
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import { Plus, Trash } from 'lucide-react';

interface ProductContextFormProps {
  categoryPOV: string;
  companyMission: string;
  uniqueInsight: string;
  features: ProductFeature[];
  useCases: ProductUseCase[];
  differentiators: ProductDifferentiator[];
  onCategoryPOVChange: (value: string) => void;
  onCompanyMissionChange: (value: string) => void;
  onUniqueInsightChange: (value: string) => void;
  onFeaturesChange: (features: ProductFeature[]) => void;
  onUseCasesChange: (useCases: ProductUseCase[]) => void;
  onDifferentiatorsChange: (differentiators: ProductDifferentiator[]) => void;
}

const ProductContextForm: FC<ProductContextFormProps> = ({
  categoryPOV,
  companyMission,
  uniqueInsight,
  features,
  useCases,
  differentiators,
  onCategoryPOVChange,
  onCompanyMissionChange,
  onUniqueInsightChange,
  onFeaturesChange,
  onUseCasesChange,
  onDifferentiatorsChange
}) => {
  // Feature management functions
  const addFeature = () => {
    onFeaturesChange([...features, { id: crypto.randomUUID(), name: '', benefits: [''], media: [] }]);
  };

  const removeFeature = (index: number) => {
    onFeaturesChange(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    onFeaturesChange(updated);
  };

  const addFeatureBenefit = (featureIndex: number) => {
    const updated = [...features];
    updated[featureIndex].benefits.push('');
    onFeaturesChange(updated);
  };

  const removeFeatureBenefit = (featureIndex: number, benefitIndex: number) => {
    const updated = [...features];
    if (updated[featureIndex].benefits.length > 1) {
      updated[featureIndex].benefits.splice(benefitIndex, 1);
      onFeaturesChange(updated);
    }
  };

  const updateFeatureBenefit = (featureIndex: number, benefitIndex: number, value: string) => {
    const updated = [...features];
    updated[featureIndex].benefits[benefitIndex] = value;
    onFeaturesChange(updated);
  };

  // Use Case management functions
  const addUseCase = () => {
    onUseCasesChange([...useCases, { id: crypto.randomUUID(), useCase: '', userRole: '', description: '', media: [] }]);
  };

  const removeUseCase = (index: number) => {
    onUseCasesChange(useCases.filter((_, i) => i !== index));
  };

  const updateUseCase = (index: number, field: string, value: string) => {
    const updated = [...useCases];
    updated[index] = { ...updated[index], [field]: value };
    onUseCasesChange(updated);
  };

  // Differentiator management functions
  const addDifferentiator = () => {
    onDifferentiatorsChange([...differentiators, { id: crypto.randomUUID(), name: '', description: '', competitorComparison: '' }]);
  };

  const removeDifferentiator = (index: number) => {
    onDifferentiatorsChange(differentiators.filter((_, i) => i !== index));
  };

  const updateDifferentiator = (index: number, field: string, value: string) => {
    const updated = [...differentiators];
    updated[index] = { ...updated[index], [field]: value };
    onDifferentiatorsChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Product Context</CardTitle>
        <CardDescription>
          This section will be populated after analysis, but you can also fill it manually
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Core Product Narrative */}
        <div className="space-y-3">
          <h4 className="font-medium">Core Product Narrative</h4>
          
          <div className="space-y-2">
            <Label className="text-sm">Category Point of View</Label>
            <Textarea
              value={categoryPOV}
              onChange={(e) => onCategoryPOVChange(e.target.value)}
              placeholder="Company's perspective on the industry/category"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Company Mission</Label>
            <Textarea
              value={companyMission}
              onChange={(e) => onCompanyMissionChange(e.target.value)}
              placeholder="The company's mission statement"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Unique Insight</Label>
            <Textarea
              value={uniqueInsight}
              onChange={(e) => onUniqueInsightChange(e.target.value)}
              placeholder="Unique perspective the company brings"
              rows={2}
            />
          </div>
        </div>

        {/* Features & Benefits */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Features & Benefits</h4>
            <Button type="button" onClick={addFeature} variant="outline" size="sm">
              <Plus className="h-3 w-3 mr-1" />
              Add Feature
            </Button>
          </div>

          {features.map((feature, index) => (
            <div key={feature.id} className="border rounded p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <Input
                    value={feature.name}
                    onChange={(e) => updateFeature(index, 'name', e.target.value)}
                    placeholder="Feature name"
                    className="text-sm"
                  />
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Benefits</Label>
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex gap-1">
                        <Input
                          value={benefit}
                          onChange={(e) => updateFeatureBenefit(index, benefitIndex, e.target.value)}
                          placeholder="Benefit description"
                          className="text-sm"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeFeatureBenefit(index, benefitIndex)}
                          disabled={feature.benefits.length === 1}
                          className="h-8 w-8"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addFeatureBenefit(index)}
                      className="text-xs h-6"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Benefit
                    </Button>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeFeature(index)}
                  className="ml-2 h-8 w-8"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Use Cases */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Use Cases</h4>
            <Button type="button" onClick={addUseCase} variant="outline" size="sm">
              <Plus className="h-3 w-3 mr-1" />
              Add Use Case
            </Button>
          </div>

          {useCases.map((useCase, index) => (
            <div key={useCase.id} className="border rounded p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <Input
                    value={useCase.useCase}
                    onChange={(e) => updateUseCase(index, 'useCase', e.target.value)}
                    placeholder="Use case title"
                    className="text-sm"
                  />
                  <Input
                    value={useCase.userRole}
                    onChange={(e) => updateUseCase(index, 'userRole', e.target.value)}
                    placeholder="Target user role/persona"
                    className="text-sm"
                  />
                  <Textarea
                    value={useCase.description}
                    onChange={(e) => updateUseCase(index, 'description', e.target.value)}
                    placeholder="Description of how the company solves this problem"
                    rows={2}
                    className="text-sm"
                  />
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeUseCase(index)}
                  className="ml-2 h-8 w-8"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Differentiators */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Differentiators</h4>
            <Button type="button" onClick={addDifferentiator} variant="outline" size="sm">
              <Plus className="h-3 w-3 mr-1" />
              Add Differentiator
            </Button>
          </div>

          {differentiators.map((diff, index) => (
            <div key={diff.id} className="border rounded p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <Input
                    value={diff.name}
                    onChange={(e) => updateDifferentiator(index, 'name', e.target.value)}
                    placeholder="Differentiator name"
                    className="text-sm"
                  />
                  <Textarea
                    value={diff.description}
                    onChange={(e) => updateDifferentiator(index, 'description', e.target.value)}
                    placeholder="Description of what makes them unique"
                    rows={2}
                    className="text-sm"
                  />
                  <Textarea
                    value={diff.competitorComparison}
                    onChange={(e) => updateDifferentiator(index, 'competitorComparison', e.target.value)}
                    placeholder="How this compares to their closest competitors"
                    rows={2}
                    className="text-sm"
                  />
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeDifferentiator(index)}
                  className="ml-2 h-8 w-8"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductContextForm;
