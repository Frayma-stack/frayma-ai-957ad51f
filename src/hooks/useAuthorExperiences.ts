
import { useState } from 'react';
import { AuthorExperience } from '@/types/storytelling';
import { createEmptyExperience } from '@/utils/authorFormUtils';

export const useAuthorExperiences = (initialExperiences: AuthorExperience[] = [createEmptyExperience()]) => {
  const [experiences, setExperiences] = useState<AuthorExperience[]>(initialExperiences);
  
  const handleExperienceChange = (id: string, field: keyof AuthorExperience, value: string) => {
    setExperiences(prev => prev.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };
  
  const addExperience = () => {
    setExperiences(prev => [...prev, createEmptyExperience()]);
  };
  
  const removeExperience = (id: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  const setExperiencesFromAnalysis = (newExperiences: AuthorExperience[]) => {
    setExperiences(newExperiences);
  };
  
  return {
    experiences,
    handleExperienceChange,
    addExperience,
    removeExperience,
    setExperiencesFromAnalysis
  };
};
