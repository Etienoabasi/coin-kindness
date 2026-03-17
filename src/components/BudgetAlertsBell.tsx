import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BudgetAlert } from "@/hooks/useBudgetAlerts";
import { Badge } from "@/components/ui/badge";

interface BudgetAlertsBellProps {
  alerts: BudgetAlert[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  formatCurrency: (n: number) => string;
}

export function BudgetAlertsBell({
  alerts,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  formatCurrency,
}: BudgetAlertsBellProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-md">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-1rem)] max-w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h4 className="text-sm font-semibold text-foreground">Budget Alerts</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto py-1 text-xs" onClick={onMarkAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto">
          {alerts.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">No alerts yet</p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`cursor-pointer border-b border-border px-4 py-3 transition-colors hover:bg-muted/50 last:border-0 ${
                  !alert.read ? "bg-primary/5" : ""
                }`}
                onClick={() => !alert.read && onMarkAsRead(alert.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {alert.category} over budget
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Spent {formatCurrency(alert.spent)} of {formatCurrency(alert.budget_limit)} limit
                    </p>
                  </div>
                  {!alert.read && (
                    <Badge variant="destructive" className="shrink-0 text-[10px]">
                      New
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">{alert.month}</p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
