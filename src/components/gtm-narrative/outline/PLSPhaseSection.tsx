
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { CustomerSuccessStory, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import OutlineSectionComponent from './OutlineSection';

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

interface PLSPhase {
  id: 'resonance' | 'relevance' | 'results';
  title: string;
  subtitle: string;
  plsSteps: string;
  description: string;
  icon: any;
  color: string;
  sections: OutlineSection[];
}

interface PLSPhaseSectionProps {
  phase: PLSPhase;
  successStories: CustomerSuccessStory[];
  productFeatures: ProductFeature[];
  productUseCases: ProductUseCase[];
  productDifferentiators: ProductDifferentiator[];
  onUpdateSection: (section: OutlineSection) => void;
  onAddSection: (phase: 'resonance' | 'relevance' | 'results') => void;
  onRemoveSection: (sectionId: string) => void;
  onMoveSectionUp: (sectionId: string) => void;
  onMoveSectionDown: (sectionId: string) => void;
}

const PLSPhaseSection: FC<PLSPhaseSectionProps> = ({
  phase,
  successStories,
  productFeatures,
  productUseCases,
  productDifferentiators,
  onUpdateSection,
  onAddSection,
  onRemoveSection,
  onMoveSectionUp,
  onMoveSectionDown
}) => {
  const PhaseIcon = phase.icon;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={`${phase.color} text-sm px-3 py-1`}>
              <PhaseIcon className="h-4 w-4 mr-2" />
              {phase.title}
            </Badge>
            <div>
              <div className="text-sm font-medium text-gray-900">{phase.subtitle}</div>
              <div className="text-xs text-gray-500">{phase.plsSteps}</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddSection(phase.id)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Section
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-2">{phase.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {phase.sections.length > 0 ? (
          phase.sections.map((section, index) => (
            <OutlineSectionComponent
              key={section.id}
              section={section}
              index={index}
              totalSections={phase.sections.length}
              successStories={successStories}
              productFeatures={productFeatures}
              productUseCases={productUseCases}
              productDifferentiators={productDifferentiators}
              onUpdateSection={(field, value) => {
                const updatedSection = { ...section, [field]: value };
                onUpdateSection(updatedSection);
              }}
              onMoveSection={(direction) => {
                if (direction === 'up') {
                  onMoveSectionUp(section.id);
                } else {
                  onMoveSectionDown(section.id);
                }
              }}
              onAddSection={() => onAddSection(phase.id)}
              onRemoveSection={() => onRemoveSection(section.id)}
            />
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <PhaseIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No sections added for this phase yet</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Section" to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PLSPhaseSection;
