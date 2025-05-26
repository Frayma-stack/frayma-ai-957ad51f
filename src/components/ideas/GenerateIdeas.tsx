
import { FC } from 'react';
import IdeaGenerationForm from './legacy/IdeaGenerationForm';
import GeneratedIdeasList from './legacy/GeneratedIdeasList';
import { useIdeaGeneration } from '@/hooks/useIdeaGeneration';
import { ICPStoryScript, CustomerSuccessStory, ProductContext, Author } from '@/types/storytelling';
import { ContentIdea } from '@/types/ideas';

interface GenerateIdeasProps {
  icpScripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  productContexts: ProductContext[];
  authors: Author[];
  onIdeaAdded: (idea: ContentIdea) => void;
  selectedClientId?: string;
}

const GenerateIdeas: FC<GenerateIdeasProps> = ({ 
  icpScripts, 
  successStories, 
  productContexts, 
  authors, 
  onIdeaAdded,
  selectedClientId
}) => {
  const {
    prompt,
    generatedIdeas,
    isLoading,
    handleInputChange,
    handleSelectChange,
    handleGenerateIdeas,
    handleDeleteIdea,
    handleEditIdea,
    handleCopyToClipboard,
    clearAllIdeas,
  } = useIdeaGeneration({
    icpScripts,
    successStories,
    productContexts,
    authors,
  });

  return (
    <div className="space-y-6">
      <IdeaGenerationForm
        prompt={prompt}
        isLoading={isLoading}
        icpScripts={icpScripts}
        successStories={successStories}
        productContexts={productContexts}
        authors={authors}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onGenerateIdeas={handleGenerateIdeas}
      />

      <GeneratedIdeasList
        generatedIdeas={generatedIdeas}
        selectedClientId={selectedClientId}
        onIdeaAdded={onIdeaAdded}
        onDeleteIdea={handleDeleteIdea}
        onEditIdea={(editedIdea) => {
          // Find original idea by matching content
          const originalIdea = generatedIdeas.find(idea => idea !== editedIdea);
          if (originalIdea) {
            handleEditIdea(originalIdea, editedIdea);
          }
        }}
        onCopyToClipboard={handleCopyToClipboard}
        onClearAllIdeas={clearAllIdeas}
      />
    </div>
  );
};

export default GenerateIdeas;
