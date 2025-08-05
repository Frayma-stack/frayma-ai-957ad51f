
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import TriggerInputSection from './TriggerInputSection';
import ProductContextSection from './ProductContextSection';
import POVNarrativeSection from './POVNarrativeSection';
import GenerationControls from './GenerationControls';
import GeneratedIdeasViewer from './GeneratedIdeasViewer';
import EnhancedRegenerationDialog from './EnhancedRegenerationDialog';
import SpecificIdeaGenerationDialog from './SpecificIdeaGenerationDialog';
import { useProductLedIdeaGenerator } from './useProductLedIdeaGenerator';

interface BaseIdeaGeneratorProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
  selectedClientId?: string;
  layout?: 'vertical' | 'horizontal';
  ideas?: GeneratedIdea[];
  successStories?: any[];
}

const BaseIdeaGenerator: FC<BaseIdeaGeneratorProps> = ({
  icpScripts,
  productContext,
  onIdeaAdded,
  onContentTypeSelect,
  selectedClientId,
  layout = 'vertical',
  ideas = [],
  successStories = []
}) => {
  const {
    triggerInput,
    setTriggerInput,
    productInputs,
    setProductInputs,
    generatedIdeas,
    showIdeasViewer,
    showRegenerationDialog,
    showSpecificGenerationDialog,
    regenerationDirection,
    setRegenerationDirection,
    isGenerating,
    isRegenerating,
    selectedICP,
    handleGenerateIdeas,
    handleBackToGeneration,
    handleGenerateNewIdeas,
    handleGenerateSpecificIdeas,
    handleRegenerateWithDirection,
    handleEnhancedRegeneration,
    setShowRegenerationDialog,
    setShowSpecificGenerationDialog
  } = useProductLedIdeaGenerator(icpScripts, productContext);

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
        
        <EnhancedRegenerationDialog
          isOpen={showRegenerationDialog}
          isGenerating={isGenerating}
          regenerationDirection={regenerationDirection}
          currentProductInputs={productInputs}
          icpScripts={icpScripts}
          productContext={productContext}
          successStories={successStories}
          onRegenerationDirectionChange={setRegenerationDirection}
          onRegenerate={handleEnhancedRegeneration}
          onClose={() => setShowRegenerationDialog(false)}
        />

        <SpecificIdeaGenerationDialog
          isOpen={showSpecificGenerationDialog}
          isGenerating={isGenerating}
          icpScripts={icpScripts}
          productContext={productContext}
          onClose={() => setShowSpecificGenerationDialog(false)}
          onGenerate={handleGenerateSpecificIdeas}
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
            <span>Mint Fresh Product-Led Ideas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Frame random thoughts or idea triggers into fresh ideas to power auto-crafting ICP-moving GTM assets.
          </p>
        </CardContent>
      </Card>

      <div className={layout === 'horizontal' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-6'}>
        <TriggerInputSection
          triggerInput={triggerInput}
          onTriggerInputChange={setTriggerInput}
          ideas={ideas}
          selectedClientId={selectedClientId}
          icpScripts={icpScripts}
          productContext={productContext}
          categoryPOV={productContext?.categoryPOV}
          uniqueInsight={productContext?.uniqueInsight}
          mission={productContext?.companyMission}
        />

        <ProductContextSection
          productInputs={productInputs}
          onProductInputsChange={setProductInputs}
          icpScripts={icpScripts}
          productContext={productContext}
          successStories={successStories}
        />
      </div>

      <POVNarrativeSection
        povContent={productInputs.povNarrativeDirection}
        onPOVChange={(content) => setProductInputs({ ...productInputs, povNarrativeDirection: content })}
      />

      <GenerationControls
        isGenerating={isGenerating}
        onGenerateIdeas={handleGenerateIdeas}
      />
    </div>
  );
};

export default BaseIdeaGenerator;
