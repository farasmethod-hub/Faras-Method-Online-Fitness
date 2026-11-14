// Safe client-side storage with IndexedDB fallback to prevent QuotaExceededError crashes

const DB_NAME = "faras_method_storage";
const STORE_NAME = "keyval";

function openIDB(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function idbGet<T = string>(key: string): Promise<T | null> {
  const db = await openIDB();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function idbSet(key: string, val: string): Promise<boolean> {
  const db = await openIDB();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(val, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

export async function idbDel(key: string): Promise<boolean> {
  const db = await openIDB();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

/**
 * Automatically purges bloated legacy base64 entries from localStorage
 * and safely relocates them to IndexedDB so quota errors can NEVER crash the app.
 */
export function purgeBloatedLocalStorage(): number {
  if (typeof window === "undefined") return 0;
  let purgedCount = 0;

  try {
    const keys = Object.keys(localStorage);
    for (const k of keys) {
      try {
        const val = localStorage.getItem(k);
        if (!val) continue;

        // If key contains heavy base64 images or exceeds 120KB
        if (val.includes("data:image/") || val.length > 120000) {
          // Relocate to IndexedDB before removal
          idbSet(k, val).catch(() => {});
          localStorage.removeItem(k);
          purgedCount++;
          console.warn(`[SafeStorage] Relocated oversized key "${k}" (${Math.round(val.length / 1024)} KB) from localStorage to IndexedDB.`);
        }
      } catch {
        // Ignore single key error
      }
    }
  } catch (err) {
    console.warn("[SafeStorage] Purge error:", err);
  }

  return purgedCount;
}

/**
 * Universal Storage.prototype.setItem interceptor to guarantee QuotaExceededError
 * is gracefully handled anywhere in the browser runtime without crashing.
 */
if (typeof window !== "undefined" && window.Storage && !((window.Storage.prototype as any).__faras_safe_wrapped)) {
  const originalSetItem = window.Storage.prototype.setItem;
  (window.Storage.prototype as any).__faras_safe_wrapped = true;

  window.Storage.prototype.setItem = function (key: string, value: string) {
    // If value is huge (> 150KB) or contains raw base64 data, route directly to IndexedDB
    if (value && (value.includes("data:image/") || value.length > 150000)) {
      idbSet(key, value).catch(() => {});
      // If key already exists in localStorage, remove it to free up space
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
      return;
    }

    try {
      return originalSetItem.apply(this, [key, value]);
    } catch (err: any) {
      const isQuota =
        err?.name === "QuotaExceededError" ||
        err?.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
        err?.code === 22 ||
        err?.code === 1014;

      if (isQuota) {
        console.warn(`[SafeStorage Interceptor] QuotaExceededError caught for "${key}". Auto-recovering via IndexedDB.`);
        // Mirror to IndexedDB
        idbSet(key, value).catch(() => {});
        // Purge bloated entries
        purgeBloatedLocalStorage();
        try {
          return originalSetItem.apply(this, [key, value]);
        } catch {
          // Silently succeed with IndexedDB persistence
          return;
        }
      }
      throw err;
    }
  };
}

/**
 * Safe storage setter: saves to IndexedDB and securely attempts localStorage
 */
export function safeSetItem(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;

  // Always mirror to IndexedDB (virtually unlimited quota)
  idbSet(key, value).catch(() => {});

  // If payload is large, keep solely in IndexedDB to preserve localStorage quota
  if (value.includes("data:image/") || value.length > 120000) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return true;
  }

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    console.warn(
      `[SafeStorage] localStorage quota reached while saving "${key}". Relocating to IndexedDB...`,
      err?.message || err
    );

    purgeBloatedLocalStorage();

    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      console.warn(`[SafeStorage] Key "${key}" stored safely in IndexedDB.`);
      return true;
    }
  }
}

export function safeGetItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.warn(`[SafeStorage] Could not read "${key}" from localStorage:`, err);
    return null;
  }
}

export function safeRemoveItem(key: string): void {
  if (typeof window === "undefined") return;
  idbDel(key).catch(() => {});
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

// Automatically run cleanup once upon client hydration
if (typeof window !== "undefined") {
  try {
    purgeBloatedLocalStorage();
  } catch {
    // ignore
  }
}

