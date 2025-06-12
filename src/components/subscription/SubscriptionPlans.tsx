import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { getAllTiers } from "@/config/subscriptionConfig";

export const SubscriptionPlans = () => {
  const { subscription_tier, createCheckoutSession, loading } =
    useSubscription();
  const plans = getAllTiers();

  const handleSelectPlan = (priceId: string | null) => {
    if (priceId) {
      createCheckoutSession(priceId);
    }
  };

  const isCurrentPlan = (tier: string) => {
    return subscription_tier === tier;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`relative ${
            plan.popular ? "border-blue-500 shadow-lg" : ""
          }`}
        >
          {plan.popular && (
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
              Most Popular
            </Badge>
          )}
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription className="text-sm min-h-[3rem]">
              {plan.description}
            </CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">${plan.monthlyPrice}</span>
              <span className="text-gray-600">
                /{plan.monthlyPrice === 0 ? "forever" : "month"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {isCurrentPlan(plan.id) ? (
              <Button disabled className="w-full">
                Current Plan
              </Button>
            ) : (
              <Button
                onClick={() => handleSelectPlan(plan.priceId)}
                disabled={loading || !plan.priceId}
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.priceId ? "Start 3-days free trial" : "Current Plan"}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
