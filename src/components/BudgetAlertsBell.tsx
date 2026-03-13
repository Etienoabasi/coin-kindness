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
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h4 className="font-semibold text-sm text-foreground">Budget Alerts</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-auto py-1" onClick={onMarkAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto">
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4 text-center">No alerts yet</p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`px-4 py-3 border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                  !alert.read ? "bg-primary/5" : ""
                }`}
                onClick={() => !alert.read && onMarkAsRead(alert.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {alert.category} over budget
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Spent {formatCurrency(alert.spent)} of {formatCurrency(alert.budget_limit)} limit
                    </p>
                  </div>
                  {!alert.read && (
                    <Badge variant="destructive" className="text-[10px] shrink-0">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{alert.month}</p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
