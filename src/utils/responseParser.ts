
export const parseAnalysisContent = (content: string) => {
  console.log('Parsing analysis content, length:', content.length);
  
  let parsed;
  try {
    // Try to parse as JSON first
    parsed = JSON.parse(content);
    console.log('✅ Successfully parsed as valid JSON');
    return parsed;
  } catch (error) {
    console.log('⚠️ Content is not valid JSON, attempting extraction');
    
    // Try to extract JSON from text that might have extra content
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully extracted JSON from text');
        return parsed;
      } catch (jsonError) {
        console.log('⚠️ Failed to parse extracted JSON, using fallback extraction');
      }
    }
    
    // Fallback to text extraction
    return extractFromText(content);
  }
};

const extractFromText = (content: string) => {
  console.log('📝 Extracting structured data from text content');
  
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
    /(?:^|\n)\s*(?:title|role|currentTitle):\s*"?([^"\n]+)"?/i,
    /(?:job\s*title|position):\s*"?([^"\n]+)"?/i
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
    /(?:organization|company|employer|workplace):\s*"?([^"\n]+)"?/i,
    /(?:^|\n)\s*(?:company|organization):\s*"?([^"\n]+)"?/i,
    /@\s*([^|\n,]+)(?:\s*\||$)/i
  ];
  
  for (const pattern of orgPatterns) {
    const match = content.match(pattern);
    if (match && match[1].trim()) {
      result.organization = match[1].trim().replace(/[",]/g, '');
      break;
    }
  }
  
  // Extract career backstory
  const backstoryPatterns = [
    /(?:backstory|background|career\s*background|careerBackstory):\s*"([^"]+)"/i,
    /(?:professional\s*background|bio|summary):\s*"([^"]+)"/i
  ];
  
  for (const pattern of backstoryPatterns) {
    const match = content.match(pattern);
    if (match && match[1].trim()) {
      result.careerBackstory = match[1].trim();
      break;
    }
  }
  
  // Extract experiences
  const experienceSection = content.match(/experiences['"]*:\s*\[(.*?)\]/gis);
  if (experienceSection && experienceSection[0]) {
    const expContent = experienceSection[0];
    const titleMatches = expContent.match(/"title":\s*"([^"]+)"/g);
    const summaryMatches = expContent.match(/"summary":\s*"([^"]+)"/g);
    
    if (titleMatches) {
      titleMatches.forEach((titleMatch, index) => {
        const title = titleMatch.match(/"title":\s*"([^"]+)"/)?.[1];
        const summary = summaryMatches?.[index]?.match(/"summary":\s*"([^"]+)"/)?.[1];
        
        if (title) {
          // Extract company and duration from title if formatted properly
          let company = '';
          let duration = '';
          
          if (title.includes('@')) {
            const parts = title.split('@');
            const afterAt = parts[1];
            if (afterAt.includes('|')) {
              const [comp, dur] = afterAt.split('|');
              company = comp.trim();
              duration = dur.trim();
            } else {
              company = afterAt.trim();
            }
          }
          
          result.experiences.push({
            title: title,
            company: company || 'Company',
            duration: duration || '',
            summary: summary || `Professional experience${company ? ` at ${company}` : ''}`
          });
        }
      });
    }
  }
  
  // Extract writing tones
  const tonesSection = content.match(/writingTones['"]*:\s*\[(.*?)\]/gis);
  if (tonesSection && tonesSection[0]) {
    const tonesContent = tonesSection[0];
    const toneTitleMatches = tonesContent.match(/"toneTitle":\s*"([^"]+)"/g);
    const toneSummaryMatches = tonesContent.match(/"toneSummary":\s*"([^"]+)"/g);
    
    if (toneTitleMatches) {
      toneTitleMatches.forEach((match, index) => {
        const toneTitle = match.match(/"toneTitle":\s*"([^"]+)"/)?.[1];
        const toneSummary = toneSummaryMatches?.[index]?.match(/"toneSummary":\s*"([^"]+)"/)?.[1];
        
        if (toneTitle && toneSummary) {
          result.writingTones.push({
            toneTitle,
            toneSummary
          });
        }
      });
    }
  }
  
  // Extract product beliefs
  const beliefsSection = content.match(/productBeliefs['"]*:\s*\[(.*?)\]/gis);
  if (beliefsSection && beliefsSection[0]) {
    const beliefsContent = beliefsSection[0];
    const beliefTitleMatches = beliefsContent.match(/"beliefTitle":\s*"([^"]+)"/g);
    const beliefSummaryMatches = beliefsContent.match(/"beliefSummary":\s*"([^"]+)"/g);
    
    if (beliefTitleMatches) {
      beliefTitleMatches.forEach((match, index) => {
        const beliefTitle = match.match(/"beliefTitle":\s*"([^"]+)"/)?.[1];
        const beliefSummary = beliefSummaryMatches?.[index]?.match(/"beliefSummary":\s*"([^"]+)"/)?.[1];
        
        if (beliefTitle && beliefSummary) {
          result.productBeliefs.push({
            beliefTitle,
            beliefSummary
          });
        }
      });
    }
  }
  
  console.log('📊 Text extraction result:', {
    hasTitle: !!result.currentTitle,
    hasOrganization: !!result.organization,
    hasBackstory: !!result.careerBackstory,
    experiencesCount: result.experiences.length,
    tonesCount: result.writingTones.length,
    beliefsCount: result.productBeliefs.length
  });
  
  return result;
};
