
import { FC, useState } from 'react';
import { ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useProductContextData } from '@/hooks/data/useProductContextData';
import ProductContextForm from '../client-dialog/ProductContextForm';

interface ProductContextCreationFormProps {
  onProductContextCreated: (productContext: ProductContext) => void;
  onCancel: () => void;
  selectedClientId?: string;
}

const ProductContextCreationForm: FC<ProductContextCreationFormProps> = ({
  onProductContextCreated,
  onCancel,
  selectedClientId
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryPOV, setCategoryPOV] = useState('');
  const [companyMission, setCompanyMission] = useState('');
  const [uniqueInsight, setUniqueInsight] = useState('');
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [useCases, setUseCases] = useState<ProductUseCase[]>([]);
  const [differentiators, setDifferentiators] = useState<ProductDifferentiator[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  const { toast } = useToast();
  const { handleProductContextAdded } = useProductContextData();

  const handleCreateProductContext = async () => {
    if (!name.trim() && !categoryPOV.trim() && !companyMission.trim() && !uniqueInsight.trim() && 
        features.length === 0 && useCases.length === 0 && differentiators.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in at least one field to create product context",
        variant: "destructive"
      });
      return;
    }

    const newProductContext: ProductContext = {
      id: crypto.randomUUID(),
      clientId: selectedClientId || '',
      name: name.trim() || 'Product Context',
      description: description.trim() || '',
      categoryPOV: categoryPOV.trim(),
      companyMission: companyMission.trim(),
      uniqueInsight: uniqueInsight.trim(),
      features,
      useCases,
      differentiators
    };

    try {
      setIsCreating(true);
      const createdContext = await handleProductContextAdded(newProductContext);
      onProductContextCreated(createdContext);
    } catch (error) {
      console.error('Error creating product context:', error);
      toast({
        title: "Error",
        description: "Failed to create product context. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setCategoryPOV('');
    setCompanyMission('');
    setUniqueInsight('');
    setFeatures([]);
    setUseCases([]);
    setDifferentiators([]);
    onCancel();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-story-blue flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Create Product Context
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Context Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product context name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-story-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the product context"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-story-blue focus:border-transparent"
              rows={2}
            />
          </div>
        </div>
        <ProductContextForm
          categoryPOV={categoryPOV}
          companyMission={companyMission}
          uniqueInsight={uniqueInsight}
          features={features}
          useCases={useCases}
          differentiators={differentiators}
          onCategoryPOVChange={setCategoryPOV}
          onCompanyMissionChange={setCompanyMission}
          onUniqueInsightChange={setUniqueInsight}
          onFeaturesChange={setFeatures}
          onUseCasesChange={setUseCases}
          onDifferentiatorsChange={setDifferentiators}
        />
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={handleCreateProductContext}
            disabled={isCreating}
            className="bg-story-blue hover:bg-story-light-blue"
          >
            {isCreating ? 'Creating...' : 'Create Product Context'}
          </Button>
          <Button 
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductContextCreationForm;
