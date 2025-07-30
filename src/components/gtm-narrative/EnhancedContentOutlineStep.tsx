import { FC, useState, useEffect } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { CustomerSuccessStory, ProductFeature, ProductUseCase, ProductDifferentiator, Author, ProductContext } from '@/types/storytelling';
import { supabaseDataService } from '@/services/SupabaseDataService';
import OutlineStepHeader from './outline/OutlineStepHeader';
import SelectedHeadlineDisplay from './outline/SelectedHeadlineDisplay';
import ThreeRsFormulaCard from './outline/ThreeRsFormulaCard';
import HeadlinePLSSection from './outline/HeadlinePLSSection';
import ResonancePLSSection from './outline/ResonancePLSSection';
import PLSPhaseSection from './outline/PLSPhaseSection';
import AutoCraftingReadinessDialog, { AutoCraftingConfig } from './outline/AutoCraftingReadinessDialog';
import { Lightbulb, TrendingUp } from 'lucide-react';

interface HeadlineOption {
  id: string;
  text: string;
  isGenerated: boolean;
}

interface OutlineSection {
  id: string;
  type: 'H2' | 'H3' | 'H4';
  title: string;
  context?: string;
  linkedAssetType?: 'categoryPOV' | 'uniqueInsight' | 'companyMission' | 'success_story' | 'feature' | 'use_case' | 'differentiator';
  linkedAssetId?: string;
  phase: 'resonance' | 'relevance' | 'results';
  plsSteps: string;
}

interface EnhancedContentOutlineData {
  headlineOptions: HeadlineOption[];
  selectedHeadline: string;
  introPOV: string;
  outlineSections: OutlineSection[];
}

interface EnhancedContentOutlineStepProps {
  data: EnhancedContentOutlineData;
  articleSubType: 'newsletter' | 'thought_leadership';
  successStories: CustomerSuccessStory[];
  productFeatures: ProductFeature[];
  productUseCases: ProductUseCase[];
  productDifferentiators: ProductDifferentiator[];
  authors: Author[];
  isGeneratingHeadlines?: boolean;
  isGeneratingOutline?: boolean;
  onDataChange: (field: keyof EnhancedContentOutlineData, value: any) => void;
  onAddHeadline: () => void;
  onProceedToAutoCrafting: (config: AutoCraftingConfig) => void;
}

