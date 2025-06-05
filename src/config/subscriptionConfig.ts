
// Centralized subscription configuration for easy management
export interface SubscriptionTierLimits {
  users: number;
  clients: number;
  authors: number;
  icpScripts: number;
  gtmNarratives: number;
  shortFormContent: number;
  mintedIdeas: number;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  priceId: string | null;
  monthlyPrice: number;
  limits: SubscriptionTierLimits;
  features: string[];
  description: string;
  popular?: boolean;
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  free: {
    id: 'free',
    name: 'Free',
    priceId: null,
    monthlyPrice: 0,
    limits: {
      users: 1,
      clients: 1,
      authors: 1,
      icpScripts: 1,
      gtmNarratives: 1,
      shortFormContent: 5,
      mintedIdeas: 5,
    },
    features: [
      '1 team member',
      'Basic templates',
      'Email support',
    ],
    description: 'Perfect for getting started',
  },
  'Narrative Starter': {
    id: 'Narrative Starter',
    name: 'Narrative Starter',
    priceId: 'price_1QWCa8GqhgwGGRgLrOhkCxQL',
    monthlyPrice: 39,
    limits: {
      users: 1,
      clients: 2,
      authors: 2,
      icpScripts: 2,
      gtmNarratives: 3,
      shortFormContent: 30,
      mintedIdeas: 30,
    },
    features: [
      '1 User',
      '2 Client/Team instances',
      '2 Authors',
      '2 ICP StoryScripts',
      '3 GTM Narrative Pieces',
      '30 short-form content pieces',
      '30 Minted Ideas',
      'Priority email support',
    ],
    description: 'Emphasizes getting started with auto-crafting GTM marketing assets with narratives that resonate and compel',
    popular: true,
  },
  'Narrative Pro': {
    id: 'Narrative Pro',
    name: 'Narrative Pro',
    priceId: 'price_1QWCaDGqhgwGGRgLkuE0Tc3S',
    monthlyPrice: 150,
    limits: {
      users: 5,
      clients: 6,
      authors: 6,
      icpScripts: 5,
      gtmNarratives: 12,
      shortFormContent: 180,
      mintedIdeas: 100,
    },
    features: [
      '5 Users',
      '6 Client/Team instances',
      '6 Authors',
      '5 ICP StoryScripts',
      '12 GTM Narrative Pieces',
      '180 short-form content pieces',
      '100 Minted Ideas',
      'Priority support',
      'Advanced analytics',
      'Custom integrations',
      'API access',
    ],
    description: 'Professional-grade solution for auto-crafting full-funnel GTM assets (marketing + sales) with narratives that resonate, compel, and convert',
  },
};

// Helper function to get tier limits
export const getTierLimits = (tierName: string): SubscriptionTierLimits => {
  return SUBSCRIPTION_TIERS[tierName]?.limits || SUBSCRIPTION_TIERS.free.limits;
};

// Helper function to check if user can perform an action based on their tier
export const canPerformAction = (
  tierName: string,
  actionType: keyof SubscriptionTierLimits,
  currentCount: number
): boolean => {
  const limits = getTierLimits(tierName);
  return currentCount < limits[actionType];
};

// Helper function to get all tiers as an array
export const getAllTiers = (): SubscriptionTier[] => {
  return Object.values(SUBSCRIPTION_TIERS);
};
