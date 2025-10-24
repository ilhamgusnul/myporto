"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateStat(id: string, formData: FormData) {
  const value = String(formData.get("value") || "");
  const label = String(formData.get("label") || "");

  const { error } = await supabaseAdmin.from("Stat").update({
    value,
    label,
  }).eq("id", id);

  if (error) {
    console.error("Failed to update stat:", error);
  }

  revalidatePath("/admin/stats");
  revalidatePath("/");
  redirect("/admin/stats");
}
