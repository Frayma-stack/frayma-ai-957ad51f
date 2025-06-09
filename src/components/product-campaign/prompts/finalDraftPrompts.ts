
import { ProductCampaignPromptTemplate } from '@/types/productCampaignPrompts';

export const FINAL_DRAFT_PROMPTS: Record<string, ProductCampaignPromptTemplate> = {
  general_announcement_blog: {
    id: 'pc_draft_general_announcement',
    name: 'General Announcement Blog Post - Final Draft',
    description: 'Auto-craft compelling general announcement GTM blog post using approved outline',
    template: `You are an expert B2B SaaS content creator using the Product-Led Storytelling (PLS) approach to auto-craft a compelling general announcement GTM blog post.

About Product-Led Storytelling (PLS):
PLS is a narrative-first content strategy that uses structured empathy and storytelling logic to resonate with ICPs, show meaningful product relevance, and move them to act through the 3Rs Formula:
• **Resonance** – Frame beliefs, pains, and transformations from your ICP's lens using their language and worldview
• **Relevance** – Show how the product solves specific, lived challenges through compelling use cases
• **Results** – Close with proof, believable outcomes, and strategic CTAs that feel natural

**APPROVED OUTLINE:**
{{approvedOutline}}

**STRATEGIC CONTEXT:**
Product/Feature Name: {{productFeatureName}}
What Was Shipped: {{whatWasShipped}}
Strategic Significance: {{strategicSignificance}}
Brand Narrative Connection: {{brandNarrativeConnection}}

**TARGET AUDIENCE INTELLIGENCE:**
Primary ICP: {{primaryICP}} - {{primaryICPPains}} | Transformation: {{primaryICPTransformation}}
Secondary ICP: {{secondaryICP}} - {{secondaryICPPains}} | Transformation: {{secondaryICPTransformation}}

**PRODUCT INTELLIGENCE:**
Key Benefits for Primary ICP: {{primaryICPBenefits}}
Key Benefits for Secondary ICP: {{secondaryICPBenefits}}
Differentiators: {{keyDifferentiators}}
Success Story Integration: {{successStoryIntegration}}

**AUTHOR CONTEXT:**
Author: {{authorName}} ({{authorRole}})
Writing in {{authorTone}} voice with {{authorPOV}} perspective
Author Experience: {{authorExperience}}
Author Credibility: {{authorCredibility}}

**CONTENT ASSETS:**
Visual References: {{visualReferences}}
Product Screenshots: {{productScreenshots}}
Success Story Quotes: {{successStoryQuotes}}
Metrics/Proof Points: {{metricsProofPoints}}

**CONTENT PARAMETERS:**
Word Count Target: {{wordCountTarget}}
Primary CTA: {{primaryCTA}}
Secondary CTA: {{secondaryCTA}}

Auto-craft the final blog post following this structure:

**OPENING (Resonance Phase)**
- Start with the approved headline that captures both ICPs' attention
- Open with a hook that immediately connects to shared beliefs or tensions
- Establish the problem context using language both ICPs recognize
- Set up the transformation promise without overselling

**BODY (Relevance Phase)**
- Introduce the product update with strategic context and "why now" narrative
- Provide feature overview that connects to both ICPs' worldviews
- Walk through Primary ICP use case with specific workflow improvements
- Detail Secondary ICP use case showing their unique value realization
- Weave in differentiators naturally through the use case narratives
- Include visual callouts and product screenshots strategically

**CLOSING (Results Phase)**
- Present transformation outcomes using success story integration
- Include credible proof points and metrics that matter to both ICPs
- Paint future vision that extends beyond immediate feature benefits
- Close with strategic CTA that feels like natural next step
- Add secondary CTA for different engagement levels

**WRITING GUIDELINES:**
1. Write in {{authorName}}'s authentic {{authorTone}} voice throughout
2. Use "I/we" perspective reflecting {{authorRole}} experience
3. Include natural transitions between PLS phases
4. Embed {{brandNarrativeConnection}} throughout the narrative
5. Make product benefits feel discovered, not pitched
6. Use specific, concrete examples over generic claims
7. Maintain professional yet approachable tone
8. End sections with forward momentum toward next section

Ensure every paragraph serves the 3Rs Formula and guides readers toward the strategic transformation outcome.`,
    variables: [
      'approvedOutline', 'productFeatureName', 'whatWasShipped', 'strategicSignificance', 'brandNarrativeConnection',
      'primaryICP', 'primaryICPPains', 'primaryICPTransformation', 'secondaryICP', 'secondaryICPPains', 'secondaryICPTransformation',
      'primaryICPBenefits', 'secondaryICPBenefits', 'keyDifferentiators', 'successStoryIntegration',
      'authorName', 'authorRole', 'authorTone', 'authorPOV', 'authorExperience', 'authorCredibility',
      'visualReferences', 'productScreenshots', 'successStoryQuotes', 'metricsProofPoints',
      'wordCountTarget', 'primaryCTA', 'secondaryCTA'
    ],
    category: 'announcement_article',
    outputType: 'final_draft',
    assetType: 'general_announcement_blog',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  primary_icp_blog: {
    id: 'pc_draft_primary_icp',
    name: 'Primary ICP Blog Post - Final Draft',
    description: 'Auto-craft sharp, POV-led blog post targeting primary ICP',
    template: `You are an expert B2B SaaS content creator using the Product-Led Storytelling (PLS) approach to auto-craft a sharp, POV-led blog post targeting the Primary ICP.

**APPROVED OUTLINE:**
{{approvedOutline}}

**PRIMARY ICP INTELLIGENCE:**
Target: {{primaryICP}} ({{primaryICPStage}})
Core Beliefs: {{primaryICPCoreBeliefs}}
Internal Pains: {{primaryICPInternalPains}}
External Struggles: {{primaryICPExternalStruggles}}
Desired Transformation: {{primaryICPDesiredTransformation}}
Daily Workflow Context: {{primaryICPWorkflowContext}}

**PRODUCT CONTEXT:**
Feature/Update: {{productFeatureName}}
Specific Use Case for Primary ICP: {{primaryICPUseCase}}
Before State: {{beforeState}}
After State: {{afterState}}
Key Benefits: {{primaryICPKeyBenefits}}
Workflow Integration: {{workflowIntegration}}

**PROOF & CREDIBILITY:**
Success Story: {{primaryICPSuccessStory}}
Customer Quote: {{primaryICPCustomerQuote}}
Metrics/Results: {{primaryICPMetrics}}
Social Proof: {{primaryICPSocialProof}}

**AUTHOR CONTEXT:**
Author: {{authorName}} ({{authorRole}})
Voice: {{authorVoice}} - {{authorTone}}
Connection to Primary ICP: {{authorPrimaryICPConnection}}
Credibility Markers: {{authorCredibilityMarkers}}

Auto-craft a compelling blog post that feels like it was written specifically for {{primaryICP}}:

**OPENING - Immediate Resonance**
- Lead with hook that reflects Primary ICP's internal dialogue or current belief
- Establish tension they're already feeling about their current workflow/challenges
- Use language and examples they immediately recognize from their daily experience
- Set up transformation promise that feels authentic to their goals

**BODY - Deep Relevance**
- Present product update as natural solution to their articulated pain
- Walk through specific use case using their exact workflow terminology
- Show step-by-step how their daily work improves with this update
- Address skepticism or concerns specific to their role/stage
- Weave in {{primaryICPSuccessStory}} to build credibility and show peer success

**CLOSING - Compelling Results**
- Paint vivid before/after picture using {{beforeState}} → {{afterState}}
- Include {{primaryICPCustomerQuote}} that validates the transformation
- Present {{primaryICPMetrics}} in context of their success metrics
- End with future vision that motivates beyond immediate feature benefits
- Strategic CTA: {{primaryCTA}} that aligns with their decision-making process

**WRITING STYLE:**
- Write in {{authorVoice}} voice with {{authorTone}} approach
- Use first-person perspective showing {{authorPrimaryICPConnection}}
- Include industry terminology and context specific to {{primaryICP}}
- Show, don't tell - use specific examples and scenarios
- Build narrative momentum toward transformation outcome
- Keep {{primaryICPStage}} buying journey stage in mind throughout

Ensure every sentence serves the Primary ICP's interests and moves them toward their desired transformation.`,
    variables: [
      'approvedOutline', 'primaryICP', 'primaryICPStage', 'primaryICPCoreBeliefs',
      'primaryICPInternalPains', 'primaryICPExternalStruggles', 'primaryICPDesiredTransformation', 'primaryICPWorkflowContext',
      'productFeatureName', 'primaryICPUseCase', 'beforeState', 'afterState', 'primaryICPKeyBenefits', 'workflowIntegration',
      'primaryICPSuccessStory', 'primaryICPCustomerQuote', 'primaryICPMetrics', 'primaryICPSocialProof',
      'authorName', 'authorRole', 'authorVoice', 'authorTone', 'authorPrimaryICPConnection', 'authorCredibilityMarkers',
      'primaryCTA'
    ],
    category: 'primary_icp_article',
    outputType: 'final_draft',
    assetType: 'primary_icp_blog',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // ... Additional final draft prompts will follow similar enhanced patterns
};
