import { prisma } from "@/lib/prisma";
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
import { DeleteProjectButton } from "./delete-button";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-white">
          <p className="text-muted-foreground">No projects yet</p>
          <Link href="/admin/projects/new">
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stack</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.category.replace(/_/g, " ")}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {project.stack.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs bg-slate-100 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{project.stack.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.completedAt
                      ? new Date(project.completedAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <DeleteProjectButton id={project.id} />
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
