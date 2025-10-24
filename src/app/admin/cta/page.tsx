import { supabaseAdmin } from "@/lib/supabase";
import { updateCTA } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function CTAPage() {
  const { data: cta } = await supabaseAdmin
    .from("CTA")
    .select("*")
    .limit(1)
    .single();

  if (!cta) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">CTA</h1>
          <p className="text-muted-foreground mt-1">Edit call-to-action section</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-muted-foreground">
            No CTA section found. Please create one from the database.
          </p>
        </div>
      </div>
    );
  }

  const updateWithId = updateCTA.bind(null, cta.id);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CTA</h1>
        <p className="text-muted-foreground mt-1">Edit call-to-action section</p>
      </div>

      <form action={updateWithId} className="bg-white p-6 rounded-lg border space-y-4">
        <div className="space-y-2">
          <Label htmlFor="heading">Heading *</Label>
          <Input
            id="heading"
            name="heading"
            required
            defaultValue={cta.heading}
            placeholder="Ready to Start Your Project?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subheading">Subheading *</Label>
          <Textarea
            id="subheading"
            name="subheading"
            required
            defaultValue={cta.subheading}
            rows={3}
            placeholder="Let's work together to bring your ideas to life..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryText">Primary Button Text *</Label>
            <Input
              id="primaryText"
              name="primaryText"
              required
              defaultValue={cta.primaryText}
              placeholder="Get In Touch"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryHref">Primary Button Link *</Label>
            <Input
              id="primaryHref"
              name="primaryHref"
              required
              defaultValue={cta.primaryHref}
              placeholder="#contact"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="secondaryText">Secondary Button Text</Label>
            <Input
              id="secondaryText"
              name="secondaryText"
              defaultValue={cta.secondaryText || ""}
              placeholder="View Projects"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondaryHref">Secondary Button Link</Label>
            <Input
              id="secondaryHref"
              name="secondaryHref"
              defaultValue={cta.secondaryHref || ""}
              placeholder="#projects"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
