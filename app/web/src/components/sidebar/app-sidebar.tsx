"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Table,
  LayoutPanelTop,
  UsersRound,
  Settings,
  Search,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Boards", icon: Table, href: "/workspaces/default/boards" },
  { title: "Templates", icon: LayoutPanelTop, href: "#" },
  { title: "Members", icon: UsersRound, href: "#" },
  { title: "Settings", icon: Settings, href: "#" },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200 bg-slate-50/50"
      {...props}
    >
      {/*header*/}
      <SidebarHeader className="h-14 border-b flex flex-row items-center justify-between px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2 font-semibold transition-all">
            <span className="text-lg tracking-tight">kanban</span>
          </div>
        )}
        <SidebarTrigger className={`h-8 w-8 ${isCollapsed ? "mx-auto" : ""}`} />
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/*workspace*/}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className={`w-full hover:bg-slate-200/50 ${
                  isCollapsed ? "justify-center px-0" : "justify-between"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm font-bold text-xs">
                    M
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium text-[15px]">mychannel</span>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex items-center gap-1">
                    <Search className="size-4 text-slate-400" />
                    <ChevronDown className="size-4 text-slate-400" />
                  </div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/*main navigator*/}
        <SidebarGroup className="mt-4">
          <SidebarMenu className="gap-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className={`px-3 py-5 hover:bg-slate-200/50 transition-colors ${
                    isCollapsed ? "justify-center" : ""
                  }`}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon
                      className={`size-5 text-slate-600 shrink-0 ${
                        isCollapsed ? "mx-auto" : ""
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="text-[15px] text-slate-700 font-medium">
                        {item.title}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/*footer*/}
      <SidebarFooter className="p-2 space-y-2 border-t bg-slate-50/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={`w-full hover:bg-slate-200/50 ${
                isCollapsed ? "justify-center px-0" : "px-2"
              }`}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-semibold text-xs border border-slate-300">
                VT
              </div>
              {!isCollapsed && (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                    <span className="truncate font-semibold text-slate-700">
                      Vy Trương
                    </span>
                  </div>
                  <MoreHorizontal className="ml-auto size-4 text-slate-400" />
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
