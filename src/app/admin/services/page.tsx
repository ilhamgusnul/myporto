import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { deleteService } from "./actions";

export default async function ServicesPage() {
  const { data: services } = await supabaseAdmin
    .from("Service")
    .select("*")
    .order("order");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground mt-1">Manage your service offerings</p>
        </div>
        <Link href="/admin/services/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services?.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Link href={`/admin/services/${service.id}/edit`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <form action={deleteService.bind(null, service.id)}>
                  <Button variant="destructive" type="submit">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!services || services.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No services yet. Click &quot;Add Service&quot; to create one.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
