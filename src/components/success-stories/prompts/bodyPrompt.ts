
import { SuccessStoryPromptTemplate } from '@/types/successStoryPrompts';

export const bodyPrompt: SuccessStoryPromptTemplate = {
  id: 'body-sections',
  name: 'Main Body Generation (Relevance)',
  description: 'Auto-craft the Relevance section showing implementation journey and product usage',
  category: 'body_sections',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  variables: [
    'USER_DEFINED_WORD_COUNT',
    'PROFILED_CUSTOMER_NAME',
    'PROFILED_CUSTOMER_URL',
    'CUSTOMER_INDUSTRY',
    'COMPANY_SIZE',
    'TARGET_ICP_01',
    'TARGET_ICP_02',
    'MAIN_CHALLENGE',
    'MOST_SIGNIFICANT_OUTCOME',
    'OUTCOME_01',
    'OUTCOME_02',
    'OUTCOME_03',
    'CORE_MESSAGE',
    'PRIOR_TOOLS_METHODS',
    'TRIGGER',
    'KEY_DECISION_FACTORS',
    'IMPLEMENTATION_TIMELINE',
    'FEATURE_USE_CASE_01',
    'FEATURE_USE_CASE_02',
    'FEATURE_USE_CASE_03',
    'HOW_IT_WAS_USED_01',
    'HOW_IT_WAS_USED_02',
    'HOW_IT_WAS_USED_03',
    'VISUAL_CAPTIONS_01',
    'VISUAL_CAPTIONS_02',
    'VISUAL_CAPTIONS_03',
    'QUOTE_01',
    'QUOTE_02',
    'QUOTE_03',
    'CHAMPION_JOB_ROLE_01',
    'CHAMPION_JOB_ROLE_02',
    'CHAMPION_JOB_ROLE_03',
    'AUTHOR_NAME',
    'AUTHOR_ROLE',
    'AUTHOR_TONE',
    'EXPERIENCE_01',
    'EXPERIENCE_02',
    'EXPERIENCE_03',
    'DIFFERENTIATOR',
    'AUTHOR_POV_SETTING',
    'HEADLINE',
    'RELEVANCE_PHASE_OUTLINE',
    'INTRO_FIRST_H2_H3_CONTENT'
  ],
  template: `You are a strategic B2B narrative AI using the Product-Led Storytelling (PLS) approach. Your task is to auto-craft the Relevance section of a Success Story: PLS steps 4–6—Engage & Show—based on the structured briefing and context below.

This section must continue from the previously crafted introduction + first H2/H3 and flow naturally into the approved "Relevance" portion of the outline.

🧠 About Product-Led Storytelling (PLS)
Product-Led Storytelling is a GTM narrative approach that helps SaaS teams craft emotionally resonant, contextually relevant, and action-driving content. It relies on three phases:
• Resonance: Align with ICP beliefs, pains, desires.
• Relevance: Show how your product fits into their world through vivid, contextual storytelling.
• Results: Drive belief-based action with transformation that feels achievable.

In this section (Relevance), we want to show—not just tell—how the profiled customer achieved their transformation using the product.

📏 Word Count
Craft this section to approximately {{USER_DEFINED_WORD_COUNT}} words.
Stay within +/- 10% of the requested length.

✅ Inputs to Ingest

🏁 Strategic Setup
• Profiled Customer: {{PROFILED_CUSTOMER_NAME}}, {{PROFILED_CUSTOMER_URL}}, {{CUSTOMER_INDUSTRY}}, {{COMPANY_SIZE}}
• Target ICP(s): {{TARGET_ICP_01}}, {{TARGET_ICP_02}}
• Main Pain + Transformation: {{MAIN_CHALLENGE}}, {{MOST_SIGNIFICANT_OUTCOME}}
• Additional Outcomes: {{OUTCOME_01}}, {{OUTCOME_02}}, {{OUTCOME_03}}
• Core Message (if provided): {{CORE_MESSAGE}}

🎯 Prior Journey
• Tools/Methods Before: {{PRIOR_TOOLS_METHODS}}
• Trigger for Change: {{TRIGGER}}
• Decision Factors: {{KEY_DECISION_FACTORS}}
• Implementation Timeline: {{IMPLEMENTATION_TIMELINE}}

⚙️ Features + Use Cases
For each selected feature/use case:
• Title: {{FEATURE_USE_CASE_01}}, {{FEATURE_USE_CASE_02}}, {{FEATURE_USE_CASE_03}}
• Usage Description: {{HOW_IT_WAS_USED_01}}, {{HOW_IT_WAS_USED_02}}, {{HOW_IT_WAS_USED_03}}
• Visuals: {{VISUAL_CAPTIONS_01}}, {{VISUAL_CAPTIONS_02}}, {{VISUAL_CAPTIONS_03}}
• Insert: [Insert Visual: Title – Caption]

🧠 Customer Quotes
Weave these quotes naturally into the section:
• Quote 01: {{QUOTE_01}} – from {{CHAMPION_JOB_ROLE_01}}
• Quote 02: {{QUOTE_02}} – from {{CHAMPION_JOB_ROLE_02}}
• Quote 03: {{QUOTE_03}} – from {{CHAMPION_JOB_ROLE_03}}

Use only when the surrounding content builds naturally to them.

✍️ Author POV
• Author Name & Role: {{AUTHOR_NAME}}, {{AUTHOR_ROLE}}
• Writing Tone: {{AUTHOR_TONE}}
• Experience to Lean On: {{EXPERIENCE_01}}, {{EXPERIENCE_02}}, {{EXPERIENCE_03}}
• Product Differentiator to Emphasize: {{DIFFERENTIATOR}}
• Narrative POV: {{AUTHOR_POV_SETTING}}

✏️ Story So Far
• Approved Headline: {{HEADLINE}}
• Approved Outline Block: {{RELEVANCE_PHASE_OUTLINE}}
• Previously Approved Sections: {{INTRO_FIRST_H2_H3_CONTENT}}

✨ Output Instructions
• Continue the narrative from the approved intro and stay aligned with the outline.
• Maintain the author's tone, POV, and voice consistently throughout.
• Vividly show the implementation journey—timelines, behaviors, decisions.
• Show (don't tell) how specific features and use cases helped.
• Insert placeholders for visuals where they were uploaded.
• Use customer quotes to validate points and build trust—but only when earned by the surrounding content.
• End the section with a natural handoff into the "Results" section—creating light forward tension.`
};
