import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BusinessContext } from '@/types/storytelling';

export type BusinessContextItemType = 'categoryPOV' | 'uniqueInsight' | 'companyMission' | 'feature' | 'useCase' | 'differentiator' | '';

interface BusinessContextItemSelectorProps {
  businessContextItemType: BusinessContextItemType;
  businessContextItem: string;
  businessContextAssetId?: string;
  productContexts?: BusinessContext[];
  onBusinessContextItemTypeChange: (value: string) => void;
  onBusinessContextItemChange: (value: string) => void;
  onBusinessContextAssetIdChange?: (value: string) => void;
  label?: string;
  required?: boolean;
}

const BusinessContextItemSelector: React.FC<BusinessContextItemSelectorProps> = ({
  businessContextItemType,
  businessContextItem,
  businessContextAssetId,
  productContexts = [],
  onBusinessContextItemTypeChange,
  onBusinessContextItemChange,
  onBusinessContextAssetIdChange,
  label = "Business Context Item",
  required = true
}) => {
  const handleBusinessContextItemTypeChange = (value: string) => {
    onBusinessContextItemTypeChange(value);
    // Clear asset selection when type changes
    if (onBusinessContextAssetIdChange) {
      onBusinessContextAssetIdChange('');
    }
  };

  // Get available assets based on selected type
  const getAvailableAssets = () => {
    if (!businessContextItemType || productContexts.length === 0) return [];
    
    const allAssets: Array<{id: string, name: string, description?: string}> = [];
    
    productContexts.forEach(context => {
      if (businessContextItemType === 'feature' && context.features) {
        context.features.forEach(feature => {
          allAssets.push({
            id: feature.id,
            name: feature.name,
            description: feature.description
          });
        });
      } else if (businessContextItemType === 'useCase' && context.useCases) {
        context.useCases.forEach(useCase => {
          allAssets.push({
            id: useCase.id,
            name: useCase.useCase,
            description: useCase.description
          });
        });
      } else if (businessContextItemType === 'differentiator' && context.differentiators) {
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
  const isProductFocused = ['feature', 'useCase', 'differentiator'].includes(businessContextItemType);
  const isThoughtLeadershipFocused = ['categoryPOV', 'uniqueInsight', 'companyMission'].includes(businessContextItemType);
  
  // Get selected asset details for display
  const getSelectedAssetName = () => {
    if (!businessContextAssetId) return null;
    const selectedAsset = availableAssets.find(asset => asset.id === businessContextAssetId);
    return selectedAsset?.name || null;
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center">
          {label} {required && '*'}
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Choose a specific business context element to subtly weave into your content for product-led storytelling</p>
            </TooltipContent>
          </Tooltip>
        </label>
        
        <div className="space-y-3">
          <Select value={businessContextItemType} onValueChange={handleBusinessContextItemTypeChange}>
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
          {isProductFocused && onBusinessContextAssetIdChange && (
            <div>
              <label className="text-sm font-medium flex items-center mb-2">
                Select Specific {businessContextItemType === 'useCase' ? 'Use Case' : 
                              businessContextItemType === 'feature' ? 'Feature' : 
                              'Differentiator'} {required && '*'}
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Choose from your saved {businessContextItemType}s to promote in this content</p>
                  </TooltipContent>
                </Tooltip>
              </label>
              <Select 
                value={businessContextAssetId || ''} 
                onValueChange={onBusinessContextAssetIdChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Choose a ${businessContextItemType}...`}>
                    {getSelectedAssetName() || `Choose a ${businessContextItemType}...`}
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
                  No {businessContextItemType}s found. Add some in your Account settings first.
                </p>
              )}
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium flex items-center mb-2">
              {isThoughtLeadershipFocused ? 'How does this content support your ' : 'How does this content tie back to your '}
              {businessContextItemType === 'categoryPOV' ? 'Category Point of View' :
               businessContextItemType === 'uniqueInsight' ? 'Unique Insight' :
               businessContextItemType === 'companyMission' ? 'Mission/Vision' :
               businessContextItemType === 'feature' ? 'Feature' :
               businessContextItemType === 'useCase' ? 'Use Case' :
               businessContextItemType === 'differentiator' ? 'Differentiator' : 'Business Context Item'}? {required && '*'}
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {isThoughtLeadershipFocused 
                      ? 'Explain how this content will reinforce and advance your chosen strategic position'
                      : 'Describe how the content will subtly lead readers to discover and engage with your product'
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </label>
            <Textarea 
              placeholder={
                isThoughtLeadershipFocused 
                  ? `Briefly describe how this content will support and advance your ${businessContextItemType === 'categoryPOV' ? 'category perspective' : businessContextItemType === 'uniqueInsight' ? 'unique insight' : 'mission/vision'}...`
                  : `Briefly explain how this content will subtly guide readers toward your ${businessContextItemType}...`
              }
              value={businessContextItem}
              onChange={(e) => onBusinessContextItemChange(e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BusinessContextItemSelector;