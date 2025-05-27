
import { FC } from 'react';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import BaseIdeaGenerator from './product-led/BaseIdeaGenerator';

interface TwoSidedIdeaGeneratorProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
  selectedClientId?: string;
}

const TwoSidedIdeaGenerator: FC<TwoSidedIdeaGeneratorProps> = (props) => {
  return <BaseIdeaGenerator {...props} layout="horizontal" />;
};

export default TwoSidedIdeaGenerator;
