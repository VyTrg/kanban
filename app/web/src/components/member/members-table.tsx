"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Member" | "Observer";
  status: "active" | "away";
  avatar?: string;
}

interface MembersTableProps {
  members?: Member[];
}

const defaultMembers: Member[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    role: "Owner",
    status: "active",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus.j@company.com",
    role: "Member",
    status: "active",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma.w@company.com",
    role: "Member",
    status: "away",
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    email: "alex.r@company.com",
    role: "Observer",
    status: "active",
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function MembersTable({ members = defaultMembers }: MembersTableProps) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Member
        </p>
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Role
        </p>
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Status
        </p>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100">
        {members.map((member) => (
          <div
            key={member.id}
            className="grid grid-cols-3 gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
          >
            {/* Member Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-semibold text-sm text-white",
                  "bg-gradient-to-br from-blue-500 to-blue-600"
                )}
              >
                {getInitials(member.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {member.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {member.email}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center">
              <Badge
                variant={
                  member.role === "Owner"
                    ? "default"
                    : member.role === "Member"
                      ? "secondary"
                      : "outline"
                }
                className="text-xs font-medium"
              >
                {member.role}
              </Badge>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  member.status === "active"
                    ? "bg-emerald-500"
                    : "bg-yellow-500"
                )}
              />
              <span className="text-sm text-slate-600 capitalize">
                {member.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
