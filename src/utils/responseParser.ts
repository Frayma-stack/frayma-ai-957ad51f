
export const parseAnalysisContent = (content: string) => {
  console.log('Parsing analysis content:', content.substring(0, 500) + '...');
  
  let parsed;
  try {
    // Try to parse as JSON first
    parsed = JSON.parse(content);
    console.log('Successfully parsed as JSON');
  } catch (error) {
    console.log('Content is not valid JSON, attempting to extract from text');
    
    // Try to extract JSON from text that might have extra content
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
        console.log('Successfully extracted JSON from text');
      } catch (jsonError) {
        console.log('Failed to parse extracted JSON, falling back to text extraction');
        parsed = extractFromText(content);
      }
    } else {
      console.log('No JSON found, using text extraction');
      parsed = extractFromText(content);
    }
  }
  
  console.log('Final parsed content:', parsed);
  return parsed;
};

const extractFromText = (content: string) => {
  console.log('Extracting structured data from text content');
  
  const result: any = {
    currentTitle: '',
    organization: '',
    careerBackstory: '',
    experiences: [],
    writingTones: [],
    productBeliefs: []
  };
  
  // Extract current title/role with multiple patterns
  const titlePatterns = [
    /(?:current\s*(?:title|role|position)|title|role|position):\s*([^\n]+)/i,
    /(?:^|\n)\s*title:\s*([^\n]+)/i,
    /(?:job\s*title|position):\s*([^\n]+)/i
  ];
  
  for (const pattern of titlePatterns) {
    const match = content.match(pattern);
    if (match && match[1].trim()) {
      result.currentTitle = match[1].trim().replace(/[",]/g, '');
      break;
    }
  }
  
  // Extract organization with multiple patterns
  const orgPatterns = [
    /(?:organization|company|employer|workplace|works?\s*at):\s*([^\n]+)/i,
    /(?:^|\n)\s*(?:company|organization):\s*([^\n]+)/i,
    /@\s*([^|\n,]+)(?:\s*\||$)/i
  ];
  
  for (const pattern of orgPatterns) {
    const match = content.match(pattern);
    if (match && match[1].trim()) {
      result.organization = match[1].trim().replace(/[",]/g, '');
      break;
    }
  }
  
  // Extract career backstory with multiple patterns
  const backstoryPatterns = [
    /(?:backstory|background|career\s*background|professional\s*background|bio|summary):\s*([^\n]+(?:\n(?![\w\s]*:)[^\n]+)*)/i,
    /(?:career\s*summary|professional\s*summary):\s*([^\n]+(?:\n(?![\w\s]*:)[^\n]+)*)/i
  ];
  
  for (const pattern of backstoryPatterns) {
    const match = content.match(pattern);
    if (match && match[1].trim()) {
      result.careerBackstory = match[1].trim().replace(/[",]/g, '');
      break;
    }
  }
  
  // Extract experiences with improved pattern matching
  const experiencePatterns = [
    /(?:experience|experiences|work\s*experience|professional\s*experience):\s*\[(.*?)\]/gis,
    /(?:^|\n)\s*[-*]\s*([^@\n]+)\s*@\s*([^|\n]+)(?:\s*\|\s*([^|\n]+))?/gm,
    /(?:^|\n)\s*(\d+\.?\s*)?([^@\n]+)\s*@\s*([^|\n]+)(?:\s*\|\s*([^|\n]+))?/gm,
    /"title":\s*"([^"]+)"/g
  ];
  
  for (const pattern of experiencePatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (pattern.source.includes('title')) {
        // JSON-style extraction
        const title = match[1].trim();
        if (title && title.includes('@')) {
          const parts = title.split('@');
          const role = parts[0].trim();
          const companyDuration = parts[1].trim();
          const pipeIndex = companyDuration.indexOf('|');
          const company = pipeIndex !== -1 ? companyDuration.substring(0, pipeIndex).trim() : companyDuration;
          const duration = pipeIndex !== -1 ? companyDuration.substring(pipeIndex + 1).trim() : '';
          
          result.experiences.push({
            title: title,
            company: company,
            duration: duration,
            summary: `Professional experience at ${company}`
          });
        }
      } else {
        // Pattern-based extraction
        const role = (match[2] || match[1] || '').trim();
        const company = (match[3] || match[2] || '').trim();
        const duration = (match[4] || match[3] || '').trim();
        
        if (role && company && role !== company && role.length > 2 && company.length > 2) {
          const formattedTitle = duration 
            ? `${role} @${company} | ${duration}`
            : `${role} @${company}`;
            
          result.experiences.push({
            title: formattedTitle,
            company: company,
            duration: duration,
            summary: `Professional experience at ${company}`
          });
        }
      }
    }
  }
  
  // Extract writing tones
  const tonesPattern = /(?:writing\s*tones?|communication\s*style|tones?):\s*\[(.*?)\]/gis;
  const tonesMatch = content.match(tonesPattern);
  if (tonesMatch) {
    try {
      const tonesContent = tonesMatch[1];
      const toneObjects = tonesContent.match(/\{[^}]+\}/g) || [];
      
      for (const toneObj of toneObjects) {
        const titleMatch = toneObj.match(/"toneTitle":\s*"([^"]+)"/);
        const summaryMatch = toneObj.match(/"toneSummary":\s*"([^"]+)"/);
        
        if (titleMatch && summaryMatch) {
          result.writingTones.push({
            toneTitle: titleMatch[1],
            toneSummary: summaryMatch[1]
          });
        }
      }
    } catch (error) {
      console.log('Error parsing writing tones from JSON');
    }
  }
  
  // Extract product beliefs
  const beliefsPattern = /(?:product\s*beliefs?|beliefs?|philosophy):\s*\[(.*?)\]/gis;
  const beliefsMatch = content.match(beliefsPattern);
  if (beliefsMatch) {
    try {
      const beliefsContent = beliefsMatch[1];
      const beliefObjects = beliefsContent.match(/\{[^}]+\}/g) || [];
      
      for (const beliefObj of beliefObjects) {
        const titleMatch = beliefObj.match(/"beliefTitle":\s*"([^"]+)"/);
        const summaryMatch = beliefObj.match(/"beliefSummary":\s*"([^"]+)"/);
        
        if (titleMatch && summaryMatch) {
          result.productBeliefs.push({
            beliefTitle: titleMatch[1],
            beliefSummary: summaryMatch[1]
          });
        }
      }
    } catch (error) {
      console.log('Error parsing product beliefs from JSON');
    }
  }
  
  console.log('Text extraction result:', result);
  return result;
};
