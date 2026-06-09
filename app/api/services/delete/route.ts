import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { kv } from "@vercel/kv";

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

    // Read existing database from Vercel KV
    let data: any = await kv.get("guna_services");
    if (!data || !data.services) {
      return NextResponse.json({ error: "Database not initialized in Vercel KV" }, { status: 500 });
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

    // Delete file from Vercel Blob if it exists and is a Vercel Blob URL
    if (item.mediaUrl && item.mediaUrl.includes("vercel-storage.com")) {
      try {
        await del(item.mediaUrl);
      } catch (blobError) {
        console.warn(`Vercel Blob file ${item.mediaUrl} could not be deleted:`, blobError);
      }
    }

    // Remove item from database
    service.items.splice(itemIndex, 1);

    // Save updated data back to Vercel KV
    await kv.set("guna_services", data);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete item" }, { status: 500 });
  }
}
