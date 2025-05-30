
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';

interface ProductContextInputs {
  selectedProductContextType: 'features' | 'usecases' | 'differentiators' | '';
  selectedFeatures: ProductFeature[];
  selectedUseCases: ProductUseCase[];
  selectedDifferentiators: ProductDifferentiator[];
}

interface ProductContextSectionProps {
  productContext: ProductContext | null;
  productInputs: ProductContextInputs;
  onProductInputsChange: (inputs: ProductContextInputs) => void;
}

const ProductContextSection: FC<ProductContextSectionProps> = ({
  productContext,
  productInputs,
  onProductInputsChange
}) => {
  if (!productContext) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No product context available for this client
      </div>
    );
  }

  const handleProductContextTypeChange = (type: 'features' | 'usecases' | 'differentiators') => {
    onProductInputsChange({
      ...productInputs,
      selectedProductContextType: type,
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
    <Card className="border-brand-primary/20">
      <CardHeader>
        <CardTitle className="text-brand-primary text-sm">Product Context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Product Context Type</Label>
          <div className="flex flex-col space-y-2 mt-2">
            {productContext.features.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="features"
                  checked={productInputs.selectedProductContextType === 'features'}
                  onCheckedChange={() => handleProductContextTypeChange('features')}
                />
                <Label htmlFor="features" className="text-sm">Product Features ({productContext.features.length})</Label>
              </div>
            )}
            {productContext.useCases.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="usecases"
                  checked={productInputs.selectedProductContextType === 'usecases'}
                  onCheckedChange={() => handleProductContextTypeChange('usecases')}
                />
                <Label htmlFor="usecases" className="text-sm">Use Cases ({productContext.useCases.length})</Label>
              </div>
            )}
            {productContext.differentiators.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="differentiators"
                  checked={productInputs.selectedProductContextType === 'differentiators'}
                  onCheckedChange={() => handleProductContextTypeChange('differentiators')}
                />
                <Label htmlFor="differentiators" className="text-sm">Differentiators ({productContext.differentiators.length})</Label>
              </div>
            )}
          </div>
        </div>

        {productInputs.selectedProductContextType === 'features' && (
          <div>
            <Label className="text-sm font-medium">Select Features</Label>
            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded p-3">
              {productContext.features.map(feature => (
                <div key={feature.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={feature.id}
                    checked={productInputs.selectedFeatures.find(f => f.id === feature.id) !== undefined}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={feature.id} className="text-sm font-medium cursor-pointer">
                      {feature.name}
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                    {feature.benefits.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Benefits: {feature.benefits.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {productInputs.selectedProductContextType === 'usecases' && (
          <div>
            <Label className="text-sm font-medium">Select Use Cases</Label>
            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded p-3">
              {productContext.useCases.map(useCase => (
                <div key={useCase.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={useCase.id}
                    checked={productInputs.selectedUseCases.find(u => u.id === useCase.id) !== undefined}
                    onCheckedChange={() => handleUseCaseToggle(useCase)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={useCase.id} className="text-sm font-medium cursor-pointer">
                      {useCase.useCase}
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="font-medium">Role:</span> {useCase.userRole}
                    </p>
                    <p className="text-xs text-gray-600">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {productInputs.selectedProductContextType === 'differentiators' && (
          <div>
            <Label className="text-sm font-medium">Select Differentiators</Label>
            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded p-3">
              {productContext.differentiators.map(differentiator => (
                <div key={differentiator.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={differentiator.id}
                    checked={productInputs.selectedDifferentiators.find(d => d.id === differentiator.id) !== undefined}
                    onCheckedChange={() => handleDifferentiatorToggle(differentiator)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={differentiator.id} className="text-sm font-medium cursor-pointer">
                      {differentiator.name}
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">{differentiator.description}</p>
                    {differentiator.competitorComparison && (
                      <p className="text-xs text-gray-500 mt-1">
                        vs Competition: {differentiator.competitorComparison}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductContextSection;
