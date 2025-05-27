
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
      // Enhanced custom content generation based on saved idea
      content = `# ${selectedIdea.title}\n\n`;
      content += `By ${author.name}, ${author.role}${author.organization ? ` at ${author.organization}` : ''}\n\n`;
      
      // Add author context section
      if (selectedAuthorTone || selectedAuthorExperience) {
        content += `*Author's perspective: `;
        
        if (selectedAuthorExperience) {
          const experience = getAuthorExperiences().find(exp => exp.id === selectedAuthorExperience);
          if (experience) {
            content += `Drawing from ${experience.title}`;
          }
        }
        
        if (selectedAuthorTone && selectedAuthorExperience) {
          content += ", ";
        }
        
        if (selectedAuthorTone) {
          const tone = getAuthorTones().find(t => t.id === selectedAuthorTone);
          if (tone) {
            content += `with a ${tone.tone} approach`;
          }
        }
        
        content += `.*\n\n`;
      }
      
      if (selectedIdea.narrative) {
        content += `## The Core Insight\n\n${selectedIdea.narrative}\n\n`;
      }
      
      // Add ICP-specific analysis
      if (script) {
        content += `## Why This Matters for ${script.name} Professionals\n\n`;
        content += `This insight is particularly relevant for ${script.name} teams because it addresses fundamental challenges in how we approach [relevant area].\n\n`;
      }
      
      if (selectedIdea.productTieIn) {
        content += `## Strategic Implications\n\n${selectedIdea.productTieIn}\n\n`;
      }
      
      if (successStory) {
        content += `## Customer Spotlight: ${successStory.title}\n\n`;
        content += `### The Challenge\n${successStory.beforeSummary}\n\n`;
        content += `### The Transformation\n${successStory.afterSummary}\n\n`;
        
        if (successStory.quotes.length > 0) {
          content += `### Client Testimonial\n\n`;
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
      
      content += `## Actionable Steps\n\n`;
      content += `Based on this insight, here are three immediate actions you can take:\n\n`;
      content += `1. **Assessment**: Evaluate your current approach against this framework\n`;
      content += `2. **Implementation**: Begin with [specific first step based on the idea]\n`;
      content += `3. **Measurement**: Track [relevant metrics] to quantify impact\n\n`;
      
      content += `## Next Steps\n\n`;
      
      if (selectedIdea.cta) {
        content += `${selectedIdea.cta}\n\n`;
      } else {
        content += `${contentGoal === 'book_call' ? 'Ready to explore how this insight applies to your specific situation? Let\'s schedule a consultation to discuss your unique challenges and opportunities.' : 
        contentGoal === 'learn_more' ? 'Want to dive deeper into this framework? Download our comprehensive implementation guide.' : 
        contentGoal === 'try_product' ? 'See this approach in action. Start with our assessment tool to understand your current position.' : 
        contentGoal === 'visit_article' ? 'For additional insights and case studies, explore our related resources.' :
        'We\'d love to hear about your experience implementing these strategies. Connect with us to share your story.'}\n\n`;
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
