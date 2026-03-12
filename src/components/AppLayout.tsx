import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  onToggleDark: () => void;
  onSignOut?: () => void;
  userEmail?: string;
}

export function AppLayout({ children, darkMode, onToggleDark, onSignOut, userEmail }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar darkMode={darkMode} onToggleDark={onToggleDark} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h2 className="text-sm font-medium text-muted-foreground">Personal Finance Tracker</h2>
            </div>
            {onSignOut && (
              <div className="flex items-center gap-3">
                {userEmail && <span className="text-xs text-muted-foreground hidden sm:inline">{userEmail}</span>}
                <Button variant="ghost" size="sm" onClick={onSignOut} className="text-muted-foreground">
                  <LogOut className="w-4 h-4 mr-1" /> Sign Out
                </Button>
              </div>
            )}
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
