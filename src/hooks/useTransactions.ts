import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useTransactions(userId: string | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast.error("Error loading transactions", { description: error.message });
    } else {
      setTransactions(
        (data || []).map((t) => ({
          id: t.id,
          type: t.type as "income" | "expense",
          amount: Number(t.amount),
          category: t.category,
          description: t.description,
          date: t.date,
        }))
      );
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(
    async (t: Omit<Transaction, "id">) => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("transactions")
        .insert({ ...t, user_id: userId })
        .select()
        .single();

      if (error) {
        toast.error("Failed to add transaction", { description: error.message });
      } else if (data) {
        setTransactions((prev) => [
          {
            id: data.id,
            type: data.type as "income" | "expense",
            amount: Number(data.amount),
            category: data.category,
            description: data.description,
            date: data.date,
          },
          ...prev,
        ]);
        toast.success("Transaction added", {
          description: `${t.type === "income" ? "Income" : "Expense"}: ${t.category}`,
        });
      }
    },
    [userId]
  );

  const updateTransaction = useCallback(
    async (id: string, updates: Partial<Transaction>) => {
      const { error } = await supabase
        .from("transactions")
        .update(updates)
        .eq("id", id);

      if (error) {
        toast.error("Failed to update transaction", { description: error.message });
      } else {
        setTransactions((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
        );
        toast.success("Transaction updated");
      }
    },
    []
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Failed to delete transaction", { description: error.message });
      } else {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        toast.success("Transaction deleted");
      }
    },
    []
  );

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalIncome,
    totalExpense,
    balance,
    loading,
  };
}
