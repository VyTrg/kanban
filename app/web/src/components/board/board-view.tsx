"use client";

import * as React from "react";
import Link from "next/link";
import { MoreHorizontal, Plus, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Id } from "@/lib/board/types";
import { useBoardsManagement } from "@/hooks/use-board";

export function BoardView({
  workspaceId,
  boardId,
}: {
  workspaceId: Id;
  boardId: Id;
}) {
  const { getBoard, getListsForBoard, getTasksForList, initBoard, createList, createTask, deleteList } =
    useBoardsManagement(workspaceId);
  const board = getBoard(boardId);
  console.log("board", board);
  const lists = getListsForBoard(boardId);

  const [newListTitle, setNewListTitle] = React.useState("");
  const [isListOpen, setIsListOpen] = React.useState(false);

  if (!board) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">
          Board not found.
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
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => initBoard(boardId)}
            >
              <Zap />
              Init
            </Button>
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
}: {
  workspaceId: Id;
  boardId: Id;
  listId: Id;
  title: string;
  tasks: { id: Id; title: string; description: string }[];
  onAddTask: (title: string, description: string) => void;
  onDeleteList: () => void;
}) {
  const [taskTitle, setTaskTitle] = React.useState("");
  const [taskDescription, setTaskDescription] = React.useState("");
  const [isTaskOpen, setIsTaskOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="w-[320px] shrink-0 rounded-xl border bg-muted/10">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">{tasks.length} tasks</div>
        </div>
        <div className="relative flex items-center gap-1">
          <Button
            size="icon-sm"
            type="button"
            variant="ghost"
            className="rounded-full bg-muted/60 text-muted-foreground hover:bg-muted cursor-pointer"
            onClick={() => setIsTaskOpen(true)}
          >
            <Plus />
            <span className="sr-only">New task</span>
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            type="button"
            className="rounded-full bg-muted/60 text-muted-foreground hover:bg-muted cursor-pointer"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
          >
            <MoreHorizontal />
            <span className="sr-only">List actions</span>
          </Button>
          {isMenuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-full z-10 mt-2 w-36 rounded-lg border bg-background p-1 shadow-md"
            >
              <button
                type="button"
                role="menuitem"
                className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted cursor-pointer"
                onClick={() => {
                  setIsMenuOpen(false);
                  const confirmed = window.confirm("Delete this list and its tasks?");
                  if (confirmed) onDeleteList();
                }}
              >
                Delete list
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-2 p-3">
        {tasks.map((t) => (
          <Link
            key={t.id}
            href={`/workspaces/${workspaceId}/boards/${boardId}/tasks/${t.id}`}
            className="block rounded-lg border bg-card px-3 py-2 text-sm shadow-sm transition hover:bg-muted/40 cursor-pointer"
          >
            <div className="font-medium leading-5">{t.title}</div>
            {t.description ? (
              <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {t.description}
              </div>
            ) : null}
          </Link>
        ))}

      </div>

      {isTaskOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setIsTaskOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md rounded-xl border bg-background p-5 shadow-lg"
          >
            <div className="text-base font-semibold">New task</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Add a title and description for this task.
            </div>
            <div className="mt-4 space-y-3">
              <Input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Task title…"
              />
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Task description…"
                className={cn(
                  "min-h-[120px] w-full rounded-xl border border-input bg-transparent p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsTaskOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    onAddTask(taskTitle, taskDescription);
                    setTaskTitle("");
                    setTaskDescription("");
                    setIsTaskOpen(false);
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

