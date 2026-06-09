import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const { serviceId, itemId, passcode } = await req.json();

    const correctPasscode = process.env.ADMIN_PASSCODE || "guna123";
    if (passcode !== correctPasscode) {
      return NextResponse.json({ error: "Invalid admin passcode" }, { status: 401 });
    }

    if (!serviceId || !itemId) {
      return NextResponse.json({ error: "Service ID and Item ID are required" }, { status: 400 });
    }

    const dbPath = path.join(process.cwd(), "data", "services.json");
    let data;
    try {
      const fileContent = await fs.readFile(dbPath, "utf-8");
      data = JSON.parse(fileContent);
    } catch (e) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const service = data.services.find((s: any) => s.id === serviceId);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const itemIndex = service.items.findIndex((item: any) => item.id === itemId);
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found in service" }, { status: 404 });
    }

    const item = service.items[itemIndex];

    // Delete file if it exists and is an uploaded file
    if (item.mediaUrl && item.mediaUrl.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", item.mediaUrl);
      try {
        await fs.unlink(filePath);
      } catch (fileError) {
        console.warn(`File ${filePath} could not be deleted or doesn't exist:`, fileError);
      }
    }

    // Remove item from database
    service.items.splice(itemIndex, 1);

    // Save database
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete item" }, { status: 500 });
  }
}
