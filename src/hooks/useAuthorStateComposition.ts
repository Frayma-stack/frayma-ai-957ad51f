
import { useState, useEffect } from 'react';
import { Author } from '@/types/storytelling';

interface UseAuthorStateCompositionProps {
  basicInfo: {
    id: string;
    name: string;
    bio?: string;
    company?: string;
    title?: string;
    email?: string;
    role?: string;
    organization?: string;
    backstory: string;
  };
  experiences: any[];
  tones: any[];
  beliefs: any[];
  socialLinks: any[];
  initialAuthor?: Author | null;
  selectedClientId?: string | null;
}

export const useAuthorStateComposition = ({
  basicInfo,
  experiences,
  tones,
  beliefs,
  socialLinks,
  initialAuthor,
  selectedClientId
}: UseAuthorStateCompositionProps) => {
  // Determine the correct client ID
  const getClientId = () => {
    // If editing an existing author, keep their existing client assignment
    if (initialAuthor) {
      return initialAuthor.clientId;
    }
    // For new authors, use the selected client ID
    return selectedClientId || undefined;
  };

  const [currentAuthor, setCurrentAuthor] = useState<Author>({
    ...basicInfo,
    title: basicInfo.title || '',
    experiences,
    tones,
    beliefs,
    socialLinks,
    clientId: getClientId()
  });

  // Update the composed author state whenever any part changes
  useEffect(() => {
    const composedAuthor: Author = {
      ...basicInfo,
      title: basicInfo.title || '',
      experiences,
      tones,
      beliefs,
      socialLinks,
      clientId: getClientId()
    };
    
    console.log('🔧 Author composition updated:', {
      name: composedAuthor.name,
      id: composedAuthor.id,
      role: composedAuthor.role,
      organization: composedAuthor.organization,
      clientId: composedAuthor.clientId,
      clientAssignment: composedAuthor.clientId ? 'assigned_to_client' : 'no_client_assignment',
      selectedClientId,
      isEditing: !!initialAuthor,
      experiencesCount: composedAuthor.experiences?.length || 0,
      tonesCount: composedAuthor.tones?.length || 0,
      beliefsCount: composedAuthor.beliefs?.length || 0,
      socialLinksCount: composedAuthor.socialLinks?.length || 0
    });
    
    setCurrentAuthor(composedAuthor);
  }, [basicInfo, experiences, tones, beliefs, socialLinks, selectedClientId, initialAuthor]);

  return {
    currentAuthor
  };
};
