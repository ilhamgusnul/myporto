"use client";

import { Button } from "@/components/ui/button";
import { deleteStat } from "./actions";
import { Trash2 } from "lucide-react";

export function DeleteStatButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this stat?")) {
      await deleteStat(id);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
