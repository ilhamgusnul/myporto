"use server";

import { prisma } from "@/lib/prisma";
import { serviceSchema, type ServiceInput } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createService(formData: FormData) {
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");
  const icon = String(formData.get("icon") || "Briefcase");

  await prisma.service.create({ 
    data: {
      title,
      description,
      icon,
    }
  });

  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function updateService(id: string, formData: FormData) {
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");
  const icon = String(formData.get("icon") || "Briefcase");

  await prisma.service.update({
    where: { id },
    data: {
      title,
      description,
      icon,
    },
  });

  revalidatePath("/admin/services");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({ where: { id } });
  } catch (error) {
    console.error("Failed to delete service:", error);
  }
  
  revalidatePath("/admin/services");
  redirect("/admin/services");
}
