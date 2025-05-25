
import { AuthorSocialLink, AuthorExperience, AuthorToneItem } from '@/types/storytelling';

export interface ProfileAnalyzerProps {
  socialLinks: AuthorSocialLink[];
  onClose: () => void;
  onAnalysisComplete: (results: {
    experiences?: AuthorExperience[],
    tones?: AuthorToneItem[]
  }) => void;
}

export interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface ParsedAnalysisData {
  experiences?: Array<{
    title: string;
    description: string;
  }>;
  tones?: Array<{
    tone: string;
    description: string;
  }>;
}
