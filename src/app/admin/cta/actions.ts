"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateCTA(id: string, formData: FormData) {
  const data = {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    buttonText: String(formData.get("buttonText") || ""),
    buttonLink: String(formData.get("buttonLink") || ""),
  };

  const { error } = await supabaseAdmin.from("CTA").update(data).eq("id", id);

  if (error) {
    console.error("Failed to update CTA:", error);
  }

  revalidatePath("/admin/cta");
  revalidatePath("/");
  redirect("/admin/cta");
}
