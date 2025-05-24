
import { FC } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2, FileText, ArrowRight } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-l-4 border-story-blue pl-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-story-blue flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Content Architecture
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              AI-generated outline based on your strategic inputs. This structure will guide the creation of your compelling {articleSubType === 'newsletter' ? 'newsletter' : 'thought leadership article'}.
            </p>
          </div>
          {isGenerating && (
            <div className="flex items-center text-sm text-story-blue">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              AI crafting outline...
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Content Structure Sections</label>
          <p className="text-sm text-gray-600 mb-4">
            Review and refine the AI-generated outline. Each section represents a key part of your narrative that will drive engagement and action.
          </p>
          
          {data.outlineSteps.length === 0 && !isGenerating && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>AI will generate your content outline based on your strategic inputs</p>
            </div>
          )}
          
          <div className="space-y-3">
            {data.outlineSteps.map((step, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-story-blue text-white rounded-full flex items-center justify-center text-sm font-medium mt-1">
                  {index + 1}
                </div>
                <Textarea 
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder={`Section ${index + 1}: Define this part of your narrative`}
                  rows={2}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeStep(index)}
                  className="mt-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {data.outlineSteps.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={addStep}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Content Section
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* AI Generation Preview */}
      {data.outlineSteps.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
            <ArrowRight className="h-4 w-4 mr-2" />
            Ready for AI Content Generation
          </h4>
          <p className="text-xs text-green-700 mb-3">
            Your StoryBrief & Outline is complete. The AI will use this structure to create:
          </p>
          <ul className="text-xs text-green-700 space-y-1">
            <li>• Compelling introduction that hooks your target audience</li>
            <li>• Narrative flow that addresses each outlined section</li>
            <li>• Strategic integration of your chosen keywords and messaging</li>
            <li>• Persuasive conclusion with your defined call-to-action</li>
          </ul>
        </div>
      )}

      {/* AI Guidance Preview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">How this powers AI content creation:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Each section guides AI to create focused, purposeful content blocks</li>
          <li>• Sequential structure ensures logical narrative progression</li>
          <li>• Strategic outline prevents AI from generating unfocused content</li>
          <li>• Your refinements personalize the AI's creative direction</li>
        </ul>
      </div>
    </div>
  );
};

export default ContentOutlineStep;
