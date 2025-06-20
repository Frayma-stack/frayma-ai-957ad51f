
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from 'lucide-react';
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
  id: 'relevance' | 'results';
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
  onAddSection: (afterSectionId?: string) => void;
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
  const IconComponent = phase.icon;
  
  const getBorderColor = () => {
    switch (phase.id) {
      case 'relevance': return 'border-l-purple-500';
      case 'results': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <Card className={`border-l-4 ${getBorderColor()}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={phase.color}>
              <IconComponent className="h-3 w-3 mr-1" />
              {phase.title}
            </Badge>
            <div>
              <CardTitle className="text-lg">{phase.subtitle}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{phase.plsSteps}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddSection()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Another Headline
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          {phase.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {phase.sections.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <IconComponent className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">AI will generate content sections for {phase.title.toLowerCase()}</p>
            <p className="text-xs text-gray-400 mt-1">Auto-built outline will include an H2 and three supporting H3s</p>
          </div>
        ) : (
          <>
            {phase.sections.map((section, index) => (
              <div key={section.id} className="space-y-4">
                <Out

Section
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
                  onAddSection={() => onAddSection(section.id)}
                  onRemoveSection={() => onRemoveSection(section.id)}
                />
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PLSPhaseSection;
