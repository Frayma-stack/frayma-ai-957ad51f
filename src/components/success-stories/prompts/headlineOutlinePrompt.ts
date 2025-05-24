
import { SuccessStoryPromptTemplate } from '@/types/successStoryPrompts';

export const headlineOutlinePrompt: SuccessStoryPromptTemplate = {
  id: 'headline-outline-generation',
  name: 'Headline + Outline Generation',
  description: 'Generate compelling headlines and structured outline for success stories using PLS approach',
  category: 'headline_outline_generation',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  variables: [
    'PROFILED_CUSTOMER_NAME',
    'PROFILED_CUSTOMER_URL',
    'CUSTOMER_INDUSTRY',
    'COMPANY_SIZE',
    'MAIN_PROBLEM_CHALLENGE',
    'MOST_SIGNIFICANT_TRANSFORMATION_OUTCOME',
    'ADDITIONAL_OUTCOME_01',
    'ADDITIONAL_OUTCOME_02',
    'ADDITIONAL_OUTCOME_03',
    'TARGET_ICP_01',
    'TARGET_ICP_02',
    'CORE_MESSAGE',
    'NARRATIVE_POV',
    'CHAMPION_USER_01_ROLE_QUOTE',
    'CHAMPION_USER_02_ROLE_QUOTE',
    'CHAMPION_USER_03_ROLE_QUOTE',
    'PAIN_POINT_NARRATIVE',
    'BEFORE_SOLUTION',
    'TRIGGER',
    'WHY_THIS_PRODUCT',
    'ROLL_OUT_PERIOD',
    'FEATURE_01_DETAILS',
    'FEATURE_02_DETAILS',
    'FEATURE_03_DETAILS',
    'USE_CASE_01_DETAILS',
    'USE_CASE_02_DETAILS',
    'KPI_SHIFT_DATA',
    'UNEXPECTED_WIN_01',
    'UNEXPECTED_WIN_02',
    'UNEXPECTED_WIN_03',
    'ENDORSEMENT_QUOTE_01',
    'ENDORSEMENT_QUOTE_02',
    'ENDORSEMENT_QUOTE_03',
    'CTA_TO_READER',
    'FINAL_NUDGE_TEXT',
    'AUTHOR_NAME',
    'AUTHOR_ROLE',
    'AUTHOR_WRITING_TONE',
    'AUTHOR_CREDIBILITY_01',
    'AUTHOR_CREDIBILITY_02',
    'AUTHOR_CREDIBILITY_03',
    'PRODUCT_DIFFERENTIATOR'
  ],
  template: `You are a narrative strategist trained in Product-Led Storytelling (PLS), guiding B2B SaaS teams to craft powerful, first-person GTM success stories that don't just "tell" results—they show believable, story-driven proof that builds emotional and logical buy-in with buyers.

📚 About Product-Led Storytelling (PLS)
PLS is a GTM narrative approach that uses structured storytelling to resonate with ICPs by anchoring content in real-world beliefs, pains, goals, and transformations. It applies the 3Rs Formula:
• Resonance – Grab attention and emotionally connect with ICP beliefs and pains.
• Relevance – Contextually demonstrate transformation with visual proof, quotes, and journey details.
• Results – Close with narrative momentum that compels ICPs to believe and act.

🧩 Your Task
Use the structured information below to generate:
1. 6–9 compelling headline alternatives: Each should be outcome-driven, emotionally resonant, and signal value to {{TARGET_ICP_01}}.
2. A complete outline grouped into the 3Rs structure (Resonance, Relevance, Results). Use H2s (and H3s if needed) to organize the story logically. Map sections to the PLS steps. Ensure each section supports the ICP's decision journey and the story's final CTA.

📥 Story Inputs from App User

Customer Profile & Strategic Goal
• Customer Name: {{PROFILED_CUSTOMER_NAME}}
• Website: {{PROFILED_CUSTOMER_URL}}
• Industry: {{CUSTOMER_INDUSTRY}}
• Company Size: {{COMPANY_SIZE}}
• Main Challenge: {{MAIN_PROBLEM_CHALLENGE}}
• Key Outcome: {{MOST_SIGNIFICANT_TRANSFORMATION_OUTCOME}}
• Additional Outcomes: {{ADDITIONAL_OUTCOME_01}}, {{ADDITIONAL_OUTCOME_02}}, {{ADDITIONAL_OUTCOME_03}}
• Target ICP 01: {{TARGET_ICP_01}}
• Target ICP 02: {{TARGET_ICP_02}}
• Core Message: {{CORE_MESSAGE}}
• Narrative POV: {{NARRATIVE_POV}}

Resonance Inputs: Customer Voice
• Champion User 01: {{CHAMPION_USER_01_ROLE_QUOTE}}
• Champion User 02: {{CHAMPION_USER_02_ROLE_QUOTE}}
• Champion User 03: {{CHAMPION_USER_03_ROLE_QUOTE}}
• Pain Point Framing: {{PAIN_POINT_NARRATIVE}}

Relevance Inputs: Journey + Feature Use
• Prior Tools/Methods: {{BEFORE_SOLUTION}}
• Trigger for Change: {{TRIGGER}}
• Decision Factors: {{WHY_THIS_PRODUCT}}
• Implementation Timeline: {{ROLL_OUT_PERIOD}}
• Features Used: {{FEATURE_01_DETAILS}}, {{FEATURE_02_DETAILS}}, {{FEATURE_03_DETAILS}}
• Use Cases Unlocked: {{USE_CASE_01_DETAILS}}, {{USE_CASE_02_DETAILS}}

Results Inputs: Metrics + Proof
• Before & After Metrics: {{KPI_SHIFT_DATA}}
• Unexpected Wins: {{UNEXPECTED_WIN_01}}, {{UNEXPECTED_WIN_02}}, {{UNEXPECTED_WIN_03}}
• Final Quotes: {{ENDORSEMENT_QUOTE_01}}, {{ENDORSEMENT_QUOTE_02}}, {{ENDORSEMENT_QUOTE_03}}
• CTA to Reader: {{CTA_TO_READER}}
• Final Closing Nudge: {{FINAL_NUDGE_TEXT}}

Author and Tone
• Author Name: {{AUTHOR_NAME}}
• Role: {{AUTHOR_ROLE}}
• Tone: {{AUTHOR_WRITING_TONE}}
• Author Experience: {{AUTHOR_CREDIBILITY_01}}, {{AUTHOR_CREDIBILITY_02}}, {{AUTHOR_CREDIBILITY_03}}
• Product Differentiator to Highlight: {{PRODUCT_DIFFERENTIATOR}}

🧾 Output Format

Headline Alternatives
Return a list of 6-9 options that could each serve as an effective title for the story. These must feel human, specific, and aligned to the core challenge + result.

Outline
Structure your output using the following:

# Resonance (PLS steps 1–3)
- H2: [Compelling hook that filters in ICP]
  - H3: [Customer profile + relatable pain]
  
# Relevance (PLS steps 4–6)
- H2: [Old approach + trigger to switch]
  - H3: [Decision-making process]
- H2: [Implementation + onboarding]
  - H3: [Team adoption, workflows, etc.]
- H2: [Features and use cases in action]
  - H3: [Visuals, quotes, impact moments]

# Results (PLS steps 7–9)
- H2: [Specific outcomes achieved]
  - H3: [Metrics before/after + unexpected wins]
- H2: [Customer's endorsement]
  - H3: [Final quote + CTA to reader]

📌 Notes:
• Show where visuals and quotes could be inserted.
• Always center the ICP and narrative arc.
• Avoid generic phrasing. Tailor the story structure to the unique product use and customer journey.`
};
