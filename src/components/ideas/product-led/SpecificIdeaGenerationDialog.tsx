import { FC, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader, Target } from 'lucide-react';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';

interface SpecificIdeaGenerationDialogProps {
  isOpen: boolean;
  isGenerating: boolean;
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  onClose: () => void;
  onGenerate: (data: SpecificGenerationData) => void;
}

export interface SpecificGenerationData {
  targetICP: string;
  productFeature: string;
  narrativeAngle: string;
}

const SpecificIdeaGenerationDialog: FC<SpecificIdeaGenerationDialogProps> = ({
  isOpen,
  isGenerating,
  icpScripts,
  productContext,
  onClose,
  onGenerate
}) => {
  const [formData, setFormData] = useState<SpecificGenerationData>({
    targetICP: '',
    productFeature: '',
    narrativeAngle: ''
  });

  const handleGenerate = () => {
    if (!formData.targetICP || !formData.productFeature || !formData.narrativeAngle.trim()) {
      return;
    }
    onGenerate(formData);
  };

  const handleClose = () => {
    if (!isGenerating) {
      setFormData({
        targetICP: '',
        productFeature: '',
        narrativeAngle: ''
      });
      onClose();
    }
  };

  const isFormValid = formData.targetICP && formData.productFeature && formData.narrativeAngle.trim();

  // Get all available product features from the product context
  const getAllProductFeatures = () => {
    if (!productContext) return [];
    
    const features = [];
    
    // Add regular features
    features.push(...productContext.features.map(f => ({ id: f.id, name: f.name, type: 'feature' })));
    
    // Add use cases
    features.push(...productContext.useCases.map(u => ({ id: u.id, name: u.useCase, type: 'usecase' })));
    
    // Add differentiators
    features.push(...productContext.differentiators.map(d => ({ id: d.id, name: d.name, type: 'differentiator' })));
    
    return features;
  };

  const productFeatures = getAllProductFeatures();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span>Generate Ideas with More Specificity</span>
          </DialogTitle>
          <DialogDescription>
            Choose specific parameters to generate more targeted Product-Led Storytelling ideas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Target ICP Selection */}
          <div>
            <Label className="text-sm font-medium">Target ICP *</Label>
            <Select 
              value={formData.targetICP} 
              onValueChange={(value) => setFormData({ ...formData, targetICP: value })}
              disabled={isGenerating}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a specific ICP to target" />
              </SelectTrigger>
              <SelectContent>
                {icpScripts.map(icp => (
                  <SelectItem key={icp.id} value={icp.id}>{icp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Feature Selection */}
          <div>
            <Label className="text-sm font-medium">Product Feature/Context *</Label>
            <Select 
              value={formData.productFeature} 
              onValueChange={(value) => setFormData({ ...formData, productFeature: value })}
              disabled={isGenerating}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a specific product feature to highlight" />
              </SelectTrigger>
              <SelectContent>
                {productFeatures.map(feature => (
                  <SelectItem key={feature.id} value={feature.id}>
                    {feature.name} ({feature.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Narrative Angle */}
          <div>
            <Label className="text-sm font-medium">New Narrative Angle or Direction *</Label>
            <Textarea
              placeholder="Describe the specific narrative angle, perspective, or direction you want to explore (e.g., 'focus on time-saving benefits', 'highlight competitive advantages', 'emphasize ROI and cost reduction')..."
              value={formData.narrativeAngle}
              onChange={(e) => setFormData({ ...formData, narrativeAngle: e.target.value })}
              className="min-h-[100px] mt-2"
              disabled={isGenerating}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate}
            disabled={!isFormValid || isGenerating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Generate Targeted Ideas
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpecificIdeaGenerationDialog;