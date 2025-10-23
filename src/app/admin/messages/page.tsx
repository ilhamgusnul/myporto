import { prisma } from "@/lib/prisma";

export default async function MessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-1">
          View messages from contact form
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border text-center">
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white p-6 rounded-lg border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold">{msg.name}</div>
                  <div className="text-sm text-muted-foreground">{msg.email}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
