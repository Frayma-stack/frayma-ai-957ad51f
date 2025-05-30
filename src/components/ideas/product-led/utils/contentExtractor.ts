
export const extractContentFromHeaderLine = (line: string): string => {
  // Remove common prefixes and extract the actual content
  let content = line
    .replace(/^[\d\.\-\*\+]\s*/, '') // Remove numbering/bullets
    .replace(/^(title|narrative|product|cta|call to action)[\:\-\s]*/i, '') // Remove section labels
    .trim();
  
  return content;
};

export const assignContentToSection = (
  section: string, 
  content: string, 
  current: { title: string; narrative: string; productTieIn: string; cta: string }
): { title: string; narrative: string; productTieIn: string; cta: string } => {
  const result = { ...current };
  
  switch (section) {
    case 'title':
      result.title = content;
      break;
    case 'narrative':
      result.narrative = content;
      break;
    case 'productTieIn':
      result.productTieIn = content;
      break;
    case 'cta':
      result.cta = content;
      break;
  }
  
  return result;
};
