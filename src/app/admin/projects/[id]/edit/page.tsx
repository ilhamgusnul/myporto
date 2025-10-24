import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { updateProject } from "../../actions";
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
          <Label htmlFor="category">Category *</Label>
          <Select name="category" defaultValue={project.category} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WEB_DEV">Web Development</SelectItem>
              <SelectItem value="MOBILE_APPS">Mobile Apps</SelectItem>
              <SelectItem value="DESIGN_PROJECTS">Design Projects</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stack">Tech Stack * (comma separated)</Label>
          <Input
            id="stack"
            name="stack"
            required
            defaultValue={project.stack.join(", ")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="completedAt">Completion Date</Label>
          <Input
            id="completedAt"
            name="completedAt"
            type="date"
            defaultValue={
              project.completedAt
                ? new Date(project.completedAt).toISOString().split("T")[0]
                : ""
            }
          />
        </div>

        <ImageUpload
          name="imageUrl"
          label="Project Image"
          defaultUrl={project.imageUrl || ""}
          required={false}
        />

        <div className="space-y-2">
          <Label htmlFor="liveUrl">Live URL</Label>
          <Input
            id="liveUrl"
            name="liveUrl"
            type="url"
            defaultValue={project.liveUrl || ""}
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
          <Button type="submit">Update Project</Button>
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
