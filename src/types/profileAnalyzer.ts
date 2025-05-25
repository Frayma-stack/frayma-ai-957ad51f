
import { AuthorSocialLink, AuthorExperience, AuthorToneItem, AuthorBelief } from '@/types/storytelling';

export interface ProfileAnalyzerProps {
  socialLinks: AuthorSocialLink[];
  onClose: () => void;
  onAnalysisComplete: (results: {
    currentRole?: string;
    organization?: string;
    backstory?: string;
    experiences?: AuthorExperience[];
    tones?: AuthorToneItem[];
    beliefs?: AuthorBelief[];
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
  currentRole?: string;
  organization?: string;
  backstory?: string;
  experiences?: Array<{
    title: string;
    description: string;
  }>;
  tones?: Array<{
    tone: string;
    description: string;
  }>;
  beliefs?: Array<{
    belief: string;
    description: string;
  }>;
}
