
export interface ProductCampaignPromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  category: ProductCampaignPromptCategory;
  outputType: 'outline' | 'final_draft';
  assetType: ProductCampaignAssetType;
  authorType?: 'founder' | 'co_founder' | 'product_marketer';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductCampaignPromptCategory = 
  | 'announcement_article'
  | 'primary_icp_article'
  | 'secondary_icp_article'
  | 'newsletter_email'
  | 'video_script'
  | 'changelog'
  | 'linkedin_post'
  | 'twitter_thread';

export type ProductCampaignAssetType =
  | 'general_announcement_blog'
  | 'primary_icp_blog'
  | 'secondary_icp_blog'
  | 'newsletter_email'
  | 'video_script'
  | 'changelog'
  | 'linkedin_founder'
  | 'linkedin_cofounder'
  | 'linkedin_product_marketer'
  | 'twitter_founder'
  | 'twitter_cofounder'
  | 'twitter_product_marketer';

export interface ProductCampaignPromptConfig {
  outlinePrompts: Record<ProductCampaignAssetType, ProductCampaignPromptTemplate>;
  finalDraftPrompts: Record<ProductCampaignAssetType, ProductCampaignPromptTemplate>;
}

export interface ProductCampaignPromptVariable {
  name: string;
  description: string;
  type: 'string' | 'array' | 'object' | 'number';
  required: boolean;
}
