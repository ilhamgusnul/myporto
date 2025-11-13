import { createProject } from "../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";

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

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select category</option>
            <option value="Fullstack Web Developer">Fullstack Web Developer</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Visual & Brand Design">Visual & Brand Design</option>
            <option value="Mobile Apps Developer">Mobile Apps Developer</option>
          </select>
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
          <SubmitButton>Create Project</SubmitButton>
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
