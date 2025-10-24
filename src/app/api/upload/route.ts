import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only images allowed." }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase credentials");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Convert file to bytes
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const filename = `${randomUUID()}.${ext}`;
    const path = `uploads/${filename}`;

    // Upload to Supabase Storage
    console.log(`Uploading file: ${filename} (${file.size} bytes) to bucket: assets`);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("assets")
      .upload(path, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error details:", {
        message: uploadError.message,
        name: uploadError.name,
        stack: uploadError.stack,
        bucket: "assets",
        path: path
      });
      return NextResponse.json({ 
        error: `Upload failed: ${uploadError.message}`,
        details: uploadError 
      }, { status: 500 });
    }

    console.log("Upload successful:", uploadData);

    // Get public URL
    const { data } = supabase.storage.from("assets").getPublicUrl(path);

    console.log("Public URL generated:", data.publicUrl);

    return NextResponse.json({ 
      url: data.publicUrl,
      path: path,
      size: file.size
    });
  } catch (error) {
    console.error("Upload error (catch):", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Upload failed",
      details: error
    }, { status: 500 });
  }
}
