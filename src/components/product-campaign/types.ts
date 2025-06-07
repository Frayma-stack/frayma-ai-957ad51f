
export interface ProductCampaignBrief {
  id: string;
  productName: string;
  featureDescription: string;
  whyBuilt: string;
  productContext: {
    feature: string;
    useCase: string;
    differentiator: string;
  };
  coreTransformation: string;
  primaryICP: string;
  secondaryICP?: string;
  positioningAngle: string;
  desiredCTA: string;
  authorProfiles: string[]; // Author IDs
  visualAssets?: File[];
  styleDepth: 'punchy' | 'educational' | 'technical' | 'visual-heavy';
  createdAt: string;
  updatedAt: string;
  clientId?: string;
}

export type CampaignStep = 'brief' | 'outline' | 'drafts';

export interface CampaignAssetType {
  id: string;
  name: string;
  description: string;
  category: 'article' | 'post' | 'email' | 'script' | 'changelog';
  estimatedLength: string;
  targetAudience: string;
}

export interface CampaignOutline {
  assetType: string;
  title: string;
  hook: string;
  sections: {
    heading: string;
    subheadings: string[];
    suggestedVisuals: string[];
  }[];
  cta: string;
  estimatedWordCount: number;
}

export interface CampaignDraft {
  assetType: string;
  title: string;
  content: string;
  authorId: string;
  version: number;
  generatedAt: string;
}

export const CAMPAIGN_ASSET_TYPES: CampaignAssetType[] = [
  {
    id: 'general-announcement',
    name: 'General Announcement GTM Article',
    description: 'Comprehensive feature announcement targeting broad audience',
    category: 'article',
    estimatedLength: '800-1200 words',
    targetAudience: 'General users and prospects'
  },
  {
    id: 'icp-01-article',
    name: 'Use Case-Specific Article (Primary ICP)',
    description: 'Targeted article for primary ICP with specific use case focus',
    category: 'article',
    estimatedLength: '600-900 words',
    targetAudience: 'Primary ICP'
  },
  {
    id: 'icp-02-article',
    name: 'Use Case-Specific Article (Secondary ICP)',
    description: 'Targeted article for secondary ICP with specific use case focus',
    category: 'article',
    estimatedLength: '600-900 words',
    targetAudience: 'Secondary ICP'
  },
  {
    id: 'newsletter-email',
    name: 'Newsletter Email',
    description: 'Feature announcement for email subscribers',
    category: 'email',
    estimatedLength: '300-500 words',
    targetAudience: 'Email subscribers'
  },
  {
    id: 'changelog-update',
    name: 'Changelog Update',
    description: 'Developer-friendly technical changelog entry',
    category: 'changelog',
    estimatedLength: '200-400 words',
    targetAudience: 'Developers and technical users'
  },
  {
    id: 'product-video-script',
    name: 'Product Video Script',
    description: 'Narrative video script with scene suggestions',
    category: 'script',
    estimatedLength: '500-800 words',
    targetAudience: 'Video viewers'
  },
  {
    id: 'linkedin-founder',
    name: 'LinkedIn Post (Founder)',
    description: 'Founder perspective LinkedIn announcement',
    category: 'post',
    estimatedLength: '150-300 words',
    targetAudience: 'LinkedIn professional network'
  },
  {
    id: 'linkedin-cofounder',
    name: 'LinkedIn Post (Co-founder)',
    description: 'Co-founder perspective LinkedIn announcement',
    category: 'post',
    estimatedLength: '150-300 words',
    targetAudience: 'LinkedIn professional network'
  },
  {
    id: 'linkedin-product-marketer',
    name: 'LinkedIn Post (Product Marketer)',
    description: 'Product marketing perspective LinkedIn announcement',
    category: 'post',
    estimatedLength: '150-300 words',
    targetAudience: 'LinkedIn professional network'
  },
  {
    id: 'twitter-founder',
    name: 'X (Twitter) Thread (Founder)',
    description: 'Founder perspective Twitter thread announcement',
    category: 'post',
    estimatedLength: '8-12 tweets',
    targetAudience: 'Twitter followers'
  },
  {
    id: 'twitter-product-marketer',
    name: 'X (Twitter) Thread (Product Marketer)',
    description: 'Product marketing perspective Twitter thread announcement',
    category: 'post',
    estimatedLength: '8-12 tweets',
    targetAudience: 'Twitter followers'
  }
];
