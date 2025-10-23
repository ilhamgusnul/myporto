"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSocialMedia(formData: FormData) {
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const icon = formData.get("icon") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  await prisma.socialMedia.create({
    data: {
      name,
      url,
      icon,
      order,
    },
  });

  revalidatePath("/admin/socials");
  revalidatePath("/");
}

export async function updateSocialMedia(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const icon = formData.get("icon") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  await prisma.socialMedia.update({
    where: { id },
    data: {
      name,
      url,
      icon,
      order,
    },
  });

  revalidatePath("/admin/socials");
  revalidatePath("/");
}

export async function deleteSocialMedia(id: string) {
  try {
    await prisma.socialMedia.delete({
      where: { id },
    });
    revalidatePath("/admin/socials");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete social media:", error);
    return { success: false, error: "Failed to delete social media" };
  }
}
