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
import { DeleteStatButton } from "./delete-button";

export default async function StatsPage() {
  const { data: stats } = await supabaseAdmin
    .from("Stat")
    .select("*")
    .order("order");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stats</h1>
          <p className="text-muted-foreground mt-1">Manage homepage statistics</p>
        </div>
        <Link href="/admin/stats/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Stat
          </Button>
        </Link>
      </div>

      {!stats || stats.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border text-center">
          <p className="text-muted-foreground mb-4">No stats yet</p>
          <Link href="/admin/stats/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Stat
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((stat) => (
                <TableRow key={stat.id}>
                  <TableCell className="font-medium">{stat.label}</TableCell>
                  <TableCell>
                    <span className="text-2xl font-bold text-primary">
                      {stat.value}+
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {stat.order}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/stats/${stat.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <DeleteStatButton id={stat.id} />
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
