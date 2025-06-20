
import { FC } from 'react';
import { CustomerSuccessStory, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import { Lightbulb, TrendingUp } from 'lucide-react';
import ResonancePLSSection from './ResonancePLSSection';
import PLSPhaseSection from './PLSPhaseSection';

interface OutlineSection {
  id: string;
  type: 'H2' | 'H3' | 'H4';
  title: string;
  context?: string;
  linkedAssetType?: 'success_story' | 'feature' | 'use_case' | 'differentiator';
  linkedAssetId?: string;
  phase: 'resonance' | 'relevance' | 'results';
  plsSteps: string;
}

interface OutlineSectionManagerProps {
  introPOV: string;
  outlineSections: OutlineSection[];
  successStories: CustomerSuccessStory[];
  productFeatures: ProductFeature[];
  productUseCases: ProductUseCase[];
  productDifferentiators: ProductDifferentiator[];
  onIntroPOVChange: (value: string) => void;
  onDataChange: (field: string, value: any) => void;
}

const OutlineSectionManager: FC<OutlineSectionManagerProps> = ({
  introPOV,
  outlineSections,
  successStories,
  productFeatures,
  productUseCases,
  productDifferentiators,
  onIntroPOVChange,
  onDataChange
}) => {
  // Organize sections by PLS phases
  const resonanceSections = outlineSections.filter(s => s.phase === 'resonance');
  
  const plsPhases = [
    {
      id: 'relevance' as const,
      title: 'Relevance',
      subtitle: 'Engage & Show Value',
      plsSteps: 'PLS Steps 4-6',
      description: 'Tackle the main query/problem statement with valuable insights and show how your solution is relevant.',
      icon: Lightbulb,
      color: 'bg-purple-100 text-purple-800',
      sections: outlineSections.filter(s => s.phase === 'relevance')
    },
    {
      id: 'results' as const,
      title: 'Results',
      subtitle: 'Persuade & Convert',
      plsSteps: 'PLS Steps 7-9',
      description: 'Address remaining concerns, provide social proof, and drive action with compelling CTAs.',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-800',
      sections: outlineSections.filter(s => s.phase === 'results')
    }
  ];

  const updateSection = (updatedSection: OutlineSection) => {
    const newSections = outlineSections.map(section => 
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
      const sections = [...outlineSections];
      const insertIndex = sections.findIndex(s => s.id === afterSectionId) + 1;
      sections.splice(insertIndex, 0, newSection);
      onDataChange('outlineSections', sections);
    } else {
      // Add to end of sections
      onDataChange('outlineSections', [...outlineSections, newSection]);
    }
  };

  const removeSection = (sectionId: string) => {
    const newSections = outlineSections.filter(section => section.id !== sectionId);
    onDataChange('outlineSections', newSections);
  };

  const moveSectionUp = (sectionId: string) => {
    const sections = [...outlineSections];
    const index = sections.findIndex(s => s.id === sectionId);
    if (index > 0) {
      [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
      onDataChange('outlineSections', sections);
    }
  };

  const moveSectionDown = (sectionId: string) => {
    const sections = [...outlineSections];
    const index = sections.findIndex(s => s.id === sectionId);
    if (index < sections.length - 1) {
      [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
      onDataChange('outlineSections', sections);
    }
  };

  return (
    <div className="space-y-6">
      {/* Resonance Section (PLS Steps 2-3) */}
      <ResonancePLSSection
        introPOV={introPOV}
        resonanceSections={resonanceSections}
        successStories={successStories}
        productFeatures={productFeatures}
        productUseCases={productUseCases}
        productDifferentiators={productDifferentiators}
        onIntroPOVChange={onIntroPOVChange}
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
          productFeatures={productFeatures}
          productUseCases={productUseCases}
          productDifferentiators={productDifferentiators}
          onUpdateSection={updateSection}
          onAddSection={(afterSectionId) => addSectionToPhase(phase.id, afterSectionId)}
          onRemoveSection={removeSection}
          onMoveSectionUp={moveSectionUp}
          onMoveSectionDown={moveSectionDown}
        />
      ))}
    </div>
  );
};

export default OutlineSectionManager;
