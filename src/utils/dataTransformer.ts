import { AuthorExperience, AuthorToneItem, AuthorBelief } from '@/types/storytelling';

export const transformAnalysisResults = (parsedData: any) => {
  console.log('Transforming analysis results:', parsedData);
  
  // If we have very limited data (e.g., due to LinkedIn blocking), create sensible defaults
  const hasMinimalData = !parsedData || Object.keys(parsedData).length === 0 || 
    (!parsedData.experiences && !parsedData.currentTitle && !parsedData.organization);
  
  // Transform LinkedIn experiences with proper formatting
  const experiences: AuthorExperience[] = [];
  
  if (parsedData.experiences && Array.isArray(parsedData.experiences)) {
    parsedData.experiences.forEach((exp: any) => {
      // If the experience already has the proper format, use it
      if (exp.title && exp.title.includes('@')) {
        experiences.push({
          id: crypto.randomUUID(),
          title: exp.title,
          description: exp.summary || exp.description || 'Professional experience'
        });
      } else {
        // Otherwise, format it properly
        const title = exp.title || exp.role || 'Professional Role';
        const company = exp.company || exp.organization || 'Company';
        const duration = exp.duration || exp.period || '';
        
        const formattedTitle = duration 
          ? `${title} @${company} | ${duration}`
          : `${title} @${company}`;
        
        experiences.push({
          id: crypto.randomUUID(),
          title: formattedTitle,
          description: exp.summary || exp.description || `Professional experience at ${company}`
        });
      }
    });
  }
  
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
  
  // If we still have no experiences and have minimal data, provide a placeholder
  if (experiences.length === 0) {
    experiences.push({
      id: crypto.randomUUID(),
      title: 'Professional Experience',
      description: 'Please update with your professional background'
    });
  }
  
  // Transform writing tones - provide meaningful defaults
  const tones: AuthorToneItem[] = [];
  
  // Add tones from parsed data first
  if (parsedData.writingTones && Array.isArray(parsedData.writingTones)) {
    parsedData.writingTones.forEach((tone: any) => {
      if (tone.toneTitle && tone.toneSummary) {
        tones.push({
          id: crypto.randomUUID(),
          tone: tone.toneTitle,
          description: tone.toneSummary
        });
      }
    });
  }
  
  // Provide smart defaults based on professional context
  const defaultTones = [
    { tone: 'Professional', description: 'Clear and authoritative communication style with industry expertise' },
    { tone: 'Analytical', description: 'Data-driven approach with logical problem-solving focus' },
    { tone: 'Engaging', description: 'Accessible and compelling content that connects with audience' },
    { tone: 'Authentic', description: 'Genuine voice that reflects personal experience and values' }
  ];
  
  // Fill in missing tones up to 4
  defaultTones.forEach((defaultTone) => {
    if (tones.length < 4 && !tones.some(t => t.tone.toLowerCase().includes(defaultTone.tone.toLowerCase()))) {
      tones.push({
        id: crypto.randomUUID(),
        ...defaultTone
      });
    }
  });
  
  // Ensure exactly 4 tones
  while (tones.length < 4) {
    tones.push({
      id: crypto.randomUUID(),
      tone: 'Strategic',
      description: 'Forward-thinking approach with focus on long-term goals and outcomes'
    });
  }

  // Transform product beliefs - provide meaningful defaults
  const beliefs: AuthorBelief[] = [];
  
  // Add beliefs from parsed data first
  if (parsedData.productBeliefs && Array.isArray(parsedData.productBeliefs)) {
    parsedData.productBeliefs.forEach((belief: any) => {
      if (belief.beliefTitle && belief.beliefSummary) {
        beliefs.push({
          id: crypto.randomUUID(),
          belief: belief.beliefTitle,
          description: belief.beliefSummary
        });
      }
    });
  }
  
  // Provide smart defaults for product beliefs
  const defaultBeliefs = [
    { belief: 'User-Centric Design', description: 'Products should solve real user problems with intuitive experiences' },
    { belief: 'Data-Driven Decisions', description: 'Strategic choices backed by insights and measurable outcomes' },
    { belief: 'Continuous Innovation', description: 'Always evolving to meet changing market needs and opportunities' },
    { belief: 'Quality Excellence', description: 'Sustainable execution focused on long-term value creation' }
  ];
  
  // Fill in missing beliefs up to 4
  defaultBeliefs.forEach((defaultBelief) => {
    if (beliefs.length < 4 && !beliefs.some(b => b.belief.toLowerCase().includes(defaultBelief.belief.toLowerCase()))) {
      beliefs.push({
        id: crypto.randomUUID(),
        ...defaultBelief
      });
    }
  });
  
  // Ensure exactly 4 beliefs
  while (beliefs.length < 4) {
    beliefs.push({
      id: crypto.randomUUID(),
      belief: 'Customer Success',
      description: 'Prioritizing customer outcomes and long-term relationship building'
    });
  }
  
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
  
  console.log('Transformed result:', {
    hasMinimalData,
    experiencesCount: result.experiences.length,
    tonesCount: result.tones.length,
    beliefsCount: result.beliefs.length,
    currentRole: result.currentRole,
    organization: result.organization
  });
  
  return result;
};
