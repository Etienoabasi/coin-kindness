import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Pencil, Trash2, Search, TrendingUp, TrendingDown, Download, CalendarIcon, X } from "lucide-react";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
  formatCurrency: (n: number) => string;
}

export function TransactionList({ transactions, onEdit, onDelete, formatCurrency }: TransactionListProps) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const allCategories = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

  const hasActiveFilters = search || filterCategory !== "all" || filterType !== "all" || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch("");
    setFilterCategory("all");
    setFilterType("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const filtered = transactions.filter((t) => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || t.category === filterCategory;
    const matchType = filterType === "all" || t.type === filterType;
    const txDate = new Date(t.date);
    const matchFrom = !dateFrom || !isBefore(txDate, startOfDay(dateFrom));
    const matchTo = !dateTo || !isAfter(txDate, endOfDay(dateTo));
    return matchSearch && matchCategory && matchType && matchFrom && matchTo;
  });

  const exportCSV = () => {
    const headers = "Date,Type,Category,Description,Amount\n";
    const rows = filtered
      .map((t) => `${t.date},${t.type},${t.category},"${t.description}",${t.amount}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs", dateFrom && "text-foreground")}>
                <CalendarIcon className="h-3.5 w-3.5" />
                {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs", dateTo && "text-foreground")}>
                <CalendarIcon className="h-3.5 w-3.5" />
                {dateTo ? format(dateTo, "MMM dd, yyyy") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-xs text-muted-foreground">
              <X className="h-3.5 w-3.5" />
              Clear filters
            </Button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {filtered.length} of {transactions.length} transactions
            </span>
            {transactions.length > 0 && (
              <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5 text-xs">
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No transactions found</p>
          <p className="text-sm mt-1">
            {hasActiveFilters ? "Try adjusting your filters" : "Add your first transaction to get started"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-sm transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  t.type === "income" ? "bg-income/10" : "bg-expense/10"
                }`}>
                  {t.type === "income" ? (
                    <TrendingUp className="w-5 h-5 text-income" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-expense" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">{t.category}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {t.type}
                    </span>
                  </div>
                  {t.description && (
                    <p className="text-sm text-muted-foreground truncate">{t.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(t.date), "MMM dd, yyyy")}
                  </p>
                </div>

                <span className={`font-bold mono text-sm ${
                  t.type === "income" ? "text-income" : "text-expense"
                }`}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                </span>

                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(t)} className="h-8 w-8">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(t.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
