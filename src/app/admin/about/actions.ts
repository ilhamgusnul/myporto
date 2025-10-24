"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateAbout(id: string, formData: FormData) {
  const data = {
    title: String(formData.get("title") || ""),
    subtitle: String(formData.get("subtitle") || ""),
    tagline: String(formData.get("tagline") || "Code by Logic, Design with Passion"),
    content: String(formData.get("content") || ""),
    avatarUrl: String(formData.get("avatarUrl") || "") || null,
  };

  const { error } = await supabaseAdmin.from("About").update(data).eq("id", id);

  if (error) {
    console.error("Failed to update about:", error);
  }

  revalidatePath("/admin/about");
  revalidatePath("/");
  redirect("/admin/about");
}
