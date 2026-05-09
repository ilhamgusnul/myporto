"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateLogo(id: string, formData: FormData) {
  try {
    const logoUrl = formData.get("logoUrl");

    const data = {
      logoUrl: logoUrl && String(logoUrl).trim() !== "" ? String(logoUrl) : null,
      updatedAt: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin
      .from("About")
      .update(data)
      .eq("id", id);

    if (error) {
      console.error("Failed to update logo:", error);
      throw error;
    }

    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error) {
    console.error("Error in updateLogo:", error);
    throw error;
  }

  redirect("/admin");
}

export async function removeLogo(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("About")
      .update({ logoUrl: null, updatedAt: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Failed to remove logo:", error);
      throw error;
    }

    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error) {
    console.error("Error in removeLogo:", error);
    throw error;
  }

  redirect("/admin");
}
