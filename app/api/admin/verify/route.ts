import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { passcode } = await req.json();
    const correctPasscode = process.env.ADMIN_PASSCODE || "guna123";
    if (passcode === correctPasscode) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Invalid admin passcode" }, { status: 401 });
  } catch (error: any) {
    console.error("Passcode verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
