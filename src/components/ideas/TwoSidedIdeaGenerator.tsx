
import { FC } from 'react';
import { GeneratedIdea } from '@/types/ideas';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import BaseIdeaGenerator from './product-led/BaseIdeaGenerator';

interface TwoSidedIdeaGeneratorProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
  selectedClientId?: string;
  ideas: GeneratedIdea[];
}

const TwoSidedIdeaGenerator: FC<TwoSidedIdeaGeneratorProps> = ({
  icpScripts,
  productContext,
  onIdeaAdded,
  onContentTypeSelect,
  selectedClientId,
  ideas
}) => {
  return (
    <BaseIdeaGenerator
      icpScripts={icpScripts}
      productContext={productContext}
      onIdeaAdded={onIdeaAdded}
      onContentTypeSelect={onContentTypeSelect}
      selectedClientId={selectedClientId}
      layout="horizontal"
      ideas={ideas}
    />
  );
};

export default TwoSidedIdeaGenerator;
