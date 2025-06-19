
import { FC } from 'react';
import { FileText, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface OutlineStepHeaderProps {
  articleSubType: 'newsletter' | 'thought_leadership';
}

const OutlineStepHeader: FC<OutlineStepHeaderProps> = ({ articleSubType }) => {
  const getContentTypeLabel = () => {
    return articleSubType === 'newsletter' 
      ? 'First-Person Narrative Newsletter'
      : 'Thought Leadership & How-to Guide';
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <FileText className="h-5 w-5 text-story-blue mr-2" />
        <h3 className="text-lg font-semibold text-story-blue">Content Architecture</h3>
        <Tooltip>
          <TooltipTrigger>
            <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-xs">
              AI has generated a {getContentTypeLabel()} outline using the Product-Led Storytelling approach and your content discovery triggers. 
              Customize headlines, sections, and link assets to guide the auto-crafting.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default OutlineStepHeader;
