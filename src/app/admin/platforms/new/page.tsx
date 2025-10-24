import { createPlatform } from "../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { SubmitButton } from "@/components/admin/submit-button";

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
          <Label htmlFor="url">Profile URL *</Label>
          <Input
            id="url"
            name="url"
            type="url"
            required
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">Icon Name *</Label>
          <Input
            id="icon"
            name="icon"
            required
            defaultValue="Globe"
            placeholder="e.g., Github, Linkedin, Twitter"
          />
          <p className="text-xs text-muted-foreground">
            Lucide icon name (e.g., Github, Linkedin, Twitter, Facebook, Instagram)
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          <SubmitButton>Create Platform</SubmitButton>
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
