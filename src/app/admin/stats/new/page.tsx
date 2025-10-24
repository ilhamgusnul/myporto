import { createStat } from "../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { SubmitButton } from "@/components/admin/submit-button";

export default function NewStatPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/stats">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Stat</h1>
          <p className="text-muted-foreground mt-1">Create a new statistic</p>
        </div>
      </div>

      <form action={createStat} className="bg-white p-6 rounded-lg border space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Label *</Label>
          <Input
            id="label"
            name="label"
            required
            placeholder="e.g., Projects Completed, Happy Clients"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Value *</Label>
          <Input
            id="value"
            name="value"
            required
            placeholder="e.g., 50, 100"
          />
          <p className="text-xs text-muted-foreground">
            Enter the number (+ sign will be added automatically)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue="0"
            placeholder="0"
          />
          <p className="text-xs text-muted-foreground">
            Display order (lower numbers appear first)
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          <SubmitButton>Create Stat</SubmitButton>
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
