import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, stat } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let buffer: Buffer;
    let filename: string;
    let section = "general";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      section = (formData.get("section") as string) || "general";

      if (!file) {
        return NextResponse.json({ success: false, error: "No file provided in form data" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);

      const originalName = file.name || "image.jpg";
      const ext = path.extname(originalName) || ".jpg";
      const cleanSection = section.toLowerCase().replace(/[^a-z0-9_-]/g, "");
      filename = `${cleanSection}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;
    } else {
      // JSON body with base64 dataUrl
      const body = await req.json();
      const { dataUrl, section: sec = "general", customFilename } = body;

      if (!dataUrl) {
        return NextResponse.json({ success: false, error: "No image data provided" }, { status: 400 });
      }

      section = sec;
      const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!matches) {
        // If it's already a URL, return it
        if (dataUrl.startsWith("/") || dataUrl.startsWith("http")) {
          return NextResponse.json({ success: true, url: dataUrl });
        }
        return NextResponse.json({ success: false, error: "Invalid image data format" }, { status: 400 });
      }

      const rawExt = matches[1].toLowerCase();
      const ext = rawExt === "jpeg" ? ".jpg" : `.${rawExt}`;
      buffer = Buffer.from(matches[2], "base64");
      const cleanSection = section.toLowerCase().replace(/[^a-z0-9_-]/g, "");
      filename = customFilename || `${cleanSection}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: buffer.length,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Upload API Error]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save uploaded image" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const files = await readdir(uploadsDir);
    const fileList = await Promise.all(
      files.map(async (file) => {
        try {
          const filePath = path.join(uploadsDir, file);
          const stats = await stat(filePath);
          return {
            filename: file,
            url: `/uploads/${file}`,
            size: stats.size,
            updatedAt: stats.mtime.toISOString(),
          };
        } catch {
          return null;
        }
      })
    );

    return NextResponse.json({
      success: true,
      files: fileList.filter(Boolean),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

