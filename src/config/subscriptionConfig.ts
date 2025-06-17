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
  price: number;
  limits: SubscriptionTierLimits;
  features: string[];
  description: string;
  recommended?: boolean;
  period?: string;
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  // free: {
  //   id: 'free',
  //   name: 'Free',
  //   priceId: null,
  //   price: 0,
  //   limits: {
  //     users: 1,
  //     clients: 1,
  //     authors: 1,
  //     icpScripts: 1,
  //     gtmNarratives: 1,
  //     shortFormContent: 5,
  //     mintedIdeas: 5,
  //   },
  //   features: [
  //     '1 team member',
  //     'Basic templates',
  //     'Email support',
  //   ],
  //   description: 'Perfect for getting started',
  // },
  "Narrative Starter": {
    id: "Narrative Starter",
    name: "Narrative Starter",
    priceId: "price_1RY9IYFFhonlvCNPCETa7mf8",
    price: 39,
    period: "per month",
    limits: {
      users: 1,
      clients: 2,
      authors: 2,
      icpScripts: 2,
      gtmNarratives: 4,
      shortFormContent: 150,
      mintedIdeas: 20,
    },
    features: [
      "1 User",
      "2 Client/Company Instances",
      "4 Long-Form GTM Narrative Pieces/month",
      "2 Authors",
      "2 ICP StoryScripts",
      "150 Short-Form GTM Content Credits",
      "20 New Product-Led, GTM Ideas Minting Credits",
      "Email Support",
    ],
    description: "For individuals getting started with GTM execution",
    recommended: false,
  },
  "Narrative Pro": {
    id: "Narrative Pro",
    name: "Narrative Pro",
    priceId: "price_1RY9POFFhonlvCNP19G6kPAt",
    price: 150,
    period: "per month",
    limits: {
      users: 3,
      clients: 12,
      authors: 6,
      icpScripts: 15,
      gtmNarratives: 20,
      shortFormContent: 5000,
      mintedIdeas: 90,
      productCampaignCredits: 4,
    },
    features: [
      "5 Users",
      "12 Client/Company/Team Instances",
      "20 Long-Form GTM Narrative Pieces/month",
      "4 Product/Feature GTM Update Campaign Credits",
      "6 Authors",
      "15 ICP StoryScripts",
      "5,000 Short-Form GTM Content Credits",
      "90 New Product-Led, GTM Ideas Minting Credits",
      "API Access",
      "Advanced Analytics (coming soon)",
      "Team Collaboration",
      "Comment Threads",
      "Unused Credit Rollover",
      "Support Channel",
    ],
    description: "Better value for GTM execution teams",
    recommended: true,
  },
  "Narrative Scale": {
    id: "Narrative Scale",
    name: "Narrative Scale",
    priceId: "price_1RY9TWFFhonlvCNPK6MB1khI",
    price: 750,
    period: "per month",
    limits: {
      users: 25,
      clients: 999, // Unlimited (using high number)
      authors: 999, // Unlimited
      icpScripts: 999, // Unlimited
      gtmNarratives: 90,
      shortFormContent: 25000,
      mintedIdeas: 999, // Unlimited
      productCampaignCredits: 45,
    },
    features: [
      "25 Users",
      "Unlimited Client/Company Instances",
      "90 Long-Form GTM Narrative Pieces/month",
      "45 Product/Feature GTM Update Campaign Credits",
      "Unlimited Authors",
      "Unlimited ICP StoryScripts",
      "25,000 Short-Form GTM Content Credits",
      "Unlimited New Product-Led, GTM Ideas Minting Credits",
      "Premium API Access",
      "Advanced Analytics (coming soon)",
      "Unused Credit Rollover",
      "Team Folders",
      "Comment Threads",
      "Priority Support",
      "Live Onboarding",
    ],
    description: "For teams scaling GTM execution",
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
