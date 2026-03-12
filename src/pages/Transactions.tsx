import { useState } from "react";
import { motion } from "framer-motion";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { Transaction } from "@/lib/types";

interface TransactionsPageProps {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  formatCurrency: (n: number) => string;
}

export default function TransactionsPage({
  transactions, addTransaction, updateTransaction, deleteTransaction, formatCurrency,
}: TransactionsPageProps) {
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage all your income and expenses</p>
      </motion.div>

      <TransactionForm
        onSubmit={(t) => {
          if (editTx) {
            updateTransaction(editTx.id, t);
            setEditTx(null);
          } else {
            addTransaction(t);
          }
        }}
        editTransaction={editTx}
        onCancelEdit={() => setEditTx(null)}
      />

      <TransactionList
        transactions={transactions}
        onEdit={setEditTx}
        onDelete={deleteTransaction}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}
