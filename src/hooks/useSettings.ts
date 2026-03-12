import { useState, useEffect } from "react";
import { Settings, BudgetGoal } from "@/lib/types";

const STORAGE_KEY = "finance-tracker-settings";

const defaultSettings: Settings = {
  currency: "USD",
  darkMode: false,
  budgetGoals: [],
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings]);

  const toggleDarkMode = () =>
    setSettings((s) => ({ ...s, darkMode: !s.darkMode }));

  const setCurrency = (currency: string) =>
    setSettings((s) => ({ ...s, currency }));

  const setBudgetGoals = (budgetGoals: BudgetGoal[]) =>
    setSettings((s) => ({ ...s, budgetGoals }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: settings.currency,
    }).format(amount);
  };

  return { settings, toggleDarkMode, setCurrency, setBudgetGoals, formatCurrency };
}
