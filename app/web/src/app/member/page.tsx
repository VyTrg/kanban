"use client";

import React from "react";
import { WorkspaceCard } from "@/components/member/workspace-card";
import { InsightCard } from "@/components/member/insight-card";
import { MembersTable } from "@/components/member/members-table";
import { InvitationList } from "@/components/member/invitation-list";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default function MemberPage() {
  const handleInviteMember = () => {
    console.log("Invite member clicked");
  };

  const handleUpdateLogo = () => {
    console.log("Update logo clicked");
  };

  const handleAcceptInvitation = (id: string) => {
    console.log("Accept invitation:", id);
  };

  const handleRejectInvitation = (id: string) => {
    console.log("Reject invitation:", id);
  };

  return (
    <div className="p-8 space-y-8">
      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Workspace Settings */}
        <div className="lg:col-span-1 space-y-6">
          <WorkspaceCard
            initials="DC"
            title="Design Collective"
            description="Collaborate on design projects and brand assets with your team members."
            onUpdateLogo={handleUpdateLogo}
          />

          <InsightCard
            teamVelocity={12}
            focusScore={92}
            description="Your team is performing exceptionally well this sprint. Keep up the momentum!"
          />
        </div>

        {/* Right Column: Members and Invitations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Project Management
              </h1>
              <p className="text-slate-600 mt-1">
                Workspace settings and team collaboration
              </p>
            </div>
            <Button
              onClick={handleInviteMember}
              size="lg"
              className="gap-2 w-full sm:w-auto"
            >
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </div>

          {/* Members Table */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Active Members
            </h2>
            <MembersTable />
          </div>

          {/* Pending Invitations */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Invitations
            </h2>
            <InvitationList
              invitations={[
                {
                  id: "1",
                  email: "john.doe@company.com",
                  role: "Member",
                  sentAt: "Sent 2 days ago",
                  onAccept: () =>
                    handleAcceptInvitation("john.doe@company.com"),
                  onReject: () =>
                    handleRejectInvitation("john.doe@company.com"),
                },
                {
                  id: "2",
                  email: "lisa.park@company.com",
                  role: "Observer",
                  sentAt: "Sent 1 week ago",
                  onAccept: () =>
                    handleAcceptInvitation("lisa.park@company.com"),
                  onReject: () =>
                    handleRejectInvitation("lisa.park@company.com"),
                },
                {
                  id: "3",
                  email: "team.lead@company.com",
                  role: "Member",
                  sentAt: "Sent 3 days ago",
                  onAccept: () =>
                    handleAcceptInvitation("team.lead@company.com"),
                  onReject: () =>
                    handleRejectInvitation("team.lead@company.com"),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
