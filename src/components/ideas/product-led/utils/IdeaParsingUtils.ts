
import { IdeaScore } from '@/types/ideas';

export interface ParsedIdea {
  tempId: string;
  title: string;
  narrative: string;
  productTieIn: string;
  cta: string;
  originalContent: string;
}

export interface IdeaWithScore extends ParsedIdea {
  score?: IdeaScore;
}

const cleanText = (text: string): string => {
  return text
    .replace(/\*\*/g, '') // Remove bold markdown
    .replace(/\*/g, '')   // Remove italic markdown
    .replace(/^[-•]\s*/, '') // Remove bullet points
    .trim();
};

const extractSection = (content: string, sectionName: string): string => {
  // Look for section headers like "Title:", "Narrative:", "Product Tie-in:", "CTA:"
  const patterns = [
    new RegExp(`${sectionName}[\\s\\-–:]+([^\\n]*(?:\\n(?!(?:Title|Narrative|Product\\s*Tie[-\\s]*in|CTA)[\\s\\-–:]).*)*)`, 'i'),
    new RegExp(`^${sectionName}[\\s\\-–:]+(.+)$`, 'im'),
    new RegExp(`\\b${sectionName}[\\s\\-–:]+([^\\n]+)`, 'i')
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return cleanText(match[1]);
    }
  }

  return '';
};

export const parseIdeas = (generatedIdeas: string[]): IdeaWithScore[] => {
  console.log('🔄 Parsing ideas:', { totalIdeas: generatedIdeas.length });
  
  return generatedIdeas.map((ideaContent, index) => {
    const tempId = `temp_${Date.now()}_${index}`;
    
    console.log(`🔍 Parsing idea ${index + 1}:`, ideaContent.substring(0, 200) + '...');
    
    // Extract each section
    const title = extractSection(ideaContent, 'Title') || `Idea ${index + 1}`;
    const narrative = extractSection(ideaContent, 'Narrative') || extractSection(ideaContent, 'Story') || extractSection(ideaContent, 'Background');
    const productTieIn = extractSection(ideaContent, 'Product Tie-in') || extractSection(ideaContent, 'Product Tie-In') || extractSection(ideaContent, 'Product Connection');
    const cta = extractSection(ideaContent, 'CTA') || extractSection(ideaContent, 'Call to Action') || extractSection(ideaContent, 'Call-to-Action');

    console.log(`✅ Parsed idea ${index + 1}:`, {
      title: title.substring(0, 50) + '...',
      narrative: narrative.substring(0, 50) + '...',
      productTieIn: productTieIn.substring(0, 50) + '...',
      cta: cta.substring(0, 50) + '...'
    });

    return {
      tempId,
      title,
      narrative,
      productTieIn,
      cta,
      originalContent: ideaContent,
    };
  });
};
