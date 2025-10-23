import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, Info, Briefcase, Award, FolderKanban, Share2, Mail, BarChart, MessageSquare, Megaphone, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/about", label: "About", icon: Info },
    { href: "/admin/services", label: "Services", icon: Briefcase },
    { href: "/admin/skills", label: "Skills", icon: Award },
    { href: "/admin/projects", label: "Projects", icon: FolderKanban },
    { href: "/admin/platforms", label: "Platforms", icon: Share2 },
    { href: "/admin/contact", label: "Contact", icon: Mail },
    { href: "/admin/stats", label: "Stats", icon: BarChart },
    { href: "/admin/cta", label: "CTA", icon: Megaphone },
    { href: "/admin/socials", label: "Socials", icon: Globe },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="text-xl font-bold">
              Portfolio Admin
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/admin/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                {session.user?.email}
              </span>
              <form action="/api/auth/signout" method="post">
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
