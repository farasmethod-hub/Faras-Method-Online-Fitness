/**
 * Client-side image compression utility using HTML Canvas.
 * Automatically downscales large camera/phone photos to crisp web dimensions
 * and converts to optimized JPEG dataURL, dramatically reducing storage size.
 */

export interface CompressionOptions {
  maxDimension?: number;
  quality?: number;
  maxBytes?: number;
}

export async function compressImageFile(
  file: File,
  options: CompressionOptions = {}
): Promise<{ dataUrl: string; originalSize: number; compressedSize: number }> {
  const { maxDimension = 1200, quality = 0.78, maxBytes = 400 * 1024 } = options;

  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith("image/")) {
      reject(new Error("File is not an image"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));

    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        reject(new Error("Empty image payload"));
        return;
      }

      // If file is SVG or already very small (< 40KB), don't alter it
      if (file.type === "image/svg+xml" || file.size < 40 * 1024) {
        resolve({
          dataUrl: rawDataUrl,
          originalSize: file.size,
          compressedSize: rawDataUrl.length,
        });
        return;
      }

      const img = new Image();
      img.onerror = () => {
        // Fallback to raw dataURL if image element fails
        resolve({
          dataUrl: rawDataUrl,
          originalSize: file.size,
          compressedSize: rawDataUrl.length,
        });
      };

      img.onload = () => {
        let { width, height } = img;

        // Downscale while preserving aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve({
            dataUrl: rawDataUrl,
            originalSize: file.size,
            compressedSize: rawDataUrl.length,
          });
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized JPEG dataURL
        let compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

        // If still exceeds maxBytes (~400KB), perform a secondary quality pass
        if (compressedDataUrl.length > maxBytes) {
          compressedDataUrl = canvas.toDataURL("image/jpeg", 0.62);
        }

        resolve({
          dataUrl: compressedDataUrl,
          originalSize: file.size,
          compressedSize: compressedDataUrl.length,
        });
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

