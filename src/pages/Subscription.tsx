import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { SubscriptionPage } from "@/components/subscription/SubscriptionPage";

const Subscription = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // return <Navigate to="/auth" replace />;
  }

  return <SubscriptionPage />;
};

export default Subscription;
