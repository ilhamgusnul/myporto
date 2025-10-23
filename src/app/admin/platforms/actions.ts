"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const platformSchema = z.object({
  name: z.string().min(1, "Name is required"),
  profileUrl: z.string().url("Valid URL is required"),
  tagline: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export async function createPlatform(formData: FormData) {
  const values = {
    name: String(formData.get("name") || ""),
    profileUrl: String(formData.get("profileUrl") || ""),
    tagline: String(formData.get("tagline") || ""),
    logoUrl: String(formData.get("logoUrl") || ""),
  };

  const parsed = platformSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  await prisma.platform.create({
    data: {
      name: parsed.data.name,
      profileUrl: parsed.data.profileUrl,
      tagline: parsed.data.tagline || null,
      logoUrl: parsed.data.logoUrl || null,
    },
  });

  revalidatePath("/admin/platforms");
  redirect("/admin/platforms");
}

export async function updatePlatform(id: string, formData: FormData) {
  const values = {
    name: String(formData.get("name") || ""),
    profileUrl: String(formData.get("profileUrl") || ""),
    tagline: String(formData.get("tagline") || ""),
    logoUrl: String(formData.get("logoUrl") || ""),
  };

  const parsed = platformSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  await prisma.platform.update({
    where: { id },
    data: {
      name: parsed.data.name,
      profileUrl: parsed.data.profileUrl,
      tagline: parsed.data.tagline || null,
      logoUrl: parsed.data.logoUrl || null,
    },
  });

  revalidatePath("/admin/platforms");
  redirect("/admin/platforms");
}

export async function deletePlatform(id: string) {
  try {
    await prisma.platform.delete({ where: { id } });
  } catch (error) {
    console.error("Failed to delete platform:", error);
  }
  
  revalidatePath("/admin/platforms");
  redirect("/admin/platforms");
}
