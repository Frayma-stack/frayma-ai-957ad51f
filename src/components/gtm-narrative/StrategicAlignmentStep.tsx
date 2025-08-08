
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GeneratedIdea } from '@/types/ideas';
import { BusinessContext } from '@/types/storytelling';

interface StrategicAlignmentData {
  ideaTrigger: string;
  selectedIdeaId: string;
  mutualGoal: string;
  targetKeyword: string;
  businessContextItem: string;
  businessContextItemType: 'categoryPOV' | 'uniqueInsight' | 'companyMission' | 'feature' | 'useCase' | 'differentiator' | '';
  businessContextAssetId?: string;
  publishReason: string;
  callToAction: string;
}

interface StrategicAlignmentStepProps {
  data: StrategicAlignmentData;
  ideas: GeneratedIdea[];
  productContexts?: BusinessContext[];
  onDataChange: (field: keyof StrategicAlignmentData, value: string) => void;
}

const StrategicAlignmentStep: FC<StrategicAlignmentStepProps> = ({
  data,
  ideas,
  productContexts = [],
  onDataChange
}) => {
  const handleIdeaSelection = (ideaId: string) => {
    const selectedIdea = ideas.find(idea => idea.id === ideaId);
    if (selectedIdea) {
      onDataChange('selectedIdeaId', ideaId);
      onDataChange('ideaTrigger', selectedIdea.narrative);
    }
  };

  const handleBusinessContextItemTypeChange = (value: string) => {
    onDataChange('businessContextItemType', value);
    // Clear asset selection when type changes
    onDataChange('businessContextAssetId', '');
  };

  // Get available assets based on selected type
  const getAvailableAssets = () => {
    if (!data.businessContextItemType || productContexts.length === 0) return [];
    
    const allAssets: Array<{id: string, name: string, description?: string}> = [];
    
    productContexts.forEach(context => {
      if (data.businessContextItemType === 'feature' && context.features) {
        context.features.forEach(feature => {
          allAssets.push({
            id: feature.id,
            name: feature.name,
            description: feature.description
          });
        });
      } else if (data.businessContextItemType === 'useCase' && context.useCases) {
        context.useCases.forEach(useCase => {
          allAssets.push({
            id: useCase.id,
            name: useCase.useCase,
            description: useCase.description
          });
        });
      } else if (data.businessContextItemType === 'differentiator' && context.differentiators) {
        context.differentiators.forEach(diff => {
          allAssets.push({
            id: diff.id,
            name: diff.name,
            description: diff.description
          });
        });
      }
    });
    
    return allAssets;
  };

  const availableAssets = getAvailableAssets();
  const isProductFocused = ['feature', 'useCase', 'differentiator'].includes(data.businessContextItemType);
  const isThoughtLeadershipFocused = ['categoryPOV', 'uniqueInsight', 'companyMission'].includes(data.businessContextItemType);
  
  // Get selected asset details for display
  const getSelectedAssetName = () => {
    if (!data.businessContextAssetId) return null;
    const selectedAsset = availableAssets.find(asset => asset.id === data.businessContextAssetId);
    return selectedAsset?.name || null;
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Step Header */}
        <div className="flex items-center mb-4">
          <Lightbulb className="h-5 w-5 text-story-blue mr-2" />
          <h3 className="text-lg font-semibold text-story-blue">Strategic Alignment</h3>
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

          <div className="md:col-span-2">
            <label className="text-sm font-medium flex items-center">
              Business Context Item to Cluster Article *
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Choose a specific business context element to subtly weave into your content for product-led storytelling</p>
                </TooltipContent>
              </Tooltip>
            </label>
            <div className="mt-1 space-y-2">
              <Select value={data.businessContextItemType} onValueChange={handleBusinessContextItemTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business context type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="categoryPOV">Category Point of View</SelectItem>
                  <SelectItem value="uniqueInsight">Unique Insight</SelectItem>
                  <SelectItem value="companyMission">Mission/Vision</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="useCase">Use Case</SelectItem>
                  <SelectItem value="differentiator">Differentiator</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Conditional asset selector for product-focused types */}
              {isProductFocused && (
                <div>
                  <label className="text-sm font-medium flex items-center mb-1">
                     Select Specific {data.businessContextItemType === 'useCase' ? 'Use Case' : 
                                    data.businessContextItemType === 'feature' ? 'Feature' : 
                                    'Differentiator'} *
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Choose from your saved {data.businessContextItemType}s to promote in this article</p>
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <Select 
                    value={data.businessContextAssetId || ''} 
                    onValueChange={(value) => onDataChange('businessContextAssetId', value)}
                  >
                    <SelectTrigger>
                       <SelectValue placeholder={`Choose a ${data.businessContextItemType}...`}>
                         {getSelectedAssetName() || `Choose a ${data.businessContextItemType}...`}
                      </SelectValue>
                    </SelectTrigger>
                     <SelectContent className="z-50 bg-background">
                      {availableAssets.map((asset) => (
                        <SelectItem key={asset.id} value={asset.id} className="cursor-pointer">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{asset.name}</span>
                            {asset.description && (
                              <span className="text-xs text-muted-foreground line-clamp-2">
                                {asset.description}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                     </SelectContent>
                  </Select>
                  {availableAssets.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      No {data.businessContextItemType}s found. Add some in your Account settings first.
                    </p>
                  )}
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium flex items-center mb-1">
                  {isThoughtLeadershipFocused ? 'How does this article support your ' : 'How does this article tie back to your '}
                   {data.businessContextItemType === 'categoryPOV' ? 'Category Point of View' :
                    data.businessContextItemType === 'uniqueInsight' ? 'Unique Insight' :
                    data.businessContextItemType === 'companyMission' ? 'Mission/Vision' :
                    data.businessContextItemType === 'feature' ? 'Feature' :
                    data.businessContextItemType === 'useCase' ? 'Use Case' :
                    data.businessContextItemType === 'differentiator' ? 'Differentiator' : 'Business Context Item'}? *
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {isThoughtLeadershipFocused 
                          ? 'Explain how this article will reinforce and advance your chosen strategic position'
                          : 'Describe how the article will subtly lead readers to discover and engage with your product'
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </label>
                <Textarea 
                  placeholder={
                    isThoughtLeadershipFocused 
                       ? `Briefly describe how this article will support and advance your ${data.businessContextItemType === 'categoryPOV' ? 'category perspective' : data.businessContextItemType === 'uniqueInsight' ? 'unique insight' : 'mission/vision'}...`
                       : `Briefly explain how this article will subtly guide readers toward your ${data.businessContextItemType}...`
                  }
                  value={data.businessContextItem}
                  onChange={(e) => onDataChange('businessContextItem', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
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
