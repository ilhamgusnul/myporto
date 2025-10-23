import { createPlatform } from "../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function NewPlatformPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/platforms">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Platform</h1>
          <p className="text-muted-foreground mt-1">Add a social platform</p>
        </div>
      </div>

      <form action={createPlatform} className="bg-white p-6 rounded-lg border space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Platform Name *</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="e.g., GitHub, LinkedIn, Twitter"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profileUrl">Profile URL *</Label>
          <Input
            id="profileUrl"
            name="profileUrl"
            type="url"
            required
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline (optional)</Label>
          <Input
            id="tagline"
            name="tagline"
            placeholder="Check out my projects"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL (optional)</Label>
          <Input
            id="logoUrl"
            name="logoUrl"
            type="url"
            placeholder="https://..."
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit">Create Platform</Button>
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
