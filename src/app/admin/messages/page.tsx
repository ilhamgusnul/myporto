import { supabaseAdmin } from "@/lib/supabase";
import { MessagesList } from "./messages-list";

export default async function MessagesPage() {
  const { data: messages } = await supabaseAdmin
    .from("Message")
    .select("*")
    .order("createdAt", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-1">
          View and manage messages from contact form
        </p>
      </div>

      {!messages || messages.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border text-center">
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        <MessagesList initialMessages={messages} />
      )}
    </div>
  );
}
