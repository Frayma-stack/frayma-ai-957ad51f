
import { useState } from 'react';
import { AuthorBelief } from '@/types/storytelling';
import { createEmptyBelief } from '@/utils/authorFormUtils';

export const useAuthorBeliefs = (initialBeliefs: AuthorBelief[] = [createEmptyBelief()]) => {
  const [beliefs, setBeliefs] = useState<AuthorBelief[]>(initialBeliefs);
  
  const handleBeliefChange = (id: string, field: keyof AuthorBelief, value: string) => {
    setBeliefs(prev => prev.map(belief => 
      belief.id === id ? { ...belief, [field]: value } : belief
    ));
  };
  
  const addBelief = () => {
    setBeliefs(prev => [...prev, createEmptyBelief()]);
  };
  
  const removeBelief = (id: string) => {
    setBeliefs(prev => prev.filter(belief => belief.id !== id));
  };

  const setBeliefsFromAnalysis = (newBeliefs: AuthorBelief[]) => {
    setBeliefs(newBeliefs);
  };
  
  return {
    beliefs,
    handleBeliefChange,
    addBelief,
    removeBelief,
    setBeliefsFromAnalysis
  };
};
