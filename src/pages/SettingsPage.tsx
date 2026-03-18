import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { EXPENSE_CATEGORIES, BudgetGoal } from "@/lib/types";
import { Plus, Trash2, Mail, Shield, LogOut, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SettingsPageProps {
  darkMode: boolean;
  onToggleDark: () => void;
  currency: string;
  onSetCurrency: (c: string) => void;
  budgetGoals: BudgetGoal[];
  onSetBudgetGoals: (g: BudgetGoal[]) => void;
  userEmail?: string;
  onSignOut?: () => void;
}

const currencies = [
  "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR", "CNY", "KRW", "BRL",
  "MXN", "ZAR", "CHF", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RUB",
  "TRY", "THB", "IDR", "MYR", "PHP", "VND", "SGD", "HKD", "TWD", "NZD",
  "ARS", "CLP", "COP", "PEN", "EGP", "NGN", "KES", "GHS", "AED", "SAR",
  "QAR", "KWD", "BHD", "OMR", "ILS", "PKR", "BDT", "LKR", "MMK", "UAH",
];

export default function SettingsPage({
  darkMode, onToggleDark, currency, onSetCurrency, budgetGoals, onSetBudgetGoals, userEmail, onSignOut,
}: SettingsPageProps) {
  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const { toast } = useToast();

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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Your password has been updated." });
      setNewPassword("");
      setConfirmPassword("");
    }
    setChangingPassword(false);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences</p>
      </motion.div>

      {/* Account Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-xl p-6 space-y-6"
      >
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Account
        </h3>

        {userEmail && (
          <div className="flex items-center gap-3 rounded-lg bg-secondary/50 px-4 py-3">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</p>
              <p className="text-sm text-foreground truncate">{userEmail}</p>
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <Label className="text-foreground text-sm font-medium">Change Password</Label>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New password (min. 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10"
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </Button>
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" size="sm" disabled={changingPassword || !newPassword || !confirmPassword}>
              {changingPassword ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>

        {onSignOut && (
          <>
            <Separator />
            <Button variant="outline" onClick={onSignOut} className="gap-2 text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </>
        )}
      </motion.div>

      {/* Preferences Section */}
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

      {/* Budget Goals Section */}
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
