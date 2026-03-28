"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Tag, Users, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Id } from "@/lib/board/types";
import { useBoardsManagement } from "@/hooks/use-board";

export function TaskDetailPage({
  workspaceId,
  boardId,
  taskId,
}: {
  workspaceId: Id;
  boardId: Id;
  taskId: Id;
}) {
  const router = useRouter();
  const { getTask, getListsForBoard, updateTask } = useBoardsManagement(workspaceId);

  const task = getTask(taskId);
  const lists = getListsForBoard(boardId);

  const [title, setTitle] = React.useState(task?.title ?? "");
  const [description, setDescription] = React.useState(task?.description ?? "");
  const [listId, setListId] = React.useState(task?.listId ?? "");

  React.useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setListId(task?.listId ?? "");
  }, [task?.description, task?.listId, task?.title]);

  if (!task) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">
          Task not found.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between gap-3 px-6 py-4">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">Task</div>
            <div className="truncate text-lg font-semibold tracking-tight">{task.title}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => router.push(`/workspaces/${workspaceId}/boards/${boardId}`)}
            >
              <X />
              Close
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border bg-card p-5">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold">Title</div>
              <div className="mt-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => updateTask(taskId, { title })}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Description</div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => updateTask(taskId, { description })}
                >
                  Save
                </Button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description…"
                className={cn(
                  "mt-2 min-h-[180px] w-full rounded-xl border border-input bg-transparent p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border bg-card p-4">
            <div className="text-sm font-semibold">List</div>
            <div className="mt-2">
              <select
                value={listId}
                onChange={(e) => {
                  const next = e.target.value;
                  setListId(next);
                  updateTask(taskId, { listId: next });
                }}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Moving a task updates its list column.
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <div className="text-sm font-semibold">Actions</div>
            <div className="mt-3 grid gap-2">
              <ActionButton icon={<Tag className="size-4" />} label="Labels (coming soon)" />
              <ActionButton icon={<Users className="size-4" />} label="Members (coming soon)" />
              <ActionButton icon={<Calendar className="size-4" />} label="Due date (coming soon)" />
            </div>
          </div>

          <Link
            href={`/workspaces/${workspaceId}/boards/${boardId}`}
            className="block rounded-xl border bg-muted/10 p-4 text-sm font-medium hover:bg-muted/25"
          >
            Back to board
          </Link>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground">
      {icon}
      <span className="truncate">{label}</span>
    </div>
  );
}

