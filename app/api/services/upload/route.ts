import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const serviceId = formData.get("serviceId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const mediaType = formData.get("mediaType") as string; // "image" | "video" | "text"
    const textContent = formData.get("textContent") as string;
    const clientName = formData.get("clientName") as string;
    const passcode = formData.get("passcode") as string;
    const file = formData.get("file") as File | null;

    // A simple passcode to secure uploads
    const correctPasscode = process.env.ADMIN_PASSCODE || "guna123";
    if (passcode !== correctPasscode) {
      return NextResponse.json({ error: "Invalid admin passcode" }, { status: 401 });
    }

    if (!serviceId || !title) {
      return NextResponse.json({ error: "Service ID and Title are required" }, { status: 400 });
    }

    // Read existing database
    const dbPath = path.join(process.cwd(), "data", "services.json");
    let data;
    try {
      const fileContent = await fs.readFile(dbPath, "utf-8");
      data = JSON.parse(fileContent);
    } catch (e) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const serviceIndex = data.services.findIndex((s: any) => s.id === serviceId);
    if (serviceIndex === -1) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    let mediaUrl = "";
    
    // Save file if provided and not "text"
    if (mediaType !== "text" && file) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      // Ensure the directory exists
      await fs.mkdir(uploadsDir, { recursive: true });

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Clean filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${timestamp}-${sanitizedName}`;
      const filePath = path.join(uploadsDir, fileName);

      await fs.writeFile(filePath, buffer);
      mediaUrl = `/uploads/${fileName}`;
    }

    const newItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      title,
      description: description || "",
      mediaUrl,
      mediaType,
      textContent: mediaType === "text" ? (textContent || "") : "",
      clientName: clientName || "",
      createdAt: new Date().toISOString(),
    };

    data.services[serviceIndex].items.push(newItem);

    // Save updated data back
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload item" }, { status: 500 });
  }
}
