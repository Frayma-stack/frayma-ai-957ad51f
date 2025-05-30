
import { FC } from 'react';
import { ICPStoryScript, Author, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { useShortFormFiltering } from '@/hooks/useShortFormFiltering';
import { useClientNameResolver } from '@/hooks/useClientNameResolver';
import { ContentType } from './short-form/types';
import ShortFormContentContainer from './short-form/ShortFormContentContainer';

interface ShortFormContentCreatorProps {
  contentType: ContentType;
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  ideas?: GeneratedIdea[];
  selectedClientId?: string | null;
  currentProductContext?: ProductContext | null;
  onBack: () => void;
}

const ShortFormContentCreator: FC<ShortFormContentCreatorProps> = ({ 
  contentType, 
  scripts,
  authors,
  successStories,
  ideas = [],
  selectedClientId,
  currentProductContext = null,
  onBack
}) => {
  const {
    filteredAuthors,
    filteredScripts,
    filteredSuccessStories,
    filteredIdeas
  } = useShortFormFiltering({
    selectedClientId,
    scripts,
    authors,
    successStories,
    ideas
  });

  const { clientName } = useClientNameResolver({ 
    scripts: filteredScripts, 
    authors: filteredAuthors, 
    successStories: filteredSuccessStories 
  });

  return (
    <ShortFormContentContainer
      contentType={contentType}
      filteredScripts={filteredScripts}
      filteredAuthors={filteredAuthors}
      filteredSuccessStories={filteredSuccessStories}
      filteredIdeas={filteredIdeas}
      selectedClientId={selectedClientId}
      currentProductContext={currentProductContext}
      clientName={clientName}
      onBack={onBack}
    />
  );
};

export default ShortFormContentCreator;
