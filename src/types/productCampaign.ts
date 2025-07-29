export interface ProductUpdateCampaign {
  id: string;
  title: string;
  summary: string;
  productName: string;
  featureDescription: string;
  whyBuilt: string;
  enablesWhat: string;
  whyMatters: string;
  launchGoal: 'awareness' | 'conversions' | 'onboarding' | 'retention';
  targetICPs: string[];
  icpStoryScriptId?: string;
  productContext: {
    existingFeature: string;
    useCase: string;
    differentiator: string;
  };
  assets: GTMAsset[];
  createdAt: string;
  updatedAt: string;
  clientId?: string;
}

export interface GTMAsset {
  id: string;
  campaignId: string;
  type: GTMAssetType;
  status: 'not_started' | 'in_progress' | 'completed';
  authorId?: string;
  outline?: string;
  content?: string;
  title?: string;
  lastUpdated: string;
}

export type GTMAssetType = 
  | 'internal_brief'
  | 'announcement_blog'
  | 'linkedin_exec'
  | 'customer_email'
  | 'in_app_notification'
  | 'sales_email_sequence'
  | 'enablement_onepager'
  | 'sales_deck_slide'
  | 'customer_success_script'
  | 'faq_sheet'
  | 'support_primer';

export interface GTMAssetTemplate {
  type: GTMAssetType;
  name: string;
  description: string;
  category: 'article' | 'post' | 'email' | 'script' | 'document';
  estimatedLength: string;
  targetAudience: string;
  requiresAuthor: boolean;
}

export const GTM_ASSET_TEMPLATES: GTMAssetTemplate[] = [
  {
    type: 'internal_brief',
    name: 'Internal Brief for GTM Team',
    description: 'Strategic overview and messaging guidance for internal teams',
    category: 'document',
    estimatedLength: '600-800 words',
    targetAudience: 'Internal GTM teams',
    requiresAuthor: false
  },
  {
    type: 'announcement_blog',
    name: 'Product Announcement Blog Post',
    description: 'Comprehensive feature announcement targeting broad audience',
    category: 'article',
    estimatedLength: '800-1200 words',
    targetAudience: 'General users and prospects',
    requiresAuthor: false
  },
  {
    type: 'linkedin_exec',
    name: 'LinkedIn Post (Executive POV)',
    description: 'Executive perspective LinkedIn announcement',
    category: 'post',
    estimatedLength: '150-300 words',
    targetAudience: 'LinkedIn professional network',
    requiresAuthor: true
  },
  {
    type: 'customer_email',
    name: 'Customer Email Update',
    description: 'Feature announcement for existing customers',
    category: 'email',
    estimatedLength: '300-500 words',
    targetAudience: 'Existing customers',
    requiresAuthor: false
  },
  {
    type: 'in_app_notification',
    name: 'In-App Notification Copy',
    description: 'Concise in-product announcement messaging',
    category: 'document',
    estimatedLength: '50-150 words',
    targetAudience: 'Active product users',
    requiresAuthor: false
  },
  {
    type: 'sales_email_sequence',
    name: 'Cold Sales Email Sequence',
    description: 'Prospecting email sequence highlighting new feature',
    category: 'email',
    estimatedLength: '200-400 words per email',
    targetAudience: 'Sales prospects',
    requiresAuthor: false
  },
  {
    type: 'enablement_onepager',
    name: 'Enablement One-Pager',
    description: 'Quick reference guide for sales and customer success teams',
    category: 'document',
    estimatedLength: '400-600 words',
    targetAudience: 'Sales and CS teams',
    requiresAuthor: false
  },
  {
    type: 'sales_deck_slide',
    name: 'Sales Deck Slide Narrative',
    description: 'Talking points and copy for sales presentation slides',
    category: 'document',
    estimatedLength: '300-500 words',
    targetAudience: 'Sales team and prospects',
    requiresAuthor: false
  },
  {
    type: 'customer_success_script',
    name: 'Customer Success / Onboarding Script',
    description: 'Script for CSMs to introduce feature to existing customers',
    category: 'script',
    estimatedLength: '400-600 words',
    targetAudience: 'Customer success team',
    requiresAuthor: false
  },
  {
    type: 'faq_sheet',
    name: 'Product Launch FAQ Sheet',
    description: 'Common questions and answers about the new feature',
    category: 'document',
    estimatedLength: '500-800 words',
    targetAudience: 'Support and sales teams',
    requiresAuthor: false
  },
  {
    type: 'support_primer',
    name: 'Support Team Primer',
    description: 'Technical overview and troubleshooting guide for support team',
    category: 'document',
    estimatedLength: '600-900 words',
    targetAudience: 'Customer support team',
    requiresAuthor: false
  }
];

export const getAssetTemplate = (type: GTMAssetType): GTMAssetTemplate | undefined => {
  return GTM_ASSET_TEMPLATES.find(template => template.type === type);
};