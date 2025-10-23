"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const skillSchema = z.object({
  title: z.string().min(1, "Title is required"),
  proficiency: z.number().min(0).max(100),
  tools: z.string().min(1, "At least one tool is required"),
});

export async function createSkill(formData: FormData) {
  const values = {
    title: String(formData.get("title") || ""),
    proficiency: Number(formData.get("proficiency") || 0),
    tools: String(formData.get("tools") || ""),
  };

  const parsed = skillSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const toolsArray = parsed.data.tools
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await prisma.skillGroup.create({
    data: {
      title: parsed.data.title,
      proficiency: parsed.data.proficiency,
      tools: toolsArray,
    },
  });

  revalidatePath("/admin/skills");
  redirect("/admin/skills");
}

export async function updateSkill(id: string, formData: FormData) {
  const values = {
    title: String(formData.get("title") || ""),
    proficiency: Number(formData.get("proficiency") || 0),
    tools: String(formData.get("tools") || ""),
  };

  const parsed = skillSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const toolsArray = parsed.data.tools
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await prisma.skillGroup.update({
    where: { id },
    data: {
      title: parsed.data.title,
      proficiency: parsed.data.proficiency,
      tools: toolsArray,
    },
  });

  revalidatePath("/admin/skills");
  redirect("/admin/skills");
}

export async function deleteSkill(id: string) {
  try {
    await prisma.skillGroup.delete({ where: { id } });
    revalidatePath("/admin/skills");
    return { ok: true };
  } catch (error) {
    console.error("Failed to delete skill:", error);
    return { ok: false, error: "Failed to delete skill" };
  }
}
