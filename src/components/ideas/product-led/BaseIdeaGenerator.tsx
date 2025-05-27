import { FC } from 'react';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { useProductLedIdeaGenerator } from './useProductLedIdeaGenerator';
import TriggerInputSection from './TriggerInputSection';
import ProductContextSection from './ProductContextSection';
import GeneratedIdeasViewer from './GeneratedIdeasViewer';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface BaseIdeaGeneratorProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
  selectedClientId?: string;
  layout?: 'vertical' | 'horizontal';
}

const BaseIdeaGenerator: FC<BaseIdeaGeneratorProps> = ({
  icpScripts,
  productContext,
  onIdeaAdded,
  onContentTypeSelect,
  selectedClientId,
  layout = 'vertical'
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

  const renderHeader = () => (
    <div className="text-center py-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
      <Lightbulb className="mx-auto h-12 w-12 text-brand-primary mb-3" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Frame Thoughts Into Powerful Ideas</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Transform your insights into compelling content ideas for auto-crafting GTM assets that resonate and propel you and your business forward.
      </p>
    </div>
  );

  const renderGenerateButton = () => (
    <div className="flex justify-center pt-6">
      <Button
        onClick={handleGenerateIdeas}
        disabled={isGenerating}
        size="lg"
        className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-3"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
            Minting Ideas...
          </>
        ) : (
          <>
            <Lightbulb className="h-5 w-5 mr-2" />
            Mint Fresh Ideas
          </>
        )}
      </Button>
    </div>
  );

  const renderVerticalLayout = () => (
    <div className="space-y-8">
      {renderHeader()}
      
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

      {renderGenerateButton()}
    </div>
  );

  const renderHorizontalLayout = () => (
    <div className="space-y-6">
      {renderHeader()}

      <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="p-6 h-full">
            <TriggerInputSection
              triggerInput={triggerInput}
              onTriggerInputChange={setTriggerInput}
            />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="p-6 h-full">
            <ProductContextSection
              icpScripts={icpScripts}
              productContext={productContext}
              productInputs={productInputs}
              onProductInputsChange={setProductInputs}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {renderGenerateButton()}
    </div>
  );

  return layout === 'horizontal' ? renderHorizontalLayout() : renderVerticalLayout();
};

export default BaseIdeaGenerator;
