
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GeneratedIdea } from '@/types/ideas';

interface StrategicAlignmentData {
  ideaTrigger: string;
  selectedIdeaId: string;
  mutualGoal: string;
  targetKeyword: string;
  contentCluster: string;
  publishReason: string;
  callToAction: string;
}

interface StrategicAlignmentStepProps {
  data: StrategicAlignmentData;
  ideas: GeneratedIdea[];
  onDataChange: (field: keyof StrategicAlignmentData, value: string) => void;
}

const StrategicAlignmentStep: FC<StrategicAlignmentStepProps> = ({
  data,
  ideas,
  onDataChange
}) => {
  const handleIdeaSelection = (ideaId: string) => {
    const selectedIdea = ideas.find(idea => idea.id === ideaId);
    if (selectedIdea) {
      onDataChange('selectedIdeaId', ideaId);
      onDataChange('ideaTrigger', selectedIdea.narrative);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Step Header */}
        <div className="flex items-center mb-4">
          <Lightbulb className="h-5 w-5 text-story-blue mr-2" />
          <h3 className="text-lg font-semibold text-story-blue">Strategic Foundation</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">These inputs guide AI to create content aligned with your business goals and messaging strategy.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium flex items-center">
              Select from Ideas Bank
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Choose a saved idea to auto-populate the core concept</p>
                </TooltipContent>
              </Tooltip>
            </label>
            <Select value={data.selectedIdeaId} onValueChange={handleIdeaSelection}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose from your saved ideas..." />
              </SelectTrigger>
              <SelectContent>
                {ideas.map((idea) => (
                  <SelectItem key={idea.id} value={idea.id}>
                    {idea.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium flex items-center">
              Core Idea/Trigger/Thesis *
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">The central concept that will anchor your AI-generated narrative</p>
                </TooltipContent>
              </Tooltip>
            </label>
            <Textarea 
              placeholder="What's the core idea, trigger, thesis, or antithesis prompting you to create this piece?"
              value={data.ideaTrigger}
              onChange={(e) => onDataChange('ideaTrigger', e.target.value)}
              rows={2}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium flex items-center">
              Mutual Goal *
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">The shared objective between you and your audience</p>
                </TooltipContent>
              </Tooltip>
            </label>
            <Input 
              placeholder="What's the mutual goal for this piece?"
              value={data.mutualGoal}
              onChange={(e) => onDataChange('mutualGoal', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium flex items-center">
              Main Target Keyword *
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Primary keyword that will guide content optimization</p>
                </TooltipContent>
              </Tooltip>
            </label>
            <Input 
              placeholder="Primary keyword or topic focus"
              value={data.targetKeyword}
              onChange={(e) => onDataChange('targetKeyword', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium flex items-center">
              Content/Service/Product Cluster *
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">The business context that will shape your narrative positioning</p>
                </TooltipContent>
              </Tooltip>
            </label>
            <Input 
              placeholder="What content, service, or product cluster does this relate to?"
              value={data.contentCluster}
              onChange={(e) => onDataChange('contentCluster', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium flex items-center">
              Desired Action *
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">The specific outcome that will guide your content's persuasive structure</p>
                </TooltipContent>
              </Tooltip>
            </label>
            <Input 
              placeholder="What action should readers take after reading?"
              value={data.callToAction}
              onChange={(e) => onDataChange('callToAction', e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium flex items-center">
              Publication Rationale *
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">The business case that will inform your content's strategic angle</p>
                </TooltipContent>
              </Tooltip>
            </label>
            <Textarea 
              placeholder="Why should you/your business publish this piece?"
              value={data.publishReason}
              onChange={(e) => onDataChange('publishReason', e.target.value)}
              rows={2}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StrategicAlignmentStep;
