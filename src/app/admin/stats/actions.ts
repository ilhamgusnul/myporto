"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStat(formData: FormData) {
  const value = String(formData.get("value") || "");
  const label = String(formData.get("label") || "");
  const order = parseInt(String(formData.get("order") || "0"));

  const { error } = await supabaseAdmin.from("Stat").insert([{
    value,
    label,
    order,
  }]);

  if (error) {
    console.error("Failed to create stat:", error);
    throw error;
  }

  revalidatePath("/admin/stats");
  revalidatePath("/");
  redirect("/admin/stats");
}

export async function updateStat(id: string, formData: FormData) {
  const value = String(formData.get("value") || "");
  const label = String(formData.get("label") || "");
  const order = parseInt(String(formData.get("order") || "0"));

  const { error } = await supabaseAdmin.from("Stat").update({
    value,
    label,
    order,
  }).eq("id", id);

  if (error) {
    console.error("Failed to update stat:", error);
  }

  revalidatePath("/admin/stats");
  revalidatePath("/");
  redirect("/admin/stats");
}

export async function deleteStat(id: string) {
  try {
    const { error } = await supabaseAdmin.from("Stat").delete().eq("id", id);
    if (error) throw error;
  } catch (error) {
    console.error("Failed to delete stat:", error);
  }
  
  revalidatePath("/admin/stats");
  revalidatePath("/");
  redirect("/admin/stats");
}
