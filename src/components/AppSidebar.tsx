import { LayoutDashboard, ArrowLeftRight, BarChart3, Settings, Wallet, Moon, Sun, LogOut, Mail, UserCircle } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

function getDisplayName(email?: string) {
  if (!email) return "User";

  const [name = "User"] = email.split("@");
  return name
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AppSidebar({ darkMode, onToggleDark, onSignOut, userEmail }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const displayName = getDisplayName(userEmail);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="flex items-center gap-3 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Wallet className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-foreground">FinTrack</span>
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
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="space-y-2 p-3">
        {userEmail && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto w-full justify-start rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-left text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {getEmailInitials(userEmail)}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-sidebar-foreground">Signed in</p>
                    <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Your profile</DialogTitle>
                <DialogDescription>Account details for the currently signed-in user.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                      {getEmailInitials(userEmail)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-semibold text-foreground">{displayName}</p>
                    <p className="text-sm text-muted-foreground">Signed in account</p>
                  </div>
                </div>

                <div className="space-y-3 rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</p>
                      <p className="break-all text-sm text-foreground">{userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <UserCircle className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Display name</p>
                      <p className="text-sm text-foreground">{displayName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        {onSignOut && (
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            onClick={onSignOut}
            className="w-full justify-start gap-3 text-sidebar-foreground"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && "Sign Out"}
          </Button>
        )}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={onToggleDark}
          className="w-full justify-start gap-3 text-sidebar-foreground"
        >
          {darkMode ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
          {!collapsed && (darkMode ? "Light Mode" : "Dark Mode")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
