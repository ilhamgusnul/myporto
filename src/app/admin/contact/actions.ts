"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateContact(id: string, formData: FormData) {
  const data = {
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || "") || null,
    location: String(formData.get("location") || "") || null,
  };

  const { error } = await supabaseAdmin.from("ContactInfo").update(data).eq("id", id);

  if (error) {
    console.error("Failed to update contact info:", error);
  }

  revalidatePath("/admin/contact");
  revalidatePath("/");
  redirect("/admin/contact");
}
