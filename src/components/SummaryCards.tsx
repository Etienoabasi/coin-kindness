import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, ArrowUpDown } from "lucide-react";

interface SummaryCardsProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  formatCurrency: (n: number) => string;
}

const cards = [
  { key: "balance", label: "Total Balance", icon: Wallet, colorClass: "text-primary" },
  { key: "income", label: "Total Income", icon: TrendingUp, colorClass: "text-income" },
  { key: "expense", label: "Total Expenses", icon: TrendingDown, colorClass: "text-expense" },
  { key: "transactions", label: "Net Flow", icon: ArrowUpDown, colorClass: "text-muted-foreground" },
] as const;

export function SummaryCards({ balance, totalIncome, totalExpense, formatCurrency }: SummaryCardsProps) {
  const values: Record<string, number> = {
    balance,
    income: totalIncome,
    expense: totalExpense,
    transactions: totalIncome - totalExpense,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground font-medium">{card.label}</span>
            <card.icon className={`w-5 h-5 ${card.colorClass}`} />
          </div>
          <p className={`text-2xl font-bold mono ${card.colorClass}`}>
            {formatCurrency(values[card.key])}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
