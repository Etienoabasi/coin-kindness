import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BudgetAlert {
  id: string;
  category: string;
  spent: number;
  budget_limit: number;
  month: string;
  read: boolean;
  created_at: string;
}

export function useBudgetAlerts(userId: string | undefined) {
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("budget_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) {
      setAlerts(data as unknown as BudgetAlert[]);
    }
  }, [userId]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const checkBudgetAlerts = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.functions.invoke("check-budget-alerts", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      await fetchAlerts();
    } finally {
      setLoading(false);
    }
  }, [userId, fetchAlerts]);

  const markAsRead = useCallback(async (alertId: string) => {
    await supabase
      .from("budget_alerts")
      .update({ read: true })
      .eq("id", alertId);
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, read: true } : a)));
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    const unreadIds = alerts.filter((a) => !a.read).map((a) => a.id);
    if (unreadIds.length === 0) return;
    await supabase
      .from("budget_alerts")
      .update({ read: true })
      .in("id", unreadIds);
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }, [userId, alerts]);

  const unreadCount = alerts.filter((a) => !a.read).length;

  return { alerts, unreadCount, loading, checkBudgetAlerts, markAsRead, markAllAsRead, fetchAlerts };
}
