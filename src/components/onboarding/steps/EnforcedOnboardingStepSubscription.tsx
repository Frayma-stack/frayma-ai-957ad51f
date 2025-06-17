import { FC, useEffect, useLayoutEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Check, Sparkles } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { getAllTiers } from "@/config/subscriptionConfig";
import { toast } from "sonner";

interface EnforcedOnboardingStepSubscriptionProps {
  onSubscriptionCompleted: () => void;
}

type PlanType = "free" | "pro";

const EnforcedOnboardingStepSubscription: FC<
  EnforcedOnboardingStepSubscriptionProps
> = ({ onSubscriptionCompleted }) => {
  const { subscribed, createCheckoutSession, checkSubscription, loading } =
    useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<string>("Narrative Starter");
  const plans = getAllTiers();

  const handleSelectPlan = async (planId: string) => {
    if (planId) {
      await createCheckoutSession(planId);
    }
  };

  if (subscribed) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Check className="h-6 w-6 text-green-600" />
            <CardTitle className="text-green-800">
              Subscription Active!
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              ✓ Your subscription is active and ready to use.
            </p>
          </div>

          <Button
            onClick={onSubscriptionCompleted}
            className="w-full bg-story-blue hover:bg-story-light-blue"
          >
            Continue to Business Setup
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {/* <CreditCard className="h-6 w-6 text-story-blue" /> */}
          {/* <CardTitle>Choose Your Plan</CardTitle> */}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 space-x-6">
        {/* <div className="text-center">
          <p className="text-gray-600">
            Select a plan to unlock the full power of Frayma AI content
            generation.
          </p>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`
                relative border rounded-lg p-6 cursor-pointer transition-all
                ${
                  selectedPlan === plan.id
                    ? "border-story-blue bg-story-blue/5"
                    : "border-gray-200 hover:border-story-blue/50"
                }
                ${
                  plan.recommended
                    ? "ring-2 ring-story-blue ring-opacity-50"
                    : ""
                }
              `}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-story-blue text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Recommended</span>
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 ml-1">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plan.priceId)}
                disabled={loading}
                className={`
                  w-full
                  ${
                    plan.id === "pro"
                      ? "bg-story-blue hover:bg-story-light-blue text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }
                `}
              >
                {"Start 3 Days Free trial"}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>You can always upgrade or downgrade your plan later.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnforcedOnboardingStepSubscription;
