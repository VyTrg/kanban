"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Id } from "@/lib/board/types";
import { useBoardsManagement } from "@/hooks/use-board";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

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
  const { workspace, getTask, getListsForBoard, updateTask, deleteTask } = useBoardsManagement(workspaceId);

  const task = getTask(taskId);
  const lists = getListsForBoard(boardId);

  const [title, setTitle] = React.useState(task?.title ?? "");
  const [description, setDescription] = React.useState(task?.description ?? "");
  const [listId, setListId] = React.useState(task?.listId ?? "");
  const [labels, setLabels] = React.useState<string[]>(task?.labels ?? []);
  const [members, setMembers] = React.useState<string[]>(task?.members ?? []);
  const [labelInput, setLabelInput] = React.useState("");
  const [memberInput, setMemberInput] = React.useState("");
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isLabelOpen, setIsLabelOpen] = React.useState(false);
  const [isMemberOpen, setIsMemberOpen] = React.useState(false);
  const [dueDate, setDueDate] = React.useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined,
  );

  React.useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setListId(task?.listId ?? "");
    setLabels(task?.labels ?? []);
    setMembers(task?.members ?? []);
    setDueDate(task?.dueDate ? new Date(task.dueDate) : undefined);
  }, [
    task?.description,
    task?.labels,
    task?.listId,
    task?.members,
    task?.title,
    task?.dueDate,
  ]);

  const getDueDateStatus = (date: Date | undefined) => {
    if (!date) {
      return { text: "No due date", color: "bg-gray-500" };
    }
    const now = new Date();
    const dueDate = new Date(date);
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const formattedDate = format(dueDate, "PPP");

    if (days < 0) {
      return { text: `Overdue: ${formattedDate}`, color: "bg-red-500" };
    }
    if (days <= 7) {
      return { text: `Due soon: ${formattedDate}`, color: "bg-yellow-500" };
    }
    return { text: formattedDate, color: "bg-gray-500" };
  };

  const addLabel = (value: string) => {
    const nextLabel = value.trim();
    if (!nextLabel || labels.includes(nextLabel)) return;
    const next = [...labels, nextLabel];
    setLabels(next);
    setLabelInput("");
    updateTask(taskId, { labels: next });
  };

  const removeLabel = (value: string) => {
    const next = labels.filter((label) => label !== value);
    setLabels(next);
    updateTask(taskId, { labels: next });
  };

  const addMember = (value: string) => {
    const nextMember = value.trim();
    if (!nextMember || members.includes(nextMember)) return;
    const next = [...members, nextMember];
    setMembers(next);
    setMemberInput("");
    updateTask(taskId, { members: next });
  };

  const removeMember = (value: string) => {
    const next = members.filter((member) => member !== value);
    setMembers(next);
    updateTask(taskId, { members: next });
  };

  const workspaceMembers = workspace?.members ?? [];
  const filteredMembers = workspaceMembers.filter((name) =>
    name.toLowerCase().includes(memberInput.trim().toLowerCase()),
  );

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
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => updateTask(taskId, { description })}
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
            <div className="mt-3 space-y-4">
              <div>
                <div className="text-sm font-semibold">Labels</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {labels.length > 0 ? (
                    labels.map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2 py-0.5 text-xs"
                      >
                        {label}
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => removeLabel(label)}
                        >
                          x
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No labels yet.</span>
                  )}
                </div>
                <div className="mt-2">
                  <Button type="button" size="sm" onClick={() => setIsLabelOpen(true)}>
                    Add label
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold">Members</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {members.length > 0 ? (
                    members.map((member) => (
                      <span
                        key={member}
                        className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2 py-0.5 text-xs"
                      >
                        {member}
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => removeMember(member)}
                        >
                          x
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No members yet.</span>
                  )}
                </div>
                <div className="mt-2">
                  <Button type="button" size="sm" onClick={() => setIsMemberOpen(true)}>
                    Add member
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold">Due Date</div>
                <div className="mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Input
                        type="date"
                        value={dueDate ? format(dueDate, "yyyy-MM-dd") : ""}
                        onChange={(e) => {
                          const newDueDate = e.target.value
                            ? new Date(e.target.value)
                            : undefined;
                          setDueDate(newDueDate);
                          updateTask(taskId, {
                            dueDate: newDueDate?.toISOString(),
                          });
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {dueDate && (
                  <div className="mt-2">
                    <Badge
                      className={cn(
                        "text-white",
                        getDueDateStatus(dueDate).color,
                      )}
                    >
                      {getDueDateStatus(dueDate).text}
                    </Badge>
                  </div>
                )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                type="button"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 />
                Delete task
              </Button>
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

      {isDeleteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setIsDeleteOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md rounded-xl border bg-background p-5 shadow-lg"
          >
            <div className="text-base font-semibold">Delete task</div>
            <div className="mt-1 text-xs text-muted-foreground">
              This action cannot be undone.
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                type="button"
                onClick={() => {
                  deleteTask(taskId);
                  setIsDeleteOpen(false);
                  router.push(`/workspaces/${workspaceId}/boards/${boardId}`);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {isLabelOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setIsLabelOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md rounded-xl border bg-background p-5 shadow-lg"
          >
            <div className="text-base font-semibold">Add label</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Enter a label name to attach it to this task.
            </div>
            <div className="mt-4 space-y-3">
              <Input
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="Label name…"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setIsLabelOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    addLabel(labelInput);
                    setIsLabelOpen(false);
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isMemberOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setIsMemberOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md rounded-xl border bg-background p-5 shadow-lg"
          >
            <div className="text-base font-semibold">Add member</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Enter a member name to attach it to this task.
            </div>
            <div className="mt-4 space-y-3">
              <Input
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                placeholder="Search members…"
              />
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border p-2">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((name) => (
                    <button
                      key={name}
                      type="button"
                      className="w-full rounded-md px-2 py-1 text-left text-sm hover:bg-muted"
                      onClick={() => {
                        addMember(name);
                        setIsMemberOpen(false);
                      }}
                    >
                      {name}
                    </button>
                  ))
                ) : (
                  <div className="px-2 py-1 text-xs text-muted-foreground">No matches.</div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setIsMemberOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => setIsMemberOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

