
import { useState, useEffect } from 'react';
import { PromptTemplate, PromptConfig, PromptCategory } from '@/types/prompts';
import { useLocalStorage } from './useLocalStorage';

// Default prompt templates
const DEFAULT_PROMPTS: Record<PromptCategory, PromptTemplate> = {
  content_triggers: {
    id: 'default_content_triggers',
    name: 'Content Discovery Triggers',
    description: 'Generate related keywords, search queries, and problem statements',
    template: `Based on the following GTM narrative piece information, suggest relevant content discovery triggers:

STRATEGIC ALIGNMENT:
- Idea/Trigger: {{ideaTrigger}}
- Mutual Goal: {{mutualGoal}}
- Target Keyword: {{targetKeyword}}
- Content Cluster: {{contentCluster}}
- Publish Reason: {{publishReason}}
- Call to Action: {{callToAction}}
- Strategic Success Story: {{strategicSuccessStory}}

TARGET READER RESONANCE:
- Main Target ICP: {{mainTargetICP}}
- Journey Stage: {{journeyStage}}
- Reading Prompt: {{readingPrompt}}
- Narrative Anchors: {{narrativeAnchors}}
- Success Story: {{successStory}}

Please provide:
1. 5-8 related keywords to "{{targetKeyword}}"
2. 3-5 real search queries that the target audience would use
3. 5 specific problem statements that the piece should address

Format your response as JSON with the following structure:
{
  "relatedKeywords": ["keyword1", "keyword2", ...],
  "searchQueries": ["query1", "query2", ...],
  "problemStatements": ["statement1", "statement2", ...]
}`,
    variables: ['ideaTrigger', 'mutualGoal', 'targetKeyword', 'contentCluster', 'publishReason', 'callToAction', 'strategicSuccessStory', 'mainTargetICP', 'journeyStage', 'readingPrompt', 'narrativeAnchors', 'successStory'],
    category: 'content_triggers',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  headlines_generation: {
    id: 'default_headlines',
    name: 'Headlines Generation',
    description: 'Generate compelling headline alternatives',
    template: `Based on the following strategic inputs, generate 9-12 compelling headline alternatives:

STRATEGIC CONTEXT:
- Core Idea: {{ideaTrigger}}
- Target Keyword: {{targetKeyword}}
- Target Audience: {{mainTargetICP}}
- Journey Stage: {{journeyStage}}
- Mutual Goal: {{mutualGoal}}

DISCOVERY TRIGGERS:
- Related Keywords: {{relatedKeywords}}
- Problem Statements: {{problemStatements}}

Create headlines that are:
1. Compelling and attention-grabbing
2. Include the target keyword naturally
3. Speak directly to the target audience's challenges
4. Promise a clear value proposition

Format as JSON:
{
  "headlines": ["headline1", "headline2", ...]
}`,
    variables: ['ideaTrigger', 'targetKeyword', 'mainTargetICP', 'journeyStage', 'mutualGoal', 'relatedKeywords', 'problemStatements'],
    category: 'headlines_generation',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  outline_sections: {
    id: 'default_outline',
    name: 'Outline Sections',
    description: 'Create detailed Product-Led Storytelling outline',
    template: `Create a detailed Product-Led Storytelling outline with the 9-step approach organized into 3Rs phases:

CONTEXT:
- Core Idea: {{ideaTrigger}}
- Target Audience: {{mainTargetICP}}
- Problems to Address: {{problemStatements}}

Create sections following this structure:
- ATTRACT (PLS Step 1): H2/H3 for hook and resonance
- FILTER (PLS Steps 2-3): H2/H3 for context and transition  
- ENGAGE (PLS Steps 4-6): H2/H3/H4 for main content body
- RESULTS (PLS Steps 7-9): H2/H3/H4 for outcomes and CTA

Format as JSON:
{
  "sections": [
    {
      "type": "H2",
      "title": "Section Title",
      "phase": "attract|filter|engage|results"
    }
  ]
}`,
    variables: ['ideaTrigger', 'mainTargetICP', 'problemStatements'],
    category: 'outline_sections',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  intro_generation: {
    id: 'default_intro',
    name: 'Introduction Generation',
    description: 'Generate compelling introduction and first section content',
    template: `Generate a compelling introduction and first section content for:
          
HEADLINE: {{selectedHeadline}}
TARGET AUDIENCE: {{mainTargetICP}}
CORE IDEA: {{ideaTrigger}}

Include:
1. Hook that resonates with the target audience
2. Introduction of the problem/challenge
3. Personal connection or credibility
4. Preview of what's coming`,
    variables: ['selectedHeadline', 'mainTargetICP', 'ideaTrigger'],
    category: 'intro_generation',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  body_generation: {
    id: 'default_body',
    name: 'Body Generation',
    description: 'Generate main body content following the outline',
    template: `Generate the main body content following the outline sections for ENGAGE phase:

SECTIONS: {{outlineSections}}
CONTEXT: {{outlineContext}}

Focus on:
1. Core framework/solution presentation
2. Detailed explanation with examples
3. Value demonstration
4. Practical application`,
    variables: ['outlineSections', 'outlineContext'],
    category: 'body_generation',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  conclusion_generation: {
    id: 'default_conclusion',
    name: 'Conclusion Generation',
    description: 'Generate conclusion content for RESULTS phase',
    template: `Generate the conclusion content for RESULTS phase:

SECTIONS: {{outlineSections}}
CALL TO ACTION: {{callToAction}}

Include:
1. Summary of key points
2. Results and benefits
3. Future implications
4. Clear call to action`,
    variables: ['outlineSections', 'callToAction'],
    category: 'conclusion_generation',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

export const usePromptConfig = () => {
  const [prompts, setPrompts] = useState<Record<PromptCategory, PromptTemplate>>(DEFAULT_PROMPTS);
  const [isLoaded, setIsLoaded] = useState(false);
  const localStorage = useLocalStorage();

  useEffect(() => {
    const savedPrompts = window.localStorage.getItem('gtm_prompts');
    if (savedPrompts) {
      try {
        setPrompts(JSON.parse(savedPrompts));
      } catch (error) {
        console.error('Error loading saved prompts:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  const updatePrompt = (category: PromptCategory, template: Partial<PromptTemplate>) => {
    const updatedPrompts = {
      ...prompts,
      [category]: {
        ...prompts[category],
        ...template,
        updatedAt: new Date().toISOString()
      }
    };
    setPrompts(updatedPrompts);
    window.localStorage.setItem('gtm_prompts', JSON.stringify(updatedPrompts));
  };

  const resetPrompt = (category: PromptCategory) => {
    const updatedPrompts = {
      ...prompts,
      [category]: DEFAULT_PROMPTS[category]
    };
    setPrompts(updatedPrompts);
    window.localStorage.setItem('gtm_prompts', JSON.stringify(updatedPrompts));
  };

  const resetAllPrompts = () => {
    setPrompts(DEFAULT_PROMPTS);
    window.localStorage.setItem('gtm_prompts', JSON.stringify(DEFAULT_PROMPTS));
  };

  const importPrompts = (importedPrompts: Record<PromptCategory, PromptTemplate>) => {
    setPrompts(importedPrompts);
    window.localStorage.setItem('gtm_prompts', JSON.stringify(importedPrompts));
  };

  const getPromptTemplate = (category: PromptCategory): string => {
    return prompts[category]?.template || DEFAULT_PROMPTS[category].template;
  };

  const interpolateTemplate = (category: PromptCategory, variables: Record<string, any>): string => {
    let template = getPromptTemplate(category);
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      let replacement = '';
      
      if (Array.isArray(value)) {
        replacement = value.join(', ');
      } else if (typeof value === 'object' && value !== null) {
        replacement = JSON.stringify(value);
      } else {
        replacement = String(value || '');
      }
      
      template = template.replace(new RegExp(placeholder, 'g'), replacement);
    });
    
    return template;
  };

  return {
    prompts,
    isLoaded,
    updatePrompt,
    resetPrompt,
    resetAllPrompts,
    importPrompts,
    getPromptTemplate,
    interpolateTemplate,
    // Include localStorage data for access if needed
    clients: localStorage.clients,
    authors: localStorage.authors,
    ideas: localStorage.ideas
  };
};
