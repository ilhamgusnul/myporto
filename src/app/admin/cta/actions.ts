"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateCTA(id: string, formData: FormData) {
  const data = {
    heading: String(formData.get("heading") || ""),
    subheading: String(formData.get("subheading") || ""),
    primaryText: String(formData.get("primaryText") || ""),
    primaryHref: String(formData.get("primaryHref") || ""),
    secondaryText: String(formData.get("secondaryText") || "") || null,
    secondaryHref: String(formData.get("secondaryHref") || "") || null,
  };

  await prisma.cTA.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/cta");
  revalidatePath("/");
  redirect("/admin/cta");
}
