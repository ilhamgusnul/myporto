"use client";

import { Button } from "@/components/ui/button";
import { deleteSocialMedia } from "./actions";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export function DeleteSocialButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this social media?")) {
      startTransition(async () => {
        await deleteSocialMedia(id);
      });
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
