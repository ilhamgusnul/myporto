import { prisma } from "@/lib/prisma";
import { updateAbout } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/image-upload";

export default async function AboutPage() {
  const about = await prisma.about.findFirst();

  if (!about) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">About</h1>
          <p className="text-muted-foreground mt-1">Edit about section</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-muted-foreground">
            No about section found. Please create one from the database.
          </p>
        </div>
      </div>
    );
  }

  const updateWithId = updateAbout.bind(null, about.id);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">About</h1>
        <p className="text-muted-foreground mt-1">Edit about section</p>
      </div>

      <form action={updateWithId} className="bg-white p-6 rounded-lg border space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={about.title}
            placeholder="Full Stack Developer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle *</Label>
          <Input
            id="subtitle"
            name="subtitle"
            required
            defaultValue={about.subtitle}
            placeholder="Building digital experiences..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            name="tagline"
            defaultValue={about.tagline}
            placeholder="Code by Logic, Design with Passion"
          />
          <p className="text-xs text-muted-foreground">
            Short catchy phrase displayed in orange
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            name="content"
            required
            defaultValue={about.content}
            rows={8}
            placeholder="Tell your story..."
          />
          <p className="text-xs text-muted-foreground">
            You can use markdown format here
          </p>
        </div>

        <ImageUpload
          name="avatarUrl"
          label="Profile Image"
          defaultUrl={about.avatarUrl || ""}
          required={false}
        />

        <div className="flex gap-2 pt-4">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
