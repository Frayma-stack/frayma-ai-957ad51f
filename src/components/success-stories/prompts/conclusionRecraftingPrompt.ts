
import { SuccessStoryPromptTemplate } from '@/types/successStoryPrompts';

export const conclusionRecraftingPrompt: SuccessStoryPromptTemplate = {
  id: 'conclusion-recrafting',
  name: 'Conclusion Re-crafting (Results)',
  description: 'Re-craft the final Results section with new narrative direction',
  category: 'conclusion_generation',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  variables: [
    'USER_PROVIDED_ADDITIONAL_CONTEXT_OR_DIRECTION',
    'DESIRED_WORD_COUNT',
    'APPROVED_HEADLINE',
    'APPROVED_OUTLINE',
    'APPROVED_INTRO_SECTION',
    'APPROVED_MAIN_BODY',
    'PROFILED_CUSTOMER_NAME',
    'PROFILED_CUSTOMER_URL',
    'CUSTOMER_INDUSTRY',
    'COMPANY_SIZE',
    'MAIN_PAIN',
    'MOST_SIGNIFICANT_OUTCOME',
    'ADDITIONAL_OUTCOMES',
    'TARGET_ICP_PRIMARY',
    'TARGET_ICP_SECONDARY',
    'FEATURES_USE_CASES_USED',
    'RELATED_VISUALS',
    'PREVIOUS_METHODS_DECISION_JOURNEY',
    'BEFORE_AFTER_METRICS',
    'UNEXPECTED_WINS',
    'CUSTOMER_ENDORSEMENT_QUOTES',
    'FINAL_CTA_DROPDOWN_CUSTOM',
    'FINAL_NUDGING_MESSAGE',
    'AUTHOR_NAME_ROLE',
    'WRITING_TONE',
    'NARRATIVE_POV',
    'PRODUCT_DIFFERENTIATOR',
    'CREDIBILITY_EXPERIENCES'
  ],
  template: `You are a world-class GTM content strategist trained in the Product-Led Storytelling (PLS) approach. A Frayma AI user has requested a recraft of the final section of their success story—PLS steps 7–9: Persuade & Convert (Results)—based on new narrative direction they've provided.

Your task: Recraft the final section by fully ingesting all prior context + inputs, while aligning the tone, storytelling arc, and CTA to the updated user-provided direction.

🧠 About Product-Led Storytelling (PLS)
PLS is a B2B GTM narrative framework that helps users auto-craft content that resonates emotionally, educates with relevance, and inspires action. This final section focuses on the "Results" layer of the 3Rs Formula—showing measurable outcomes, second-order effects, and a final CTA that answers the ICP's internal question: "Why you, why now?"

📥 New Context to Follow
Override previous narrative tone/direction with this newly provided POV:
{{USER_PROVIDED_ADDITIONAL_CONTEXT_OR_DIRECTION}}
You must lean into this perspective when recrafting—your job is not to rewrite the same story, but to reframe it using this narrative lens.

📏 Word Count Target
Craft this section to be approximately {{DESIRED_WORD_COUNT}} words (soft limit — +/- 10% acceptable for storytelling flow).

✅ Retain & Ingest This Full Context

From Prior Sections:
• Headline: {{APPROVED_HEADLINE}}
• Outline: {{APPROVED_OUTLINE}}
• Introduction + First H2/H3: {{APPROVED_INTRO_SECTION}}
• Main Body / Relevance Section: {{APPROVED_MAIN_BODY}}

From Original Inputs:
Customer + Story Info
• Profiled Customer Name, URL, Industry, Company Size: {{PROFILED_CUSTOMER_NAME}}, {{PROFILED_CUSTOMER_URL}}, {{CUSTOMER_INDUSTRY}}, {{COMPANY_SIZE}}
• Main Pain, Most Significant Outcome, Additional Outcomes: {{MAIN_PAIN}}, {{MOST_SIGNIFICANT_OUTCOME}}, {{ADDITIONAL_OUTCOMES}}

Target ICPs
• Primary + Secondary: {{TARGET_ICP_PRIMARY}}, {{TARGET_ICP_SECONDARY}}

Implementation Context
• Features + Use Cases Used: {{FEATURES_USE_CASES_USED}}
• Related Visuals: {{RELATED_VISUALS}}
• Previous Methods + Decision Journey: {{PREVIOUS_METHODS_DECISION_JOURNEY}}

Results-Specific Data
• Before & After Metrics: {{BEFORE_AFTER_METRICS}}
• Unexpected Wins: {{UNEXPECTED_WINS}}
• Customer Endorsement Quotes: {{CUSTOMER_ENDORSEMENT_QUOTES}}
• Final CTA: {{FINAL_CTA_DROPDOWN_CUSTOM}}
• Final Nudging Message: {{FINAL_NUDGING_MESSAGE}}

Narrative POV + Author Style
• Author Name + Role: {{AUTHOR_NAME_ROLE}}
• Writing Tone: {{WRITING_TONE}}
• Narrative POV: {{NARRATIVE_POV}}
• Product Differentiator to Lean On: {{PRODUCT_DIFFERENTIATOR}}
• Credibility Experiences: {{CREDIBILITY_EXPERIENCES}}

✨ Output Instructions
• Start with clear, meaningful transformation: show measurable wins and how they were achieved.
• Thread in second-order effects that the ICP might not expect but would strongly value.
• Reweave one or more endorsement quotes, making sure they support the new narrative lens.
• Maintain narrative continuity with previous sections but adopt the tone and framing of the new context.
• Use light FOMO storytelling to make the ICP feel like this outcome is within reach—but only by acting now.
• End on a high note with a final CTA + nudging message that inspires next steps, grounded in the transformation arc.

Once completed, this version will replace the previous ending in the editor, ready for review or final polish.`
};
