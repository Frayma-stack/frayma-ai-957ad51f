
import { FC } from 'react';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import BaseIdeaGenerator from './product-led/BaseIdeaGenerator';

interface ProductLedIdeaGeneratorProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
  selectedClientId?: string;
}

const ProductLedIdeaGenerator: FC<ProductLedIdeaGeneratorProps> = (props) => {
  return <BaseIdeaGenerator {...props} layout="vertical" />;
};

export default ProductLedIdeaGenerator;
