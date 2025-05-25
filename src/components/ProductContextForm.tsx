
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import { Plus, Trash } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface ProductContextFormProps {
  isOpen: boolean;
  onClose: () => void;
  onProductContextCreated: (productContext: ProductContext) => void;
  editingProductContext?: ProductContext | null;
  selectedClientId?: string | null;
}

const ProductContextForm: FC<ProductContextFormProps> = ({
  isOpen,
  onClose,
  onProductContextCreated,
  editingProductContext,
  selectedClientId
}) => {
  const [categoryPOV, setCategoryPOV] = useState(editingProductContext?.categoryPOV || '');
  const [companyMission, setCompanyMission] = useState(editingProductContext?.companyMission || '');
  const [uniqueInsight, setUniqueInsight] = useState(editingProductContext?.uniqueInsight || '');
  const [features, setFeatures] = useState<ProductFeature[]>(editingProductContext?.features || []);
  const [useCases, setUseCases] = useState<ProductUseCase[]>(editingProductContext?.useCases || []);
  const [differentiators, setDifferentiators] = useState<ProductDifferentiator[]>(editingProductContext?.differentiators || []);

  const { toast } = useToast();

  const resetForm = () => {
    setCategoryPOV('');
    setCompanyMission('');
    setUniqueInsight('');
    setFeatures([]);
    setUseCases([]);
    setDifferentiators([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!categoryPOV.trim() && !companyMission.trim() && !uniqueInsight.trim()) {
      toast({
        title: "Error",
        description: "Please fill in at least one of the core narrative fields",
        variant: "destructive"
      });
      return;
    }

    const productContext: ProductContext = {
      id: editingProductContext?.id || crypto.randomUUID(),
      categoryPOV: categoryPOV.trim(),
      companyMission: companyMission.trim(),
      uniqueInsight: uniqueInsight.trim(),
      features,
      useCases,
      differentiators,
      clientId: selectedClientId || editingProductContext?.clientId
    };

    onProductContextCreated(productContext);
    
    toast({
      title: "Success",
      description: editingProductContext ? "Product context updated successfully" : "Product context created successfully"
    });

    handleClose();
  };

  const addFeature = () => {
    setFeatures([...features, { id: crypto.randomUUID(), name: '', benefits: [''], media: [] }]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const addFeatureBenefit = (featureIndex: number) => {
    const updated = [...features];
    updated[featureIndex].benefits.push('');
    setFeatures(updated);
  };

  const removeFeatureBenefit = (featureIndex: number, benefitIndex: number) => {
    const updated = [...features];
    if (updated[featureIndex].benefits.length > 1) {
      updated[featureIndex].benefits.splice(benefitIndex, 1);
      setFeatures(updated);
    }
  };

  const updateFeatureBenefit = (featureIndex: number, benefitIndex: number, value: string) => {
    const updated = [...features];
    updated[featureIndex].benefits[benefitIndex] = value;
    setFeatures(updated);
  };

  const addUseCase = () => {
    setUseCases([...useCases, { id: crypto.randomUUID(), useCase: '', userRole: '', description: '', media: [] }]);
  };

  const removeUseCase = (index: number) => {
    setUseCases(useCases.filter((_, i) => i !== index));
  };

  const updateUseCase = (index: number, field: string, value: string) => {
    const updated = [...useCases];
    updated[index] = { ...updated[index], [field]: value };
    setUseCases(updated);
  };

  const addDifferentiator = () => {
    setDifferentiators([...differentiators, { id: crypto.randomUUID(), name: '', description: '', competitorComparison: '' }]);
  };

  const removeDifferentiator = (index: number) => {
    setDifferentiators(differentiators.filter((_, i) => i !== index));
  };

  const updateDifferentiator = (index: number, field: string, value: string) => {
    const updated = [...differentiators];
    updated[index] = { ...updated[index], [field]: value };
    setDifferentiators(updated);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingProductContext ? 'Edit Product Context' : 'Add Product Context'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Core Product Narrative Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Core Product Narrative</h3>
            
            <div className="space-y-2">
              <Label htmlFor="categoryPOV">Category Point of View</Label>
              <Textarea
                id="categoryPOV"
                value={categoryPOV}
                onChange={(e) => setCategoryPOV(e.target.value)}
                placeholder="Your company's perspective on the industry/category and market positioning"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyMission">Company Mission</Label>
              <Textarea
                id="companyMission"
                value={companyMission}
                onChange={(e) => setCompanyMission(e.target.value)}
                placeholder="The company's mission statement or core purpose"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uniqueInsight">Unique Insight</Label>
              <Textarea
                id="uniqueInsight"
                value={uniqueInsight}
                onChange={(e) => setUniqueInsight(e.target.value)}
                placeholder="What unique perspective or insight does this company bring to their market"
                rows={3}
              />
            </div>
          </div>

          {/* Features & Benefits Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Features & Benefits</h3>
              <Button type="button" onClick={addFeature} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>

            {features.map((feature, index) => (
              <div key={feature.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <Input
                      value={feature.name}
                      onChange={(e) => updateFeature(index, 'name', e.target.value)}
                      placeholder="Feature name"
                    />
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Benefits</Label>
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex gap-2">
                          <Input
                            value={benefit}
                            onChange={(e) => updateFeatureBenefit(index, benefitIndex, e.target.value)}
                            placeholder="Benefit description"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeFeatureBenefit(index, benefitIndex)}
                            disabled={feature.benefits.length === 1}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addFeatureBenefit(index)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Benefit
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeFeature(index)}
                    className="ml-2"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Use Cases Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Use Cases</h3>
              <Button type="button" onClick={addUseCase} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Use Case
              </Button>
            </div>

            {useCases.map((useCase, index) => (
              <div key={useCase.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={useCase.useCase}
                      onChange={(e) => updateUseCase(index, 'useCase', e.target.value)}
                      placeholder="Use case title"
                    />
                    <Input
                      value={useCase.userRole}
                      onChange={(e) => updateUseCase(index, 'userRole', e.target.value)}
                      placeholder="Target user role/persona"
                    />
                    <div className="md:col-span-2">
                      <Textarea
                        value={useCase.description}
                        onChange={(e) => updateUseCase(index, 'description', e.target.value)}
                        placeholder="Description of how the company solves this problem"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeUseCase(index)}
                    className="ml-2"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Differentiators Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Differentiators</h3>
              <Button type="button" onClick={addDifferentiator} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Differentiator
              </Button>
            </div>

            {differentiators.map((diff, index) => (
              <div key={diff.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <Input
                      value={diff.name}
                      onChange={(e) => updateDifferentiator(index, 'name', e.target.value)}
                      placeholder="Differentiator name"
                    />
                    <Textarea
                      value={diff.description}
                      onChange={(e) => updateDifferentiator(index, 'description', e.target.value)}
                      placeholder="Description of what makes them unique"
                      rows={2}
                    />
                    <Textarea
                      value={diff.competitorComparison}
                      onChange={(e) => updateDifferentiator(index, 'competitorComparison', e.target.value)}
                      placeholder="How this compares to their closest competitors"
                      rows={2}
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeDifferentiator(index)}
                    className="ml-2"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-story-blue hover:bg-story-light-blue">
            {editingProductContext ? 'Update' : 'Create'} Product Context
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductContextForm;
