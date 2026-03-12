export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface BudgetGoal {
  category: string;
  limit: number;
}

export interface Settings {
  currency: string;
  darkMode: boolean;
  budgetGoals: BudgetGoal[];
}

export const EXPENSE_CATEGORIES = [
  "Food", "Transport", "Rent", "Entertainment", "Shopping",
  "Health", "Education", "Utilities", "Travel", "Other"
] as const;

export const INCOME_CATEGORIES = [
  "Salary", "Freelance", "Investment", "Gift", "Other"
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "hsl(var(--chart-1))",
  Transport: "hsl(var(--chart-2))",
  Rent: "hsl(var(--chart-3))",
  Entertainment: "hsl(var(--chart-4))",
  Shopping: "hsl(var(--chart-5))",
  Health: "hsl(var(--chart-6))",
  Education: "hsl(var(--chart-1))",
  Utilities: "hsl(var(--chart-2))",
  Travel: "hsl(var(--chart-3))",
  Salary: "hsl(var(--chart-1))",
  Freelance: "hsl(var(--chart-2))",
  Investment: "hsl(var(--chart-3))",
  Gift: "hsl(var(--chart-4))",
  Other: "hsl(var(--muted-foreground))",
};
