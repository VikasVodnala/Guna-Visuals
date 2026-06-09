import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), "data", "services.json");
    const fileContent = await fs.readFile(dbPath, "utf-8");
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to read services database:", error);
    return NextResponse.json({ error: "Failed to read database" }, { status: 500 });
  }
}
