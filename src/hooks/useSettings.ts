import { useState, useEffect, useCallback } from "react";
import { Settings, BudgetGoal } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

const defaultSettings: Settings = {
  currency: "USD",
  darkMode: false,
  budgetGoals: [],
};

export function useSettings(userId: string | undefined) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  // Fetch settings from DB
  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (data) {
        setSettings({
          currency: data.currency,
          darkMode: data.dark_mode,
          budgetGoals: (data.budget_goals as any) || [],
        });
      } else {
        // Create default settings for new user
        await supabase.from("user_settings").insert({ user_id: userId });
      }
      setLoaded(true);
    };
    fetch();
  }, [userId]);

  // Apply dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  const saveSettings = useCallback(
    async (newSettings: Settings) => {
      if (!userId) return;
      setSettings(newSettings);
      await supabase
        .from("user_settings")
        .update({
          currency: newSettings.currency,
          dark_mode: newSettings.darkMode,
          budget_goals: newSettings.budgetGoals as any,
        })
        .eq("user_id", userId);
    },
    [userId]
  );

  const toggleDarkMode = () => {
    const next = { ...settings, darkMode: !settings.darkMode };
    saveSettings(next);
  };

  const setCurrency = (currency: string) => {
    saveSettings({ ...settings, currency });
  };

  const setBudgetGoals = (budgetGoals: BudgetGoal[]) => {
    saveSettings({ ...settings, budgetGoals });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: settings.currency,
    }).format(amount);
  };

  return { settings, toggleDarkMode, setCurrency, setBudgetGoals, formatCurrency, loaded };
}
