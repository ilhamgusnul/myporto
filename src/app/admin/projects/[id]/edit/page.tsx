import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { updateProject } from "../../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: project } = await supabaseAdmin
    .from("Project")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!project) {
    return <div>Project not found</div>;
  }

  const updateWithId = updateProject.bind(null, params.id);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground mt-1">Update project details</p>
        </div>
      </div>

      <form action={updateWithId} className="bg-white p-6 rounded-lg border space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" required defaultValue={project.title} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={project.description || ""}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="technologies">Tech Stack * (comma separated)</Label>
          <Input
            id="technologies"
            name="technologies"
            required
            defaultValue={project.technologies?.join(", ") || ""}
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
            defaultValue={project.category || ""}
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
          defaultUrl={project.imageUrl || ""}
          required={false}
        />

        <div className="space-y-2">
          <Label htmlFor="demoUrl">Live Demo URL</Label>
          <Input
            id="demoUrl"
            name="demoUrl"
            type="url"
            defaultValue={project.demoUrl || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            name="githubUrl"
            type="url"
            defaultValue={project.githubUrl || ""}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <SubmitButton>Update Project</SubmitButton>
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
