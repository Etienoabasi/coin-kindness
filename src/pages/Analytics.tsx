import { useMemo } from "react";
import { motion } from "framer-motion";
import { SpendingPieChart, MonthlyBarChart } from "@/components/Charts";
import { Transaction, EXPENSE_CATEGORIES } from "@/lib/types";
import { BudgetGoal } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";

interface AnalyticsPageProps {
  transactions: Transaction[];
  formatCurrency: (n: number) => string;
  budgetGoals: BudgetGoal[];
}

export default function AnalyticsPage({ transactions, formatCurrency, budgetGoals }: AnalyticsPageProps) {
  const categoryTotals = useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => map.set(t.category, (map.get(t.category) || 0) + t.amount));
    return map;
  }, [transactions]);

  const topCategories = useMemo(() => {
    return Array.from(categoryTotals, ([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [categoryTotals]);

  const avgTransaction = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    return expenses.length ? expenses.reduce((s, t) => s + t.amount, 0) / expenses.length : 0;
  }, [transactions]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Insights into your spending habits</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <p className="text-2xl font-bold text-foreground mono">{transactions.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Avg. Expense</p>
          <p className="text-2xl font-bold text-foreground mono">{formatCurrency(avgTransaction)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Categories Used</p>
          <p className="text-2xl font-bold text-foreground mono">{categoryTotals.size}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Expense Breakdown</h3>
          <SpendingPieChart transactions={transactions} formatCurrency={formatCurrency} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Income vs Expenses</h3>
          <MonthlyBarChart transactions={transactions} formatCurrency={formatCurrency} />
        </motion.div>
      </div>

      {/* Top spending categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <h3 className="font-semibold text-foreground mb-4">Top Spending Categories</h3>
        {topCategories.length === 0 ? (
          <p className="text-muted-foreground text-sm">No expense data yet</p>
        ) : (
          <div className="space-y-4">
            {topCategories.map((cat) => {
              const budget = budgetGoals.find((g) => g.category === cat.name);
              const overBudget = budget && cat.total > budget.limit;
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{cat.name}</span>
                      {overBudget && (
                        <span className="flex items-center gap-1 text-xs text-warning">
                          <AlertTriangle className="w-3 h-3" /> Over budget
                        </span>
                      )}
                    </div>
                    <span className="mono text-muted-foreground">
                      {formatCurrency(cat.total)}
                      {budget && <span className="text-xs"> / {formatCurrency(budget.limit)}</span>}
                    </span>
                  </div>
                  <Progress
                    value={budget ? Math.min((cat.total / budget.limit) * 100, 100) : 100}
                    className="h-2"
                  />
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
