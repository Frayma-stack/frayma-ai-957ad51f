
import { ICPStoryScript, Author, CustomerSuccessStory } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentGoal } from '../types';

interface UseLinkedInContentGeneratorProps {
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  additionalContext: string;
  contentGoal: ContentGoal;
  getAuthorTones: () => any[];
  getAuthorExperiences: () => any[];
  getSelectedNarrativeContents: () => string[];
}

export const useLinkedInContentGenerator = ({
  selectedAuthorTone,
  selectedAuthorExperience,
  additionalContext,
  contentGoal,
  getAuthorTones,
  getAuthorExperiences,
  getSelectedNarrativeContents
}: UseLinkedInContentGeneratorProps) => {
  const generateLinkedInContent = (
    script: ICPStoryScript | undefined, 
    author: Author, 
    successStory?: CustomerSuccessStory | undefined, 
    selectedIdea?: GeneratedIdea | null
  ) => {
    let content = "";
    
    if (selectedIdea) {
      // Enhanced content generation based on saved idea
      content = `# ${selectedIdea.title}\n\n`;
      
      // Add author context if available
      if (selectedAuthorTone || selectedAuthorExperience) {
        content += "As someone ";
        
        if (selectedAuthorExperience) {
          const experience = getAuthorExperiences().find(exp => exp.id === selectedAuthorExperience);
          if (experience) {
            content += `with ${experience.title}, `;
          }
        }
        
        if (selectedAuthorTone) {
          const tone = getAuthorTones().find(t => t.id === selectedAuthorTone);
          if (tone) {
            content += `who approaches these topics in a ${tone.tone} way, `;
          }
        }
        
        content += "I want to share an important insight.\n\n";
      }
      
      if (selectedIdea.narrative) {
        content += `${selectedIdea.narrative}\n\n`;
      }
      
      // Add strategic insights based on ICP context
      if (script) {
        content += `For ${script.name} professionals, this insight is particularly relevant because it addresses a common challenge in our industry.\n\n`;
      }
      
      if (selectedIdea.productTieIn) {
        content += `Here's what I've learned: ${selectedIdea.productTieIn}\n\n`;
      }
      
      if (successStory) {
        content += `Case in point: ${successStory.title}\n\n`;
        content += `Before: ${successStory.beforeSummary}\n\n`;
        content += `After: ${successStory.afterSummary}\n\n`;
        
        if (successStory.quotes.length > 0) {
          content += `"${successStory.quotes[0].quote}" - ${successStory.quotes[0].author}, ${successStory.quotes[0].title}\n\n`;
        }
      }
      
      content += `Key takeaways:\n`;
      content += `• Focus on [key insight from the idea]\n`;
      content += `• Implement [strategic approach]\n`;
      content += `• Measure [important metric]\n\n`;
      
      if (selectedIdea.cta) {
        content += `${selectedIdea.cta}\n\n`;
      } else {
        content += `${contentGoal === 'book_call' ? 'Interested in discussing how this applies to your situation? DM me.' : 
        contentGoal === 'learn_more' ? 'Want to dive deeper into this topic? Check out the link in comments.' : 
        contentGoal === 'try_product' ? 'Ready to see this in action? Try our assessment tool (link in comments).' : 
        'What's your experience with this challenge? Share your thoughts below.'}\n\n`;
      }
    } else {
      // Original logic for non-idea based content
      const narrativeContent = getSelectedNarrativeContents();
      
      content = `# The ${script?.name || 'Industry'} Challenge No One's Talking About\n\n`;
      
      if (selectedAuthorTone || selectedAuthorExperience) {
        content += "As someone ";
        
        if (selectedAuthorExperience) {
          const experience = getAuthorExperiences().find(exp => exp.id === selectedAuthorExperience);
          if (experience) {
            content += `with ${experience.title}, `;
          }
        }
        
        if (selectedAuthorTone) {
          const tone = getAuthorTones().find(t => t.id === selectedAuthorTone);
          if (tone) {
            content += `who approaches these topics in a ${tone.tone} way, `;
          }
        }
        
        content += "I want to highlight an important issue.\n\n";
      }
      
      if (narrativeContent.length > 0) {
        content += `${narrativeContent[0]}\n\n`;
        
        if (narrativeContent.length > 1) {
          content += `And that's not all. ${narrativeContent[1]}\n\n`;
        }
      }

      content += `But what if there was a better way?\n\n`;

      if (successStory) {
        content += `We recently worked with ${successStory.title} who was facing this exact challenge.\n\n`;
        content += `Before: ${successStory.beforeSummary}\n\n`;
        content += `After: ${successStory.afterSummary}\n\n`;
        
        if (successStory.quotes.length > 0) {
          content += `"${successStory.quotes[0].quote}" - ${successStory.quotes[0].author}, ${successStory.quotes[0].title}\n\n`;
        }
      }

      if (additionalContext && !additionalContext.startsWith('Based on saved idea:')) {
        content += `${additionalContext}\n\n`;
      } else {
        content += `After working with dozens of ${script?.name || 'companies'}, we've discovered that the most successful teams approach this differently:\n\n`;
      }

      content += `1. They focus on [key insight]\n`;
      content += `2. They implement [key process]\n`;
      content += `3. They measure [key metric]\n\n`;
      
      content += `The results?\n`;
      content += `• [Result 1]\n`;
      content += `• [Result 2]\n`;
      content += `• [Result 3]\n\n`;

      content += `Want to learn how your team can achieve similar results?\n\n`;

      content += `${contentGoal === 'book_call' ? 'DM me to set up a quick call.' : 
      contentGoal === 'learn_more' ? 'Check out our latest guide (link in comments).' : 
      contentGoal === 'try_product' ? 'Try our free assessment tool (link in comments).' : 
      'Comment below with your biggest challenge in this area.'}\n\n`;
    }

    content += `#${script?.name.replace(/\s+/g, '') || 'Leadership'} #Leadership #Innovation`;
    
    return content;
  };

  return { generateLinkedInContent };
};
