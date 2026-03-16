import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BudgetAlertsBell } from "@/components/BudgetAlertsBell";
import { BudgetAlert } from "@/hooks/useBudgetAlerts";

interface AppLayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  onToggleDark: () => void;
  onSignOut?: () => void;
  userEmail?: string;
  alerts: BudgetAlert[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  formatCurrency: (n: number) => string;
}

export function AppLayout({ children, darkMode, onToggleDark, onSignOut, userEmail, alerts, unreadCount, onMarkAsRead, onMarkAllAsRead, formatCurrency }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar darkMode={darkMode} onToggleDark={onToggleDark} onSignOut={onSignOut} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h2 className="text-sm font-medium text-muted-foreground">Personal Finance Tracker</h2>
            </div>
            <div className="flex items-center gap-2">
              {userEmail && <span className="text-xs text-muted-foreground hidden sm:inline">{userEmail}</span>}
              <BudgetAlertsBell
                alerts={alerts}
                unreadCount={unreadCount}
                onMarkAsRead={onMarkAsRead}
                onMarkAllAsRead={onMarkAllAsRead}
                formatCurrency={formatCurrency}
              />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
