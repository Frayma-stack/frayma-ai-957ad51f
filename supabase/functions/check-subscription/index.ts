import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
// Helper logging function for enhanced debugging
const logStep = (step, details) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};
// Subscription tier mapping based on price IDs
const determineSubscriptionTier = (priceId) => {
  switch (priceId) {
    case "price_1RY9IYFFhonlvCNPCETa7mf8":
      return {
        tier: "Narrative Starter",
        maxUsers: 1,
      };
    case "price_1RY9POFFhonlvCNP19G6kPAt":
      return {
        tier: "Narrative Pro",
        maxUsers: 3,
      };
    case "price_1RY9TWFFhonlvCNPK6MB1khI":
      return {
        tier: "Narrative Scale",
        maxUsers: 25,
      };
    default:
      return {
        tier: "free",
        maxUsers: 1,
      };
  }
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  // Use the service role key to perform writes (upsert) in Supabase
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
      auth: {
        persistSession: false,
      },
    }
  );
  try {
    logStep("Function started");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");
    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    const { data: userData, error: userError } =
      await supabaseClient.auth.getUser(token);
    if (userError)
      throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email)
      throw new Error("User not authenticated or email not available");
    logStep("User authenticated", {
      userId: user.id,
      email: user.email,
    });
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });
    logStep("Customers: ", customers);
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      await supabaseClient.from("subscribers").upsert(
        {
          email: user.email,
          user_id: user.id,
          stripe_customer_id: null,
          subscribed: false,
          subscription_tier: "free",
          subscription_end: null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "email",
        }
      );
      // Ensure user has free tier limits
      await supabaseClient.from("user_limits").upsert(
        {
          user_id: user.id,
          subscription_tier: "free",
          max_users: 1,
          current_users: 0,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );
      return new Response(
        JSON.stringify({
          subscribed: false,
          subscription_tier: "free",
          max_users: 1,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          status: 200,
        }
      );
    }
    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", {
      customerId,
    });
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
    });
    logStep("Subscriptions: ", subscriptions);
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = "free";
    let subscriptionEnd = null;
    let maxUsers = 1;
    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(
        subscription.current_period_end * 1000
      ).toISOString();
      logStep("Active subscription found", {
        subscriptionId: subscription.id,
        endDate: subscriptionEnd,
      });
      // Determine subscription tier from price ID
      const priceId = subscription.items.data[0].price.id;
      const tierInfo = determineSubscriptionTier(priceId);
      subscriptionTier = tierInfo.tier;
      maxUsers = tierInfo.maxUsers;
      logStep("Determined subscription tier", {
        priceId,
        subscriptionTier,
        maxUsers,
      });
    } else {
      logStep("No active subscription found");
    }
    // Update subscriber record
    await supabaseClient.from("subscribers").upsert(
      {
        email: user.email,
        user_id: user.id,
        stripe_customer_id: customerId,
        subscribed: hasActiveSub,
        subscription_tier: subscriptionTier,
        subscription_end: subscriptionEnd,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "email",
      }
    );
    // Update user limits
    await supabaseClient.from("user_limits").upsert(
      {
        user_id: user.id,
        subscription_tier: subscriptionTier,
        max_users: maxUsers,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );
    logStep("Updated database with subscription info", {
      subscribed: hasActiveSub,
      subscriptionTier,
      maxUsers,
    });
    return new Response(
      JSON.stringify({
        subscribed: hasActiveSub,
        subscription_tier: subscriptionTier,
        subscription_end: subscriptionEnd,
        max_users: maxUsers,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", {
      message: errorMessage,
    });
    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
