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
  { title: "Templates", icon: LayoutPanelTop, href: "/templates" },
  { title: "Members", icon: UsersRound, href: "/members" },
  { title: "Settings", icon: Settings, href: "/settings" },
];

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  children?: React.ReactNode;
};

export function AppSidebar({ children, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="flex h-screen w-full">
      <Sidebar
        collapsible="icon"
        className="relative z-50 border-r border-sidebar-border bg-sidebar"
        {...props}
      >
        {/*header*/}
        <SidebarHeader className="h-14 border-b border-sidebar-border/60 bg-sidebar flex flex-row items-center justify-between px-4">
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
                  className={`w-full hover:bg-sidebar-accent/50 ${
                    isCollapsed ? "justify-center px-0" : "justify-between"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm font-bold text-xs">
                      M
                    </div>
                    {!isCollapsed && (
                      <span className="font-medium text-[15px] text-sidebar-foreground">
                        mychannel
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center gap-1">
                      <Search className="size-4 text-sidebar-foreground/70" />
                      <ChevronDown className="size-4 text-sidebar-foreground/70" />
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
                    className={`px-3 py-5 transition-colors hover:bg-sidebar-accent/50 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground ${
                      isCollapsed ? "justify-center" : ""
                    }`}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon
                        className={`size-5 shrink-0 text-sidebar-foreground/80 ${
                          isCollapsed ? "mx-auto" : ""
                        }`}
                      />
                      {!isCollapsed && (
                        <span className="text-[15px] font-medium text-sidebar-foreground">
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
        <SidebarFooter className="p-2 space-y-2 border-t border-sidebar-border/60 bg-sidebar">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className={`w-full hover:bg-sidebar-accent/50 ${
                  isCollapsed ? "justify-center px-0" : "px-2"
                }`}
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-sidebar-border bg-muted text-foreground/80 font-semibold text-xs">
                  VT
                </div>
                {!isCollapsed && (
                  <>
                    <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                      <span className="truncate font-semibold text-sidebar-foreground">
                        Vy Trương
                      </span>
                    </div>
                    <MoreHorizontal className="ml-auto size-4 text-sidebar-foreground/70" />
                  </>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
