import { createSkill } from "../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function NewSkillPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/skills">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Skill</h1>
          <p className="text-muted-foreground mt-1">Create a new skill group</p>
        </div>
      </div>

      <form action={createSkill} className="bg-white p-6 rounded-lg border space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Skill Category *</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="e.g., Frontend Development, Backend, Design"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proficiency">Proficiency Level (0-100) *</Label>
          <Input
            id="proficiency"
            name="proficiency"
            type="number"
            min="0"
            max="100"
            required
            defaultValue="80"
          />
          <p className="text-xs text-muted-foreground">
            Enter your proficiency level from 0 to 100
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tools">Tools & Technologies * (comma separated)</Label>
          <Input
            id="tools"
            name="tools"
            required
            placeholder="React, Next.js, TypeScript, Tailwind CSS"
          />
          <p className="text-xs text-muted-foreground">
            Separate tools with commas
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit">Create Skill</Button>
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
