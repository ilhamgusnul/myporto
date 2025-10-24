import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { updatePlatform } from "../../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default async function EditPlatformPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: platform } = await supabaseAdmin
    .from("Platform")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!platform) {
    return <div>Platform not found</div>;
  }

  const updateWithId = updatePlatform.bind(null, params.id);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/platforms">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Platform</h1>
          <p className="text-muted-foreground mt-1">Update platform details</p>
        </div>
      </div>

      <form action={updateWithId} className="bg-white p-6 rounded-lg border space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Platform Name *</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={platform.name}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">Profile URL *</Label>
          <Input
            id="url"
            name="url"
            type="url"
            required
            defaultValue={platform.url}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">Icon Name *</Label>
          <Input
            id="icon"
            name="icon"
            required
            defaultValue={platform.icon}
          />
          <p className="text-xs text-muted-foreground">
            Lucide icon name (e.g., Github, Linkedin, Twitter, Facebook, Instagram)
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit">Update Platform</Button>
          <Link href="/admin/platforms">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
