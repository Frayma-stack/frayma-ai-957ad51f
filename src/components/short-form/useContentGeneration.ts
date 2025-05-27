
import { ICPStoryScript, Author, CustomerSuccessStory, NarrativeSelection } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { useIdeaSummary } from '@/hooks/useIdeaSummary';

type ContentGoal = 'book_call' | 'learn_more' | 'try_product' | 'reply' | 'visit_article';

interface UseContentGenerationProps {
  contentType: 'email' | 'linkedin' | 'custom';
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  narrativeSelections: NarrativeSelection[];
  selectedICP: string;
  selectedAuthor: string;
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  selectedSuccessStory: string;
  contentGoal: ContentGoal;
  wordCount: number;
  emailCount: number;
  additionalContext: string;
}

export const useContentGeneration = ({
  contentType,
  scripts,
  authors,
  successStories,
  narrativeSelections,
  selectedICP,
  selectedAuthor,
  selectedAuthorTone,
  selectedAuthorExperience,
  selectedSuccessStory,
  contentGoal,
  wordCount,
  emailCount,
  additionalContext
}: UseContentGenerationProps) => {
  const { generateContentTrigger } = useIdeaSummary();

  const getSelectedICPScript = () => {
    return scripts.find(script => script.id === selectedICP);
  };

  const getSelectedAuthor = () => {
    return authors.find(author => author.id === selectedAuthor);
  };

  const getSelectedSuccessStory = () => {
    if (selectedSuccessStory === 'none') return null;
    return successStories.find(story => story.id === selectedSuccessStory);
  };

  const generateBaseContent = (
    script: ICPStoryScript | undefined,
    author: Author,
    successStory: CustomerSuccessStory | null,
    selectedIdea: GeneratedIdea | null
  ) => {
    let content = "";

    // If using a saved idea, build content from that
    if (selectedIdea) {
      const ideaTrigger = generateContentTrigger(selectedIdea);
      content += `Using saved idea as foundation: ${ideaTrigger}\n\n`;
    }

    // Author information
    content += `Author: ${author.name}`;
    if (author.role) content += ` (${author.role})`;
    content += `\n${author.backstory}\n\n`;

    // Author tone and experience if selected
    if (selectedAuthorTone) {
      const tone = author.tones?.find(t => t.id === selectedAuthorTone);
      if (tone) content += `Writing tone: ${tone.tone}\n`;
    }
    if (selectedAuthorExperience) {
      const exp = author.experiences?.find(e => e.id === selectedAuthorExperience);
      if (exp) content += `Drawing from experience: ${exp.title} - ${exp.description}\n`;
    }

    // ICP information (only if not using a saved idea or if idea doesn't override)
    if (script && !selectedIdea) {
      content += `\nTarget ICP: ${script.name}\n`;
      content += `Demographics: ${script.demographics}\n\n`;

      // Narrative elements
      narrativeSelections.forEach(selection => {
        const items = selection.items.map(itemId => {
          let source;
          switch (selection.type) {
            case 'belief':
              source = script.coreBeliefs.find(item => item.id === itemId);
              break;
            case 'pain':
              source = script.internalPains.find(item => item.id === itemId);
              break;
            case 'struggle':
              source = script.externalStruggles.find(item => item.id === itemId);
              break;
            case 'transformation':
              source = script.desiredTransformations.find(item => item.id === itemId);
              break;
          }
          return source ? source.content : '';
        }).filter(Boolean);

        if (items.length > 0) {
          const typeLabel = {
            'belief': 'Core Beliefs',
            'pain': 'Internal Pains',
            'struggle': 'External Struggles',
            'transformation': 'Desired Transformations'
          }[selection.type];
          content += `${typeLabel}: ${items.join(', ')}\n`;
        }
      });
    }

    // Success story
    if (successStory) {
      content += `\nSuccess Story: ${successStory.title}\n`;
      content += `Before: ${successStory.beforeSummary}\n`;
      content += `After: ${successStory.afterSummary}\n`;
    }

    // Additional context
    if (additionalContext) {
      content += `\nAdditional Context: ${additionalContext}\n`;
    }

    return content;
  };

  const generateEmailContent = (
    script: ICPStoryScript | undefined,
    author: Author,
    successStory: CustomerSuccessStory | null,
    selectedIdea: GeneratedIdea | null
  ) => {
    const baseContent = generateBaseContent(script, author, successStory, selectedIdea);
    const goalText = contentGoal.replace('_', ' ');
    
    return `${baseContent}

Generate ${emailCount} sales email${emailCount > 1 ? 's' : ''} with the goal to ${goalText}.

Email Structure:
- Compelling subject line
- Personal opening
- Value proposition
- Clear call to action

Generated Email${emailCount > 1 ? 's' : ''}:

Subject: Transform Your Business with Proven Solutions

Hi [Name],

I noticed [company observation based on research]. Many companies in your position struggle with [relevant pain point from narrative].

${selectedIdea ? `This reminds me of an insight: ${selectedIdea.narrative}` : '[Narrative hook based on selected elements]'}

${successStory ? `We recently helped ${successStory.title} achieve similar results - they went from ${successStory.beforeSummary} to ${successStory.afterSummary}.` : ''}

${selectedIdea?.productTieIn || '[Product connection and value proposition]'}

Would you be interested in a brief conversation about how we could help you achieve similar results?

Best regards,
${author.name}

${selectedIdea?.cta || `[Call to action to ${goalText}]`}`;
  };

  const generateLinkedInContent = (
    script: ICPStoryScript | undefined,
    author: Author,
    successStory: CustomerSuccessStory | null,
    selectedIdea: GeneratedIdea | null
  ) => {
    const baseContent = generateBaseContent(script, author, successStory, selectedIdea);
    const goalText = contentGoal.replace('_', ' ');
    
    return `${baseContent}

Generate a LinkedIn post (~${wordCount} words) with the goal to ${goalText}.

Generated LinkedIn Post:

${selectedIdea ? selectedIdea.title : '[Compelling hook/question]'}

${selectedIdea ? selectedIdea.narrative : '[Opening story or insight]'}

${successStory ? `Just like when we worked with ${successStory.title} - they transformed from ${successStory.beforeSummary} to ${successStory.afterSummary}.` : ''}

Key takeaways:
• [Insight 1]
• [Insight 2] 
• [Insight 3]

${selectedIdea?.productTieIn || '[How this relates to your solution]'}

${selectedIdea?.cta || `What's your experience with [relevant topic]? ${goalText === 'book_call' ? 'Drop me a DM if you'd like to discuss.' : 'Share your thoughts below.'}`}

#[RelevantHashtag] #[IndustryHashtag] #[SolutionHashtag]`;
  };

  const generateCustomContent = (
    script: ICPStoryScript | undefined,
    author: Author,
    successStory: CustomerSuccessStory | null,
    selectedIdea: GeneratedIdea | null
  ) => {
    const baseContent = generateBaseContent(script, author, successStory, selectedIdea);
    const goalText = contentGoal.replace('_', ' ');
    
    return `${baseContent}

Generate custom content (~${wordCount} words) with the goal to ${goalText}.

Generated Custom Content:

${selectedIdea ? `**${selectedIdea.title}**` : '**[Compelling Title]**'}

${selectedIdea ? selectedIdea.narrative : '[Opening narrative that resonates with your audience]'}

${successStory ? `This approach proved successful when we worked with ${successStory.title}. They experienced a transformation from ${successStory.beforeSummary} to ${successStory.afterSummary}.` : ''}

**Key Points:**
- [Main insight 1]
- [Main insight 2]
- [Main insight 3]

${selectedIdea?.productTieIn || '**The Solution:**\n[How your product/service addresses these challenges]'}

**Next Steps:**
${selectedIdea?.cta || `Ready to ${goalText}? [Specific call to action]`}`;
  };

  return {
    getSelectedICPScript,
    getSelectedAuthor,
    getSelectedSuccessStory,
    generateEmailContent,
    generateLinkedInContent,
    generateCustomContent
  };
};
