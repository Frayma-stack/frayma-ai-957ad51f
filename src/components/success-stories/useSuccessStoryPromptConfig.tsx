
import { SuccessStoryPromptCategory } from '@/types/successStoryPrompts';

// Default prompt templates for success story generation
const DEFAULT_PROMPTS = {
  headline_outline_generation: `
You are a Product-Led Storytelling expert helping create compelling customer success stories.

Based on the provided customer information, generate 3 different headline options and a comprehensive outline for a success story that follows the 3Rs Framework (Resonance, Relevance, Results).

Customer Details:
- Customer: {PROFILED_CUSTOMER_NAME}
- Industry: {CUSTOMER_INDUSTRY}
- Company Size: {COMPANY_SIZE}
- Main Problem: {MAIN_PROBLEM_CHALLENGE}
- Key Transformation: {MOST_SIGNIFICANT_TRANSFORMATION_OUTCOME}
- Target ICP: {TARGET_ICP_01}

Generate:
1. Three compelling headline options that capture attention and hint at the transformation
2. A detailed outline with main sections and key points to cover
3. Suggested H2 and H3 subheadings for structure

Focus on creating headlines that are specific, benefit-driven, and resonate with the target ICP.
`,

  intro_first_section: `
You are a Product-Led Storytelling expert crafting the introduction section of a customer success story.

Using the provided information, write an engaging introduction that hooks the reader and sets up the transformation story.

Customer Context:
- Customer: {PROFILED_CUSTOMER_NAME}
- Industry: {CUSTOMER_INDUSTRY}
- Main Challenge: {MAIN_PROBLEM_CHALLENGE}
- Key Quote: {CHAMPION_USER_01_ROLE_QUOTE}
- Pain Point Context: {PAIN_POINT_NARRATIVE}

Selected Structure:
- Headline: {SELECTED_HEADLINE}
- First H2: {FIRST_H2}
- First H3: {FIRST_H3}

Target word count: {USER_SPECIFIED_WORD_COUNT} words

Write an introduction that:
1. Opens with a compelling hook
2. Introduces the customer and their challenge
3. Sets up the transformation story
4. Uses the customer's voice through quotes
5. Creates curiosity about the solution

Tone: Professional yet engaging, focusing on the customer's perspective.
`,

  intro_recrafting: `
You are a Product-Led Storytelling expert recrafting the introduction section based on new direction.

Original Context:
- Customer: {PROFILED_CUSTOMER_NAME}
- Challenge: {MAIN_PROBLEM_CHALLENGE}
- Transformation: {MOST_SIGNIFICANT_TRANSFORMATION_OUTCOME}

New Direction: {NEW_USER_PROVIDED_DIRECTION}

Structure:
- Headline: {FINAL_HEADLINE}
- First H2: {FIRST_H2}
- First H3: {FIRST_H3}

Target word count: {USER_SPECIFIED_RANGE} words

Recraft the introduction incorporating the new direction while maintaining:
1. Strong opening hook
2. Clear problem setup
3. Customer voice and credibility
4. Smooth transition to the main story
`,

  body_sections: `
You are a Product-Led Storytelling expert crafting the main body sections of a customer success story.

Context:
- Customer: {PROFILED_CUSTOMER_NAME}
- Previous Solution: {BEFORE_SOLUTION}
- Trigger for Change: {TRIGGER}
- Key Features Used: {FEATURE_01_DETAILS}, {FEATURE_02_DETAILS}
- Use Cases: {USE_CASE_01_DETAILS}, {USE_CASE_02_DETAILS}
- Implementation: {ROLL_OUT_PERIOD}

Previous Sections:
- Headline: {HEADLINE}
- Outline: {RELEVANCE_PHASE_OUTLINE}
- Introduction: {INTRO_FIRST_H2_H3_CONTENT}

Target word count: {USER_DEFINED_WORD_COUNT} words

Write the main body sections that cover:
1. The decision process and evaluation
2. Implementation and onboarding experience
3. Key features and use cases in action
4. Initial results and early wins

Focus on storytelling that shows rather than tells, using specific examples and customer quotes.
`,

  conclusion_generation: `
You are a Product-Led Storytelling expert writing the conclusion section of a customer success story.

Full Story Context:
- Customer: {PROFILED_CUSTOMER_NAME}
- Key Results: {KPI_SHIFT_DATA}
- Unexpected Wins: {UNEXPECTED_WIN_01}, {UNEXPECTED_WIN_02}
- Endorsements: {ENDORSEMENT_QUOTE_01}
- CTA: {CTA_TO_READER}

Previous Sections:
- Headline: {APPROVED_HEADLINE}
- Outline: {APPROVED_OUTLINE}
- Introduction: {CRAFTED_INTRO_SECTION}
- Body: {CRAFTED_MAIN_BODY}

Target word count: {DESIRED_WORD_COUNT} words

Write a powerful conclusion that:
1. Summarizes the key transformation and results
2. Highlights unexpected benefits and wins
3. Includes strong endorsement quotes
4. Ends with a compelling call-to-action
5. Reinforces the value proposition for similar prospects

Make it persuasive and action-oriented while maintaining authenticity.
`,

  full_story_assembly: `
You are assembling a complete customer success story from the provided sections.

Combine and polish all sections into a cohesive, compelling narrative that flows naturally from introduction through conclusion.

Ensure:
1. Smooth transitions between sections
2. Consistent voice and tone throughout
3. Proper formatting with headlines and subheadings
4. Strong narrative arc from challenge to transformation
5. Strategic placement of quotes and credibility elements

Output the complete, polished success story ready for publication.
`
};

export const useSuccessStoryPromptConfig = () => {
  const generatePromptWithVariables = (
    category: SuccessStoryPromptCategory,
    variables: Record<string, string>
  ): string => {
    let template = DEFAULT_PROMPTS[category];
    
    if (!template) {
      console.warn(`No template found for category: ${category}`);
      return '';
    }

    // Replace all variables in the template
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      template = template.replaceAll(placeholder, value || '');
    });

    return template;
  };

  return {
    generatePromptWithVariables
  };
};
