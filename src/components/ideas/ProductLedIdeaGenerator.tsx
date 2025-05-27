
import { FC } from 'react';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { useProductLedIdeaGenerator } from './product-led/useProductLedIdeaGenerator';
import TriggerInputSection from './product-led/TriggerInputSection';
import ProductContextSection from './product-led/ProductContextSection';
import GeneratedIdeasViewer from './product-led/GeneratedIdeasViewer';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface ProductLedIdeaGeneratorProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
  selectedClientId?: string;
}

const ProductLedIdeaGenerator: FC<ProductLedIdeaGeneratorProps> = ({
  icpScripts,
  productContext,
  onIdeaAdded,
  onContentTypeSelect,
  selectedClientId
}) => {
  const {
    triggerInput,
    setTriggerInput,
    productInputs,
    setProductInputs,
    generatedIdeas,
    showIdeasViewer,
    isGenerating,
    selectedICP,
    handleGenerateIdeas,
    handleBackToGeneration,
    handleGenerateNewIdeas
  } = useProductLedIdeaGenerator(icpScripts);

  if (showIdeasViewer) {
    return (
      <GeneratedIdeasViewer
        generatedIdeas={generatedIdeas}
        onBackToGeneration={handleBackToGeneration}
        onSaveIdea={onIdeaAdded}
        onGenerateNewIdeas={handleGenerateNewIdeas}
        onContentTypeSelect={onContentTypeSelect}
        selectedClientId={selectedClientId}
        icpId={productInputs.targetICP}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center py-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
        <Lightbulb className="mx-auto h-12 w-12 text-blue-500 mb-3" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Frame Thoughts Into Powerful Ideas</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Transform your insights into compelling content ideas for auto-crafting GTM assets that resonate and propel you and your business forward.
        </p>
      </div>

      <TriggerInputSection
        triggerInput={triggerInput}
        onTriggerInputChange={setTriggerInput}
      />

      <ProductContextSection
        icpScripts={icpScripts}
        productContext={productContext}
        productInputs={productInputs}
        onProductInputsChange={setProductInputs}
      />

      <div className="flex justify-center pt-6">
        <Button
          onClick={handleGenerateIdeas}
          disabled={isGenerating}
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
              Generating Ideas...
            </>
          ) : (
            <>
              <Lightbulb className="h-5 w-5 mr-2" />
              Generate Product-Led Ideas
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductLedIdeaGenerator;
