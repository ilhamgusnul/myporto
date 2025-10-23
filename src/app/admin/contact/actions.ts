"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateContact(id: string, formData: FormData) {
  const data = {
    email: String(formData.get("email") || "") || null,
    whatsapp: String(formData.get("whatsapp") || "") || null,
    location: String(formData.get("location") || "") || null,
  };

  await prisma.contactInfo.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/contact");
  revalidatePath("/");
  redirect("/admin/contact");
}
