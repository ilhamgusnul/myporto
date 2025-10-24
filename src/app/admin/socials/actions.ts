"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSocialMedia(formData: FormData) {
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const icon = formData.get("icon") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  const { error } = await supabaseAdmin.from("SocialMedia").insert([{
    name,
    url,
    icon,
    order,
  }]);

  if (error) {
    console.error("Failed to create social media:", error);
  }

  revalidatePath("/admin/socials");
  revalidatePath("/");
  redirect("/admin/socials");
}

export async function updateSocialMedia(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const icon = formData.get("icon") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  const { error } = await supabaseAdmin.from("SocialMedia").update({
    name,
    url,
    icon,
    order,
  }).eq("id", id);

  if (error) {
    console.error("Failed to update social media:", error);
  }

  revalidatePath("/admin/socials");
  revalidatePath("/");
  redirect("/admin/socials");
}

export async function deleteSocialMedia(id: string) {
  try {
    const { error } = await supabaseAdmin.from("SocialMedia").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/socials");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to delete social media:", error);
  }
  redirect("/admin/socials");
}
