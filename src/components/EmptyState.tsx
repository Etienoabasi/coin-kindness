import { motion } from "framer-motion";
import { Receipt, TrendingUp, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: "transactions" | "analytics" | "budget";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const icons = {
  transactions: Receipt,
  analytics: TrendingUp,
  budget: PiggyBank,
};

export function EmptyState({ icon = "transactions", title, description, actionLabel, onAction }: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