const EnhancedContentOutlineStep: FC<EnhancedContentOutlineStepProps> = ({
  data,
  articleSubType,
  successStories,
  productFeatures: initialProductFeatures,
  productUseCases: initialProductUseCases,
  productDifferentiators: initialProductDifferentiators,
  authors = [],
  isGeneratingHeadlines = false,
  isGeneratingOutline = false,
  onDataChange,
  onAddHeadline,
  onProceedToAutoCrafting
}) => {
  const [showAutoCraftingDialog, setShowAutoCraftingDialog] = useState(false);
  const [productContexts, setProductContexts] = useState<ProductContext[]>([]);
  const [allProductFeatures, setAllProductFeatures] = useState<ProductFeature[]>(initialProductFeatures);
  const [allProductUseCases, setAllProductUseCases] = useState<ProductUseCase[]>(initialProductUseCases);
  const [allProductDifferentiators, setAllProductDifferentiators] = useState<ProductDifferentiator[]>(initialProductDifferentiators);

  // Load additional product context data
  useEffect(() => {
    const loadProductContextData = async () => {
      try {
        const contexts = await supabaseDataService.getProductContexts();
        setProductContexts(contexts);
        
        // Aggregate all features, use cases, and differentiators from product contexts
        const allFeatures: ProductFeature[] = [...initialProductFeatures];
        const allUseCases: ProductUseCase[] = [...initialProductUseCases];
        const allDifferentiators: ProductDifferentiator[] = [...initialProductDifferentiators];
        
        contexts.forEach(context => {
          if (context.features) {
            allFeatures.push(...context.features);
          }
          if (context.useCases) {
            allUseCases.push(...context.useCases);
          }
          if (context.differentiators) {
            allDifferentiators.push(...context.differentiators);
          }
        });
        
        setAllProductFeatures(allFeatures);
        setAllProductUseCases(allUseCases);
        setAllProductDifferentiators(allDifferentiators);
        
        console.log('Asset data loaded:', {
          features: allFeatures.length,
          useCases: allUseCases.length,
          differentiators: allDifferentiators.length,
          successStories: successStories.length
        });
      } catch (error) {
        console.error('Error loading product context data:', error);
      }
    };

    loadProductContextData();
  }, [initialProductFeatures, initialProductUseCases, initialProductDifferentiators, successStories]);

  const handleAddHeadline = (headline: HeadlineOption) => {
    onDataChange('headlineOptions', [...data.headlineOptions, headline]);
  };

  // Organize sections by PLS phases - separate resonance from others
  const resonanceSections = data.outlineSections.filter(s => s.phase === 'resonance');
  
  const plsPhases = [
    {
      id: 'relevance' as const,
      title: 'Relevance',
      subtitle: 'Engage & Show Value',
      plsSteps: 'PLS Steps 4-6',
      description: 'Tackle the main query/problem statement with valuable insights and show how your solution is relevant.',
      icon: Lightbulb,
      color: 'bg-purple-100 text-purple-800',
      sections: data.outlineSections.filter(s => s.phase === 'relevance')
    },
    {
      id: 'results' as const,
      title: 'Results',
      subtitle: 'Persuade & Convert',
      plsSteps: 'PLS Steps 7-9',
      description: 'Address remaining concerns, provide social proof, and drive action with compelling CTAs.',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-800',
      sections: data.outlineSections.filter(s => s.phase === 'results')
    }
  ];

  const updateSection = (updatedSection: OutlineSection) => {
    const newSections = data.outlineSections.map(section => 
      section.id === updatedSection.id ? updatedSection : section
    );
    onDataChange('outlineSections', newSections);
  };

  const addSectionToPhase = (phase: 'resonance' | 'relevance' | 'results', afterSectionId?: string) => {
    const plsStepsMap = {
      resonance: 'PLS Steps 2-3',
      relevance: 'PLS Steps 4-6', 
      results: 'PLS Steps 7-9'
    };

    const newSection: OutlineSection = {
      id: `custom_${Date.now()}`,
      type: 'H3',
      title: 'New Headline',
      context: '',
      phase,
      plsSteps: plsStepsMap[phase],
      linkedAssetType: undefined,
      linkedAssetId: undefined
    };
    
    if (afterSectionId) {
      // Insert after specific section
      const sections = [...data.outlineSections];
      const insertIndex = sections.findIndex(s => s.id === afterSectionId) + 1;
      sections.splice(insertIndex, 0, newSection);
      onDataChange('outlineSections', sections);
    } else {
      // Add to end of sections
      onDataChange('outlineSections', [...data.outlineSections, newSection]);
    }
  };

  const removeSection = (sectionId: string) => {
    const newSections = data.outlineSections.filter(section => section.id !== sectionId);
    onDataChange('outlineSections', newSections);
  };

  const moveSectionUp = (sectionId: string) => {
    const sections = [...data.outlineSections];
    const index = sections.findIndex(s => s.id === sectionId);
    if (index > 0) {
      [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
      onDataChange('outlineSections', sections);
    }
  };

  const moveSectionDown = (sectionId: string) => {
    const sections = [...data.outlineSections];
    const index = sections.findIndex(s => s.id === sectionId);
    if (index < sections.length - 1) {
      [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
      onDataChange('outlineSections', sections);
    }
  };

  const canProceedToAutoCrafting = () => {
    return data.selectedHeadline && 
           authors.length > 0 && 
           (resonanceSections.length > 0 || plsPhases.some(phase => phase.sections.length > 0));
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <OutlineStepHeader articleSubType={articleSubType} />

        {/* Show Selected Headline */}
        <SelectedHeadlineDisplay 
          selectedHeadline={data.selectedHeadline}
          headlineOptions={data.headlineOptions}
        />
        
        <ThreeRsFormulaCard />

        <HeadlinePLSSection
          headlineOptions={data.headlineOptions}
          selectedHeadline={data.selectedHeadline}
          introPOV={data.introPOV || ''}
          isGeneratingHeadlines={isGeneratingHeadlines}
          onHeadlineChange={(value) => onDataChange('selectedHeadline', value)}
          onIntroPOVChange={(value) => onDataChange('introPOV', value)}
          onAddHeadline={handleAddHeadline}
        />

        {/* Resonance Section (PLS Steps 2-3) */}
        <ResonancePLSSection
          introPOV={data.introPOV || ''}
          resonanceSections={resonanceSections}
          successStories={successStories}
          productFeatures={allProductFeatures}
          productUseCases={allProductUseCases}
          productDifferentiators={allProductDifferentiators}
          onIntroPOVChange={(value) => onDataChange('introPOV', value)}
          onUpdateSection={updateSection}
          onAddSection={(afterSectionId) => addSectionToPhase('resonance', afterSectionId)}
          onRemoveSection={removeSection}
          onMoveSectionUp={moveSectionUp}
          onMoveSectionDown={moveSectionDown}
        />

        {plsPhases.map((phase) => (
          <PLSPhaseSection
            key={phase.id}
            phase={phase}
            successStories={successStories}
            productFeatures={allProductFeatures}
            productUseCases={allProductUseCases}
            productDifferentiators={allProductDifferentiators}
            onUpdateSection={updateSection}
            onAddSection={(afterSectionId) => addSectionToPhase(phase.id, afterSectionId)}
            onRemoveSection={removeSection}
            onMoveSectionUp={moveSectionUp}
            onMoveSectionDown={moveSectionDown}
          />
        ))}

        {/* Ready for Auto-Crafting Button */}
        <div className="flex justify-center pt-6">
          <Button 
            onClick={() => setShowAutoCraftingDialog(true)}
            disabled={!canProceedToAutoCrafting()}
            size="lg"
            className="bg-story-blue hover:bg-story-blue/90"
          >
            Ready for Auto-Crafting
          </Button>
        </div>

        <AutoCraftingReadinessDialog
          isOpen={showAutoCraftingDialog}
          authors={authors}
          onClose={() => setShowAutoCraftingDialog(false)}
          onProceedToAutoCrafting={(config) => {
            setShowAutoCraftingDialog(false);
            onProceedToAutoCrafting(config);
          }}
        />
      </div>
    </TooltipProvider>
  );
};

export default EnhancedContentOutlineStep;
