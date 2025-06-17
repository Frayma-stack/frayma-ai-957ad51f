import { useAuth } from "@/contexts/AuthContext";
import { Stripe } from "stripe";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-05-28.basil",
});

export class StripeService {
  stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "", {
    // apiVersion: "2025-05-28.basil",
  });

  static async createCheckout(priceId: string) {
    try {
      const { user } = useAuth();

      logStep("Function started");

      if (!priceId) throw new Error("Price ID is required");
      logStep("Price ID received", { priceId });

      if (!user?.email)
        throw new Error("User not authenticated or email not available");
      logStep("User authenticated", { userId: user.id, email: user.email });

      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });
      let customerId;

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing customer found", { customerId });
      } else {
        logStep("Creating new customer");
        return;
      }

      const origin = "http://localhost:8080";

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : user.email,
        subscription_data: {
          trial_period_days: 3,
          trial_settings: {
            end_behavior: {
              missing_payment_method: "cancel",
            },
          },
        },
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${origin}/app?success=true`,
        cancel_url: `${origin}/app?canceled=true`,
      });

      logStep("Checkout session created", {
        sessionId: session.id,
        url: session.url,
      });

      return session.url;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logStep("ERROR in create-checkout", { message: errorMessage });
      throw new Error(errorMessage);
    }
  }
}
