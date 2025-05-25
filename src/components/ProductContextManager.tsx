import { FC, useState } from 'react';
import { ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import CollapsibleProductContext from './CollapsibleProductContext';
import ProductContextForm from './client-dialog/ProductContextForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface ProductContextManagerProps {
  productContext: ProductContext | null;
  onProductContextUpdated: (productContext: ProductContext) => void;
}

const ProductContextManager: FC<ProductContextManagerProps> = ({ 
  productContext, 
  onProductContextUpdated 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [categoryPOV, setCategoryPOV] = useState('');
  const [companyMission, setCompanyMission] = useState('');
  const [uniqueInsight, setUniqueInsight] = useState('');
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [useCases, setUseCases] = useState<ProductUseCase[]>([]);
  const [differentiators, setDifferentiators] = useState<ProductDifferentiator[]>([]);
  
  const { toast } = useToast();

  const handleCreateProductContext = () => {
    if (!categoryPOV.trim() && !companyMission.trim() && !uniqueInsight.trim() && 
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
      categoryPOV: categoryPOV.trim(),
      companyMission: companyMission.trim(),
      uniqueInsight: uniqueInsight.trim(),
      features,
      useCases,
      differentiators,
      companyLinks: []
    };

    onProductContextUpdated(newProductContext);
    setIsCreating(false);
    
    // Reset form
    setCategoryPOV('');
    setCompanyMission('');
    setUniqueInsight('');
    setFeatures([]);
    setUseCases([]);
    setDifferentiators([]);
    
    toast({
      title: "Success",
      description: "Product context created successfully"
    });
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setCategoryPOV('');
    setCompanyMission('');
    setUniqueInsight('');
    setFeatures([]);
    setUseCases([]);
    setDifferentiators([]);
  };

  if (!productContext && !isCreating) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-story-blue flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Product Context
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 border border-dashed rounded-md">
              <Package className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 mb-2">No product context found</p>
              <p className="text-gray-400 text-sm mb-4">
                Create product context to enhance content generation with features, use cases, and differentiators
              </p>
              <Button 
                onClick={() => setIsCreating(true)}
                className="bg-story-blue hover:bg-story-light-blue"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Product Context
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="space-y-4">
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
                onClick={handleCancelCreate}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CollapsibleProductContext
        productContext={productContext}
        onProductContextUpdated={onProductContextUpdated}
      />
    </div>
  );
};

export default ProductContextManager;
