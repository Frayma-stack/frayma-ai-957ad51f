import { ICPStoryScript, Author, CustomerSuccessStory, NarrativeSelection } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

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
  const getSelectedICPScript = () => {
    return scripts.find(script => script.id === selectedICP);
  };

  const getSelectedAuthor = () => {
    return authors.find(author => author.id === selectedAuthor);
  };
  
  const getSelectedSuccessStory = () => {
    if (selectedSuccessStory === "none") return undefined;
    return successStories.find(story => story.id === selectedSuccessStory);
  };

  const getAuthorTones = () => {
    const author = getSelectedAuthor();
    return author?.tones || [];
  };

  const getAuthorExperiences = () => {
    const author = getSelectedAuthor();
    return author?.experiences || [];
  };

  const getSelectedNarrativeContents = () => {
    const result: string[] = [];
    
    narrativeSelections.forEach(selection => {
      const items = getNarrativeItems(selection.type);
      selection.items.forEach(itemId => {
        const item = items.find(i => i.id === itemId);
        if (item) {
          result.push(item.content);
        }
      });
    });
    
    return result;
  };

  const getNarrativeItems = (type: 'belief' | 'pain' | 'struggle' | 'transformation') => {
    const script = getSelectedICPScript();
    if (!script) return [];

    switch (type) {
      case 'belief':
        return script.coreBeliefs.map(item => ({ id: item.id, content: item.content }));
      case 'pain':
        return script.internalPains.map(item => ({ id: item.id, content: item.content }));
      case 'struggle':
        return script.externalStruggles.map(item => ({ id: item.id, content: item.content }));
      case 'transformation':
        return script.desiredTransformations.map(item => ({ id: item.id, content: item.content }));
      default:
        return [];
    }
  };

  const generateEmailContent = (script: ICPStoryScript | undefined, author: Author, successStory?: CustomerSuccessStory | undefined, selectedIdea?: GeneratedIdea | null) => {
    let content = "";
    
    if (selectedIdea) {
      // Generate content based on the selected idea
      content = `Subject: ${selectedIdea.title}\n\n`;
      content += `Hi {{First Name}},\n\n`;
      
      if (selectedIdea.narrative) {
        content += `${selectedIdea.narrative}\n\n`;
      }
      
      if (selectedIdea.productTieIn) {
        content += `${selectedIdea.productTieIn}\n\n`;
      }
      
      if (successStory) {
        content += `We've helped companies like ${successStory.title} achieve similar results. ${successStory.afterSummary}\n\n`;
      }
      
      if (selectedIdea.cta) {
        content += `${selectedIdea.cta}\n\n`;
      } else {
        content += `Would you be interested in learning more about how this could work for your team?\n\n`;
      }
    } else {
      // Generate content using the original logic
      const narrativeContent = getSelectedNarrativeContents();
      
      content = `Subject: Quick question about ${narrativeSelections[0]?.type === 'struggle' ? 'handling' : 'addressing'} ${script?.name || 'your'} challenges\n\n`;
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

  const generateLinkedInContent = (script: ICPStoryScript | undefined, author: Author, successStory?: CustomerSuccessStory | undefined, selectedIdea?: GeneratedIdea | null) => {
    let content = "";
    
    if (selectedIdea) {
      // Generate content based on the selected idea
      content = `# ${selectedIdea.title}\n\n`;
      
      if (selectedIdea.narrative) {
        content += `${selectedIdea.narrative}\n\n`;
      }
      
      if (selectedIdea.productTieIn) {
        content += `${selectedIdea.productTieIn}\n\n`;
      }
      
      if (successStory) {
        content += `Case in point: ${successStory.title}\n\n`;
        content += `Before: ${successStory.beforeSummary}\n\n`;
        content += `After: ${successStory.afterSummary}\n\n`;
        
        if (successStory.quotes.length > 0) {
          content += `"${successStory.quotes[0].quote}" - ${successStory.quotes[0].author}, ${successStory.quotes[0].title}\n\n`;
        }
      }
      
      if (selectedIdea.cta) {
        content += `${selectedIdea.cta}\n\n`;
      } else {
        content += `What's your take on this? Share your thoughts in the comments.\n\n`;
      }
    } else {
      // Generate content using the original logic
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

  const generateCustomContent = (script: ICPStoryScript | undefined, author: Author, successStory?: CustomerSuccessStory | undefined, selectedIdea?: GeneratedIdea | null) => {
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

  return {
    getSelectedICPScript,
    getSelectedAuthor,
    getSelectedSuccessStory,
    getAuthorTones,
    getAuthorExperiences,
    getSelectedNarrativeContents,
    generateEmailContent,
    generateLinkedInContent,
    generateCustomContent
  };
};
