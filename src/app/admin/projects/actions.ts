"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  technologies: z.string().min(1, "At least one technology is required"),
});

export async function createProject(formData: FormData) {
  const values = {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    imageUrl: String(formData.get("imageUrl") || ""),
    technologies: String(formData.get("technologies") || ""),
    demoUrl: String(formData.get("demoUrl") || ""),
    githubUrl: String(formData.get("githubUrl") || ""),
  };

  const parsed = projectSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const techArray = parsed.data.technologies
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabaseAdmin.from("Project").insert([{
    title: parsed.data.title,
    description: parsed.data.description || "",
    imageUrl: parsed.data.imageUrl || null,
    technologies: techArray,
    demoUrl: parsed.data.demoUrl || null,
    githubUrl: parsed.data.githubUrl || null,
  }]);

  if (error) {
    console.error("Failed to create project:", error);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const values = {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    imageUrl: String(formData.get("imageUrl") || ""),
    technologies: String(formData.get("technologies") || ""),
    demoUrl: String(formData.get("demoUrl") || ""),
    githubUrl: String(formData.get("githubUrl") || ""),
  };

  const parsed = projectSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const techArray = parsed.data.technologies
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabaseAdmin.from("Project").update({
    title: parsed.data.title,
    description: parsed.data.description || "",
    imageUrl: parsed.data.imageUrl || null,
    technologies: techArray,
    demoUrl: parsed.data.demoUrl || null,
    githubUrl: parsed.data.githubUrl || null,
  }).eq("id", id);

  if (error) {
    console.error("Failed to update project:", error);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  try {
    const { error } = await supabaseAdmin.from("Project").delete().eq("id", id);
    if (error) throw error;
  } catch (error) {
    console.error("Failed to delete project:", error);
  }
  
  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}
