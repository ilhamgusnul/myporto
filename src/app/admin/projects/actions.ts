"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  demoUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  technologies: z.string().min(1, "At least one technology is required"),
  category: z.string().optional(),
});

export async function createProject(formData: FormData) {
  try {
    console.log("Creating project with form data:", Array.from(formData.entries()));

    const values = {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      imageUrl: String(formData.get("imageUrl") || ""),
      technologies: String(formData.get("technologies") || ""),
      demoUrl: String(formData.get("demoUrl") || ""),
      githubUrl: String(formData.get("githubUrl") || ""),
      category: String(formData.get("category") || ""),
    };

    console.log("Values to validate:", values);

    const parsed = projectSchema.safeParse(values);

    if (!parsed.success) {
      console.error("Validation errors:", parsed.error.errors);
      throw new Error(`Validation failed: ${parsed.error.errors.map(e => e.message).join(", ")}`);
    }

    const techArray = parsed.data.technologies
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    console.log("Tech array:", techArray);

    const projectData = {
      title: parsed.data.title,
      description: parsed.data.description || "",
      imageUrl: parsed.data.imageUrl || null,
      technologies: techArray,
      demoUrl: parsed.data.demoUrl || null,
      githubUrl: parsed.data.githubUrl || null,
      category: parsed.data.category || null,
    };

    console.log("Inserting project:", projectData);

    const { data, error } = await supabaseAdmin
      .from("Project")
      .insert([projectData])
      .select()
      .single();

    if (error) {
      console.error("Failed to create project:", error);
      throw error;
    }

    console.log("Project created successfully:", data);
  } catch (error) {
    console.error("Error in createProject:", error);
    throw error;
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  try {
    console.log("Updating project ID:", id);
    console.log("Form data:", Array.from(formData.entries()));

    const values = {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      imageUrl: String(formData.get("imageUrl") || ""),
      technologies: String(formData.get("technologies") || ""),
      demoUrl: String(formData.get("demoUrl") || ""),
      githubUrl: String(formData.get("githubUrl") || ""),
      category: String(formData.get("category") || ""),
    };

    console.log("Values to validate:", values);

    const parsed = projectSchema.safeParse(values);

    if (!parsed.success) {
      console.error("Validation errors:", parsed.error.errors);
      throw new Error(`Validation failed: ${parsed.error.errors.map(e => e.message).join(", ")}`);
    }

    const techArray = parsed.data.technologies
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const projectData = {
      title: parsed.data.title,
      description: parsed.data.description || "",
      imageUrl: parsed.data.imageUrl || null,
      technologies: techArray,
      demoUrl: parsed.data.demoUrl || null,
      githubUrl: parsed.data.githubUrl || null,
      category: parsed.data.category || null,
      updatedAt: new Date().toISOString(),
    };

    console.log("Updating with data:", projectData);

    const { data, error } = await supabaseAdmin
      .from("Project")
      .update(projectData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update project:", error);
      throw error;
    }

    console.log("Project updated successfully:", data);

    revalidatePath("/admin/projects");
    revalidatePath("/");
  } catch (error) {
    console.error("Error in updateProject:", error);
    throw error;
  }

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
