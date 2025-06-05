
import { useSubscription } from '@/contexts/SubscriptionContext';
import { getTierLimits, canPerformAction, SubscriptionTierLimits } from '@/config/subscriptionConfig';

export const useSubscriptionLimits = () => {
  const { subscription_tier } = useSubscription();

  const limits = getTierLimits(subscription_tier);

  const checkLimit = (actionType: keyof SubscriptionTierLimits, currentCount: number): boolean => {
    return canPerformAction(subscription_tier, actionType, currentCount);
  };

  const getRemainingCount = (actionType: keyof SubscriptionTierLimits, currentCount: number): number => {
    return Math.max(0, limits[actionType] - currentCount);
  };

  const getUsagePercentage = (actionType: keyof SubscriptionTierLimits, currentCount: number): number => {
    const limit = limits[actionType];
    return limit > 0 ? Math.min(100, (currentCount / limit) * 100) : 0;
  };

  return {
    limits,
    checkLimit,
    getRemainingCount,
    getUsagePercentage,
    subscription_tier,
  };
};
