
import { FC, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  description: string;
  usageDescription?: string; // New field for feature usage
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
  const [newFeature, setNewFeature] = useState({ 
    name: '', 
    description: '',
    usageDescription: ''
  });

  const handleAddFeature = () => {
    if (newFeature.name && newFeature.description) {
      onAddFeature(newFeature);
      setNewFeature({ name: '', description: '', usageDescription: '' });
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Features Used</Label>
      
      {features.length > 0 && (
        <div className="space-y-3">
          {features.map((feature) => (
            <Card key={feature.id} className="border border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-semibold">{feature.name}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRemoveFeature(feature.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <p className="text-sm text-gray-600">{feature.description}</p>
                {feature.usageDescription && (
                  <div className="bg-blue-50 p-2 rounded-md">
                    <p className="text-xs font-medium text-blue-800 mb-1">Usage Description:</p>
                    <p className="text-sm text-blue-700">{feature.usageDescription}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="feature-name">Feature Name *</Label>
              <Input
                id="feature-name"
                type="text"
                placeholder="e.g., Real-time Analytics Dashboard"
                value={newFeature.name}
                onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="feature-description">Feature Description *</Label>
              <Textarea
                id="feature-description"
                placeholder="What does this feature do?"
                value={newFeature.description}
                onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                className="resize-none"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="feature-usage">How This Feature Was Used</Label>
              <Textarea
                id="feature-usage"
                placeholder="Describe how the customer specifically used this feature and what made it valuable"
                value={newFeature.usageDescription}
                onChange={(e) => setNewFeature({ ...newFeature, usageDescription: e.target.value })}
                className="resize-none"
                rows={3}
              />
            </div>
            
            <Button 
              size="sm" 
              onClick={handleAddFeature}
              disabled={!newFeature.name || !newFeature.description}
              className="w-full"
            >
              Add Feature
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureManager;
