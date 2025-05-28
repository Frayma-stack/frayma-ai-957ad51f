
import { FC, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Feature {
  id: string;
  name: string;
  description: string;
}

interface FeatureManagerProps {
  features: Feature[];
  onAddFeature: (feature: Omit<Feature, 'id'>) => void;
  onRemoveFeature: (id: string) => void;
}

const FeatureManager: FC<FeatureManagerProps> = ({
  features,
  onAddFeature,
  onRemoveFeature,
}) => {
  const [newFeature, setNewFeature] = useState({ name: '', description: '' });

  const handleAddFeature = () => {
    if (newFeature.name && newFeature.description) {
      onAddFeature(newFeature);
      setNewFeature({ name: '', description: '' });
    }
  };

  return (
    <div>
      <Label className="text-right">Features</Label>
      <div className="col-span-3">
        {features.map((feature) => (
          <div key={feature.id} className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold">{feature.name}</p>
              <p className="text-sm">{feature.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onRemoveFeature(feature.id)}>
              Remove
            </Button>
          </div>
        ))}
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Feature Name"
            value={newFeature.name}
            onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
          />
          <Textarea
            placeholder="Feature Description"
            value={newFeature.description}
            onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
            className="resize-none"
          />
          <Button size="sm" onClick={handleAddFeature}>
            Add Feature
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeatureManager;
