
import { ProductCampaignPromptTemplate, ProductCampaignAssetType } from '@/types/productCampaignPrompts';
import { OUTLINE_PROMPTS } from './outlinePrompts';
import { FINAL_DRAFT_PROMPTS } from './finalDraftPrompts';
import { LINKEDIN_OUTLINE_PROMPTS, TWITTER_OUTLINE_PROMPTS } from './socialMediaPrompts';

// Complete prompt collection for Product Campaign module
export const PRODUCT_CAMPAIGN_PROMPTS = {
  // Outline Generation Prompts
  outlines: {
    ...OUTLINE_PROMPTS,
    ...LINKEDIN_OUTLINE_PROMPTS,
    ...TWITTER_OUTLINE_PROMPTS,
    
    // Newsletter Email Outline
    newsletter_email: {
      id: 'pc_outline_newsletter',
      name: 'Newsletter Email Outline',
      description: 'Generate compelling newsletter email outline for product update',
      template: `You are a B2B SaaS email marketing strategist using the Product-Led Storytelling (PLS) approach to craft a compelling newsletter email outline.

**STRATEGIC CONTEXT:**
Product Update Summary: {{productUpdateSummary}}
Why It Matters: {{whyItMatters}}
Strategic Significance: {{strategicSignificance}}

**TARGET AUDIENCE:**
Primary ICP: {{primaryICP}} - {{primaryICPBenefits}}
Secondary ICP: {{secondaryICP}} - {{secondaryICPBenefits}}
Subscriber Segment: {{subscriberSegment}}

**EMAIL PARAMETERS:**
Desired CTA: {{desiredCTA}}
Author Tone: {{authorTone}}
Email Length: {{emailLength}}

Generate outline with PLS structure:

**SUBJECT LINE OPTIONS (3 variations):**
- Curiosity-driven subject line
- Benefit-focused subject line  
- Personal/behind-the-scenes subject line

**EMAIL STRUCTURE:**
- **Opening Hook**: Personal greeting that immediately connects to subscriber interests
- **Resonance Section**: Update context that resonates with subscriber challenges
- **Relevance Section**: Feature details with specific benefits for each ICP
- **Results Section**: Transformation vision with strategic CTA
- **Visual/CTA Placements**: Strategic placement of screenshots, GIFs, and action buttons

Ensure outline maintains newsletter feel while driving strategic engagement.`,
      variables: [
        'productUpdateSummary', 'whyItMatters', 'strategicSignificance',
        'primaryICP', 'primaryICPBenefits', 'secondaryICP', 'secondaryICPBenefits',
        'subscriberSegment', 'desiredCTA', 'authorTone', 'emailLength'
      ],
      category: 'newsletter_email',
      outputType: 'outline',
      assetType: 'newsletter_email',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as ProductCampaignPromptTemplate,

    // Video Script Outline
    video_script: {
      id: 'pc_outline_video',
      name: 'Product-Led Video Script Outline',
      description: 'Generate narrative-rich video script outline for product update',
      template: `You are a B2B SaaS video content strategist using the Product-Led Storytelling (PLS) approach to generate a narrative-rich video script outline.

**VIDEO CONTEXT:**
Update Summary: {{updateSummary}}
Feature Walkthrough: {{featureWalkthrough}}
Strategic POV: {{strategicPOV}}
Video Length: {{videoLength}}

**AUDIENCE & TRANSFORMATION:**
Target Viewer: {{targetViewer}}
Viewer Transformation Goal: {{viewerTransformationGoal}}
Current State: {{currentState}}
Desired Future State: {{desiredFutureState}}

**NARRATOR CONTEXT:**
Narrator: {{narrator}} ({{narratorRole}})
Narrator Voice: {{narratorVoice}}
Credibility Markers: {{credibilityMarkers}}

Generate video script outline using PLS narrative structure:

**OPENING (0-15 seconds) - Hook & Resonance:**
- Attention-grabbing hook that immediately connects to viewer challenges
- Problem statement that resonates with target viewer's current frustrations
- Stakes/context that makes watching worthwhile

**BODY (15-75 seconds) - Relevance & Demo:**
- Product update introduction with strategic context
- Feature walkthrough with specific viewer benefits highlighted
- Use case demonstration showing clear before/after workflow
- Key differentiator that makes this solution unique

**CLOSING (75-90 seconds) - Results & CTA:**
- Transformation narrative showing believable future state
- Strategic CTA aligned with viewer's next logical step
- Vision statement that motivates continued engagement

**PRODUCTION ELEMENTS:**
- Screen recording segments with callouts
- Narrator on-camera moments for credibility
- Visual transitions that support narrative flow
- Music/audio cues that enhance emotional beats
- Text overlays for key points and CTAs

Ensure script maintains {{narratorVoice}} authenticity while building toward transformation outcome.`,
      variables: [
        'updateSummary', 'featureWalkthrough', 'strategicPOV', 'videoLength',
        'targetViewer', 'viewerTransformationGoal', 'currentState', 'desiredFutureState',
        'narrator', 'narratorRole', 'narratorVoice', 'credibilityMarkers'
      ],
      category: 'video_script',
      outputType: 'outline',
      assetType: 'video_script',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as ProductCampaignPromptTemplate
  },

  // Final Draft Generation Prompts
  finalDrafts: FINAL_DRAFT_PROMPTS
};

// Helper function to get prompt by asset type and output type
export const getProductCampaignPrompt = (
  assetType: ProductCampaignAssetType, 
  outputType: 'outline' | 'final_draft'
): ProductCampaignPromptTemplate | null => {
  const promptCollection = outputType === 'outline' 
    ? PRODUCT_CAMPAIGN_PROMPTS.outlines 
    : PRODUCT_CAMPAIGN_PROMPTS.finalDrafts;
    
  return promptCollection[assetType] || null;
};

// Helper function to interpolate prompt template with variables
export const interpolateProductCampaignPrompt = (
  template: string,
  variables: Record<string, any>
): string => {
  let result = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    let replacement = '';
    
    if (Array.isArray(value)) {
      replacement = value.join(', ');
    } else if (typeof value === 'object' && value !== null) {
      replacement = JSON.stringify(value);
    } else {
      replacement = String(value || '');
    }
    
    result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), replacement);
  });
  
  return result;
};
