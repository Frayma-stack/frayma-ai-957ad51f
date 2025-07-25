
import { useState } from 'react';
import { SocialLink } from '@/types/storytelling';
import { createEmptySocialLink } from '@/utils/authorFormUtils';

export const useAuthorSocialLinks = (initialSocialLinks: SocialLink[] = []) => {
  // Ensure we always have at least one LinkedIn link for new authors
  const ensureLinkedInLink = (links: SocialLink[]) => {
    const hasLinkedIn = links.some(link => link.type === 'linkedin');
    if (!hasLinkedIn) {
      return [{ 
        id: crypto.randomUUID(), 
        platform: 'LinkedIn',
        type: 'linkedin' as const, 
        url: '' 
      }, ...links];
    }
    return links;
  };

  const initialLinks = initialSocialLinks.length > 0 
    ? ensureLinkedInLink(initialSocialLinks) 
    : [{ 
        id: crypto.randomUUID(), 
        platform: 'LinkedIn',
        type: 'linkedin' as const, 
        url: '' 
      }];
    
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialLinks);
  
  const handleSocialLinkChange = (id: string, field: keyof SocialLink, value: string | 'linkedin' | 'x' | 'blog' | 'website' | 'other') => {
    setSocialLinks(prev => prev.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };
  
  const addSocialLink = () => {
    // Create new non-LinkedIn link by default
    const newLink = createEmptySocialLink();
    newLink.type = 'x'; // Default to X for additional links
    newLink.platform = 'X';
    setSocialLinks(prev => [...prev, newLink]);
  };
  
  const removeSocialLink = (id: string) => {
    setSocialLinks(prev => {
      const filtered = prev.filter(link => link.id !== id);
      // Ensure we always have at least one link and it should be LinkedIn if possible
      if (filtered.length === 0) {
        return [{ 
          id: crypto.randomUUID(), 
          platform: 'LinkedIn',
          type: 'linkedin' as const, 
          url: '' 
        }];
      }
      return filtered;
    });
  };
  
  return {
    socialLinks,
    handleSocialLinkChange,
    addSocialLink,
    removeSocialLink
  };
};
