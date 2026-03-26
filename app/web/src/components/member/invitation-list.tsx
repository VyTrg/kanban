"use client";

import React from "react";
import { Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Invitation {
  id: string;
  email: string;
  role: "Owner" | "Member" | "Observer";
  sentAt: string;
  onAccept?: () => void;
  onReject?: () => void;
}

interface InvitationListProps {
  invitations?: Invitation[];
}

const defaultInvitations: Invitation[] = [
  {
    id: "1",
    email: "john.doe@company.com",
    role: "Member",
    sentAt: "Sent 2 days ago",
  },
  {
    id: "2",
    email: "lisa.park@company.com",
    role: "Observer",
    sentAt: "Sent 1 week ago",
  },
  {
    id: "3",
    email: "team.lead@company.com",
    role: "Member",
    sentAt: "Sent 3 days ago",
  },
];

export function InvitationList({
  invitations = defaultInvitations,
}: InvitationListProps) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <p className="text-sm font-semibold text-slate-900">Pending Invitations</p>
        <p className="text-xs text-slate-500 mt-1">
          {invitations.length} invitation{invitations.length !== 1 ? "s" : ""} pending
        </p>
      </div>

      {/* Invitations List */}
      {invitations.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              {/* Left: Email, Role, Time */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {invitation.email}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge
                    variant={
                      invitation.role === "Owner"
                        ? "default"
                        : invitation.role === "Member"
                          ? "secondary"
                          : "outline"
                    }
                    className="text-xs"
                  >
                    {invitation.role}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {invitation.sentAt}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={invitation.onAccept}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Accept invitation"
                >
                  <Check className="h-4 w-4 text-emerald-600" />
                </Button>
                <Button
                  onClick={invitation.onReject}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Reject invitation"
                >
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-slate-500">No pending invitations</p>
        </div>
      )}
    </div>
  );
}
