"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { serviceSchema, type ServiceInput } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createService(formData: FormData) {
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");
  const icon = String(formData.get("icon") || "Briefcase");

  const { error } = await supabaseAdmin.from("Service").insert([{ 
    title,
    description,
    icon,
  }]);

  if (error) {
    console.error("Failed to create service:", error);
  }

  revalidatePath("/admin/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function updateService(id: string, formData: FormData) {
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");
  const icon = String(formData.get("icon") || "Briefcase");

  const { error } = await supabaseAdmin.from("Service").update({
    title,
    description,
    icon,
  }).eq("id", id);

  if (error) {
    console.error("Failed to update service:", error);
  }

  revalidatePath("/admin/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  try {
    const { error } = await supabaseAdmin.from("Service").delete().eq("id", id);
    if (error) throw error;
  } catch (error) {
    console.error("Failed to delete service:", error);
  }
  
  revalidatePath("/admin/services");
  revalidatePath("/");
  redirect("/admin/services");
}
