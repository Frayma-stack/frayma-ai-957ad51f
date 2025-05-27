
import { FC } from 'react';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import BaseIdeaGenerator from './product-led/BaseIdeaGenerator';

interface IdeaGeneratorProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
  selectedClientId?: string;
  layout?: 'vertical' | 'horizontal';
}

const IdeaGenerator: FC<IdeaGeneratorProps> = ({
  layout = 'vertical',
  ...props
}) => {
  return <BaseIdeaGenerator {...props} layout={layout} />;
};

export default IdeaGenerator;
