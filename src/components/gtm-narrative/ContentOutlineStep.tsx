
import { FC } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2, FileText, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <div className="space-y-4">
        {/* Minimal Step Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-story-blue mr-2" />
            <h3 className="text-lg font-semibold text-story-blue">Content Architecture</h3>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">AI-generated outline that structures your compelling {articleSubType === 'newsletter' ? 'newsletter' : 'thought leadership article'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          {isGenerating && (
            <div className="flex items-center text-xs text-story-blue">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              AI crafting...
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {data.outlineSteps.length === 0 && !isGenerating && (
            <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">AI will generate your content outline</p>
            </div>
          )}
          
          {data.outlineSteps.map((step, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-story-blue text-white rounded-full flex items-center justify-center text-xs font-medium mt-2">
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
                className="mt-2 h-8 w-8"
              >
                <X className="h-3 w-3" />
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
              <Plus className="h-4 w-4 mr-2" /> Add Section
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ContentOutlineStep;
