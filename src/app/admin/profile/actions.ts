"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export async function updateProfile(id: string, formData: FormData) {
  const name = String(formData.get("name") || "") || null;
  const email = String(formData.get("email") || "");

  if (!email) {
    throw new Error("Email is required");
  }

  await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
    },
  });

  revalidatePath("/admin/profile");
  redirect("/admin/profile");
}

export async function updatePassword(id: string, formData: FormData) {
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("All fields are required");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  // Get current user
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, user.password);

  if (!isValid) {
    throw new Error("Current password is incorrect");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword,
    },
  });

  revalidatePath("/admin/profile");
  redirect("/admin/profile");
}
