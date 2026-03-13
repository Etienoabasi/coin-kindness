import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify the user
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(
      authHeader.replace("Bearer ", "")
    );
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    // Use service role for DB operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's budget goals
    const { data: settingsData } = await adminClient
      .from("user_settings")
      .select("budget_goals, currency")
      .eq("user_id", userId)
      .maybeSingle();

    if (!settingsData?.budget_goals || (settingsData.budget_goals as any[]).length === 0) {
      return new Response(JSON.stringify({ alerts: [], message: "No budget goals set" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const budgetGoals = settingsData.budget_goals as { category: string; limit: number }[];
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthStart = `${currentMonth}-01`;
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthEnd = nextMonth.toISOString().split("T")[0];

    // Get this month's expenses by category
    const { data: transactions } = await adminClient
      .from("transactions")
      .select("category, amount")
      .eq("user_id", userId)
      .eq("type", "expense")
      .gte("date", monthStart)
      .lt("date", monthEnd);

    const spendingByCategory: Record<string, number> = {};
    for (const t of transactions || []) {
      spendingByCategory[t.category] = (spendingByCategory[t.category] || 0) + Number(t.amount);
    }

    const newAlerts: { category: string; spent: number; limit: number }[] = [];

    for (const goal of budgetGoals) {
      const spent = spendingByCategory[goal.category] || 0;
      if (spent > goal.limit) {
        // Check if we already have an alert for this category/month
        const { data: existing } = await adminClient
          .from("budget_alerts")
          .select("id, spent")
          .eq("user_id", userId)
          .eq("category", goal.category)
          .eq("month", currentMonth)
          .maybeSingle();

        if (!existing) {
          // Create new alert
          await adminClient.from("budget_alerts").insert({
            user_id: userId,
            category: goal.category,
            spent,
            budget_limit: goal.limit,
            month: currentMonth,
          });
          newAlerts.push({ category: goal.category, spent, limit: goal.limit });
        } else if (Math.abs(Number(existing.spent) - spent) > 0.01) {
          // Update spent amount
          await adminClient
            .from("budget_alerts")
            .update({ spent, read: false })
            .eq("id", existing.id);
          newAlerts.push({ category: goal.category, spent, limit: goal.limit });
        }
      }
    }

    return new Response(
      JSON.stringify({ alerts: newAlerts, month: currentMonth }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
