import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * Keep-alive endpoint untuk mencegah Supabase Free Tier pause otomatis.
 * Supabase Free Tier akan pause jika tidak ada aktivitas selama 7 hari.
 *
 * Endpoint ini dipanggil oleh Vercel Cron setiap hari (lihat vercel.json),
 * sehingga database selalu aktif.
 *
 * Keamanan: Dilindungi dengan CRON_SECRET header.
 * Cara akses manual: GET /api/keep-alive dengan header Authorization: Bearer <CRON_SECRET>
 */
export async function GET(request: NextRequest) {
  // ── Verifikasi Secret ────────────────────────────────────────────────────
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Jika CRON_SECRET sudah di-set, wajib ada header yang cocok
  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  // ── Ping Supabase ────────────────────────────────────────────────────────
  const startTime = Date.now();

  try {
    // Query ringan: ambil 1 baris dari tabel About
    // (tabel ini selalu ada dan kecil ukurannya)
    const { error } = await supabase
      .from("About")
      .select("id")
      .limit(1)
      .single();

    const elapsed = Date.now() - startTime;

    if (error && error.code !== "PGRST116") {
      // PGRST116 = 'Row not found' — masih oke, DB tetap aktif
      console.error("[keep-alive] Supabase query error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
          elapsed_ms: elapsed,
        },
        { status: 500 }
      );
    }

    console.log(`[keep-alive] Supabase pinged successfully in ${elapsed}ms`);

    return NextResponse.json({
      success: true,
      message: "Supabase is alive 🟢",
      timestamp: new Date().toISOString(),
      elapsed_ms: elapsed,
    });
  } catch (err) {
    const elapsed = Date.now() - startTime;
    console.error("[keep-alive] Unexpected error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Unexpected error occurred",
        timestamp: new Date().toISOString(),
        elapsed_ms: elapsed,
      },
      { status: 500 }
    );
  }
}
