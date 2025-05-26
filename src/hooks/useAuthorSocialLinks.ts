
import { useState } from 'react';
import { AuthorSocialLink } from '@/types/storytelling';
import { createEmptySocialLink } from '@/utils/authorFormUtils';

export const useAuthorSocialLinks = (initialSocialLinks: AuthorSocialLink[] = []) => {
  // Ensure we always have at least one social link
  const initialLinks = initialSocialLinks.length > 0 ? initialSocialLinks : [createEmptySocialLink()];
  const [socialLinks, setSocialLinks] = useState<AuthorSocialLink[]>(initialLinks);
  
  const handleSocialLinkChange = (id: string, field: keyof AuthorSocialLink, value: string | 'linkedin' | 'x' | 'blog' | 'website' | 'other') => {
    setSocialLinks(prev => prev.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };
  
  const addSocialLink = () => {
    setSocialLinks(prev => [...prev, createEmptySocialLink()]);
  };
  
  const removeSocialLink = (id: string) => {
    setSocialLinks(prev => {
      const filtered = prev.filter(link => link.id !== id);
      // Ensure we always have at least one social link
      return filtered.length > 0 ? filtered : [createEmptySocialLink()];
    });
  };
  
  return {
    socialLinks,
    handleSocialLinkChange,
    addSocialLink,
    removeSocialLink
  };
};
