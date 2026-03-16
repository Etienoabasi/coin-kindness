import { LayoutDashboard, ArrowLeftRight, BarChart3, Settings, Wallet, Moon, Sun, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Transactions", url: "/transactions", icon: ArrowLeftRight },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface AppSidebarProps {
  darkMode: boolean;
  onToggleDark: () => void;
  onSignOut?: () => void;
  userEmail?: string;
}

function getEmailInitials(email?: string) {
  if (!email) return "U";

  const [name = ""] = email.split("@");
  const parts = name.split(/[._-]+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase() || "U";
}

export function AppSidebar({ darkMode, onToggleDark, onSignOut, userEmail }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Wallet className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-foreground tracking-tight">FinTrack</span>
        )}
      </div>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2">
        {userEmail && (
          <div className="flex items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {getEmailInitials(userEmail)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-sidebar-foreground">Signed in</p>
                <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
              </div>
            )}
          </div>
        )}
        {onSignOut && (
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            onClick={onSignOut}
            className="w-full justify-start gap-3 text-sidebar-foreground"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && "Sign Out"}
          </Button>
        )}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={onToggleDark}
          className="w-full justify-start gap-3 text-sidebar-foreground"
        >
          {darkMode ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
          {!collapsed && (darkMode ? "Light Mode" : "Dark Mode")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
