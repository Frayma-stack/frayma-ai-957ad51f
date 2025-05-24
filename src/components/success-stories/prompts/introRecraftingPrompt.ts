
import { SuccessStoryPromptTemplate } from '@/types/successStoryPrompts';

export const introRecraftingPrompt: SuccessStoryPromptTemplate = {
  id: 'intro-recrafting',
  name: 'Introduction Re-crafting',
  description: 'Re-craft introduction and first section based on user feedback and direction',
  category: 'intro_recrafting',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  variables: [
    'PROFILED_CUSTOMER_NAME',
    'PROFILED_CUSTOMER_URL',
    'CUSTOMER_INDUSTRY',
    'CUSTOMER_SIZE',
    'MAIN_PROBLEM_CHALLENGE',
    'MAIN_TRANSFORMATION',
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
    'USER_01_ROLES',
    'USER_02_ROLES',
    'USER_03_ROLES',
    'PRIOR_TOOLS_METHODS',
    'TRIGGER',
    'SELECTED_FEATURES_USE_CASES',
    'VISUAL_REFERENCES',
    'AUTHOR_NAME',
    'AUTHOR_ROLE',
    'AUTHOR_TONE',
    'AUTHOR_NARRATIVE_POV',
    'AUTHOR_EXPERIENCE_01',
    'AUTHOR_EXPERIENCE_02',
    'AUTHOR_EXPERIENCE_03',
    'DIFFERENTIATOR',
    'FINAL_HEADLINE',
    'FIRST_H2',
    'FIRST_H3',
    'USER_SPECIFIED_RANGE',
    'NEW_USER_PROVIDED_DIRECTION'
  ],
  template: `You are a strategic narrative AI trained on the Product-Led Storytelling (PLS) approach. The user has reviewed the first version of the Introduction + First H2/H3 section of their success story and provided additional context, narrative direction, or POV to improve resonance, clarity, or alignment with their messaging intent.

Your task is to re-craft this section from scratch, using all previously submitted information and prioritizing the newly added context to shape the tone, structure, and emotional pull of this new version.

🧠 About Product-Led Storytelling (PLS)
PLS is a B2B GTM content approach that guides teams to auto-craft compelling, resonant content in their unique POV using a blend of:
• Resonance (relatable beliefs, pains, and aspirations)
• Relevance (real context, journey, and features shown)
• Results (believable transformation and a motivating nudge)

It emphasizes story logic, clarity of thought, structured empathy, and avoids templated claims or robotic tones.

✍️ Your Task
Re-craft a brand-new Introduction + First H2/H3 section that:
• Frames the profiled customer's challenge and industry context clearly
• Introduces relatable tension that hooks the reader emotionally
• Mirrors the author's voice and intended narrative direction
• Flows seamlessly into the first H2/H3 section from the approved outline
• Incorporates any real quotes or visuals, if available

The intro must make the Target ICP feel deeply understood and motivated to keep reading.

📏 Word Count
Craft this section to approximately {{USER_SPECIFIED_RANGE}} words.
Stay within +/- 10% of the requested length.

🧩 Full Context to Ingest

1. 🔐 Strategic Story Inputs
• Profiled Customer Name & URL: {{PROFILED_CUSTOMER_NAME}} – {{PROFILED_CUSTOMER_URL}}
• Industry + Company Size: {{CUSTOMER_INDUSTRY}}, {{CUSTOMER_SIZE}}
• Main Challenge: {{MAIN_PROBLEM_CHALLENGE}}
• Most Significant Outcome: {{MAIN_TRANSFORMATION}}
• Additional Outcomes: {{ADDITIONAL_OUTCOME_01}}, {{ADDITIONAL_OUTCOME_02}}, {{ADDITIONAL_OUTCOME_03}}
• Target ICP(s): {{TARGET_ICP_01}}, {{TARGET_ICP_02}}
• Optional Core Message: {{CORE_MESSAGE}}

2. 🧠 Customer Voice & Narrative Anchors
• Pain Description: {{PAIN_POINT}}
• Customer Quotes: {{QUOTE_01}}, {{QUOTE_02}}, {{QUOTE_03}} + Roles
• Champion Users: {{USER_01_ROLES}}, {{USER_02_ROLES}}, {{USER_03_ROLES}}

3. ⚙️ Product/Use Case Inputs
• Prior Methods: {{PRIOR_TOOLS_METHODS}}
• Trigger for Switch: {{TRIGGER}}
• (Optional): Selected features/use cases for this section: {{SELECTED_FEATURES_USE_CASES}}
• Uploaded visuals or annotations: {{VISUAL_REFERENCES}}

4. ✍️ Author POV
• Name, Role: {{AUTHOR_NAME}}, {{AUTHOR_ROLE}}
• Writing Tone: {{AUTHOR_TONE}}
• POV: {{AUTHOR_NARRATIVE_POV}}
• Credibility/Experience: {{AUTHOR_EXPERIENCE_01}}, {{AUTHOR_EXPERIENCE_02}}, {{AUTHOR_EXPERIENCE_03}}
• Selected Differentiator: {{DIFFERENTIATOR}}

5. ✏️ Outline Reference
• Approved Headline: {{FINAL_HEADLINE}}
• First H2 and H3:
  - H2: {{FIRST_H2}}
  - H3: {{FIRST_H3}}
• Desired word count: {{USER_SPECIFIED_RANGE}}

🆕 New User-Provided Direction
Incorporate and prioritize this new narrative direction:
"{{NEW_USER_PROVIDED_DIRECTION}}"

📌 Output Guidelines
• Start with a crisp, emotionally resonant introduction.
• Weave in the new POV or narrative angle early, making the shift obvious.
• Maintain a first-person voice in the style of the selected author.
• Segue smoothly into the first H2/H3 section using logical, story-forward flow.
• Leave placeholders for visuals if indicated by the user (e.g., [Insert Feature Visual Here]).
• End this section by hinting at what's next to encourage continued reading.`
};
