
import { FC, useState } from 'react';
import { ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import ProductContextForm from '../client-dialog/ProductContextForm';

interface ProductContextCreationFormProps {
  onProductContextCreated: (productContext: ProductContext) => void;
  onCancel: () => void;
}

const ProductContextCreationForm: FC<ProductContextCreationFormProps> = ({
  onProductContextCreated,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryPOV, setCategoryPOV] = useState('');
  const [companyMission, setCompanyMission] = useState('');
  const [uniqueInsight, setUniqueInsight] = useState('');
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [useCases, setUseCases] = useState<ProductUseCase[]>([]);
  const [differentiators, setDifferentiators] = useState<ProductDifferentiator[]>([]);
  
  const { toast } = useToast();

  const handleCreateProductContext = () => {
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
      name: name.trim() || 'Product Context',
      description: description.trim() || '',
      categoryPOV: categoryPOV.trim(),
      companyMission: companyMission.trim(),
      uniqueInsight: uniqueInsight.trim(),
      features,
      useCases,
      differentiators
    };

    onProductContextCreated(newProductContext);
    
    toast({
      title: "Success",
      description: "Product context created successfully"
    });
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
            className="bg-story-blue hover:bg-story-light-blue"
          >
            Create Product Context
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
