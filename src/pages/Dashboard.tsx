import { useState } from "react";
import { motion } from "framer-motion";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { SpendingPieChart, MonthlyBarChart } from "@/components/Charts";
import { SummaryCardsSkeleton, ChartSkeleton, TransactionListSkeleton } from "@/components/DashboardSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { Transaction } from "@/lib/types";

interface DashboardProps {
  transactions: Transaction[];
  balance: number;
  totalIncome: number;
  totalExpense: number;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  formatCurrency: (n: number) => string;
  loading?: boolean;
}

export default function Dashboard({
  transactions, balance, totalIncome, totalExpense,
  addTransaction, updateTransaction, deleteTransaction, formatCurrency, loading,
}: DashboardProps) {
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [showForm, setShowForm] = useState(false);
  const recentTransactions = transactions.slice(0, 5);
  const hasTransactions = transactions.length > 0;

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of your finances</p>
      </motion.div>

      {loading ? (
        <SummaryCardsSkeleton />
      ) : (
        <SummaryCards
          balance={balance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          formatCurrency={formatCurrency}
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      ) : hasTransactions ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <h3 className="font-semibold text-foreground mb-4">Spending by Category</h3>
            <SpendingPieChart transactions={transactions} formatCurrency={formatCurrency} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <h3 className="font-semibold text-foreground mb-4">Monthly Overview</h3>
            <MonthlyBarChart transactions={transactions} formatCurrency={formatCurrency} />
          </motion.div>
        </div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Recent Transactions</h3>
        </div>
        <TransactionForm
          onSubmit={(t) => {
            if (editTx) {
              updateTransaction(editTx.id, t);
              setEditTx(null);
            } else {
              addTransaction(t);
              setShowForm(false);
            }
          }}
          editTransaction={editTx}
          onCancelEdit={() => setEditTx(null)}
        />
        <div className="mt-4">
          {loading ? (
            <TransactionListSkeleton />
          ) : hasTransactions ? (
            <TransactionList
              transactions={recentTransactions}
              onEdit={setEditTx}
              onDelete={deleteTransaction}
              formatCurrency={formatCurrency}
            />
          ) : (
            <EmptyState
              icon="transactions"
              title="No transactions yet"
              description="Add your first transaction to start tracking your finances and see insights here."
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
