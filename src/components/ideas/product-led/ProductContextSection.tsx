import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ICPStoryScript, ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator, CustomerSuccessStory } from '@/types/storytelling';

interface ProductContextInputs {
  targetICP: string;
  narrativeAnchor: 'belief' | 'pain' | 'struggle' | 'transformation';
  selectedNarrativeTypes: string[];
  businessContextItem: 'category_pov' | 'unique_insight' | 'mission_vision' | 'success_story' | 'feature' | 'use_case' | 'differentiator' | '';
  selectedFeatures: ProductFeature[];
  selectedUseCases: ProductUseCase[];
  selectedDifferentiators: ProductDifferentiator[];
  selectedSuccessStory: CustomerSuccessStory | null;
  customPOV: string;
  povNarrativeDirection: string;
}

interface ProductContextSectionProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  productInputs: ProductContextInputs;
  onProductInputsChange: (inputs: ProductContextInputs) => void;
  successStories?: CustomerSuccessStory[];
}

const ProductContextSection: FC<ProductContextSectionProps> = ({
  icpScripts,
  productContext,
  productInputs,
  onProductInputsChange,
  successStories = []
}) => {
  const selectedICP = icpScripts.find(icp => icp.id === productInputs.targetICP);

  const getNarrativeTypes = () => {
    if (!selectedICP) return [];
    
    switch (productInputs.narrativeAnchor) {
      case 'belief':
        return selectedICP.coreBeliefs;
      case 'pain':
        return selectedICP.internalPains;
      case 'struggle':
        return selectedICP.externalStruggles;
      case 'transformation':
        return selectedICP.desiredTransformations;
      default:
        return [];
    }
  };

  const handleNarrativeTypeToggle = (narrativeId: string) => {
    const newSelectedTypes = productInputs.selectedNarrativeTypes.includes(narrativeId)
      ? productInputs.selectedNarrativeTypes.filter(id => id !== narrativeId)
      : [...productInputs.selectedNarrativeTypes, narrativeId];
    
    onProductInputsChange({
      ...productInputs,
      selectedNarrativeTypes: newSelectedTypes
    });
  };

  const handleBusinessContextItemChange = (item: 'category_pov' | 'unique_insight' | 'mission_vision' | 'success_story' | 'feature' | 'use_case' | 'differentiator') => {
    onProductInputsChange({
      ...productInputs,
      businessContextItem: item,
      selectedFeatures: item === 'feature' ? productInputs.selectedFeatures : [],
      selectedUseCases: item === 'use_case' ? productInputs.selectedUseCases : [],
      selectedDifferentiators: item === 'differentiator' ? productInputs.selectedDifferentiators : [],
      selectedSuccessStory: item === 'success_story' ? productInputs.selectedSuccessStory : null
    });
  };

  const handleFeatureToggle = (feature: ProductFeature) => {
    const newFeatures = productInputs.selectedFeatures.find(f => f.id === feature.id)
      ? productInputs.selectedFeatures.filter(f => f.id !== feature.id)
      : [...productInputs.selectedFeatures, feature];
    
    onProductInputsChange({
      ...productInputs,
      selectedFeatures: newFeatures
    });
  };

  const handleUseCaseToggle = (useCase: ProductUseCase) => {
    const newUseCases = productInputs.selectedUseCases.find(u => u.id === useCase.id)
      ? productInputs.selectedUseCases.filter(u => u.id !== useCase.id)
      : [...productInputs.selectedUseCases, useCase];
    
    onProductInputsChange({
      ...productInputs,
      selectedUseCases: newUseCases
    });
  };

  const handleDifferentiatorToggle = (differentiator: ProductDifferentiator) => {
    const newDifferentiators = productInputs.selectedDifferentiators.find(d => d.id === differentiator.id)
      ? productInputs.selectedDifferentiators.filter(d => d.id !== differentiator.id)
      : [...productInputs.selectedDifferentiators, differentiator];
    
    onProductInputsChange({
      ...productInputs,
      selectedDifferentiators: newDifferentiators
    });
  };

  const handleSuccessStoryChange = (storyId: string) => {
    const selectedStory = successStories.find(s => s.id === storyId) || null;
    onProductInputsChange({
      ...productInputs,
      selectedSuccessStory: selectedStory
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-story-blue">Business Context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Layer business context to guide Product-Led, GTM Content Ideas Minting.
        </p>
        
        <div>
          <Label className="text-red-600">Target ICP *</Label>
          <Select 
            value={productInputs.targetICP} 
            onValueChange={(value) => onProductInputsChange({
              ...productInputs, 
              targetICP: value, 
              selectedNarrativeTypes: []
            })}
            required
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select ICP StoryScript (Required)" />
            </SelectTrigger>
            <SelectContent>
              {icpScripts.map(icp => (
                <SelectItem key={icp.id} value={icp.id}>{icp.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-red-600">Narrative Anchor *</Label>
          <Select 
            value={productInputs.narrativeAnchor} 
            onValueChange={(value: any) => onProductInputsChange({
              ...productInputs, 
              narrativeAnchor: value, 
              selectedNarrativeTypes: []
            })}
            required
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select Narrative Anchor (Required)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="belief">Core Beliefs</SelectItem>
              <SelectItem value="pain">Internal Pains</SelectItem>
              <SelectItem value="struggle">External Struggles</SelectItem>
              <SelectItem value="transformation">Desired Transformations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedICP && productInputs.narrativeAnchor && (
          <div>
            <Label className="text-red-600">Narrative Type *</Label>
            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded p-3">
              {getNarrativeTypes().map(narrative => (
                <div key={narrative.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={narrative.id}
                    checked={productInputs.selectedNarrativeTypes.includes(narrative.id)}
                    onCheckedChange={() => handleNarrativeTypeToggle(narrative.id)}
                  />
                  <Label htmlFor={narrative.id} className="text-sm">
                    {narrative.content}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label className="text-red-600">Business Context Item *</Label>
          <Select 
            value={productInputs.businessContextItem} 
            onValueChange={(value: any) => handleBusinessContextItemChange(value)}
            required
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select Business Context Item (Required)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category_pov">Category POV</SelectItem>
              <SelectItem value="unique_insight">Unique Insight</SelectItem>
              <SelectItem value="mission_vision">Mission/Vision</SelectItem>
              <SelectItem value="success_story">Success Story</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="use_case">Use Case</SelectItem>
              <SelectItem value="differentiator">Differentiator</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Success Story Selection */}
        {productInputs.businessContextItem === 'success_story' && (
          <div>
            <Label className="text-red-600">Select Success Story *</Label>
            <Select 
              value={productInputs.selectedSuccessStory?.id || ''} 
              onValueChange={handleSuccessStoryChange}
              required
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a success story" />
              </SelectTrigger>
              <SelectContent>
                {successStories.map(story => (
                  <SelectItem key={story.id} value={story.id}>
                    {story.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {productInputs.selectedSuccessStory && (
              <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                <strong>{productInputs.selectedSuccessStory.title}</strong>
                <p className="mt-1 text-gray-600">
                  <strong>Before:</strong> {productInputs.selectedSuccessStory.beforeSummary}
                </p>
                <p className="mt-1 text-gray-600">
                  <strong>After:</strong> {productInputs.selectedSuccessStory.afterSummary}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Feature Selection */}
        {productContext && productInputs.businessContextItem === 'feature' && (
          <div>
            <Label className="text-red-600">Select Product Features *</Label>
            <Select onValueChange={(value) => {
              const feature = productContext.features.find(f => f.id === value);
              if (feature) handleFeatureToggle(feature);
            }}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select features" />
              </SelectTrigger>
              <SelectContent>
                {productContext.features.map(feature => (
                  <SelectItem key={feature.id} value={feature.id}>
                    {feature.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {productInputs.selectedFeatures.length > 0 && (
              <div className="mt-2 space-y-2">
                {productInputs.selectedFeatures.map(feature => (
                  <div key={feature.id} className="p-3 bg-gray-50 rounded text-sm">
                    <strong>{feature.name}</strong>
                    <p className="mt-1 text-gray-600">
                      Benefits: {feature.benefits.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Use Case Selection */}
        {productContext && productInputs.businessContextItem === 'use_case' && (
          <div>
            <Label className="text-red-600">Select Use Cases *</Label>
            <Select onValueChange={(value) => {
              const useCase = productContext.useCases.find(u => u.id === value);
              if (useCase) handleUseCaseToggle(useCase);
            }}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select use cases" />
              </SelectTrigger>
              <SelectContent>
                {productContext.useCases.map(useCase => (
                  <SelectItem key={useCase.id} value={useCase.id}>
                    {useCase.useCase}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {productInputs.selectedUseCases.length > 0 && (
              <div className="mt-2 space-y-2">
                {productInputs.selectedUseCases.map(useCase => (
                  <div key={useCase.id} className="p-3 bg-gray-50 rounded text-sm">
                    <strong>{useCase.useCase}</strong>
                    <p className="mt-1 text-gray-600">
                      <strong>User Role:</strong> {useCase.userRole}
                    </p>
                    <p className="mt-1 text-gray-600">
                      <strong>Description:</strong> {useCase.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Differentiator Selection */}
        {productContext && productInputs.businessContextItem === 'differentiator' && (
          <div>
            <Label className="text-red-600">Select Differentiators *</Label>
            <Select onValueChange={(value) => {
              const differentiator = productContext.differentiators.find(d => d.id === value);
              if (differentiator) handleDifferentiatorToggle(differentiator);
            }}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select differentiators" />
              </SelectTrigger>
              <SelectContent>
                {productContext.differentiators.map(diff => (
                  <SelectItem key={diff.id} value={diff.id}>
                    {diff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {productInputs.selectedDifferentiators.length > 0 && (
              <div className="mt-2 space-y-2">
                {productInputs.selectedDifferentiators.map(diff => (
                  <div key={diff.id} className="p-3 bg-gray-50 rounded text-sm">
                    <strong>{diff.name}</strong>
                    <p className="mt-1 text-gray-600">
                      {diff.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category POV Display */}
        {productContext && productInputs.businessContextItem === 'category_pov' && (
          <div className="p-3 bg-blue-50 rounded text-sm">
            <strong>Category POV:</strong>
            <p className="mt-1 text-gray-700">{productContext.categoryPOV}</p>
          </div>
        )}

        {/* Unique Insight Display */}
        {productContext && productInputs.businessContextItem === 'unique_insight' && (
          <div className="p-3 bg-green-50 rounded text-sm">
            <strong>Unique Insight:</strong>
            <p className="mt-1 text-gray-700">{productContext.uniqueInsight}</p>
          </div>
        )}

        {/* Mission/Vision Display */}
        {productContext && productInputs.businessContextItem === 'mission_vision' && (
          <div className="p-3 bg-purple-50 rounded text-sm">
            <strong>Mission/Vision:</strong>
            <p className="mt-1 text-gray-700">{productContext.companyMission}</p>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default ProductContextSection;