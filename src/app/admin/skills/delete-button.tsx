"use client";

import { Button } from "@/components/ui/button";
import { deleteSkill } from "./actions";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export function DeleteSkillButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm("Are you sure you want to delete this skill?")) {
      startTransition(async () => {
        await deleteSkill(id);
      });
    }
  }

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
