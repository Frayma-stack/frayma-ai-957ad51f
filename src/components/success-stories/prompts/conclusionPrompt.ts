
import { SuccessStoryPromptTemplate } from '@/types/successStoryPrompts';

export const conclusionPrompt: SuccessStoryPromptTemplate = {
  id: 'conclusion-generation',
  name: 'Conclusion Generation (Results)',
  description: 'Auto-craft the final Results section with outcomes and CTA',
  category: 'conclusion_generation',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  variables: [
    'DESIRED_WORD_COUNT',
    'APPROVED_HEADLINE',
    'APPROVED_OUTLINE',
    'CRAFTED_INTRO_SECTION',
    'CRAFTED_MAIN_BODY',
    'PROFILED_CUSTOMER_NAME',
    'PROFILED_CUSTOMER_URL',
    'CUSTOMER_INDUSTRY',
    'COMPANY_SIZE',
    'MAIN_PROBLEM',
    'MOST_SIGNIFICANT_OUTCOME',
    'ADDITIONAL_OUTCOMES',
    'TARGET_ICP_PRIMARY',
    'TARGET_ICP_SECONDARY',
    'FEATURES_USE_CASES_USED',
    'VISUALS_UPLOADED',
    'CHAMPION_USER_QUOTES',
    'BEFORE_AFTER_METRICS',
    'UNEXPECTED_WINS',
    'ENDORSEMENT_QUOTES_1_3',
    'FINAL_CTA',
    'FINAL_NUDGING_MESSAGE',
    'SELECTED_AUTHOR',
    'SELECTED_TONE',
    'NARRATIVE_POV',
    'SELECTED_EXPERIENCES',
    'SELECTED_PRODUCT_DIFFERENTIATOR'
  ],
  template: `You are a world-class GTM narrative strategist trained in the Product-Led Storytelling (PLS) approach. A Frayma AI user has completed the full StoryBrief input flow and approved the previous sections of their success story. Now, your task is to auto-craft the final section of the story—PLS steps 7–9—to drive belief and action.

🧠 About Product-Led Storytelling (PLS)
Product-Led Storytelling is a GTM narrative approach that aligns every piece with three pillars:
• Resonance: Start by speaking to ICP beliefs and pains.
• Relevance: Educate with useful, experience-backed product context.
• Results: End by showcasing compelling outcomes, second-order benefits, and a CTA that invites the ICP to act.

This final section is focused on Results—the business outcomes and emotional payoff that make the case for your product not just as a tool, but a strategic asset.

📏 Word Count Target
Craft this section to be approximately {{DESIRED_WORD_COUNT}} words (soft limit — +/- 10% acceptable for storytelling flow).

✅ Data to Ingest

From Prior Sections
• Headline: {{APPROVED_HEADLINE}}
• Outline: {{APPROVED_OUTLINE}}
• Introduction + First H2/H3: {{CRAFTED_INTRO_SECTION}}
• Main Body / Relevance Section: {{CRAFTED_MAIN_BODY}}

From Inputs – Frayma AI StoryBrief System
Profiled Customer Details:
• Name, URL, Industry, Size: {{PROFILED_CUSTOMER_NAME}}, {{PROFILED_CUSTOMER_URL}}, {{CUSTOMER_INDUSTRY}}, {{COMPANY_SIZE}}
• Main Problem + Outcomes: {{MAIN_PROBLEM}}, {{MOST_SIGNIFICANT_OUTCOME}}
• Additional Outcomes: {{ADDITIONAL_OUTCOMES}}

Target ICPs:
• Primary & secondary ICPs: {{TARGET_ICP_PRIMARY}}, {{TARGET_ICP_SECONDARY}}

Implementation Narrative (for context):
• Features + use cases used: {{FEATURES_USE_CASES_USED}}
• Visuals uploaded by the user: {{VISUALS_UPLOADED}}
• Quotes from champion users: {{CHAMPION_USER_QUOTES}}

Results-Specific Fields:
• Before & After Metrics: {{BEFORE_AFTER_METRICS}}
• Unexpected Wins: {{UNEXPECTED_WINS}}
• Customer Endorsement Quotes 1–3: {{ENDORSEMENT_QUOTES_1_3}}
• Final CTA: {{FINAL_CTA}}
• Final Nudging Message: {{FINAL_NUDGING_MESSAGE}}

Narrative POV + Tone:
• Author: {{SELECTED_AUTHOR}}
• Tone: {{SELECTED_TONE}}
• Narrative POV: {{NARRATIVE_POV}}
• Experiences to lean on: {{SELECTED_EXPERIENCES}}
• Differentiator to highlight: {{SELECTED_PRODUCT_DIFFERENTIATOR}}

✨ Output Instructions
• Use storytelling arcs and connective language to bridge naturally from the last section into this one.
• Don't regurgitate what's already been said. Build on it.
• Start with measurable outcomes, then layer in second-order business effects.
• Use endorsement quotes to emphasize credibility, but only if they flow naturally in context.
• Showcase a light sense of FOMO—make the ICP feel like "this is exactly what I want too."
• Close with a persuasive Final CTA section:
  - Recap the transformation
  - Invite action based on their reality ("If you're struggling with [main pain], you deserve outcomes like this…")

Once completed, this content will be displayed in the Frayma AI editor for review, final tweaks, or re-crafting with user-guided direction.`
};
