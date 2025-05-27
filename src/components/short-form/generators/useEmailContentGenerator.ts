
import { ICPStoryScript, Author, CustomerSuccessStory } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentGoal } from '../types';

interface UseEmailContentGeneratorProps {
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  additionalContext: string;
  emailCount: number;
  contentGoal: ContentGoal;
  triggerInput: string;
  getAuthorTones: () => any[];
  getAuthorExperiences: () => any[];
  getSelectedNarrativeContents: () => string[];
}

export const useEmailContentGenerator = ({
  selectedAuthorTone,
  selectedAuthorExperience,
  additionalContext,
  emailCount,
  contentGoal,
  triggerInput,
  getAuthorTones,
  getAuthorExperiences,
  getSelectedNarrativeContents
}: UseEmailContentGeneratorProps) => {
  const generateEmailContent = (
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
      // Enhanced email generation based on trigger or saved idea
      const subject = selectedIdea?.title || "Insight worth sharing";
      content = `Subject: ${subject}\n\n`;
      content += `Hi {{First Name}},\n\n`;
      
      // Add personalized opening based on author context
      if (selectedAuthorTone || selectedAuthorExperience) {
        content += "I was reflecting on ";
        
        if (selectedAuthorExperience) {
          const experience = getAuthorExperiences().find(exp => exp.id === selectedAuthorExperience);
          if (experience) {
            content += `my experience in ${experience.title} `;
          }
        }
        
        content += "and wanted to share an insight that might be valuable for you.\n\n";
      }
      
      // Use trigger input or idea narrative
      if (trigger) {
        content += `${trigger}\n\n`;
      } else if (selectedIdea?.narrative) {
        content += `${selectedIdea.narrative}\n\n`;
      }
      
      // Add ICP-specific context
      if (script) {
        content += `I know that as a ${script.name} professional, you're likely dealing with similar challenges.\n\n`;
      }
      
      // Add product tie-in if from saved idea
      if (selectedIdea?.productTieIn) {
        content += `Here's what I've discovered: ${selectedIdea.productTieIn}\n\n`;
      }
      
      if (successStory) {
        content += `We've helped companies like ${successStory.title} navigate this exact situation. ${successStory.afterSummary}\n\n`;
        
        if (successStory.quotes.length > 0) {
          content += `As their ${successStory.quotes[0].title} put it: "${successStory.quotes[0].quote}"\n\n`;
        }
      }
      
      // Add CTA based on saved idea or content goal
      if (selectedIdea?.cta) {
        content += `${selectedIdea.cta}\n\n`;
      } else {
        content += `${contentGoal === 'book_call' ? 'Would you be interested in a brief call to discuss how this might apply to your situation?' : 
        contentGoal === 'learn_more' ? 'I\'d be happy to share more details about how this approach works.' : 
        contentGoal === 'try_product' ? 'Would you like to see how this works in practice? I can show you a quick demo.' :
        'I\'d love to hear your thoughts on this approach.'}\n\n`;
      }
    } else {
      // Original logic for non-idea based content
      const narrativeContent = getSelectedNarrativeContents();
      
      content = `Subject: Quick question about ${script?.name || 'your'} challenges\n\n`;
      content += `Hi {{First Name}},\n\n`;
      content += `I was looking at your recent work at {{Company}} and noticed you're focused on improving your team's ${script?.name.toLowerCase() || 'operations'}.\n\n`;
      
      if (selectedAuthorTone || selectedAuthorExperience) {
        content += "As someone ";
        
        if (selectedAuthorExperience) {
          const experience = getAuthorExperiences().find(exp => exp.id === selectedAuthorExperience);
          if (experience) {
            content += `with experience in ${experience.title}, `;
          }
        }
        
        if (selectedAuthorTone) {
          const tone = getAuthorTones().find(t => t.id === selectedAuthorTone);
          if (tone) {
            content += `who communicates in a ${tone.tone} manner, `;
          }
        }
        
        content += "I wanted to reach out personally.\n\n";
      }
      
      if (narrativeContent.length > 0) {
        content += `${narrativeContent[0]}\n\n`;
      }

      if (successStory) {
        content += `We've helped companies like ${successStory.title} overcome this exact challenge. ${successStory.afterSummary}\n\n`;
      } else {
        content += `We've helped dozens of ${script?.name || 'similar'} teams overcome this exact challenge. In fact, one client recently [specific result they achieved].\n\n`;
      }

      if (additionalContext && !additionalContext.startsWith('Based on saved idea:')) {
        content += `${additionalContext}\n\n`;
      }

      content += `Would you be open to a quick 15-minute call to explore how we might be able to help your team too?\n\n`;
    }
    
    content += `Best regards,\n${author.name}\n`;
    content += `${author.role ? `${author.role}${author.organization ? `, ${author.organization}` : ''}` : ''}\n\n`;
    content += `P.S. If you'd prefer to learn more before chatting, here's a case study that might be helpful: [LINK]`;
    
    if (emailCount > 1 && !selectedIdea) {
      const narrativeContent = getSelectedNarrativeContents();
      for (let i = 1; i < emailCount; i++) {
        content += `\n\n------- FOLLOW-UP EMAIL ${i} -------\n\n`;
        
        content += `Subject: Following up: ${script?.name || 'your'} challenges\n\n`;
        content += `Hi {{First Name}},\n\n`;
        
        if (i === 1) {
          content += `I wanted to follow up on my previous email about addressing ${script?.name.toLowerCase() || 'your'} challenges.\n\n`;
          
          if (narrativeContent.length > i) {
            content += `${narrativeContent[i]}\n\n`;
          }
          
          content += `I'd love to share how we've helped similar companies overcome these challenges.\n\n`;
        } else {
          content += `I hope you've been well since my last message.\n\n`;
          content += `I understand you're busy, but I wanted to quickly share ${narrativeContent.length > i ? narrativeContent[i] : "another insight that might be valuable for you"}.\n\n`;
          content += `If any of this resonates with you, I'd be happy to schedule a brief call at your convenience.\n\n`;
        }
        
        content += `Best regards,\n${author.name}\n`;
        content += `${author.role ? `${author.role}${author.organization ? `, ${author.organization}` : ''}` : ''}`;
      }
    }
    
    return content;
  };

  return { generateEmailContent };
};
