import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SubscriptionState {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
  max_users: number;
  loading: boolean;
}

interface SubscriptionContextType extends SubscriptionState {
  checkSubscription: () => Promise<void>;
  createCheckoutSession: (priceId: string) => Promise<void>;
  openCustomerPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  const { user, session } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    subscribed: false,
    subscription_tier: "free",
    subscription_end: null,
    max_users: 1,
    loading: true,
  });

  const checkSubscription = async () => {
    if (!user || !session) {
      setState({
        subscribed: false,
        subscription_tier: "free",
        subscription_end: null,
        max_users: 1,
        loading: false,
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const { data, error } = await supabase.functions.invoke(
        "check-subscription",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (error) throw error;

      setState({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || "free",
        subscription_end: data.subscription_end || null,
        max_users: data.max_users || 1,
        loading: false,
      });
    } catch (error) {
      console.error("Error checking subscription:", error);
      setState({
        subscribed: false,
        subscription_tier: "free",
        subscription_end: null,
        max_users: 1,
        loading: false,
      });
    }
  };

  const createCheckoutSession = async (priceId: string) => {
    if (!session) {
      toast.error("Please sign in to subscribe");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: { priceId },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (error) throw error;

      // Open checkout in new tab
      window.open(data.url, "_blank");
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to create checkout session");
    }
  };

  const openCustomerPortal = async () => {
    if (!session) {
      toast.error("Please sign in to manage subscription");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "customer-portal",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (error) throw error;

      // Open portal in new tab
      window.open(data.url, "_blank");
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("Failed to open customer portal");
    }
  };

  // Check subscription on auth state change
  useEffect(() => {
    if (user) {
      checkSubscription();

      // Set up periodic check (every 30 seconds)
      const interval = setInterval(checkSubscription, 30000);
      return () => clearInterval(interval);
    } else {
      setState({
        subscribed: false,
        subscription_tier: "free",
        subscription_end: null,
        max_users: 1,
        loading: false,
      });
    }
  }, [user, session]);

  // Listen for URL changes to detect successful checkout
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "true") {
      toast.success("Subscription activated successfully!");
      checkSubscription();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (urlParams.get("canceled") === "true") {
      toast.error("Subscription was canceled");
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const value: SubscriptionContextType = {
    ...state,
    checkSubscription,
    createCheckoutSession,
    openCustomerPortal,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
