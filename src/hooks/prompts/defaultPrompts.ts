
import { PromptCategory, PromptTemplate } from './types';

export const DEFAULT_PROMPTS: Record<PromptCategory, PromptTemplate> = {
  content_triggers: {
    id: 'content_triggers_1',
    name: 'Content Discovery Triggers',
    description: 'Generate SEO keywords, search queries, and problem statements',
    template: `Based on the content strategy below, generate comprehensive content discovery triggers:

Content Context:
- Idea Trigger: {{ideaTrigger}}
- Mutual Goal: {{mutualGoal}}
- Target Keyword: {{targetKeyword}}
- Content Cluster: {{contentCluster}}
- Publishing Reason: {{publishReason}}
- Call to Action: {{callToAction}}
- Strategic Success Story: {{strategicSuccessStory}}
- Target ICP: {{mainTargetICP}}
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
  "problemStatements": ["problem1", "problem2", ...]
}`,
    variables: ['ideaTrigger', 'mutualGoal', 'targetKeyword', 'contentCluster', 'publishReason', 'callToAction', 'strategicSuccessStory', 'mainTargetICP', 'journeyStage', 'readingPrompt', 'narrativeAnchors', 'successStory'],
    category: 'content_triggers',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  headlines_generation: {
    id: 'headlines_generation_1',
    name: 'Headlines Generation',
    description: 'Generate compelling headlines for the content',
    template: `Generate 5 compelling headlines for this content:

Content Context:
- Idea Trigger: {{ideaTrigger}}
- Target Keyword: {{targetKeyword}}
- Target ICP: {{mainTargetICP}}
- Journey Stage: {{journeyStage}}
- Mutual Goal: {{mutualGoal}}
- Related Keywords: {{relatedKeywords}}
- Problem Statements: {{problemStatements}}

The headlines should:
1. Include the target keyword naturally
2. Appeal to the {{journeyStage}} stage audience
3. Address the mutual goal: {{mutualGoal}}
4. Be compelling and click-worthy

Format your response as JSON:
{
  "headlines": ["headline1", "headline2", "headline3", "headline4", "headline5"]
}`,
    variables: ['ideaTrigger', 'targetKeyword', 'mainTargetICP', 'journeyStage', 'mutualGoal', 'relatedKeywords', 'problemStatements'],
    category: 'headlines_generation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  outline_sections: {
    id: 'outline_sections_1',
    name: 'Outline Sections',
    description: 'Generate content outline sections',
    template: `Create a detailed content outline for this piece:

Content Context:
- Idea Trigger: {{ideaTrigger}}
- Target ICP: {{mainTargetICP}}
- Problem Statements: {{problemStatements}}

Generate 4-6 main sections (H2 level) that follow this structure:
1. Attract phase (hook and problem introduction)
2. Filter phase (audience qualification)
3. Engage phase (solution and value demonstration)
4. Results phase (outcomes and call to action)

Format your response as JSON:
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  intro_generation: {
    id: 'intro_generation_1',
    name: 'Introduction Generation',
    description: 'Generate compelling introduction content',
    template: `Write a compelling introduction for this content:

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
    variables: ['selectedHeadline', 'mainTargetICP', 'ideaTrigger'],
    category: 'intro_generation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  body_generation: {
    id: 'body_generation_1',
    name: 'Body Content Generation',
    description: 'Generate main body content',
    template: `Write the main body content based on this outline:

Outline Sections: {{outlineSections}}
Additional Context: {{outlineContext}}

Create comprehensive content for each section that:
1. Provides valuable insights
2. Includes practical examples
3. Maintains reader engagement
4. Builds toward the conclusion

Write in a professional yet accessible tone.`,
    variables: ['outlineSections', 'outlineContext'],
    category: 'body_generation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  conclusion_generation: {
    id: 'conclusion_generation_1',
    name: 'Conclusion Generation',
    description: 'Generate compelling conclusion with CTA',
    template: `Write a compelling conclusion for this content:

Context:
- Conclusion Sections: {{outlineSections}}
- Call to Action: {{callToAction}}

Create a conclusion that:
1. Summarizes key points
2. Reinforces the value proposition
3. Includes a clear, compelling call to action
4. Leaves the reader motivated to take action

End with the specific call to action: {{callToAction}}`,
    variables: ['outlineSections', 'callToAction'],
    category: 'conclusion_generation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};
