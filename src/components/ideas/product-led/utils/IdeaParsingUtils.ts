
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

export const SCORE_OPTIONS: IdeaScore[] = [
  { value: 0, label: '0 - Poor' },
  { value: 1, label: '1 - Fair' },
  { value: 2, label: '2 - Good' },
  { value: 3, label: '3 - Excellent' }
];

const cleanText = (text: string): string => {
  return text
    .replace(/\*\*/g, '') // Remove bold markdown
    .replace(/\*/g, '')   // Remove italic markdown
    .replace(/^[-•]\s*/, '') // Remove bullet points
    .replace(/^\d+\.\s*/, '') // Remove numbered list markers
    .trim();
};

const extractSection = (content: string, sectionName: string): string => {
  console.log(`🔍 Extracting section "${sectionName}" from content:`, content.substring(0, 200) + '...');
  
  // Enhanced patterns to catch various formats
  const patterns = [
    // Standard format: "Title: content" or "Title – content"
    new RegExp(`^${sectionName}[\\s\\-–:]+(.+?)(?=\\n(?:Title|Narrative|Product\\s*Tie[-\\s]*in|CTA)[\\s\\-–:]|$)`, 'ims'),
    // Bold format: "**Title:** content"
    new RegExp(`\\*\\*${sectionName}[\\s\\-–:]*\\*\\*[\\s]*(.+?)(?=\\n\\*\\*(?:Title|Narrative|Product\\s*Tie[-\\s]*in|CTA)|$)`, 'ims'),
    // Numbered format: "1. Title: content"
    new RegExp(`^\\d+\\.\\s*${sectionName}[\\s\\-–:]+(.+?)(?=\\n\\d+\\.|\\n(?:Title|Narrative|Product\\s*Tie[-\\s]*in|CTA)[\\s\\-–:]|$)`, 'ims'),
    // Line break format where content is on next line
    new RegExp(`^${sectionName}[\\s\\-–:]*\\n(.+?)(?=\\n(?:Title|Narrative|Product\\s*Tie[-\\s]*in|CTA)[\\s\\-–:]|$)`, 'ims'),
    // Simple format: just "section: content" on same line
    new RegExp(`${sectionName}[\\s\\-–:]+([^\\n]+)`, 'i')
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const cleaned = cleanText(match[1]);
      console.log(`✅ Found "${sectionName}":`, cleaned.substring(0, 100) + '...');
      return cleaned;
    }
  }

  console.log(`❌ Section "${sectionName}" not found`);
  return '';
};

const fallbackExtraction = (content: string, index: number): ParsedIdea => {
  console.log('⚠️ Using fallback extraction for idea', index + 1);
  
  // Split content into lines and try to extract meaningful parts
  const lines = content.split('\n').filter(line => line.trim());
  
  let title = `Idea ${index + 1}`;
  let narrative = '';
  let productTieIn = '';
  let cta = '';
  
  // Try to find the first substantive line as title
  const firstMeaningfulLine = lines.find(line => 
    line.trim().length > 10 && 
    !line.match(/^(title|narrative|product|cta)/i)
  );
  
  if (firstMeaningfulLine) {
    title = cleanText(firstMeaningfulLine);
  }
  
  // Use remaining content as narrative
  const remainingContent = lines.slice(1).join(' ').trim();
  if (remainingContent) {
    narrative = cleanText(remainingContent).substring(0, 200) + '...';
  }
  
  return {
    tempId: `temp_${Date.now()}_${index}`,
    title,
    narrative,
    productTieIn,
    cta,
    originalContent: content,
  };
};

export const parseIdeas = (generatedIdeas: string[]): IdeaWithScore[] => {
  console.log('🔄 Parsing ideas:', { totalIdeas: generatedIdeas.length });
  
  return generatedIdeas.map((ideaContent, index) => {
    const tempId = `temp_${Date.now()}_${index}`;
    
    console.log(`🔍 Parsing idea ${index + 1}:`, ideaContent.substring(0, 200) + '...');
    
    // Extract each section with improved patterns
    const title = extractSection(ideaContent, 'Title') || 
                  extractSection(ideaContent, 'Headline') ||
                  extractSection(ideaContent, 'Name');
    
    const narrative = extractSection(ideaContent, 'Narrative') || 
                     extractSection(ideaContent, 'Story') || 
                     extractSection(ideaContent, 'Background') ||
                     extractSection(ideaContent, 'Context');
    
    const productTieIn = extractSection(ideaContent, 'Product Tie-in') || 
                        extractSection(ideaContent, 'Product Tie-In') || 
                        extractSection(ideaContent, 'Product Connection') ||
                        extractSection(ideaContent, 'Product Value');
    
    const cta = extractSection(ideaContent, 'CTA') || 
               extractSection(ideaContent, 'Call to Action') || 
               extractSection(ideaContent, 'Call-to-Action') ||
               extractSection(ideaContent, 'Action');

    // If we couldn't extract meaningful content, use fallback
    if (!title && !narrative && !productTieIn && !cta) {
      console.log('❌ Failed to extract sections, using fallback');
      return fallbackExtraction(ideaContent, index);
    }

    console.log(`✅ Parsed idea ${index + 1}:`, {
      title: title.substring(0, 50) + '...',
      narrative: narrative.substring(0, 50) + '...',
      productTieIn: productTieIn.substring(0, 50) + '...',
      cta: cta.substring(0, 50) + '...'
    });

    return {
      tempId,
      title: title || `Idea ${index + 1}`,
      narrative: narrative || 'Content extracted from generated idea',
      productTieIn: productTieIn || 'Product connection to be defined',
      cta: cta || 'Call to action to be added',
      originalContent: ideaContent,
    };
  });
};
