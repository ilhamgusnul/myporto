import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Briefcase, Award, MessageSquare, Share2 } from "lucide-react";

export default async function AdminDashboard() {
  const [
    projectCount,
    serviceCount,
    skillCount,
    messageCount,
    platformCount,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.service.count(),
    prisma.skillGroup.count(),
    prisma.message.count(),
    prisma.platform.count(),
  ]);

  const stats = [
    { label: "Projects", value: projectCount, icon: FolderKanban, color: "text-blue-600" },
    { label: "Services", value: serviceCount, icon: Briefcase, color: "text-green-600" },
    { label: "Skills", value: skillCount, icon: Award, color: "text-purple-600" },
    { label: "Messages", value: messageCount, icon: MessageSquare, color: "text-orange-600" },
    { label: "Platforms", value: platformCount, icon: Share2, color: "text-pink-600" },
  ];

  const recentMessages = await prisma.message.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to your portfolio admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet</p>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{msg.name}</div>
                      <div className="text-sm text-muted-foreground">{msg.email}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm mt-2 line-clamp-2">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
