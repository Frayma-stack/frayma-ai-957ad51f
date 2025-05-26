
import { useState } from 'react';
import { AuthorSocialLink } from '@/types/storytelling';
import { createEmptySocialLink } from '@/utils/authorFormUtils';

export const useAuthorSocialLinks = (initialSocialLinks: AuthorSocialLink[] = [createEmptySocialLink()]) => {
  const [socialLinks, setSocialLinks] = useState<AuthorSocialLink[]>(initialSocialLinks);
  
  const handleSocialLinkChange = (id: string, field: keyof AuthorSocialLink, value: string | 'linkedin' | 'x' | 'blog' | 'website' | 'other') => {
    setSocialLinks(prev => prev.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };
  
  const addSocialLink = () => {
    setSocialLinks(prev => [...prev, createEmptySocialLink()]);
  };
  
  const removeSocialLink = (id: string) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id));
  };
  
  return {
    socialLinks,
    handleSocialLinkChange,
    addSocialLink,
    removeSocialLink
  };
};
