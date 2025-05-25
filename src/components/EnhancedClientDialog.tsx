
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Client, CompanyLink, ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import { useToast } from "@/components/ui/use-toast";
import { useClientAnalysis } from '@/hooks/useClientAnalysis';
import ClientBasicInfoForm from './client-dialog/ClientBasicInfoForm';
import ProductContextForm from './client-dialog/ProductContextForm';

interface EnhancedClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (client: Client, productContext?: ProductContext) => void;
  editingClient?: Client | null;
}

const EnhancedClientDialog: FC<EnhancedClientDialogProps> = ({
  isOpen,
  onClose,
  onClientCreated,
  editingClient
}) => {
  const [name, setName] = useState(editingClient?.name || '');
  const [description, setDescription] = useState(editingClient?.description || '');
  const [companyLinks, setCompanyLinks] = useState<CompanyLink[]>(
    editingClient?.companyLinks || [{ type: 'website', url: '' }]
  );

  // Product Context fields
  const [categoryPOV, setCategoryPOV] = useState('');
  const [companyMission, setCompanyMission] = useState('');
  const [uniqueInsight, setUniqueInsight] = useState('');
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [useCases, setUseCases] = useState<ProductUseCase[]>([]);
  const [differentiators, setDifferentiators] = useState<ProductDifferentiator[]>([]);
  
  const { toast } = useToast();
  const { isAnalyzing, analyzeClient } = useClientAnalysis();

  const resetForm = () => {
    setName('');
    setDescription('');
    setCompanyLinks([{ type: 'website', url: '' }]);
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

  const handleAnalyzeAndComplete = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Client name is required",
        variant: "destructive"
      });
      return;
    }

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
      await analyzeClient(validLinks, name, (productContext) => {
        // Populate the Product Context fields with analyzed data
        setCategoryPOV(productContext.categoryPOV || '');
        setCompanyMission(productContext.companyMission || '');
        setUniqueInsight(productContext.uniqueInsight || '');
        setFeatures(productContext.features || []);
        setUseCases(productContext.useCases || []);
        setDifferentiators(productContext.differentiators || []);

        toast({
          title: "Analysis Complete",
          description: "Product context has been populated with analyzed data. Review and edit as needed.",
        });
      });
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleCreateClient = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Client name is required",
        variant: "destructive"
      });
      return;
    }

    const clientData: Client = {
      id: editingClient?.id || crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      companyLinks: companyLinks.filter(link => link.url.trim() !== ''),
      createdAt: editingClient?.createdAt || new Date().toISOString()
    };

    // Create product context if any fields are filled
    let productContext: ProductContext | undefined;
    if (categoryPOV || companyMission || uniqueInsight || features.length > 0 || useCases.length > 0 || differentiators.length > 0) {
      productContext = {
        id: crypto.randomUUID(),
        categoryPOV: categoryPOV.trim(),
        companyMission: companyMission.trim(),
        uniqueInsight: uniqueInsight.trim(),
        features,
        useCases,
        differentiators,
        companyLinks: companyLinks.filter(link => link.url.trim() !== ''),
        clientId: clientData.id
      };
    }

    onClientCreated(clientData, productContext);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingClient ? 'Edit Client' : 'Add New Client'}
          </DialogTitle>
          <DialogDescription>
            Provide company information and URLs for automated analysis of product context
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Basic Client Info */}
          <div className="space-y-4">
            <ClientBasicInfoForm
              name={name}
              description={description}
              companyLinks={companyLinks}
              onNameChange={setName}
              onDescriptionChange={setDescription}
              onCompanyLinksChange={setCompanyLinks}
              onAnalyze={handleAnalyzeAndComplete}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {/* Right Column: Product Context */}
          <div className="space-y-4">
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
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateClient} className="bg-story-blue hover:bg-story-light-blue">
            {editingClient ? 'Update Client' : 'Create Client'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedClientDialog;
