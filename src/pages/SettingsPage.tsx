import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { EXPENSE_CATEGORIES, BudgetGoal } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

interface SettingsPageProps {
  darkMode: boolean;
  onToggleDark: () => void;
  currency: string;
  onSetCurrency: (c: string) => void;
  budgetGoals: BudgetGoal[];
  onSetBudgetGoals: (g: BudgetGoal[]) => void;
}

const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR"];

export default function SettingsPage({
  darkMode, onToggleDark, currency, onSetCurrency, budgetGoals, onSetBudgetGoals,
}: SettingsPageProps) {
  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");

  const addGoal = () => {
    if (!newCategory || !newLimit) return;
    if (budgetGoals.some((g) => g.category === newCategory)) return;
    onSetBudgetGoals([...budgetGoals, { category: newCategory, limit: parseFloat(newLimit) }]);
    setNewCategory("");
    setNewLimit("");
  };

  const removeGoal = (category: string) => {
    onSetBudgetGoals(budgetGoals.filter((g) => g.category !== category));
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Customize your experience</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6 space-y-6"
      >
        <h3 className="font-semibold text-foreground">Preferences</h3>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-foreground">Dark Mode</Label>
            <p className="text-sm text-muted-foreground">Toggle dark theme</p>
          </div>
          <Switch checked={darkMode} onCheckedChange={onToggleDark} />
        </div>

        <div className="space-y-2">
          <Label>Currency</Label>
          <Select value={currency} onValueChange={onSetCurrency}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-6 space-y-6"
      >
        <h3 className="font-semibold text-foreground">Budget Goals</h3>
        <p className="text-sm text-muted-foreground">Set spending limits per category. You'll see alerts in Analytics when exceeded.</p>

        {budgetGoals.length > 0 && (
          <div className="space-y-3">
            {budgetGoals.map((g) => (
              <div key={g.category} className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-3">
                <div>
                  <span className="font-medium text-foreground">{g.category}</span>
                  <span className="text-sm text-muted-foreground ml-2 mono">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency }).format(g.limit)}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeGoal(g.category)} className="h-8 w-8 text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={newCategory} onValueChange={setNewCategory}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {EXPENSE_CATEGORIES.filter((c) => !budgetGoals.some((g) => g.category === c)).map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Budget limit"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
            className="flex-1 mono"
          />
          <Button onClick={addGoal} className="gap-2">
            <Plus className="w-4 h-4" /> Add Goal
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
