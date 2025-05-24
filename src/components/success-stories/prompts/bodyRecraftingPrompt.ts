
import { SuccessStoryPromptTemplate } from '@/types/successStoryPrompts';

export const bodyRecraftingPrompt: SuccessStoryPromptTemplate = {
  id: 'body-recrafting',
  name: 'Main Body Re-crafting (Relevance)',
  description: 'Re-craft the Relevance section with new narrative direction',
  category: 'body_sections',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  variables: [
    'UPDATED_WORD_COUNT',
    'USER_PROVIDED_CONTEXT_POV_NARRATIVE',
    'PROFILED_CUSTOMER_NAME',
    'PROFILED_CUSTOMER_URL',
    'CUSTOMER_INDUSTRY',
    'COMPANY_SIZE',
    'TARGET_ICP_01',
    'TARGET_ICP_02',
    'MAIN_PAIN',
    'MOST_SIGNIFICANT_OUTCOME',
    'OUTCOME_01',
    'OUTCOME_02',
    'OUTCOME_03',
    'BEFORE_TOOL_WORKAROUND',
    'MOTIVATION',
    'REASONS_FOR_CHOICE',
    'IMPLEMENTATION_TIMELINE',
    'USE_CASES_DESCRIPTIONS',
    'VISUAL_CAPTIONS',
    'QUOTES_1_3',
    'AUTHOR',
    'AUTHOR_TONE',
    'SELECTED_EXPERIENCES',
    'AUTHOR_POV',
    'DIFFERENTIATOR',
    'HEADLINE',
    'PREVIOUS_SECTION'
  ],
  template: `You are a world-class GTM narrative strategist trained in the Product-Led Storytelling (PLS) approach. A Frayma AI app user has requested a re-crafted version of the Relevance section (PLS steps 4–6) of their success story.

Your goal is to take the original story inputs, previously approved sections, and the newly provided direction/POV to regenerate this part of the story in a sharper, more resonant way. This section should seamlessly follow the approved introduction + first H2/H3 and reflect the updated creative direction.

🧠 About Product-Led Storytelling (PLS)
Product-Led Storytelling (PLS) transforms product messaging into narrative that resonates, educates, and drives belief-based action using a 3Rs Formula:
• Resonance: Align with ICP's beliefs, pains, and goals.
• Relevance: Show product fit with strategic, real-world context.
• Results: Demonstrate believable transformation.

This section focuses on Relevance—educating the target ICP by showing what actually happened. Go deep. Use specifics. Avoid fluff.

📏 Word Count Target
Re-craft this section to approximately {{UPDATED_WORD_COUNT}} words
(Allow +/- 10% tolerance for narrative flow)

🆕 New Narrative Direction to Consider
The user provided this new narrative/POV to guide this version:
"{{USER_PROVIDED_CONTEXT_POV_NARRATIVE}}"
Ensure the story tone, angle, and detail reflect this direction clearly.

✅ Original Inputs to Ingest

Strategic Setup
• Profiled Customer: {{PROFILED_CUSTOMER_NAME}}, {{PROFILED_CUSTOMER_URL}}, {{CUSTOMER_INDUSTRY}}, {{COMPANY_SIZE}}
• Target ICP(s): {{TARGET_ICP_01}}, {{TARGET_ICP_02}}
• Main Challenge + Outcome: {{MAIN_PAIN}}, {{MOST_SIGNIFICANT_OUTCOME}}
• Additional Outcomes: {{OUTCOME_01}}, {{OUTCOME_02}}, {{OUTCOME_03}}

Prior Journey
• Previous Tools/Methods: {{BEFORE_TOOL_WORKAROUND}}
• Trigger for Change: {{MOTIVATION}}
• Key Decision Factors: {{REASONS_FOR_CHOICE}}
• Timeline: {{IMPLEMENTATION_TIMELINE}}

Features/Use Cases/Visuals
• Use cases + how they were unlocked: {{USE_CASES_DESCRIPTIONS}}
• Feature 01, 02, 03: Title, usage context
• Visuals: {{VISUAL_CAPTIONS}}

Customer Voice
• Quotes: {{QUOTES_1_3}} — Include only if they amplify points made naturally in narrative.

Author Details
• Name + Role: {{AUTHOR}}
• Writing Tone: {{AUTHOR_TONE}}
• Credibility/Experience to Lean On: {{SELECTED_EXPERIENCES}}
• Narrative POV: {{AUTHOR_POV}}
• Product Differentiator: {{DIFFERENTIATOR}}

Previously Approved Sections
• Headline: {{HEADLINE}}
• Introduction + First H2/H3: {{PREVIOUS_SECTION}}

✨ Output Instructions
• Maintain first-person or hybrid voice as selected.
• Keep the new POV and tone clearly reflected throughout the rewrite.
• Focus on educating the ICP reader with narrative depth (step-by-step, feature-by-feature) and SHOW don't just tell.
• Weave in product features and visuals naturally.
• Use quotes as proof or amplification—only when earned.
• End with a smooth transition to the next section: PLS steps 7–9, Persuade & Convert.`
};
