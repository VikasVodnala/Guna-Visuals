import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { kv } from "@vercel/kv";

const defaultServices = [
  {
    "id": "commercial-ads",
    "title": "Commercial Ads",
    "iconName": "Video",
    "desc": "High-impact advertisements that drive conversion.",
    "details": "We produce visually stunning, high-converting commercial advertisements designed to capture your target audience's attention. From concept development, storyboarding, script writing, to high-end filming and post-production, we handle it all to help grow your brand's presence.",
    "color": "border-neon-orange",
    "glow": "rgba(255,122,0,0.5)",
    "delay": 0,
    "items": []
  },
  {
    "id": "content-writing",
    "title": "Content Writing",
    "iconName": "PenTool",
    "desc": "Compelling narratives that resonate with your audience.",
    "details": "Words have power. Our copywriters specialize in crafting engaging narratives, ad copies, website contents, screenplays, and SEO-optimized blogs that establish your brand voice and speak directly to the hearts of your audience.",
    "color": "border-neon-blue",
    "glow": "rgba(0,243,255,0.5)",
    "delay": 0.1,
    "items": []
  },
  {
    "id": "cinematography",
    "title": "Cinematography",
    "iconName": "Camera",
    "desc": "Cinematic visuals tailored for modern brands.",
    "details": "We offer top-of-the-line cinematography services, shooting with professional cameras, lighting equipment, and state-of-the-art stabilizers. Whether it is a brand documentary, product showcase, or event coverage, we create cinematic masterpieces.",
    "color": "border-neon-orange",
    "glow": "rgba(255,122,0,0.5)",
    "delay": 0.2,
    "items": []
  },
  {
    "id": "poster-designing",
    "title": "Poster Designing",
    "iconName": "Layout",
    "desc": "Striking graphics that capture immediate attention.",
    "details": "Our design team creates eye-catching posters, banners, and digital graphics tailored for advertising campaigns, social media, events, and print. We blend colors, layout typography, and visuals to leave a lasting impression.",
    "color": "border-neon-blue",
    "glow": "rgba(0,243,255,0.5)",
    "delay": 0.3,
    "items": []
  },
  {
    "id": "video-editing",
    "title": "Video Editing",
    "iconName": "Film",
    "desc": "Short & Long-form editing optimized for retention.",
    "details": "Our editing suite transforms raw footage into high-retention content. We specialize in sound design, color grading, motion graphics, captions, and narrative pacing for YouTube, TikTok, Instagram Reels, and corporate videos.",
    "color": "border-neon-orange",
    "glow": "rgba(255,122,0,0.5)",
    "delay": 0.4,
    "items": []
  },
  {
    "id": "ai-videos",
    "title": "AI Videos",
    "iconName": "Cpu",
    "desc": "Next-gen AI generated content for scalable media.",
    "details": "Leverage the power of generative AI. We combine cutting-edge text-to-video, image-to-video, and voice clone models to produce high-impact, scalable, and imaginative AI-generated video campaigns that push boundaries.",
    "color": "border-neon-blue",
    "glow": "rgba(0,243,255,0.5)",
    "delay": 0.5,
    "items": []
  }
];

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

    const correctPasscode = process.env.ADMIN_PASSCODE || "guna123";
    if (passcode !== correctPasscode) {
      return NextResponse.json({ error: "Invalid admin passcode" }, { status: 401 });
    }

    if (!serviceId || !title) {
      return NextResponse.json({ error: "Service ID and Title are required" }, { status: 400 });
    }

    // Check if Vercel KV environment variables are configured
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return NextResponse.json(
        { error: "Vercel KV is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables." },
        { status: 503 }
      );
    }

    // Read existing database from Vercel KV
    let data: any = await kv.get("guna_services");
    if (!data || !data.services) {
      data = { services: defaultServices };
    }

    const serviceIndex = data.services.findIndex((s: any) => s.id === serviceId);
    if (serviceIndex === -1) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    let mediaUrl = "";
    
    // Save file to Vercel Blob if provided and not "text"
    if (mediaType !== "text" && file) {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `uploads/${timestamp}-${sanitizedName}`;

      // Upload file directly to Vercel Blob Store
      const blob = await put(fileName, file, {
        access: "public",
      });
      mediaUrl = blob.url;
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

    // Save updated data back to Vercel KV
    await kv.set("guna_services", data);

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload item" }, { status: 500 });
  }
}
