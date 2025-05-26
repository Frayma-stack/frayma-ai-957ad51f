
import { AuthorSocialLink } from '@/types/storytelling';

export const collectUrls = (socialLinks: AuthorSocialLink[], additionalUrls: string) => {
  const allUrls = socialLinks
    .filter(link => link.url.trim() !== '')
    .map(link => link.url);
  
  // Add any manually entered URLs
  if (additionalUrls.trim()) {
    additionalUrls.split('\n')
      .map(url => url.trim())
      .filter(url => url !== '')
      .forEach(url => allUrls.push(url));
  }
  
  return allUrls;
};
