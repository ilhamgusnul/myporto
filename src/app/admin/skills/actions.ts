"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  skills: z.string().min(1, "At least one skill is required"),
});

export async function createSkill(formData: FormData) {
  const values = {
    name: String(formData.get("name") || ""),
    skills: String(formData.get("skills") || ""),
  };

  const parsed = skillSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const skillsArray = parsed.data.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabaseAdmin.from("SkillGroup").insert([{
    name: parsed.data.name,
    skills: skillsArray,
  }]);

  if (error) {
    console.error("Failed to create skill group:", error);
  }

  revalidatePath("/admin/skills");
  revalidatePath("/");
  redirect("/admin/skills");
}

export async function updateSkill(id: string, formData: FormData) {
  const values = {
    name: String(formData.get("name") || ""),
    skills: String(formData.get("skills") || ""),
  };

  const parsed = skillSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const skillsArray = parsed.data.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabaseAdmin.from("SkillGroup").update({
    name: parsed.data.name,
    skills: skillsArray,
  }).eq("id", id);

  if (error) {
    console.error("Failed to update skill group:", error);
  }

  revalidatePath("/admin/skills");
  revalidatePath("/");
  redirect("/admin/skills");
}

export async function deleteSkill(id: string) {
  try {
    const { error } = await supabaseAdmin.from("SkillGroup").delete().eq("id", id);
    if (error) throw error;
  } catch (error) {
    console.error("Failed to delete skill:", error);
  }
  
  revalidatePath("/admin/skills");
  revalidatePath("/");
  redirect("/admin/skills");
}
