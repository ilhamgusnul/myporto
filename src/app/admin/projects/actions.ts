"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(["WEB_DEV", "MOBILE_APPS", "DESIGN_PROJECTS"]),
  completedAt: z.string().optional(),
  imageUrl: z.string().optional(),
  stack: z.string().min(1, "At least one technology is required"),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
});

export async function createProject(formData: FormData) {
  const values = {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    category: String(formData.get("category") || "WEB_DEV"),
    completedAt: String(formData.get("completedAt") || ""),
    imageUrl: String(formData.get("imageUrl") || ""),
    stack: String(formData.get("stack") || ""),
    liveUrl: String(formData.get("liveUrl") || ""),
    githubUrl: String(formData.get("githubUrl") || ""),
  };

  const parsed = projectSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const stackArray = parsed.data.stack
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await prisma.project.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      category: parsed.data.category as any,
      completedAt: parsed.data.completedAt
        ? new Date(parsed.data.completedAt)
        : null,
      imageUrl: parsed.data.imageUrl || null,
      stack: stackArray,
      liveUrl: parsed.data.liveUrl || null,
      githubUrl: parsed.data.githubUrl || null,
    },
  });

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const values = {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    category: String(formData.get("category") || "WEB_DEV"),
    completedAt: String(formData.get("completedAt") || ""),
    imageUrl: String(formData.get("imageUrl") || ""),
    stack: String(formData.get("stack") || ""),
    liveUrl: String(formData.get("liveUrl") || ""),
    githubUrl: String(formData.get("githubUrl") || ""),
  };

  const parsed = projectSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const stackArray = parsed.data.stack
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await prisma.project.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      category: parsed.data.category as any,
      completedAt: parsed.data.completedAt
        ? new Date(parsed.data.completedAt)
        : null,
      imageUrl: parsed.data.imageUrl || null,
      stack: stackArray,
      liveUrl: parsed.data.liveUrl || null,
      githubUrl: parsed.data.githubUrl || null,
    },
  });

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
  } catch (error) {
    console.error("Failed to delete project:", error);
  }
  
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}
