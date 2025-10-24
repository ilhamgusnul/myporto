import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { updateSkill } from "../../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default async function EditSkillPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: skill } = await supabaseAdmin
    .from("SkillGroup")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!skill) {
    return <div>Skill not found</div>;
  }

  const updateWithId = updateSkill.bind(null, params.id);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/skills">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Skill</h1>
          <p className="text-muted-foreground mt-1">Update skill details</p>
        </div>
      </div>

      <form action={updateWithId} className="bg-white p-6 rounded-lg border space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Skill Group Name *</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={skill.name}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills">Skills * (comma separated)</Label>
          <Input
            id="skills"
            name="skills"
            required
            defaultValue={skill.skills.join(", ")}
          />
          <p className="text-xs text-muted-foreground">
            Separate skills with commas
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit">Update Skill Group</Button>
          <Link href="/admin/skills">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
