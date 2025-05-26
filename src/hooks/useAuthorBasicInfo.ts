
import { useState } from 'react';
import { Author } from '@/types/storytelling';

export const useAuthorBasicInfo = (initialAuthor: Author) => {
  const [basicInfo, setBasicInfo] = useState({
    id: initialAuthor.id,
    name: initialAuthor.name,
    role: initialAuthor.role,
    organization: initialAuthor.organization,
    backstory: initialAuthor.backstory
  });

  const handleInputChange = (
    field: keyof Omit<Author, 'id' | 'experiences' | 'tones' | 'beliefs' | 'socialLinks'>, 
    value: string
  ) => {
    setBasicInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    basicInfo,
    handleInputChange
  };
};
