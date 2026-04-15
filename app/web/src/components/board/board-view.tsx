"use client";

import * as React from "react";
import Link from "next/link";
import { MoreHorizontal, Plus, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Id } from "@/lib/board/types";
import { useBoardsManagement } from "@/hooks/use-board";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Task } from "@/lib/board/types";

export function BoardView({
  workspaceId,
  boardId,
}: {
  workspaceId: Id;
  boardId: Id;
}) {
  const { getBoard, getListsForBoard, getTasksForList, isLoading, initBoard, createList, createTask, deleteList, updateList } =
    useBoardsManagement(workspaceId);
  const board = getBoard(boardId);
  const lists = getListsForBoard(boardId);

  const [newListTitle, setNewListTitle] = React.useState("");
  const [isListOpen, setIsListOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="h-full w-full">
        <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between gap-3 px-6 py-4">
            <div className="min-w-0">
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
              <div className="mt-0.5 h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="h-full w-full">
        <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between gap-3 px-6 py-4">
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold tracking-tight">Board not found</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between gap-3 px-6 py-4">
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold tracking-tight">{board.title}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {lists.length} lists
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/workspaces/${workspaceId}/boards`}
              className={cn(
                "inline-flex h-8 items-center rounded-lg border border-border px-2.5 text-sm font-medium hover:bg-muted",
              )}
            >
              Back to boards
            </Link>
          </div>
        </div>
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-muted-foreground">Create a new list for this board.</div>
            <Button variant="outline" type="button" onClick={() => setIsListOpen(true)}>
              <Plus />
              Add list
            </Button>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-8.5rem)] w-full overflow-x-auto px-6 py-6">
        <div className="flex min-w-full items-start gap-4">
          {lists.length === 0 ? (
            <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">
              This board has no lists yet. Click <span className="font-medium">Init</span> to
              create default columns, or add your own list above.
            </div>
          ) : (
            lists.map((list) => (
              <ListColumn
                key={list.id}
                workspaceId={workspaceId}
                boardId={boardId}
                listId={list.id}
                title={list.title}
                tasks={getTasksForList(list.id)}
                onAddTask={(t, d) => createTask(boardId, list.id, t, d)}
                onDeleteList={() => deleteList(boardId, list.id)}
                onUpdateList={(title) => updateList(list.id, { title })}
              />
            ))
          )}
        </div>
      </div>

      {isListOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsListOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md rounded-xl border bg-background p-5 shadow-lg"
          >
            <div className="text-base font-semibold">New list</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Add a list title to create a new column.
            </div>
            <div className="mt-4 space-y-3">
              <Input
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="List title…"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setIsListOpen(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={!newListTitle.trim()}
                  type="button"
                  onClick={() => {
                    createList(boardId, newListTitle);
                    setNewListTitle("");
                    setIsListOpen(false);
                  }}
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ListColumn({
  workspaceId,
  boardId,
  listId,
  title,
  tasks,
  onAddTask,
  onDeleteList,
  onUpdateList,
}: {
  workspaceId: Id;
  boardId: Id;
  listId: Id;
  title: string;
  tasks: Task[];
  onAddTask: (title: string, description: string) => void;
  onDeleteList: () => void;
  onUpdateList: (title: string) => void;
}) {
  const [newTitle, setNewTitle] = React.useState(title);
  const [taskTitle, setTaskTitle] = React.useState("");
  const [taskDescription, setTaskDescription] = React.useState("");
  const [isTaskOpen, setIsTaskOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isRenameOpen, setIsRenameOpen] = React.useState(false);

  React.useEffect(() => {
    setNewTitle(title);
  }, [title]);

  const handleRename = () => {
    if (newTitle.trim() && newTitle !== title) {
      onUpdateList(newTitle);
    }
    setIsRenameOpen(false);
  };

  return (
    <div className="flex w-72 flex-col rounded-lg border bg-card">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{title}</div>
          <Badge variant="secondary">{tasks.length}</Badge>
        </div>
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setIsRenameOpen(true)}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="text-red-500">
              Delete list
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col gap-3 p-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} workspaceId={workspaceId} boardId={boardId} task={task} />
        ))}
      </div>
      <div className="p-3 pt-0">
        {isTaskOpen ? (
          <div className="space-y-3 rounded-lg border bg-background p-3">
            <Input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task title…"
              className="h-8"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => {
                  setIsTaskOpen(false);
                  setTaskTitle("");
                  setTaskDescription("");
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="button"
                disabled={!taskTitle.trim()}
                onClick={() => {
                  onAddTask(taskTitle, taskDescription);
                  setTaskTitle("");
                  setTaskDescription("");
                  setIsTaskOpen(false);
                }}
              >
                Add
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            type="button"
            className="w-full justify-start"
            onClick={() => setIsTaskOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add task
          </Button>
        )}
      </div>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete list</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this list? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDeleteList();
                setIsDeleteOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename list</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TaskCard({
  workspaceId,
  boardId,
  task,
}: {
  workspaceId: Id;
  boardId: Id;
  task: Task;
}) {
  const [taskTitle, setTaskTitle] = React.useState("");
  const [taskDescription, setTaskDescription] = React.useState("");
  const [isTaskOpen, setIsTaskOpen] = React.useState(false);

  React.useEffect(() => {
    setTaskTitle(task.title);
    setTaskDescription(task.description);
  }, [task]);

  const getDueDateStatus = (date: string | undefined) => {
    if (!date) {
      return null;
    }
    const now = new Date();
    const dueDate = new Date(date);
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const formattedDate = format(dueDate, "MMM d");

    if (days < 0) {
      return { text: `Overdue: ${formattedDate}`, color: "bg-red-500" };
    }
    if (days <= 7) {
      return { text: `Due: ${formattedDate}`, color: "bg-yellow-500" };
    }
    return { text: formattedDate, color: "bg-gray-500" };
  };

  const dueDateStatus = getDueDateStatus(task.dueDate);

  return (
    <Link
      key={task.id}
      href={`/workspaces/${workspaceId}/boards/${boardId}/tasks/${task.id}`}
      className="block rounded-lg border bg-card px-3 py-2 text-sm shadow-sm transition hover:bg-muted/40 cursor-pointer"
    >
      <div className="font-medium leading-5">{task.title}</div>
      {dueDateStatus && (
        <div className="mt-2">
          <Badge
            className={cn("text-white", dueDateStatus.color)}
          >
            {dueDateStatus.text}
          </Badge>
        </div>
      )}
      {task.labels && task.labels.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.labels.slice(0, 3).map((label) => (
            <span
              key={label}
              className="rounded-full border bg-muted/40 px-2 py-0.5 text-[11px]"
            >
              {label}
            </span>
          ))}
          {task.labels.length > 3 ? (
            <span className="text-[11px] text-muted-foreground">
              +{task.labels.length - 3}
            </span>
          ) : null}
        </div>
      ) : null}
      {task.description ? (
        <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {task.description}
        </div>
      ) : null}
    </Link>
  );
}

