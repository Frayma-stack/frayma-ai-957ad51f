
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Target, Filter } from 'lucide-react';
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

interface ResonancePLSSectionProps {
  introPOV: string;
  resonanceSections: OutlineSection[];
  successStories: CustomerSuccessStory[];
  productFeatures: ProductFeature[];
  productUseCases: ProductUseCase[];
  productDifferentiators: ProductDifferentiator[];
  onIntroPOVChange: (value: string) => void;
  onUpdateSection: (section: OutlineSection) => void;
  onAddSection: (afterSectionId?: string) => void;
  onRemoveSection: (sectionId: string) => void;
  onMoveSectionUp: (sectionId: string) => void;
  onMoveSectionDown: (sectionId: string) => void;
}

const ResonancePLSSection: FC<ResonancePLSSectionProps> = ({
  introPOV,
  resonanceSections,
  successStories,
  productFeatures,
  productUseCases,
  productDifferentiators,
  onIntroPOVChange,
  onUpdateSection,
  onAddSection,
  onRemoveSection,
  onMoveSectionUp,
  onMoveSectionDown
}) => {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800">
              <Target className="h-3 w-3 mr-1" />
              Resonance
            </Badge>
            <div>
              <CardTitle className="text-lg">Filter & Build Rapport</CardTitle>
              <p className="text-sm text-gray-600 mt-1">PLS Steps 2-3</p>
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
          After the headline attracts attention, filter for your target ICP and build initial rapport with an engaging introduction and first content section.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Intro POV Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-blue-600" />
            <Label className="text-sm font-medium text-blue-900">
              Introduction Direction & POV
            </Label>
          </div>
          <Textarea
            value={introPOV}
            onChange={(e) => onIntroPOVChange(e.target.value)}
            placeholder="Add your perspective, angle, or specific direction for the article introduction. This will guide Frayma AI to craft an intro that aligns with your vision and filters for your target ICP..."
            rows={4}
            className="bg-white border-blue-200 focus:border-blue-400"
          />
          <p className="text-xs text-blue-600 mt-2">
            This POV will be combined with the first headline's context to auto-craft the complete Resonance section (intro + first content section).
          </p>
        </div>

        {/* First H3 Section */}
        {resonanceSections.length === 0 && (
          <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <Target className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">AI will generate your first content section (H3) based on your inputs</p>
            <p className="text-xs text-gray-400 mt-1">This section filters your audience and builds rapport</p>
          </div>
        )}

        {/* Resonance Sections */}
        {resonanceSections.map((section, index) => (
          <OutlineSectionComponent
            key={section.id}
            section={section}
            index={index}
            totalSections={resonanceSections.length}
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
        ))}
      </CardContent>
    </Card>
  );
};

export default ResonancePLSSection;
