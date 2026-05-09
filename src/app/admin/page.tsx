import { supabaseAdmin } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Briefcase, Award, MessageSquare, Share2, ImageIcon } from "lucide-react";
import { LogoUploadForm } from "@/components/admin/logo-upload-form";
import { updateLogo, removeLogo } from "@/app/admin/logo/actions";

export default async function AdminDashboard() {
  const [
    { count: projectCount },
    { count: serviceCount },
    { count: skillCount },
    { count: messageCount },
    { count: platformCount },
  ] = await Promise.all([
    supabaseAdmin.from("Project").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("Service").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("SkillGroup").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("Message").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("Platform").select("*", { count: "exact", head: true }),
  ]);

  // Fetch About for logo
  const { data: about } = await supabaseAdmin
    .from("About")
    .select("id, logoUrl")
    .limit(1)
    .single();

  const stats = [
    { label: "Projects", value: projectCount || 0, icon: FolderKanban, color: "text-blue-600" },
    { label: "Services", value: serviceCount || 0, icon: Briefcase, color: "text-green-600" },
    { label: "Skills", value: skillCount || 0, icon: Award, color: "text-purple-600" },
    { label: "Messages", value: messageCount || 0, icon: MessageSquare, color: "text-orange-600" },
    { label: "Platforms", value: platformCount || 0, icon: Share2, color: "text-pink-600" },
  ];

  const { data: recentMessages } = await supabaseAdmin
    .from("Message")
    .select("*")
    .order("createdAt", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to your portfolio admin panel</p>
      </div>

      {/* ── Logo & Branding ───────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-indigo-500" />
            Logo & Branding
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Upload logo untuk ditampilkan di navbar dan digunakan sebagai favicon browser.
          </p>
        </CardHeader>
        <CardContent>
          {about ? (
            <LogoUploadForm
              aboutId={about.id}
              currentLogoUrl={about.logoUrl ?? null}
              updateLogoAction={updateLogo}
              removeLogoAction={removeLogo}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Data About belum tersedia. Buat data About terlebih dahulu.
            </p>
          )}
        </CardContent>
      </Card>

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
          {!recentMessages || recentMessages.length === 0 ? (
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
