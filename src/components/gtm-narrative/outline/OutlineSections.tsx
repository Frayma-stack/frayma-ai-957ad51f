import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, FileText } from 'lucide-react';
import { CustomerSuccessStory, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import OutlineSectionComponent from './OutlineSection';

interface OutlineSection {
  id: string;
  type: 'H2' | 'H3' | 'H4';
  title: string;
  context?: string;
  plsSteps?: string;
  linkedAssetType?: 'success_story' | 'feature' | 'use_case' | 'differentiator';
  linkedAssetId?: string;
  phase: 'attract' | 'filter' | 'engage' | 'results';
}

interface OutlineSectionsProps {
  sections: OutlineSection[];
  isGeneratingOutline: boolean;
  articleSubType: 'newsletter' | 'thought_leadership';
  successStories: CustomerSuccessStory[];
  productFeatures: ProductFeature[];
  productUseCases: ProductUseCase[];
  productDifferentiators: ProductDifferentiator[];
  onSectionsChange: (sections: OutlineSection[]) => void;
}

const OutlineSections: FC<OutlineSectionsProps> = ({
  sections,
  isGeneratingOutline,
  articleSubType,
  successStories,
  productFeatures,
  productUseCases,
  productDifferentiators,
  onSectionsChange
}) => {
  const getContentTypeLabel = () => {
    return articleSubType === 'newsletter' 
      ? 'First-Person Narrative Newsletter'
      : 'Thought Leadership & How-to Guide';
  };

  const updateSection = (index: number, field: keyof OutlineSection, value: any) => {
    const newSections = [...sections];
    const processedValue = value === "__none__" ? undefined : value;
    newSections[index] = { ...newSections[index], [field]: processedValue };
    onSectionsChange(newSections);
  };

  const addSection = (afterIndex?: number) => {
    const newSection: OutlineSection = {
      id: `custom_${Date.now()}`,
      type: 'H3',
      title: 'New Section',
      context: '',
      phase: 'engage',
      plsSteps: 'PLS Steps 4-6',
      linkedAssetType: undefined,
      linkedAssetId: undefined
    };
    
    const newSections = [...sections];
    if (afterIndex !== undefined) {
      newSections.splice(afterIndex + 1, 0, newSection);
    } else {
      newSections.push(newSection);
    }
    onSectionsChange(newSections);
  };

  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    onSectionsChange(newSections);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newSections.length) {
      [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
      onSectionsChange(newSections);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">PLS-Based Content Outline</CardTitle>
          {isGeneratingOutline && (
            <div className="flex items-center text-sm text-story-blue">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Building outline...
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600">
          AI-generated outline using your content discovery triggers. Edit sections, change heading levels, add your POV, and link assets.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.length > 0 ? (
          <>
            {sections.map((section, index) => (
              <OutlineSectionComponent
                key={section.id}
                section={section}
                index={index}
                totalSections={sections.length}
                successStories={successStories}
                productFeatures={productFeatures}
                productUseCases={productUseCases}
                productDifferentiators={productDifferentiators}
                onUpdateSection={(field, value) => updateSection(index, field, value)}
                onMoveSection={(direction) => moveSection(index, direction)}
                onAddSection={() => addSection(index)}
                onRemoveSection={() => removeSection(index)}
              />
            ))}
            
            <Button 
              variant="outline" 
              onClick={() => addSection()}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Section
            </Button>
          </>
        ) : (
          <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">AI will generate your {getContentTypeLabel()} outline using the PLS framework</p>
            <p className="text-xs text-gray-400 mt-1">Structure will include content discovery triggers and follow the 3Rs Formula</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OutlineSections;
