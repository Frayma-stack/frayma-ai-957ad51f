
import { FC } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from 'lucide-react';

interface ContentOutlineData {
  outlineSteps: string[];
}

interface ContentOutlineStepProps {
  data: ContentOutlineData;
  articleSubType: 'newsletter' | 'thought_leadership';
  isGenerating?: boolean;
  onDataChange: (field: keyof ContentOutlineData, value: string[]) => void;
}

const ContentOutlineStep: FC<ContentOutlineStepProps> = ({
  data,
  articleSubType,
  isGenerating = false,
  onDataChange
}) => {
  const updateStep = (index: number, value: string) => {
    const newSteps = [...data.outlineSteps];
    newSteps[index] = value;
    onDataChange('outlineSteps', newSteps);
  };

  const removeStep = (index: number) => {
    const newSteps = data.outlineSteps.filter((_, i) => i !== index);
    onDataChange('outlineSteps', newSteps);
  };

  const addStep = () => {
    onDataChange('outlineSteps', [...data.outlineSteps, '']);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-story-blue">Content Outline</h3>
        {isGenerating && (
          <div className="flex items-center text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Generating outline...
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Content Structure Steps</label>
        <p className="text-sm text-gray-600 mb-4">
          Define the main sections/steps that will structure your {articleSubType === 'newsletter' ? 'newsletter' : 'article'}. Each step should represent a key section of your content.
        </p>
        <div className="space-y-2">
          {data.outlineSteps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <Textarea 
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
                placeholder={`Content section ${index + 1}`}
                rows={2}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeStep(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addStep}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Content Section
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentOutlineStep;
