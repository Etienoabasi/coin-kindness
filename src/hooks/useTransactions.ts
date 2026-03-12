import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useTransactions(userId: string | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTransactions = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast({ title: "Error loading transactions", description: error.message, variant: "destructive" });
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
  }, [userId, toast]);

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
        toast({ title: "Error adding transaction", description: error.message, variant: "destructive" });
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
      }
    },
    [userId, toast]
  );

  const updateTransaction = useCallback(
    async (id: string, updates: Partial<Transaction>) => {
      const { error } = await supabase
        .from("transactions")
        .update(updates)
        .eq("id", id);

      if (error) {
        toast({ title: "Error updating transaction", description: error.message, variant: "destructive" });
      } else {
        setTransactions((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
        );
      }
    },
    [toast]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) {
        toast({ title: "Error deleting transaction", description: error.message, variant: "destructive" });
      } else {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      }
    },
    [toast]
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
