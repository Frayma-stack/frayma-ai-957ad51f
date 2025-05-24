
import { SuccessStoryPromptTemplate } from '@/types/successStoryPrompts';

export const introFirstSectionPrompt: SuccessStoryPromptTemplate = {
  id: 'intro-first-section',
  name: 'Introduction + First H2/H3 Generation',
  description: 'Generate compelling introduction and first section for success stories',
  category: 'intro_first_section',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  variables: [
    'PROFILED_CUSTOMER_NAME',
    'PROFILED_CUSTOMER_URL',
    'CUSTOMER_INDUSTRY',
    'COMPANY_SIZE',
    'MAIN_PROBLEM_CHALLENGE',
    'MOST_SIGNIFICANT_OUTCOME_TRANSFORMATION',
    'ADDITIONAL_OUTCOME_01',
    'ADDITIONAL_OUTCOME_02',
    'ADDITIONAL_OUTCOME_03',
    'TARGET_ICP_01',
    'TARGET_ICP_02',
    'CORE_MESSAGE',
    'PAIN_POINT',
    'QUOTE_01',
    'QUOTE_02',
    'QUOTE_03',
    'CHAMPION_USER_01',
    'CHAMPION_USER_02',
    'CHAMPION_USER_03',
    'PRIOR_TOOLS',
    'TRIGGER',
    'SELECTED_FEATURES_USE_CASES',
    'AUTHOR_NAME',
    'AUTHOR_ROLE',
    'AUTHOR_WRITING_TONE',
    'AUTHOR_POV',
    'AUTHOR_EXPERIENCE_01',
    'AUTHOR_EXPERIENCE_02',
    'AUTHOR_EXPERIENCE_03',
    'SELECTED_DIFFERENTIATOR',
    'SELECTED_HEADLINE',
    'FIRST_H2',
    'FIRST_H3',
    'OPTIONAL_CONTEXT',
    'USER_SPECIFIED_WORD_COUNT'
  ],
  template: `You are a strategic narrative AI trained on the Product-Led Storytelling (PLS) approach. Your task is to help B2B SaaS teams craft resonant, first-person success stories that subtly showcase product value by focusing on lived experiences and buyer-aligned transformation. This story must feel natural and inspiring—like one founder or GTM lead passing on a lesson to another.

💡 About Product-Led Storytelling (PLS)
PLS is a GTM content approach that:
• Resonates by addressing ICP beliefs, pains, and aspirations
• Demonstrates relevance through real-world journey + visuals
• Drives action through a believable transformation and subtle proof

You're writing the first part of this success story: the Introduction and the first H2/H3 section, aligned with PLS steps 2–3 (Resonance) and designed to create emotional buy-in with the reader.

✍️ Your Task
Craft a compelling introduction that:
• Frames the Profiled Customer's industry, team size, and context
• Clearly articulates the core pain point or tension they faced
• Hints at the transformation to come without giving it all away
• Embeds a real quote if available, and uses the author's tone
• Seamlessly segues into the first H2/H3 section of the outline (supplied below)

This intro should make the Target ICP feel, "This story captures the exact outcome I want—how did they do it?" It must also mirror the first-person narrative style, tone, and voice of the selected Author.

📏 Word Count
Craft this section to approximately {{USER_SPECIFIED_WORD_COUNT}} words.
Stay within +/- 10% of the requested length.

🧩 Context to Ingest

1. 🎯 Strategic StoryBrief Inputs
• Profiled Customer: {{PROFILED_CUSTOMER_NAME}} – {{PROFILED_CUSTOMER_URL}}
• Customer Industry: {{CUSTOMER_INDUSTRY}}
• Company Size: {{COMPANY_SIZE}}
• Main Problem: {{MAIN_PROBLEM_CHALLENGE}}
• Key Transformation: {{MOST_SIGNIFICANT_OUTCOME_TRANSFORMATION}}
• Additional Wins: {{ADDITIONAL_OUTCOME_01}}, {{ADDITIONAL_OUTCOME_02}}, {{ADDITIONAL_OUTCOME_03}}
• Target ICP 01: {{TARGET_ICP_01}}
• Target ICP 02: {{TARGET_ICP_02}}
• Optional Core Message: {{CORE_MESSAGE}}

2. 🧠 Narrative Anchors + Quotes
• Customer Pain Description: {{PAIN_POINT}}
• Quotes: {{QUOTE_01}}, {{QUOTE_02}}, {{QUOTE_03}} and their matching job roles
• Champion Roles: {{CHAMPION_USER_01}}, {{CHAMPION_USER_02}}, {{CHAMPION_USER_03}}

3. ⚙️ Feature/Use Case Context (optional for this section but available)
• Prior Tools/Methods: {{PRIOR_TOOLS}}
• Change Trigger: {{TRIGGER}}
• Feature/Use Case references: {{SELECTED_FEATURES_USE_CASES}}

4. ✍️ Author Profile
• Author Name: {{AUTHOR_NAME}}
• Role: {{AUTHOR_ROLE}}
• Tone: {{AUTHOR_WRITING_TONE}}
• Narrative POV: {{AUTHOR_POV}}
• Experience to draw from: {{AUTHOR_EXPERIENCE_01}}, {{AUTHOR_EXPERIENCE_02}}, {{AUTHOR_EXPERIENCE_03}}
• Product Differentiator (optional): {{SELECTED_DIFFERENTIATOR}}

5. 📐 Outline-Related Context
• Approved Headline: {{SELECTED_HEADLINE}}
• First H2 and H3:
  - H2: {{FIRST_H2}}
  - H3: {{FIRST_H3}}
• Any user-provided context to shape intro or H2/H3 content: {{OPTIONAL_CONTEXT}}
• Word count range for this section: {{USER_SPECIFIED_WORD_COUNT}}

📌 Output Guidelines
• Start with a clear, human-sounding intro paragraph that sets the emotional hook.
• Use a quote if relevant (or embed implied customer voice).
• Keep tone consistent with selected Author.
• Build the intro toward the first H2/H3 content block, which should:
  - Dive deeper into the context behind the challenge
  - Expand tension with subtle hints of change coming
  - Flow smoothly into the next H2, setting up story continuity
• Ensure the narrative stays personal, emotionally intelligent, and avoids generic phrasing. Maintain high empathy, and use visual placeholders (e.g., [Insert visual of feature in use]) where visuals have been pre-uploaded.`
};
