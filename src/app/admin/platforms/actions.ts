"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const platformSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Valid URL is required"),
  icon: z.string().min(1, "Icon is required"),
});

export async function createPlatform(formData: FormData) {
  const values = {
    name: String(formData.get("name") || ""),
    url: String(formData.get("url") || ""),
    icon: String(formData.get("icon") || "Globe"),
  };

  const parsed = platformSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const { error } = await supabaseAdmin.from("Platform").insert([{
    name: parsed.data.name,
    url: parsed.data.url,
    icon: parsed.data.icon,
  }]);

  if (error) {
    console.error("Failed to create platform:", error);
  }

  revalidatePath("/admin/platforms");
  revalidatePath("/");
  redirect("/admin/platforms");
}

export async function updatePlatform(id: string, formData: FormData) {
  const values = {
    name: String(formData.get("name") || ""),
    url: String(formData.get("url") || ""),
    icon: String(formData.get("icon") || "Globe"),
  };

  const parsed = platformSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const { error } = await supabaseAdmin.from("Platform").update({
    name: parsed.data.name,
    url: parsed.data.url,
    icon: parsed.data.icon,
  }).eq("id", id);

  if (error) {
    console.error("Failed to update platform:", error);
  }

  revalidatePath("/admin/platforms");
  revalidatePath("/");
  redirect("/admin/platforms");
}

export async function deletePlatform(id: string) {
  try {
    const { error } = await supabaseAdmin.from("Platform").delete().eq("id", id);
    if (error) throw error;
  } catch (error) {
    console.error("Failed to delete platform:", error);
  }
  
  revalidatePath("/admin/platforms");
  revalidatePath("/");
  redirect("/admin/platforms");
}
