
import { IdeaScore } from '@/types/ideas';

export interface ParsedIdea {
  title: string;
  narrative: string;
  productTieIn: string;
  cta: string;
  originalContent: string;
  tempId: string;
}

export interface IdeaWithScore extends ParsedIdea {
  score: IdeaScore | null;
}
