import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubscriptionStatus } from "./SubscriptionStatus";
import { SubscriptionPlans } from "./SubscriptionPlans";

export const SubscriptionPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan for your team's storytelling needs. Upgrade or
          downgrade at any time with no long-term commitments.
        </p>
      </div>

      {/* <SubscriptionStatus /> */}

      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Available Plans</h2>
          <p className="text-gray-600">
            All plans include our core storytelling features
          </p>
        </div>
        <SubscriptionPlans />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Have questions about our plans? We're here to help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Contact our support team at{" "}
            <a
              href="mailto:support@frayma.ai"
              className="text-blue-600 hover:underline"
            >
              support@frayma.ai
            </a>{" "}
            for assistance with your subscription.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
