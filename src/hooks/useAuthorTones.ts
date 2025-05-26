
import { useState } from 'react';
import { AuthorToneItem } from '@/types/storytelling';
import { createEmptyTone } from '@/utils/authorFormUtils';

export const useAuthorTones = (initialTones: AuthorToneItem[] = [createEmptyTone()]) => {
  const [tones, setTones] = useState<AuthorToneItem[]>(initialTones);
  
  const handleToneChange = (id: string, field: keyof AuthorToneItem, value: string) => {
    setTones(prev => prev.map(tone => 
      tone.id === id ? { ...tone, [field]: value } : tone
    ));
  };
  
  const addTone = () => {
    setTones(prev => [...prev, createEmptyTone()]);
  };
  
  const removeTone = (id: string) => {
    setTones(prev => prev.filter(tone => tone.id !== id));
  };

  const setTonesFromAnalysis = (newTones: AuthorToneItem[]) => {
    setTones(newTones);
  };
  
  return {
    tones,
    handleToneChange,
    addTone,
    removeTone,
    setTonesFromAnalysis
  };
};
