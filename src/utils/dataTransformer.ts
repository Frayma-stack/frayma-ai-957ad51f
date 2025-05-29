import { AuthorExperience, AuthorToneItem, AuthorBelief } from '@/types/storytelling';

export const transformAnalysisResults = (parsedData: any) => {
  console.log('Transforming analysis results:', parsedData);
  
  // Transform LinkedIn experiences with proper formatting
  const experiences: AuthorExperience[] = (parsedData.experiences || []).map((exp: any) => {
    // If the experience already has the proper format, use it
    if (exp.title && exp.title.includes('@')) {
      return {
        id: crypto.randomUUID(),
        title: exp.title,
        description: exp.summary || exp.description || 'Professional experience'
      };
    }
    
    // Otherwise, format it properly
    const title = exp.title || exp.role || 'Professional Role';
    const company = exp.company || exp.organization || 'Company';
    const duration = exp.duration || exp.period || '';
    
    const formattedTitle = duration 
      ? `${title} @${company} | ${duration}`
      : `${title} @${company}`;
    
    return {
      id: crypto.randomUUID(),
      title: formattedTitle,
      description: exp.summary || exp.description || `Professional experience at ${company}`
    };
  });
  
  // If no experiences found but we have current role info, create one
  if (experiences.length === 0 && (parsedData.currentTitle || parsedData.organization)) {
    const title = parsedData.currentTitle || 'Current Role';
    const company = parsedData.organization || 'Organization';
    
    experiences.push({
      id: crypto.randomUUID(),
      title: `${title} @${company}`,
      description: 'Current professional role'
    });
  }
  
  // Transform writing tones with better defaults
  const tones: AuthorToneItem[] = (parsedData.writingTones || []).map((tone: any) => ({
    id: crypto.randomUUID(),
    tone: tone.toneTitle || tone.tone || 'Professional',
    description: tone.toneSummary || tone.description || 'Communication style'
  }));
  
  // Ensure we have at least 3 meaningful tones
  const defaultTones = [
    { tone: 'Professional', description: 'Clear and authoritative communication' },
    { tone: 'Analytical', description: 'Data-driven and logical approach' },
    { tone: 'Engaging', description: 'Compelling and accessible content' },
    { tone: 'Authentic', description: 'Genuine and relatable voice' }
  ];
  
  defaultTones.forEach((defaultTone, index) => {
    if (tones.length < 4 && !tones.some(t => t.tone.toLowerCase().includes(defaultTone.tone.toLowerCase()))) {
      tones.push({
        id: crypto.randomUUID(),
        ...defaultTone
      });
    }
  });

  // Transform product beliefs
  const beliefs: AuthorBelief[] = (parsedData.productBeliefs || []).map((belief: any) => ({
    id: crypto.randomUUID(),
    belief: belief.beliefTitle || belief.belief || 'Product Excellence',
    description: belief.beliefSummary || belief.description || 'Core product philosophy'
  }));
  
  // Ensure we have meaningful beliefs
  const defaultBeliefs = [
    { belief: 'User-Centric Design', description: 'Products should solve real user problems' },
    { belief: 'Data-Driven Decisions', description: 'Insights should guide product strategy' },
    { belief: 'Continuous Innovation', description: 'Always evolving to meet market needs' },
    { belief: 'Quality over Speed', description: 'Sustainable excellence in execution' }
  ];
  
  defaultBeliefs.forEach((defaultBelief, index) => {
    if (beliefs.length < 4 && !beliefs.some(b => b.belief.toLowerCase().includes(defaultBelief.belief.toLowerCase()))) {
      beliefs.push({
        id: crypto.randomUUID(),
        ...defaultBelief
      });
    }
  });
  
  // Extract organization from experiences if not directly available
  let organization = parsedData.organization || '';
  if (!organization && experiences.length > 0) {
    const firstExp = experiences[0].title;
    const atIndex = firstExp.indexOf('@');
    const pipeIndex = firstExp.indexOf('|');
    
    if (atIndex !== -1) {
      organization = pipeIndex !== -1 
        ? firstExp.substring(atIndex + 1, pipeIndex).trim()
        : firstExp.substring(atIndex + 1).trim();
    }
  }
  
  const result = { 
    currentRole: parsedData.currentTitle || '',
    organization: organization,
    backstory: parsedData.careerBackstory || '',
    experiences: experiences.slice(0, 6), // Limit to 6 most relevant experiences
    tones: tones.slice(0, 4), // Exactly 4 tones
    beliefs: beliefs.slice(0, 4) // Exactly 4 beliefs
  };
  
  console.log('Transformed result:', result);
  return result;
};
