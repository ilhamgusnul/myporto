import { supabaseAdmin } from "@/lib/supabase";
import { updateAbout } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";

export default async function AboutPage() {
  const { data: about } = await supabaseAdmin
    .from("About")
    .select("*")
    .limit(1)
    .single();

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
          <Label htmlFor="title">Title * (Full Name)</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={about.title || ""}
            placeholder="Ilham Gusnul Romadhon"
          />
          <p className="text-xs text-muted-foreground">
            First 2 words will be displayed in orange
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle * (Role/Position)</Label>
          <Input
            id="subtitle"
            name="subtitle"
            required
            defaultValue={about.subtitle || ""}
            placeholder="Full Stack Developer & Designer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline (Motto)</Label>
          <Input
            id="tagline"
            name="tagline"
            defaultValue={about.tagline || ""}
            placeholder="Code by Logic, Design with Passion"
          />
          <p className="text-xs text-muted-foreground">
            Short catchy phrase displayed in orange
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content * (About Description)</Label>
          <Textarea
            id="content"
            name="content"
            required
            defaultValue={about.content || ""}
            rows={8}
            placeholder="Tell your story... Describe your expertise, experience, and what you do."
          />
          <p className="text-xs text-muted-foreground">
            Full description displayed in hero section
          </p>
        </div>

        <div className="space-y-3">
          <ImageUpload
            name="avatarUrl"
            label="Profile Photo (Hero Section)"
            defaultUrl={about.avatarUrl || ""}
            required={false}
          />
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-2">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">📸 Rekomendasi Foto Hero</p>
            <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
              <li>Gunakan foto dengan <strong>background transparan (PNG)</strong> agar menyatu dengan halaman</li>
              <li>Orientasi <strong>portrait / vertikal</strong> (tinggi lebih dari lebar), contoh: 600×800px</li>
              <li>Foto dari <strong>pinggang ke atas</strong> lebih baik dari foto full-body</li>
              <li>Pastikan subjek berada di <strong>tengah frame</strong></li>
              <li>Resolusi minimal <strong>800×1000px</strong> agar tajam di semua layar</li>
              <li>Untuk menghapus background: gunakan <a href="https://remove.bg" target="_blank" rel="noopener noreferrer" className="underline font-semibold">remove.bg</a> atau Adobe Express (gratis)</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <SubmitButton>Save Changes</SubmitButton>
        </div>
      </form>
    </div>
  );
}
