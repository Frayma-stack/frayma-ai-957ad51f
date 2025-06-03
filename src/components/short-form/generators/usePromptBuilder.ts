
import { ICPStoryScript, Author, CustomerSuccessStory } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentType, ContentGoal } from '../types';
import { useContentGeneration } from '../useContentGeneration';

interface PromptBuilderProps {
  contentType: ContentType;
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  narrativeSelections: any[];
  selectedICP: string;
  selectedAuthor: string;
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  selectedSuccessStory: string;
  contentGoal: ContentGoal;
  wordCount: number;
  emailCount: number;
  additionalContext: string;
  triggerInput: string;
  getSelectedIdea: () => GeneratedIdea | null;
}

export const usePromptBuilder = (props: PromptBuilderProps) => {
  const {
    getSelectedICPScript,
    getSelectedAuthor,
    getSelectedSuccessStory,
    getSelectedNarrativeContents
  } = useContentGeneration({
    contentType: props.contentType,
    scripts: props.scripts,
    authors: props.authors,
    successStories: props.successStories,
    narrativeSelections: props.narrativeSelections,
    selectedICP: props.selectedICP,
    selectedAuthor: props.selectedAuthor,
    selectedAuthorTone: props.selectedAuthorTone,
    selectedAuthorExperience: props.selectedAuthorExperience,
    selectedSuccessStory: props.selectedSuccessStory,
    contentGoal: props.contentGoal,
    wordCount: props.wordCount,
    emailCount: props.emailCount,
    additionalContext: props.additionalContext,
    triggerInput: props.triggerInput
  });

  const buildPrompt = () => {
    const script = getSelectedICPScript();
    const author = getSelectedAuthor();
    const successStory = getSelectedSuccessStory();
    const selectedIdea = props.getSelectedIdea();
    const narrativeContents = getSelectedNarrativeContents();

    let prompt = `You are an expert GTM narrative writer creating compelling, high-converting ${props.contentType} content.\n\n`;

    // Content type specific instructions
    if (props.contentType === 'linkedin') {
      prompt += `Create a LinkedIn post that:
- Uses engaging storytelling to capture attention
- Includes relevant hashtags and professional tone
- Has a clear call-to-action
- Is approximately ${props.wordCount} words
- Uses LinkedIn best practices for engagement\n\n`;
    } else if (props.contentType === 'email') {
      prompt += `Create a ${props.emailCount}-email sequence that:
- Uses compelling subject lines
- Builds trust and credibility
- Addresses pain points directly
- Has clear calls-to-action
- Follows email marketing best practices\n\n`;
    } else {
      prompt += `Create custom content that:
- Is approximately ${props.wordCount} words
- Uses compelling storytelling
- Has a clear call-to-action
- Addresses the target audience's needs\n\n`;
    }

    // Add trigger/idea context
    if (props.triggerInput) {
      prompt += `CONTENT TRIGGER/THESIS:\n${props.triggerInput}\n\n`;
    } else if (selectedIdea) {
      prompt += `CONTENT IDEA:\nTitle: ${selectedIdea.title}\nNarrative: ${selectedIdea.narrative}\n`;
      if (selectedIdea.productTieIn) {
        prompt += `Product Tie-in: ${selectedIdea.productTieIn}\n`;
      }
      if (selectedIdea.cta) {
        prompt += `CTA: ${selectedIdea.cta}\n`;
      }
      prompt += '\n';
    }

    // Add ICP context
    if (script) {
      prompt += `TARGET ICP: ${script.name}\n`;
      if (script.demographics) {
        prompt += `ICP Demographics: ${script.demographics}\n`;
      }
      prompt += '\n';
    }

    // Add narrative anchors
    if (narrativeContents.length > 0) {
      prompt += `NARRATIVE ANCHORS TO INCORPORATE:\n`;
      narrativeContents.forEach((content, index) => {
        prompt += `${index + 1}. ${content}\n`;
      });
      prompt += '\n';
    }

    // Add author context
    if (author) {
      prompt += `AUTHOR CONTEXT:\n`;
      prompt += `Name: ${author.name}\n`;
      if (author.title) prompt += `Title: ${author.title}\n`;
      if (author.organization) prompt += `Organization: ${author.organization}\n`;
      if (author.backstory) prompt += `Background: ${author.backstory}\n`;
      
      // Add tone and experience
      if (props.selectedAuthorTone && author.tones) {
        const tone = author.tones.find(t => t.id === props.selectedAuthorTone);
        if (tone) prompt += `Writing Tone: ${tone.tone} - ${tone.description}\n`;
      }
      if (props.selectedAuthorExperience && author.experiences) {
        const experience = author.experiences.find(e => e.id === props.selectedAuthorExperience);
        if (experience) prompt += `Experience Context: ${experience.title} - ${experience.description}\n`;
      }
      prompt += '\n';
    }

    // Add success story
    if (successStory) {
      prompt += `SUCCESS STORY TO REFERENCE:\n`;
      prompt += `Title: ${successStory.title}\n`;
      prompt += `Before: ${successStory.beforeSummary}\n`;
      prompt += `After: ${successStory.afterSummary}\n`;
      if (successStory.quotes.length > 0) {
        prompt += `Quote: "${successStory.quotes[0].quote}" - ${successStory.quotes[0].author}\n`;
      }
      prompt += '\n';
    }

    // Add content goal
    prompt += `CONTENT GOAL: ${props.contentGoal.description}\n\n`;

    // Add additional context
    if (props.additionalContext && !props.additionalContext.startsWith('Based on saved idea:')) {
      prompt += `ADDITIONAL CONTEXT:\n${props.additionalContext}\n\n`;
    }

    prompt += `INSTRUCTIONS:
1. Write engaging, narrative-driven content that resonates with the target audience
2. Incorporate the narrative anchors naturally into the story
3. Use the author's voice and expertise authentically
4. Include specific, actionable insights
5. End with a compelling call-to-action aligned with the content goal
6. Make it feel personal and credible, not templated
7. Use storytelling techniques to build engagement

Write the complete ${props.contentType} content now:`;

    return prompt;
  };

  return {
    buildPrompt
  };
};
