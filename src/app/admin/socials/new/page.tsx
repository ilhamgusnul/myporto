import { createSocialMedia } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SubmitButton } from "@/components/admin/submit-button";

export default function NewSocialPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/socials">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Social Media</h1>
          <p className="text-gray-600 mt-1">Create a new social media link</p>
        </div>
      </div>

      <form action={createSocialMedia} className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="GitHub"
            required
          />
          <p className="text-sm text-gray-500">
            Display name for the social media (e.g., GitHub, LinkedIn)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            name="url"
            type="url"
            placeholder="https://github.com/username"
            required
          />
          <p className="text-sm text-gray-500">
            Full URL to your profile
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">Icon Name</Label>
          <Input
            id="icon"
            name="icon"
            placeholder="Github"
            required
          />
          <p className="text-sm text-gray-500">
            Lucide icon name (e.g., Github, Linkedin, Twitter, Facebook, Instagram)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            name="order"
            type="number"
            placeholder="0"
            defaultValue="0"
          />
          <p className="text-sm text-gray-500">
            Display order (lower numbers appear first)
          </p>
        </div>

        <div className="flex gap-4">
          <SubmitButton>Create Social Media</SubmitButton>
          <Link href="/admin/socials">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
