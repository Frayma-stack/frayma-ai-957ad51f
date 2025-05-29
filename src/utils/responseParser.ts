
export const parseAnalysisContent = (content: string) => {
  console.log('Parsing analysis content:', content);
  
  let parsed;
  try {
    // Try to parse as JSON first
    parsed = JSON.parse(content);
  } catch (error) {
    console.log('Content is not JSON, attempting to extract from text');
    
    // If not JSON, try to extract structured data from text
    parsed = extractFromText(content);
  }
  
  console.log('Parsed content:', parsed);
  return parsed;
};

const extractFromText = (content: string) => {
  const result: any = {
    experiences: [],
    writingTones: [],
    productBeliefs: []
  };
  
  // Extract current title/role
  const titleMatch = content.match(/(?:current\s*(?:title|role|position)|title|role):\s*([^\n]+)/i);
  if (titleMatch) {
    result.currentTitle = titleMatch[1].trim();
  }
  
  // Extract organization
  const orgMatch = content.match(/(?:organization|company|employer):\s*([^\n]+)/i);
  if (orgMatch) {
    result.organization = orgMatch[1].trim();
  }
  
  // Extract career backstory
  const backstoryMatch = content.match(/(?:backstory|background|career\s*background|professional\s*background):\s*([^\n]+(?:\n(?![\w\s]*:)[^\n]+)*)/i);
  if (backstoryMatch) {
    result.careerBackstory = backstoryMatch[1].trim();
  }
  
  // Extract LinkedIn experiences with improved pattern matching
  const experiencePatterns = [
    /(?:experience|experiences|work\s*experience|professional\s*experience):\s*(.*?)(?=\n(?:[a-z\s]*:|$))/gis,
    /(?:^|\n)\s*-\s*([^@\n]+)\s*@\s*([^|\n]+)(?:\s*\|\s*([^|\n]+))?/gm,
    /(?:^|\n)\s*\*\s*([^@\n]+)\s*@\s*([^|\n]+)(?:\s*\|\s*([^|\n]+))?/gm,
    /(?:^|\n)\s*(\d+\.?\s*)?([^@\n]+)\s*@\s*([^|\n]+)(?:\s*\|\s*([^|\n]+))?/gm
  ];
  
  for (const pattern of experiencePatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const title = (match[2] || match[1] || '').trim();
      const company = (match[3] || match[2] || '').trim();
      const duration = (match[4] || match[3] || '').trim();
      
      if (title && company && title !== company) {
        // Format as "Title @Company | Duration"
        const formattedTitle = duration 
          ? `${title} @${company} | ${duration}`
          : `${title} @${company}`;
          
        result.experiences.push({
          title: formattedTitle,
          company: company,
          duration: duration,
          summary: `Professional experience at ${company}`
        });
      }
    }
  }
  
  // Extract writing tones
  const tonesSection = content.match(/(?:writing\s*tones?|communication\s*style|tone):\s*(.*?)(?=\n(?:[a-z\s]*:|$))/gis);
  if (tonesSection) {
    const tones = tonesSection[1].split(/[,\n-]/).filter(t => t.trim());
    result.writingTones = tones.map(tone => ({
      toneTitle: tone.trim(),
      toneSummary: `Communication style characteristic`
    }));
  }
  
  // Extract product beliefs
  const beliefsSection = content.match(/(?:product\s*beliefs?|beliefs?|philosophy):\s*(.*?)(?=\n(?:[a-z\s]*:|$))/gis);
  if (beliefsSection) {
    const beliefs = beliefsSection[1].split(/[,\n-]/).filter(b => b.trim());
    result.productBeliefs = beliefs.map(belief => ({
      beliefTitle: belief.trim(),
      beliefSummary: `Professional belief or principle`
    }));
  }
  
  return result;
};
