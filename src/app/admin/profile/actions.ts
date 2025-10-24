"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

export async function updateProfile(id: string, formData: FormData) {
  const name = String(formData.get("name") || "") || null;
  const email = String(formData.get("email") || "");

  if (!email) {
    throw new Error("Email is required");
  }

  // Update Profile table
  const { error: profileError } = await supabaseAdmin.from("Profile").update({
    name,
    email,
    updatedAt: new Date().toISOString(),
  }).eq("id", id);

  if (profileError) {
    console.error("Failed to update profile:", profileError);
    throw new Error("Failed to update profile");
  }

  // Update auth.users email if changed
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const { error: authError } = await supabase.auth.admin.updateUserById(id, {
    email,
    user_metadata: { name }
  });

  if (authError) {
    console.error("Failed to update auth user:", authError);
  }

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

  // Get profile
  const { data: profile } = await supabaseAdmin.from("Profile").select("email").eq("id", id).single();

  if (!profile) {
    throw new Error("Profile not found");
  }

  // Create Supabase client for auth operations
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Verify current password by attempting sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password: currentPassword,
  });

  if (signInError) {
    throw new Error("Current password is incorrect");
  }

  // Update password using Supabase Auth Admin API
  const { error: updateError } = await supabase.auth.admin.updateUserById(id, {
    password: newPassword
  });

  if (updateError) {
    console.error("Failed to update password:", updateError);
    throw new Error("Failed to update password");
  }

  revalidatePath("/admin/profile");
  redirect("/admin/profile");
}
