
export const isTitleSection = (line: string): boolean => {
  return line.includes('title') || 
         line.includes('headline') || 
         Boolean(line.match(/^[\d\.\-\*\+]\s*title/i)) ||
         Boolean(line.match(/^title:/i));
};

export const isNarrativeSection = (line: string): boolean => {
  return line.includes('narrative') || 
         line.includes('story') || 
         line.includes('tension') ||
         line.includes('belief') ||
         Boolean(line.match(/^[\d\.\-\*\+]\s*narrative/i)) ||
         Boolean(line.match(/^narrative:/i));
};

export const isProductTieInSection = (line: string): boolean => {
  return line.includes('product') || 
         line.includes('tie-in') || 
         line.includes('tie in') ||
         line.includes('solution') ||
         Boolean(line.match(/^[\d\.\-\*\+]\s*product/i)) ||
         Boolean(line.match(/^product.*:/i));
};

export const isCtaSection = (line: string): boolean => {
  return line.includes('cta') || 
         line.includes('call to action') || 
         line.includes('action') ||
         Boolean(line.match(/^[\d\.\-\*\+]\s*cta/i)) ||
         Boolean(line.match(/^cta:/i)) ||
         Boolean(line.match(/^call.*action:/i));
};
