import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteSkillButton } from "./delete-button";

export default async function SkillsPage() {
  const { data: skills } = await supabaseAdmin
    .from("SkillGroup")
    .select("*")
    .order("order");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-muted-foreground mt-1">Manage your skills and expertise</p>
        </div>
        <Link href="/admin/skills/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </Link>
      </div>

      {!skills || skills.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-white">
          <p className="text-muted-foreground">No skills yet</p>
          <Link href="/admin/skills/new">
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Proficiency</TableHead>
                <TableHead>Tools</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      <span className="text-sm">{skill.proficiency}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap max-w-md">
                      {skill.tools.slice(0, 4).map((tool: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs bg-slate-100 px-2 py-1 rounded"
                        >
                          {tool}
                        </span>
                      ))}
                      {skill.tools.length > 4 && (
                        <span className="text-xs text-muted-foreground">
                          +{skill.tools.length - 4}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/skills/${skill.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <DeleteSkillButton id={skill.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
