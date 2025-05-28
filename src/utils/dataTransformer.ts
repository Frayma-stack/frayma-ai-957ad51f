
import { AuthorExperience, AuthorToneItem, AuthorBelief } from '@/types/storytelling';

export const transformAnalysisResults = (parsedData: any) => {
  console.log('Transforming analysis results:', parsedData);
  
  // Map experiences from enhanced format with better fallbacks
  const experiences: AuthorExperience[] = (parsedData.experiences || []).map((exp: any) => ({
    id: crypto.randomUUID(),
    title: exp.title || `${exp.title || 'Professional Role'} @ ${exp.company || 'Company'}${exp.duration ? ` | ${exp.duration}` : ''}`,
    description: exp.summary || exp.description || 'Professional experience details not available'
  }));
  
  // Ensure minimum experiences if data is sparse
  if (experiences.length === 0 && parsedData.currentTitle) {
    experiences.push({
      id: crypto.randomUUID(),
      title: parsedData.currentTitle,
      description: 'Current role and responsibilities'
    });
  }
  
  // Map writing tones from enhanced format
  const tones: AuthorToneItem[] = (parsedData.writingTones || []).map((tone: any) => ({
    id: crypto.randomUUID(),
    tone: tone.toneTitle || tone.tone || 'Professional Tone',
    description: tone.toneSummary || tone.description || 'Writing style characteristic'
  }));
  
  // Ensure exactly 4 tones with meaningful defaults if needed
  const targetTones = ['Educational', 'Authentic', 'Analytical', 'Engaging'];
  while (tones.length < 4 && tones.length < targetTones.length) {
    const defaultTone = targetTones[tones.length];
    if (!tones.some(t => t.tone.includes(defaultTone))) {
      tones.push({
        id: crypto.randomUUID(),
        tone: defaultTone,
        description: `${defaultTone} communication style observed in content`
      });
    } else {
      break;
    }
  }

  // Map product beliefs from enhanced format
  const beliefs: AuthorBelief[] = (parsedData.productBeliefs || []).map((belief: any) => ({
    id: crypto.randomUUID(),
    belief: belief.beliefTitle || belief.belief || 'Product Philosophy',
    description: belief.beliefSummary || belief.description || 'Product-related belief or opinion'
  }));
  
  // Ensure exactly 4 beliefs with meaningful defaults if needed
  const targetBeliefs = [
    'User-Centric Design',
    'Data-Driven Decisions', 
    'Continuous Innovation',
    'Quality over Speed'
  ];
  while (beliefs.length < 4 && beliefs.length < targetBeliefs.length) {
    const defaultBelief = targetBeliefs[beliefs.length];
    if (!beliefs.some(b => b.belief.includes(defaultBelief.split(' ')[0]))) {
      beliefs.push({
        id: crypto.randomUUID(),
        belief: defaultBelief,
        description: `Belief in ${defaultBelief.toLowerCase()} as evidenced in professional approach`
      });
    } else {
      break;
    }
  }
  
  // Extract organization from currentTitle if available
  const organization = parsedData.organization || 
    (parsedData.currentTitle && parsedData.currentTitle.includes('@') 
      ? parsedData.currentTitle.split('@')[1]?.trim() 
      : '');
  
  const result = { 
    currentRole: parsedData.currentTitle || '',
    organization: organization,
    backstory: parsedData.careerBackstory || '',
    experiences, 
    tones: tones.slice(0, 4), // Ensure exactly 4 tones
    beliefs: beliefs.slice(0, 4) // Ensure exactly 4 beliefs
  };
  
  console.log('Transformed result:', result);
  return result;
};
