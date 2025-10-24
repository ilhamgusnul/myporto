"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function deleteMessage(id: string) {
  try {
    const { error } = await supabaseAdmin.from("Message").delete().eq("id", id);
    if (error) throw error;
    
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete message:", error);
    return { success: false, error: "Failed to delete message" };
  }
}

export async function deleteMessages(ids: string[]) {
  try {
    const { error } = await supabaseAdmin.from("Message").delete().in("id", ids);
    if (error) throw error;
    
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete messages:", error);
    return { success: false, error: "Failed to delete messages" };
  }
}

export async function markAsRead(id: string, read: boolean) {
  try {
    const { error } = await supabaseAdmin
      .from("Message")
      .update({ read })
      .eq("id", id);
    
    if (error) throw error;
    
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to update message:", error);
    return { success: false, error: "Failed to update message" };
  }
}
