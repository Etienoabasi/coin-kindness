
-- Create budget_alerts table for in-app notifications
CREATE TABLE public.budget_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  spent NUMERIC NOT NULL,
  budget_limit NUMERIC NOT NULL,
  month TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.budget_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts" ON public.budget_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.budget_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON public.budget_alerts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Service role can insert alerts" ON public.budget_alerts FOR INSERT WITH CHECK (true);

CREATE INDEX idx_budget_alerts_user_id ON public.budget_alerts(user_id);
CREATE INDEX idx_budget_alerts_unread ON public.budget_alerts(user_id, read) WHERE read = false;
