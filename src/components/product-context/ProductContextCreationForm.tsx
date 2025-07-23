
import { FC, useState } from 'react';
import { BusinessContext, ProductFeature, ProductUseCase, ProductDifferentiator, CompanyLink } from '@/types/storytelling';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useProductContextData } from '@/hooks/data/useProductContextData';
import { useClientAnalysis } from '@/hooks/useClientAnalysis';
import ProductContextForm from '../client-dialog/ProductContextForm';
import CompanyLinksSection from '../client-dialog/CompanyLinksSection';

interface ProductContextCreationFormProps {
  onProductContextCreated: (productContext: BusinessContext) => void;
  onCancel: () => void;
  selectedClientId?: string;
}

const ProductContextCreationForm: FC<ProductContextCreationFormProps> = ({
  onProductContextCreated,
  onCancel,
  selectedClientId
}) => {
  const [categoryPOV, setCategoryPOV] = useState('');
  const [companyMission, setCompanyMission] = useState('');
  const [uniqueInsight, setUniqueInsight] = useState('');
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [useCases, setUseCases] = useState<ProductUseCase[]>([]);
  const [differentiators, setDifferentiators] = useState<ProductDifferentiator[]>([]);
  const [companyLinks, setCompanyLinks] = useState<CompanyLink[]>([
    { id: crypto.randomUUID(), type: 'website', url: '' }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  
  const { toast } = useToast();
  const { handleProductContextAdded } = useProductContextData();
  const { isAnalyzing, analyzeClient } = useClientAnalysis();

  const handleCreateBusinessContext = async () => {
    if (!categoryPOV.trim() && !companyMission.trim() && !uniqueInsight.trim() && 
        features.length === 0 && useCases.length === 0 && differentiators.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in at least one field to create business context",
        variant: "destructive"
      });
      return;
    }

    const newBusinessContext: BusinessContext = {
      id: crypto.randomUUID(),
      clientId: selectedClientId || '',
      categoryPOV: categoryPOV.trim(),
      companyMission: companyMission.trim(),
      uniqueInsight: uniqueInsight.trim(),
      features,
      useCases,
      differentiators
    };

    try {
      setIsCreating(true);
      const createdContext = await handleProductContextAdded(newBusinessContext);
      onProductContextCreated(createdContext);
    } catch (error) {
      console.error('Error creating business context:', error);
      toast({
        title: "Error",
        description: "Failed to create business context. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleAnalyzeAndComplete = async () => {
    const validLinks = companyLinks.filter(link => link.url.trim() !== '');
    if (validLinks.length === 0) {
      toast({
        title: "Error",
        description: "At least one company URL is required for analysis",
        variant: "destructive"
      });
      return;
    }

    try {
      await analyzeClient(validLinks, 'Business Context Analysis', (productContext) => {
        setCategoryPOV(productContext.categoryPOV || '');
        setCompanyMission(productContext.companyMission || '');
        setUniqueInsight(productContext.uniqueInsight || '');
        setFeatures(productContext.features || []);
        setUseCases(productContext.useCases || []);
        setDifferentiators(productContext.differentiators || []);

        toast({
          title: "Analysis Complete",
          description: "Business context has been populated with analyzed data. Review and edit as needed.",
        });
      });
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleCancel = () => {
    setCategoryPOV('');
    setCompanyMission('');
    setUniqueInsight('');
    setFeatures([]);
    setUseCases([]);
    setDifferentiators([]);
    setCompanyLinks([{ id: crypto.randomUUID(), type: 'website', url: '' }]);
    onCancel();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-story-blue flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Create Business Context
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <CompanyLinksSection
            companyLinks={companyLinks}
            onUpdateCompanyLinks={setCompanyLinks}
            onAnalyze={handleAnalyzeAndComplete}
            isAnalyzing={isAnalyzing}
            canAnalyze={companyLinks.some(link => link.url.trim() !== '')}
          />
          
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
        </div>
        <div className="flex gap-2 mt-6">
          <Button 
            onClick={handleCreateBusinessContext}
            disabled={isCreating}
            className="bg-story-blue hover:bg-story-light-blue"
          >
            {isCreating ? 'Creating...' : 'Create Business Context'}
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
