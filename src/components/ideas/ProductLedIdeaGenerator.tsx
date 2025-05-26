
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2 } from 'lucide-react';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { useProductLedIdeaGenerator } from './product-led/useProductLedIdeaGenerator';
import TriggerInputSection from './product-led/TriggerInputSection';
import ProductContextSection from './product-led/ProductContextSection';
import GeneratedIdeasViewer from './product-led/GeneratedIdeasViewer';

interface ProductLedIdeaGeneratorProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  selectedClientId?: string;
}

const ProductLedIdeaGenerator: FC<ProductLedIdeaGeneratorProps> = ({
  icpScripts,
  productContext,
  onIdeaAdded,
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
    handleBackToGeneration
  } = useProductLedIdeaGenerator(icpScripts);

  if (showIdeasViewer) {
    return (
      <GeneratedIdeasViewer
        generatedIdeas={generatedIdeas}
        onBackToGeneration={handleBackToGeneration}
        onSaveIdea={onIdeaAdded}
        selectedClientId={selectedClientId}
        icpId={selectedICP?.id || ''}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleGenerateIdeas}
          disabled={isGenerating}
          className="bg-story-blue hover:bg-story-light-blue text-white px-8 py-3"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Product-Led Ideas...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-5 w-5" />
              Generate Ideas
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductLedIdeaGenerator;
