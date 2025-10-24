import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function StatsPage() {
  const { data: stats } = await supabaseAdmin
    .from("Stat")
    .select("*")
    .order("order");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stats</h1>
        <p className="text-muted-foreground mt-1">Manage homepage statistics</p>
      </div>

      {!stats || stats.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border text-center">
          <p className="text-muted-foreground">No stats found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Value</TableHead>
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
                    {stat.key}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/stats/${stat.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
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
