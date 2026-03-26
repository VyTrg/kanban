"use client";

import React from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WorkspaceCardProps {
  avatar?: string;
  initials: string;
  title: string;
  description: string;
  onUpdateLogo?: () => void;
}

export function WorkspaceCard({
  avatar,
  initials = "DC",
  title = "Design Collective",
  description = "Collaborate on design projects and brand assets",
  onUpdateLogo,
}: WorkspaceCardProps) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-16 w-16 shrink-0 items-center justify-center rounded-lg font-bold text-lg text-white",
            "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md"
          )}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Workspace
          </p>
          <h3 className="text-lg font-semibold text-slate-900 truncate">
            {title}
          </h3>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* Description Section */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            readOnly
            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium cursor-default"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            Description
          </label>
          <textarea
            value={description}
            readOnly
            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-sm resize-none cursor-default"
            rows={3}
          />
        </div>
      </div>

      {/* Update Logo Button */}
      <Button
        onClick={onUpdateLogo}
        variant="outline"
        className="w-full gap-2"
        size="sm"
      >
        <ImagePlus className="h-4 w-4" />
        Update Logo
      </Button>
    </div>
  );
}
