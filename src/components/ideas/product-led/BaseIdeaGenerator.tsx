
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import TriggerInputSection from './TriggerInputSection';
import ProductContextSection from './ProductContextSection';
import GenerationControls from './GenerationControls';
import GeneratedIdeasViewer from './GeneratedIdeasViewer';
import RegenerationDirectionDialog from './RegenerationDirectionDialog';
import { useProductLedIdeaGenerator } from './useProductLedIdeaGenerator';

interface BaseIdeaGeneratorProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
  selectedClientId?: string;
  layout?: 'vertical' | 'horizontal';
  ideas?: GeneratedIdea[];
}

const BaseIdeaGenerator: FC<BaseIdeaGeneratorProps> = ({
  icpScripts,
  productContext,
  onIdeaAdded,
  onContentTypeSelect,
  selectedClientId,
  layout = 'vertical',
  ideas = []
}) => {
  const {
    triggerInput,
    setTriggerInput,
    productInputs,
    setProductInputs,
    generatedIdeas,
    showIdeasViewer,
    showRegenerationDialog,
    regenerationDirection,
    setRegenerationDirection,
    isGenerating,
    isRegenerating,
    selectedICP,
    handleGenerateIdeas,
    handleBackToGeneration,
    handleGenerateNewIdeas,
    handleRegenerateWithDirection,
    setShowRegenerationDialog
  } = useProductLedIdeaGenerator(icpScripts);

  if (showIdeasViewer) {
    return (
      <>
        <GeneratedIdeasViewer
          generatedIdeas={generatedIdeas}
          onBackToGeneration={handleBackToGeneration}
          onSaveIdea={onIdeaAdded}
          onGenerateNewIdeas={handleGenerateNewIdeas}
          onContentTypeSelect={onContentTypeSelect}
          selectedClientId={selectedClientId}
          icpId={selectedICP?.id || ''}
          isRegenerating={isRegenerating}
        />
        
        <RegenerationDirectionDialog
          isOpen={showRegenerationDialog}
          isGenerating={isGenerating}
          regenerationDirection={regenerationDirection}
          onRegenerationDirectionChange={setRegenerationDirection}
          onRegenerate={handleRegenerateWithDirection}
          onClose={() => setShowRegenerationDialog(false)}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-story-blue flex items-center space-x-2">
            <Sparkles className="h-6 w-6" />
            <span>Product-Led Storytelling Idea Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Generate compelling B2B content ideas that subtly showcase your product's value through narrative-driven storytelling.
          </p>
        </CardContent>
      </Card>

      <div className={layout === 'horizontal' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-6'}>
        <TriggerInputSection
          triggerInput={triggerInput}
          onTriggerInputChange={setTriggerInput}
          ideas={ideas}
          selectedClientId={selectedClientId}
        />

        <ProductContextSection
          productInputs={productInputs}
          onProductInputsChange={setProductInputs}
          icpScripts={icpScripts}
          productContext={productContext}
        />
      </div>

      <GenerationControls
        isGenerating={isGenerating}
        onGenerateIdeas={handleGenerateIdeas}
      />
    </div>
  );
};

export default BaseIdeaGenerator;
