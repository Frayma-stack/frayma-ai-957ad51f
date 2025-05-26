
import { Author } from '@/types/storytelling';

export const useAuthorState = (
  basicInfo: {
    id: string;
    name: string;
    role: string;
    organization: string;
    backstory: string;
  },
  experiences: any[],
  tones: any[],
  beliefs: any[],
  socialLinks: any[]
): Author => {
  return {
    ...basicInfo,
    experiences,
    tones,
    beliefs,
    socialLinks
  };
};
