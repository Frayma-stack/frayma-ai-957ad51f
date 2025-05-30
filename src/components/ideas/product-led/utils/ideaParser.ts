
import { ParsedIdea } from './types';
import { 
  isTitleSection, 
  isNarrativeSection, 
  isProductTieInSection, 
  isCtaSection 
} from './sectionDetectors';
import { extractContentFromHeaderLine, assignContentToSection } from './contentExtractor';

export const parseIdeaContent = (content: string): Omit<ParsedIdea, 'originalContent' | 'tempId'> => {
  // Initialize with empty values
  let title = '';
  let narrative = '';
  let productTieIn = '';
  let cta = '';

  // Split content into lines for easier parsing
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Try to identify sections using common patterns
  let currentSection = '';
  let sectionContent: string[] = [];
  
  for (const line of lines) {
    // Check if this line is a section header
    const lowerLine = line.toLowerCase();
    
    if (isTitleSection(lowerLine)) {
      if (currentSection && sectionContent.length > 0) {
        assignContentToSection(currentSection, sectionContent.join(' '), { title, narrative, productTieIn, cta });
      }
      currentSection = 'title';
      sectionContent = [];
      
      // Extract title content from the same line if it exists
      const titleContent = extractContentFromHeaderLine(line);
      if (titleContent) {
        sectionContent.push(titleContent);
      }
    } else if (isNarrativeSection(lowerLine)) {
      if (currentSection && sectionContent.length > 0) {
        const result = assignContentToSection(currentSection, sectionContent.join(' '), { title, narrative, productTieIn, cta });
        title = result.title;
        narrative = result.narrative;
        productTieIn = result.productTieIn;
        cta = result.cta;
      }
      currentSection = 'narrative';
      sectionContent = [];
      
      const narrativeContent = extractContentFromHeaderLine(line);
      if (narrativeContent) {
        sectionContent.push(narrativeContent);
      }
    } else if (isProductTieInSection(lowerLine)) {
      if (currentSection && sectionContent.length > 0) {
        const result = assignContentToSection(currentSection, sectionContent.join(' '), { title, narrative, productTieIn, cta });
        title = result.title;
        narrative = result.narrative;
        productTieIn = result.productTieIn;
        cta = result.cta;
      }
      currentSection = 'productTieIn';
      sectionContent = [];
      
      const productContent = extractContentFromHeaderLine(line);
      if (productContent) {
        sectionContent.push(productContent);
      }
    } else if (isCtaSection(lowerLine)) {
      if (currentSection && sectionContent.length > 0) {
        const result = assignContentToSection(currentSection, sectionContent.join(' '), { title, narrative, productTieIn, cta });
        title = result.title;
        narrative = result.narrative;
        productTieIn = result.productTieIn;
        cta = result.cta;
      }
      currentSection = 'cta';
      sectionContent = [];
      
      const ctaContent = extractContentFromHeaderLine(line);
      if (ctaContent) {
        sectionContent.push(ctaContent);
      }
    } else {
      // This is content for the current section
      if (line && !line.match(/^[\d\.\-\*\+]\s/)) { // Skip bullet points and numbering
        sectionContent.push(line);
      }
    }
  }
  
  // Handle the last section
  if (currentSection && sectionContent.length > 0) {
    const result = assignContentToSection(currentSection, sectionContent.join(' '), { title, narrative, productTieIn, cta });
    title = result.title;
    narrative = result.narrative;
    productTieIn = result.productTieIn;
    cta = result.cta;
  }
  
  // Fallback: if we couldn't parse structured content, try to extract a basic title
  if (!title && !narrative && !productTieIn && !cta) {
    // Use the first meaningful line as title and the rest as narrative
    const meaningfulLines = lines.filter(line => line.length > 10);
    if (meaningfulLines.length > 0) {
      title = meaningfulLines[0];
      if (meaningfulLines.length > 1) {
        narrative = meaningfulLines.slice(1).join(' ');
      }
    } else {
      title = lines[0] || 'Generated Idea';
      narrative = lines.slice(1).join(' ') || content;
    }
  }

  return {
    title: title || 'Generated Idea',
    narrative: narrative || 'Narrative content to be developed',
    productTieIn: productTieIn || 'Product connection to be established',
    cta: cta || 'Call to action to be defined'
  };
};
