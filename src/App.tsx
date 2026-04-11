import { useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { useTransactions } from "@/hooks/useTransactions";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { useBudgetAlerts } from "@/hooks/useBudgetAlerts";
import Dashboard from "@/pages/Dashboard";
import TransactionsPage from "@/pages/Transactions";
import AnalyticsPage from "@/pages/Analytics";
import SettingsPage from "@/pages/SettingsPage";
import AuthPage from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { user, loading: authLoading, signIn, signUp, signOut, resetPassword } = useAuth();

  const {
    transactions, addTransaction, updateTransaction,
    deleteTransaction, totalIncome, totalExpense, balance, loading: txLoading,
  } = useTransactions(user?.id);

  const {
    settings, toggleDarkMode, setCurrency, setBudgetGoals, formatCurrency,
  } = useSettings(user?.id);

  const {
    alerts, unreadCount, checkBudgetAlerts, markAsRead, markAllAsRead,
  } = useBudgetAlerts(user?.id);

  const addTransactionWithAlertCheck = useCallback(
    async (t: Parameters<typeof addTransaction>[0]) => {
      await addTransaction(t);
      if (t.type === "expense") {
        // Small delay to let the DB commit, then check alerts
        setTimeout(() => checkBudgetAlerts(), 500);
      }
    },
    [addTransaction, checkBudgetAlerts]
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<AuthPage onSignIn={signIn} onSignUp={signUp} onResetPassword={resetPassword} />} />
      </Routes>
    );
  }

  return (
    <AppLayout darkMode={settings.darkMode} onToggleDark={toggleDarkMode} onSignOut={signOut} userEmail={user.email} alerts={alerts} unreadCount={unreadCount} onMarkAsRead={markAsRead} onMarkAllAsRead={markAllAsRead} formatCurrency={formatCurrency}>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              transactions={transactions}
              balance={balance}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              addTransaction={addTransactionWithAlertCheck}
              updateTransaction={updateTransaction}
              deleteTransaction={deleteTransaction}
              formatCurrency={formatCurrency}
              loading={txLoading}
            />
          }
        />
        <Route
          path="/transactions"
          element={
            <TransactionsPage
              transactions={transactions}
              addTransaction={addTransactionWithAlertCheck}
              updateTransaction={updateTransaction}
              deleteTransaction={deleteTransaction}
              formatCurrency={formatCurrency}
            />
          }
        />
        <Route
          path="/analytics"
          element={
            <AnalyticsPage
              transactions={transactions}
              formatCurrency={formatCurrency}
              budgetGoals={settings.budgetGoals}
            />
          }
        />
        <Route
          path="/settings"
          element={
          <SettingsPage
              darkMode={settings.darkMode}
              onToggleDark={toggleDarkMode}
              currency={settings.currency}
              onSetCurrency={setCurrency}
              budgetGoals={settings.budgetGoals}
              onSetBudgetGoals={setBudgetGoals}
              userEmail={user.email}
              onSignOut={signOut}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
