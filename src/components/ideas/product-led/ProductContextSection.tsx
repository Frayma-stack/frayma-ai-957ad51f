
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ICPStoryScript, ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';

interface ProductContextInputs {
  targetICP: string;
  narrativeAnchor: 'belief' | 'pain' | 'struggle' | 'transformation';
  selectedNarrativeTypes: string[];
  selectedFeatures: ProductFeature[];
  selectedUseCases: ProductUseCase[];
  selectedDifferentiators: ProductDifferentiator[];
  productContextType: 'features' | 'usecases' | 'differentiators' | '';
  customPOV: string;
  povNarrativeDirection: string;
}

interface ProductContextSectionProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  productInputs: ProductContextInputs;
  onProductInputsChange: (inputs: ProductContextInputs) => void;
}

const ProductContextSection: FC<ProductContextSectionProps> = ({
  icpScripts,
  productContext,
  productInputs,
  onProductInputsChange
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

  const handleProductContextTypeChange = (type: 'features' | 'usecases' | 'differentiators') => {
    onProductInputsChange({
      ...productInputs,
      productContextType: type,
      selectedFeatures: type === 'features' ? productInputs.selectedFeatures : [],
      selectedUseCases: type === 'usecases' ? productInputs.selectedUseCases : [],
      selectedDifferentiators: type === 'differentiators' ? productInputs.selectedDifferentiators : []
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-story-blue">Business Context Mapping (Optional)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          If you skip this section, Frayma AI will automatically map your trigger to the best-fit ICP and product context from your saved business context.
        </p>
        <div>
          <Label>Target ICP</Label>
          <Select 
            value={productInputs.targetICP} 
            onValueChange={(value) => onProductInputsChange({
              ...productInputs, 
              targetICP: value, 
              selectedNarrativeTypes: []
            })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select ICP StoryScript" />
            </SelectTrigger>
            <SelectContent>
              {icpScripts.map(icp => (
                <SelectItem key={icp.id} value={icp.id}>{icp.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Narrative Anchor</Label>
          <Select 
            value={productInputs.narrativeAnchor} 
            onValueChange={(value: any) => onProductInputsChange({
              ...productInputs, 
              narrativeAnchor: value, 
              selectedNarrativeTypes: []
            })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
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
            <Label>Narrative Types (select multiple)</Label>
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

        {productContext && (
          <div>
            <Label>Business Context Type (choose one primary)</Label>
            <div className="flex flex-col space-y-2 mt-2">
              {productContext.features.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="features"
                    checked={productInputs.productContextType === 'features'}
                    onCheckedChange={() => handleProductContextTypeChange('features')}
                  />
                  <Label htmlFor="features">Product Features</Label>
                </div>
              )}
              {productContext.useCases.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="usecases"
                    checked={productInputs.productContextType === 'usecases'}
                    onCheckedChange={() => handleProductContextTypeChange('usecases')}
                  />
                  <Label htmlFor="usecases">Use Cases</Label>
                </div>
              )}
              {productContext.differentiators.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="differentiators"
                    checked={productInputs.productContextType === 'differentiators'}
                    onCheckedChange={() => handleProductContextTypeChange('differentiators')}
                  />
                  <Label htmlFor="differentiators">Differentiators</Label>
                </div>
              )}
            </div>
          </div>
        )}

        {productContext && productInputs.productContextType === 'features' && (
          <div>
            <Label>Select Product Features</Label>
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
              <div className="mt-2 text-sm text-gray-600">
                Selected: {productInputs.selectedFeatures.map(f => f.name).join(', ')}
              </div>
            )}
          </div>
        )}

        {productContext && productInputs.productContextType === 'usecases' && (
          <div>
            <Label>Select Use Cases</Label>
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
              <div className="mt-2 text-sm text-gray-600">
                Selected: {productInputs.selectedUseCases.map(u => u.useCase).join(', ')}
              </div>
            )}
          </div>
        )}

        {productContext && productInputs.productContextType === 'differentiators' && (
          <div>
            <Label>Select Differentiators</Label>
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
              <div className="mt-2 text-sm text-gray-600">
                Selected: {productInputs.selectedDifferentiators.map(d => d.name).join(', ')}
              </div>
            )}
          </div>
        )}

        <div>
          <Label>Personal POV (optional)</Label>
          <Textarea
            placeholder="Add your personal POV, narrative, or thinking to shape the ideas..."
            value={productInputs.customPOV}
            onChange={(e) => onProductInputsChange({
              ...productInputs,
              customPOV: e.target.value
            })}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductContextSection;
