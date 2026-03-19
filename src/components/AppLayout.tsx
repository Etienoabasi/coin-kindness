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
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar darkMode={darkMode} onToggleDark={onToggleDark} onSignOut={onSignOut} userEmail={userEmail} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-card/80 px-3 backdrop-blur-sm sm:px-4">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <SidebarTrigger className="h-9 w-9 shrink-0 rounded-md" />
              <h2 className="truncate text-xs font-medium text-muted-foreground sm:text-sm">Personal Finance Tracker</h2>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden gap-1.5 sm:inline-flex"
                onClick={() => navigate("/analytics")}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => navigate("/transactions?new=1")}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Transaction</span>
              </Button>
              <BudgetAlertsBell
                alerts={alerts}
                unreadCount={unreadCount}
                onMarkAsRead={onMarkAsRead}
                onMarkAllAsRead={onMarkAllAsRead}
                formatCurrency={formatCurrency}
              />
            </div>
          </header>
          <main className="flex-1 overflow-auto px-3 py-4 sm:px-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
