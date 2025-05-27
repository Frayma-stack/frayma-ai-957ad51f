
import { CompanyLink, ProductContext } from '@/types/storytelling';

export interface ClientAnalysisRequest {
  companyLinks: CompanyLink[];
  companyName: string;
  onAnalysisComplete: (productContext: ProductContext) => void;
}

export interface AnalysisServiceResponse {
  choices?: Array<{
    message: {
      content: string;
    };
  }>;
  content?: string;
  error?: string;
  details?: string;
  suggestion?: string;
}
