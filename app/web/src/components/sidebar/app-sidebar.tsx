"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Table,
  LayoutPanelTop,
  UsersRound,
  Settings,
  Search,
  ChevronDown,
  MoreHorizontal,
  LogOut,
  Plus,
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
import { ThemeProvider } from "@/components/theme/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const navItems = [
  { title: "Boards", icon: Table, href: "/workspaces/default/boards" },
  { title: "Templates", icon: LayoutPanelTop, href: "/templates" },
  { title: "Members", icon: UsersRound, href: "/member" },
  { title: "Settings", icon: Settings, href: "/settings" },
];

const workspaces = [
  { id: "default", name: "mychannel", initials: "M" },
  { id: "work", name: "Workspace 2", initials: "W" },
];

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  children?: React.ReactNode;
};

export function AppSidebar({ children, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <ThemeProvider>
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
            <SidebarTrigger
              className={`h-8 w-8 ${isCollapsed ? "mx-auto" : ""}`}
            />
          </SidebarHeader>

          <SidebarContent className="px-2 py-4">
            {/*workspace*/}
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
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
                            <ChevronDown className="size-4 text-sidebar-foreground/70" />
                          </div>
                        )}
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="w-56">
                      <DropdownMenuLabel>Switch Workspace</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {workspaces.map((ws) => (
                        <DropdownMenuItem key={ws.id}>
                          <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shadow-sm font-bold text-xs mr-2">
                            {ws.initials}
                          </div>
                          <span className="flex-1">{ws.name}</span>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-muted-foreground">
                        <Plus className="size-4 mr-2" />
                        Create Workspace
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            {/*search*/}
            <SidebarGroup className="mt-2">
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <SidebarMenuButton
                    className={`w-full hover:bg-sidebar-accent/50 ${
                      isCollapsed ? "justify-center px-0" : ""
                    }`}
                  >
                    <Search className="size-4 shrink-0 text-sidebar-foreground/70" />
                    {!isCollapsed && (
                      <span className="text-[15px] text-sidebar-foreground/70">
                        Search...
                      </span>
                    )}
                  </SidebarMenuButton>
                </PopoverTrigger>
                <PopoverContent side="right" align="start" className="w-80 p-3">
                  <div className="space-y-2">
                    <Input
                      placeholder="Search boards, members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <p className="text-xs text-muted-foreground">
                      Press Esc to close
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
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
                        isCollapsed ? "justify-center !w-full" : ""
                      }`}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3"
                      >
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
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
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="size-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="size-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </ThemeProvider>
  );
}
