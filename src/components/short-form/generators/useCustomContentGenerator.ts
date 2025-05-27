
import { ICPStoryScript, Author, CustomerSuccessStory } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentGoal } from '../types';

interface UseCustomContentGeneratorProps {
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  additionalContext: string;
  contentGoal: ContentGoal;
  getAuthorTones: () => any[];
  getAuthorExperiences: () => any[];
  getSelectedNarrativeContents: () => string[];
}

export const useCustomContentGenerator = ({
  selectedAuthorTone,
  selectedAuthorExperience,
  additionalContext,
  contentGoal,
  getAuthorTones,
  getAuthorExperiences,
  getSelectedNarrativeContents
}: UseCustomContentGeneratorProps) => {
  const generateCustomContent = (
    script: ICPStoryScript | undefined, 
    author: Author, 
    successStory?: CustomerSuccessStory | undefined, 
    selectedIdea?: GeneratedIdea | null
  ) => {
    let content = "";
    
    if (selectedIdea) {
      // Generate content based on the selected idea
      content = `# ${selectedIdea.title}\n\n`;
      content += `By ${author.name}, ${author.role}${author.organization ? ` at ${author.organization}` : ''}\n\n`;
      
      if (selectedIdea.narrative) {
        content += `## Overview\n\n${selectedIdea.narrative}\n\n`;
      }
      
      if (selectedIdea.productTieIn) {
        content += `## Solution Approach\n\n${selectedIdea.productTieIn}\n\n`;
      }
      
      if (successStory) {
        content += `## Customer Spotlight: ${successStory.title}\n\n`;
        content += `### Before\n${successStory.beforeSummary}\n\n`;
        content += `### After\n${successStory.afterSummary}\n\n`;
        
        if (successStory.quotes.length > 0) {
          content += `> "${successStory.quotes[0].quote}"\n>\n> — ${successStory.quotes[0].author}, ${successStory.quotes[0].title}\n\n`;
        }
        
        if (successStory.features.length > 0) {
          content += `### Key Solutions Implemented\n\n`;
          successStory.features.forEach((feature, index) => {
            content += `${index + 1}. **${feature.name}**: ${feature.description}\n`;
          });
          content += `\n`;
        }
      }
      
      content += `## Next Steps\n\n`;
      
      if (selectedIdea.cta) {
        content += `${selectedIdea.cta}\n\n`;
      } else {
        content += `Ready to explore how this approach can work for your organization? Let's connect to discuss your specific situation.\n\n`;
      }
    } else {
      // Generate content using the original logic
      const narrativeContent = getSelectedNarrativeContents();
      
      content = `# ${script?.name || 'Industry Insights'}: Overcoming Key Challenges in Today's Market\n\n`;
      
      content += `By ${author.name}, ${author.role}${author.organization ? ` at ${author.organization}` : ''}\n\n`;
      
      if (selectedAuthorTone || selectedAuthorExperience) {
        content += "*About the author: ";
        
        if (selectedAuthorExperience) {
          const experience = getAuthorExperiences().find(exp => exp.id === selectedAuthorExperience);
          if (experience) {
            content += `With expertise in ${experience.title}`;
          }
        }
        
        if (selectedAuthorTone && selectedAuthorExperience) {
          content += ", ";
        }
        
        if (selectedAuthorTone) {
          const tone = getAuthorTones().find(t => t.id === selectedAuthorTone);
          if (tone) {
            content += `known for a ${tone.tone} perspective`;
          }
        }
        
        content += `.*\n\n`;
      }
      
      content += `## Introduction\n\n`;
      content += `In today's rapidly evolving landscape for ${script?.name || 'business'}, professionals face numerous challenges that can impact their effectiveness and results.\n\n`;
      
      content += `## Key Challenges\n\n`;
      
      narrativeContent.forEach((item, index) => {
        if (index < 3) {
          content += `### Challenge ${index + 1}\n\n`;
          content += `${item}\n\n`;
        }
      });

      if (successStory) {
        content += `## Customer Spotlight: ${successStory.title}\n\n`;
        content += `### Before\n${successStory.beforeSummary}\n\n`;
        content += `### After\n${successStory.afterSummary}\n\n`;
        
        if (successStory.quotes.length > 0) {
          content += `> "${successStory.quotes[0].quote}"\n>\n> — ${successStory.quotes[0].author}, ${successStory.quotes[0].title}\n\n`;
        }
        
        if (successStory.features.length > 0) {
          content += `### Key Solutions Implemented\n\n`;
          successStory.features.forEach((feature, index) => {
            content += `${index + 1}. **${feature.name}**: ${feature.description}\n`;
          });
          content += `\n`;
        }
      }
      
      if (additionalContext && !additionalContext.startsWith('Based on saved idea:')) {
        content += `## Additional Insights\n\n${additionalContext}\n\n`;
      }

      content += `## Solutions and Best Practices\n\n`;
      content += `Based on our experience working with leading ${script?.name || 'organizations'}, here are the approaches that consistently deliver results:\n\n`;
      content += `1. **Strategic Alignment**: Ensure your [specific approach] aligns with business objectives.\n`;
      content += `2. **Process Optimization**: Implement [specific process] to streamline operations.\n`;
      content += `3. **Measurement Framework**: Track [specific metrics] to quantify success.\n\n`;
      
      content += `## Next Steps\n\n`;
      
      content += `${contentGoal === 'book_call' ? 'Ready to transform your approach? Schedule a consultation with our team to discuss your specific challenges.' : 
      contentGoal === 'learn_more' ? 'Want to learn more? Download our comprehensive guide on this topic.' : 
      contentGoal === 'try_product' ? 'Experience the difference firsthand. Start your free trial today.' : 
      contentGoal === 'visit_article' ? 'For more insights, check out our related article on this topic.' :
      'Connect with us to discuss how these strategies can be applied to your specific situation.'}\n\n`;
    }
    
    return content;
  };

  return { generateCustomContent };
};
