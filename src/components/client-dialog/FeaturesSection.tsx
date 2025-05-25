
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductFeature } from '@/types/storytelling';
import { Plus, Trash } from 'lucide-react';

interface FeaturesSectionProps {
  features: ProductFeature[];
  onFeaturesChange: (features: ProductFeature[]) => void;
}

const FeaturesSection: FC<FeaturesSectionProps> = ({
  features,
  onFeaturesChange
}) => {
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

  return (
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
  );
};

export default FeaturesSection;
