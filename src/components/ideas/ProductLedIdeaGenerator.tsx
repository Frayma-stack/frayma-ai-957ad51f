
import { FC } from 'react';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import IdeaGenerator from './IdeaGenerator';

interface ProductLedIdeaGeneratorProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
  selectedClientId?: string;
}

const ProductLedIdeaGenerator: FC<ProductLedIdeaGeneratorProps> = (props) => {
  return <IdeaGenerator {...props} layout="vertical" />;
};

export default ProductLedIdeaGenerator;
