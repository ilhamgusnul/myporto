"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateAbout(id: string, formData: FormData) {
  try {
    console.log("Updating About with ID:", id);
    console.log("Form data entries:", Array.from(formData.entries()));

    const title = formData.get("title");
    const subtitle = formData.get("subtitle");
    const tagline = formData.get("tagline");
    const content = formData.get("content");
    const avatarUrl = formData.get("avatarUrl");

    // Validate required fields
    if (!title || !subtitle || !content) {
      console.error("Missing required fields:", { title, subtitle, content });
      throw new Error("Title, subtitle, and content are required");
    }

    const data = {
      title: String(title),
      subtitle: String(subtitle),
      tagline: tagline ? String(tagline) : null,
      content: String(content),
      avatarUrl: avatarUrl && String(avatarUrl).trim() !== "" ? String(avatarUrl) : null,
      updatedAt: new Date().toISOString(),
    };

    console.log("Updating with data:", data);

    const { data: result, error } = await supabaseAdmin
      .from("About")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update about:", error);
      throw error;
    }

    console.log("Update successful:", result);

    revalidatePath("/admin/about");
    revalidatePath("/");
  } catch (error) {
    console.error("Error in updateAbout:", error);
    throw error;
  }
  
  redirect("/admin/about");
}
