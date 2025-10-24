import { createProject } from "../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/admin/image-upload";

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Project</h1>
          <p className="text-muted-foreground mt-1">
            Create a new portfolio project
          </p>
        </div>
      </div>

      <form action={createProject} className="bg-white p-6 rounded-lg border space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" required placeholder="E-Commerce Platform" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="A full-featured e-commerce platform..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="technologies">Tech Stack * (comma separated)</Label>
          <Input
            id="technologies"
            name="technologies"
            required
            placeholder="React, Node.js, PostgreSQL, Tailwind"
          />
          <p className="text-xs text-muted-foreground">
            Separate technologies with commas
          </p>
        </div>

        <ImageUpload
          name="imageUrl"
          label="Project Image"
          required={false}
        />

        <div className="space-y-2">
          <Label htmlFor="demoUrl">Live Demo URL</Label>
          <Input
            id="demoUrl"
            name="demoUrl"
            type="url"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            name="githubUrl"
            type="url"
            placeholder="https://github.com/..."
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit">Create Project</Button>
          <Link href="/admin/projects">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
