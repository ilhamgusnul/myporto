"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateAbout(id: string, formData: FormData) {
  const data = {
    title: String(formData.get("title") || ""),
    subtitle: String(formData.get("subtitle") || ""),
    tagline: String(formData.get("tagline") || "Code by Logic, Design with Passion"),
    content: String(formData.get("content") || ""),
    avatarUrl: String(formData.get("avatarUrl") || "") || null,
  };

  await prisma.about.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/about");
  revalidatePath("/");
  redirect("/admin/about");
}
