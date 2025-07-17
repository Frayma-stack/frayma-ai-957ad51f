
// Centralized subscription configuration for easy management
export interface SubscriptionTierLimits {
  users: number;
  clients: number;
  authors: number;
  icpScripts: number;
  gtmNarratives: number;
  shortFormContent: number;
  mintedIdeas: number;
  productCampaignCredits?: number;
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
      clients: 2,
      authors: 2,
      icpScripts: 2,
      gtmNarratives: 0,
      shortFormContent: 6,
      mintedIdeas: 20,
    },
    features: [
      '2 Client/Company Accounts',
      '2 ICP StoryScripts',
      '20 GTM Ideas per Month (6 visible)',
      'Audio transcription for ICP analysis',
      'Ideas Bank access',
      'Basic templates',
      'Email support',
    ],
    description: 'Start generating rare GTM ideas that move buyers - no payment required',
  },
  'Narrative Starter': {
    id: 'Narrative Starter',
    name: 'Narrative Starter',
    priceId: 'price_1RY9IYFFhonlvCNPCETa7mf8',
    monthlyPrice: 39,
    limits: {
      users: 1,
      clients: 4,
      authors: 2,
      icpScripts: 2,
      gtmNarratives: 10,
      shortFormContent: 100,
      mintedIdeas: 100,
    },
    features: [
      'Everything in Free',
      '4 Client/Company accounts',
      '10 long-form GTM assets per month',
      '100 short-form GTM content',
      '2 author profiles',
      'All narrative frameworks',
      'StoryBrief & Outline builder',
      'Ideas Bank (100 ideas)',
      'Email support',
      'Core Author tone controls',
    ],
    description: 'Perfect for individual creators and small teams getting started with strategic content',
    popular: true,
  },
  'Narrative Pro': {
    id: 'Narrative Pro',
    name: 'Narrative Pro',
    priceId: 'price_1RY9POFFhonlvCNP19G6kPAt',
    monthlyPrice: 150,
    limits: {
      users: 3,
      clients: 15,
      authors: 6,
      icpScripts: 15,
      gtmNarratives: 30,
      shortFormContent: 600,
      mintedIdeas: 600,
      productCampaignCredits: 10,
    },
    features: [
      'Everything in Narrative Starter',
      '30 long-form GTM assets per month',
      '600 short-form GTM content',
      '15 Client/Company accounts',
      '10 Product/Feature Update campaigns',
      '6 author profiles',
      'Advanced narrative frameworks',
      'Ideas Bank (600 ideas)',
      'Resonance Mirror scoring',
      'Priority support',
      'Team collaboration tools',
    ],
    description: 'Ideal for growing teams that need advanced GTM intelligence and collaboration',
  },
  'Full-Scale Narrative': {
    id: 'Full-Scale Narrative',
    name: 'Full-Scale Narrative',
    priceId: 'price_1RY9TWFFhonlvCNPK6MB1khI',
    monthlyPrice: 750,
    limits: {
      users: 25,
      clients: 999, // Unlimited
      authors: 999, // Unlimited
      icpScripts: 999, // Unlimited
      gtmNarratives: 999, // Unlimited GTM assets
      shortFormContent: 999, // Unlimited
      mintedIdeas: 999, // Unlimited
      productCampaignCredits: 999, // Unlimited
    },
    features: [
      'Everything in Narrative Pro',
      'Unlimited GTM assets',
      'Unlimited author profiles',
      'Custom narrative frameworks',
      'Unlimited Ideas Bank',
      'API access',
      'Custom integrations',
      'Dedicated success manager',
      'Advanced analytics',
      'White-label options',
    ],
    description: 'Enterprise-grade solution for organizations scaling GTM content at volume',
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
