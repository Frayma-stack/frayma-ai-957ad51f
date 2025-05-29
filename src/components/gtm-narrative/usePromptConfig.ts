
import { contentTriggersPrompt } from './prompts/contentTriggersPrompt';
import { headlinesPrompt } from './prompts/headlinesPrompt';
import { outlinePrompt } from './prompts/outlinePrompt';

type PromptCategory = 'content_triggers' | 'headlines_generation' | 'outline_sections' | 'intro_generation' | 'body_generation' | 'conclusion_generation';

const PROMPT_TEMPLATES = {
  content_triggers: contentTriggersPrompt.template,
  headlines_generation: headlinesPrompt.template,
  outline_sections: outlinePrompt.template,
  intro_generation: `Write a compelling introduction for this content:

Context:
- Headline: {{selectedHeadline}}
- Target ICP: {{mainTargetICP}}
- Idea Trigger: {{ideaTrigger}}

Write a 2-3 paragraph introduction that:
1. Hooks the reader immediately
2. Establishes credibility
3. Sets up the main value proposition
4. Transitions smoothly to the main content

Write in a conversational, engaging tone.`,
  body_generation: `Write the main body content based on this outline:

Outline Sections: {{outlineSections}}
Additional Context: {{outlineContext}}

Create comprehensive content for each section that:
1. Provides valuable insights
2. Includes practical examples
3. Maintains reader engagement
4. Builds toward the conclusion

Write in a professional yet accessible tone.`,
  conclusion_generation: `Write a compelling conclusion for this content:

Context:
- Conclusion Sections: {{outlineSections}}
- Call to Action: {{callToAction}}

Create a conclusion that:
1. Summarizes key points
2. Reinforces the value proposition
3. Includes a clear, compelling call to action
4. Leaves the reader motivated to take action

End with the specific call to action: {{callToAction}}`
};

export const usePromptConfig = () => {
  const interpolateTemplate = (category: PromptCategory, variables: Record<string, any>): string => {
    let template = PROMPT_TEMPLATES[category];
    
    if (!template) {
      console.warn(`No template found for category: ${category}`);
      return '';
    }

    // Replace all variables in the template
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      template = template.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value || '');
    });

    return template;
  };

  return {
    interpolateTemplate
  };
};
