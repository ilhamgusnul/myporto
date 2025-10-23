"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateStat(id: string, formData: FormData) {
  const value = Number(formData.get("value") || 0);
  const label = String(formData.get("label") || "");

  await prisma.stat.update({
    where: { id },
    data: {
      value,
      label,
    },
  });

  revalidatePath("/admin/stats");
  revalidatePath("/");
  redirect("/admin/stats");
}
