
import { useEffect } from 'react';
import { Author } from '@/types/storytelling';
import { useFormPersistence } from './useFormPersistence';

export const useAuthorFormPersistence = (
  initialAuthor?: Author | null,
  basicInfo?: {
    name: string;
    bio?: string;
    company?: string;
    title?: string;
    email?: string;
  }
) => {
  const {
    values: persistedBasicInfo,
    updateValue: updatePersistedValue,
    clearPersistedData,
    isLoaded: isPersistenceLoaded
  } = useFormPersistence({
    key: initialAuthor ? `author_edit_${initialAuthor.id}` : 'author_new',
    defaultValues: {
      name: initialAuthor?.name || '',
      bio: initialAuthor?.bio || '',
      company: initialAuthor?.company || '',
      title: initialAuthor?.title || '',
      email: initialAuthor?.email || ''
    }
  });

  // Update persistence when basic info changes
  useEffect(() => {
    if (isPersistenceLoaded && basicInfo) {
      updatePersistedValue('name', basicInfo.name);
      updatePersistedValue('bio', basicInfo.bio || '');
      updatePersistedValue('company', basicInfo.company || '');
      updatePersistedValue('title', basicInfo.title || '');
      updatePersistedValue('email', basicInfo.email || '');
    }
  }, [basicInfo, updatePersistedValue, isPersistenceLoaded]);

  return {
    persistedBasicInfo,
    isPersistenceLoaded,
    clearPersistedData
  };
};
