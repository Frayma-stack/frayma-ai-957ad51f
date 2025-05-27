
import { ICPStoryScript, Author, CustomerSuccessStory } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentGoal } from '../types';

interface UseCustomContentGeneratorProps {
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  additionalContext: string;
  contentGoal: ContentGoal;
  triggerInput: string;
  getAuthorTones: () => any[];
  getAuthorExperiences: () => any[];
  getSelectedNarrativeContents: () => string[];
}

export const useCustomContentGenerator = ({
  selectedAuthorTone,
  selectedAuthorExperience,
  additionalContext,
  contentGoal,
  triggerInput,
  getAuthorTones,
  getAuthorExperiences,
  getSelectedNarrativeContents
}: UseCustomContentGeneratorProps) => {
  const generateCustomContent = (
    script: ICPStoryScript | undefined, 
    author: Author, 
    successStory?: CustomerSuccessStory | undefined, 
    selectedIdea?: GeneratedIdea | null,
    customTrigger?: string
  ) => {
    let content = "";
    
    // Use custom trigger if provided, otherwise use saved idea or narrative content
    const trigger = customTrigger || triggerInput;
    
    if (trigger || selectedIdea) {
      // Enhanced content generation based on trigger or saved idea
      const title = selectedIdea?.title || "Custom Content";
      content = `# ${title}\n\n`;
      
      // Add author introduction
      content += `By ${author.name}`;
      if (author.role || author.organization) {
        content += ` - ${author.role || ''}${author.role && author.organization ? ', ' : ''}${author.organization || ''}`;
      }
      content += `\n\n`;
      
      // Add author context if available
      if (selectedAuthorTone || selectedAuthorExperience) {
        content += "From my perspective ";
        
        if (selectedAuthorExperience) {
          const experience = getAuthorExperiences().find(exp => exp.id === selectedAuthorExperience);
          if (experience) {
            content += `as someone with ${experience.title}, `;
          }
        }
        
        if (selectedAuthorTone) {
          const tone = getAuthorTones().find(t => t.id === selectedAuthorTone);
          if (tone) {
            content += `and with a ${tone.tone} approach to communication, `;
          }
        }
        
        content += "I want to share some important insights.\n\n";
      }
      
      // Use trigger input or idea narrative
      if (trigger) {
        content += `## The Core Insight\n\n${trigger}\n\n`;
      } else if (selectedIdea?.narrative) {
        content += `## The Core Insight\n\n${selectedIdea.narrative}\n\n`;
      }
      
      // Add strategic context
      if (script) {
        content += `## Why This Matters for ${script.name} Professionals\n\n`;
        content += `This insight is particularly relevant for our community because it addresses fundamental challenges we face in driving meaningful outcomes.\n\n`;
      }
      
      // Add product tie-in if from saved idea
      if (selectedIdea?.productTieIn) {
        content += `## What I've Learned\n\n${selectedIdea.productTieIn}\n\n`;
      }
      
      // Add success story context
      if (successStory) {
        content += `## Real-World Application\n\n`;
        content += `Consider the case of ${successStory.title}:\n\n`;
        content += `**Before:** ${successStory.beforeSummary}\n\n`;
        content += `**After:** ${successStory.afterSummary}\n\n`;
        
        if (successStory.quotes.length > 0) {
          content += `**Their Perspective:**\n`;
          content += `"${successStory.quotes[0].quote}"\n`;
          content += `— ${successStory.quotes[0].author}, ${successStory.quotes[0].title}\n\n`;
        }
      }
      
      // Add actionable insights
      content += `## Key Takeaways\n\n`;
      content += `1. **Focus:** Start with understanding the core challenge\n`;
      content += `2. **Approach:** Implement systematic changes\n`;
      content += `3. **Measure:** Track meaningful progress indicators\n\n`;
      
      // Add CTA based on saved idea or content goal
      content += `## Next Steps\n\n`;
      if (selectedIdea?.cta) {
        content += `${selectedIdea.cta}`;
      } else {
        const ctaText = contentGoal === 'book_call' ? 'If you\'d like to discuss how this applies to your specific situation, I\'d be happy to schedule a conversation.' : 
          contentGoal === 'learn_more' ? 'For more detailed insights on this topic, I\'ve prepared additional resources.' : 
          contentGoal === 'try_product' ? 'To see these principles in action, I can walk you through a practical demonstration.' : 
          'I\'m curious about your experience with these challenges. What has worked best in your context?';
        content += ctaText;
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
