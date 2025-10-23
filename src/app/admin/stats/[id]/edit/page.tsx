import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateStat } from "../../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default async function EditStatPage({
  params,
}: {
  params: { id: string };
}) {
  const stat = await prisma.stat.findUnique({
    where: { id: params.id },
  });

  if (!stat) notFound();

  const updateWithId = updateStat.bind(null, params.id);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/stats">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Stat</h1>
          <p className="text-muted-foreground mt-1">Update statistic value</p>
        </div>
      </div>

      <form action={updateWithId} className="bg-white p-6 rounded-lg border space-y-4">
        <div className="space-y-2">
          <Label htmlFor="key">Key (readonly)</Label>
          <Input
            id="key"
            name="key"
            value={stat.key}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="label">Label *</Label>
          <Input
            id="label"
            name="label"
            required
            defaultValue={stat.label}
            placeholder="Projects Completed"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Value *</Label>
          <Input
            id="value"
            name="value"
            type="number"
            min="0"
            required
            defaultValue={stat.value}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit">Update Stat</Button>
          <Link href="/admin/stats">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
