import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createService } from "../actions";

export default function NewServicePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/services">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Service</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createService} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Web Development"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the service"
                rows={4}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                name="icon"
                placeholder="e.g. Code, Palette, Smartphone, Server, Cloud"
                defaultValue="Briefcase"
              />
              <p className="text-xs text-gray-500">
                Lucide icon name (e.g., Code, Palette, Smartphone, Server, Cloud, MessageSquare, Briefcase, Layers, Lightbulb, Zap)
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="submit">Create Service</Button>
              <Link href="/admin/services">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
