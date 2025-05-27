
import { GeneratedIdea, IdeaScore } from '@/types/ideas';

export interface ParsedIdea {
  title: string;
  narrative: string;
  productTieIn: string;
  cta: string;
  originalContent: string;
}

export interface IdeaWithScore extends ParsedIdea {
  score: IdeaScore | null;
  tempId: string;
}

export const SCORE_OPTIONS: IdeaScore[] = [
  { value: 0, label: "0 - Won't propel business" },
  { value: 1, label: "1 - Somewhat useful" },
  { value: 2, label: "2 - Very promising" },
  { value: 3, label: "3 - Can't auto-craft without it" }
];

export const parseIdeas = (ideas: string[]): IdeaWithScore[] => {
  console.log('Raw generated ideas:', ideas);
  
  return ideas
    .filter(idea => {
      const trimmed = idea.trim();
      // More lenient filtering - just check for substantial content
      return trimmed && trimmed.length > 50;
    })
    .map((idea, index) => {
      console.log(`Parsing idea ${index + 1}:`, idea);
      
      // Split by double line breaks first to get potential idea blocks
      const blocks = idea.split(/\n\s*\n/).filter(block => block.trim());
      
      // Try to find the main idea block that contains all sections
      let mainBlock = idea;
      for (const block of blocks) {
        if (block.toLowerCase().includes('title') && 
            (block.toLowerCase().includes('narrative') || 
             block.toLowerCase().includes('product tie-in') || 
             block.toLowerCase().includes('cta'))) {
          mainBlock = block;
          break;
        }
      }
      
      console.log(`Main block for idea ${index + 1}:`, mainBlock);
      
      // Extract sections using more flexible regex patterns
      const extractSection = (text: string, sectionName: string): string => {
        // Try multiple patterns for section extraction
        const patterns = [
          new RegExp(`${sectionName}[\\s\\-–:]+(.+?)(?=\\n(?:Title|Narrative|Product Tie-in|CTA)[\\s\\-–:]|$)`, 'is'),
          new RegExp(`${sectionName}[\\s\\-–:]+(.+?)(?=\\n\\w+[\\s\\-–:]|$)`, 'is'),
          new RegExp(`${sectionName}[\\s\\-–:]+([\\s\\S]+?)(?=\\n(?:Title|Narrative|Product Tie-in|CTA)|$)`, 'i')
        ];
        
        for (const pattern of patterns) {
          const match = text.match(pattern);
          if (match && match[1]) {
            const extracted = match[1].trim();
            console.log(`Extracted ${sectionName}:`, extracted);
            return extracted;
          }
        }
        
        console.log(`No match found for ${sectionName}`);
        return '';
      };
      
      const title = extractSection(mainBlock, 'Title') || 
                   extractSection(mainBlock, 'TITLE') || 
                   `Untitled Idea ${index + 1}`;
      
      const narrative = extractSection(mainBlock, 'Narrative') || 
                       extractSection(mainBlock, 'NARRATIVE') || '';
      
      const productTieIn = extractSection(mainBlock, 'Product Tie-in') || 
                          extractSection(mainBlock, 'Product Tie-In') || 
                          extractSection(mainBlock, 'PRODUCT TIE-IN') || '';
      
      const cta = extractSection(mainBlock, 'CTA') || 
                 extractSection(mainBlock, 'Call to Action') || '';

      const parsedIdea = {
        title,
        narrative,
        productTieIn,
        cta,
        originalContent: idea,
        score: null,
        tempId: `temp-${index}-${Date.now()}`
      };
      
      console.log(`Parsed idea ${index + 1}:`, parsedIdea);
      return parsedIdea;
    });
};
