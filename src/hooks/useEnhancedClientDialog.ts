

import { useState } from 'react';
import { Client, CompanyLink, BusinessContext, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import { useToast } from "@/components/ui/use-toast";
import { useClientAnalysis } from '@/hooks/useClientAnalysis';

export const useEnhancedClientDialog = (editingClient?: Client | null) => {
  const [name, setName] = useState(editingClient?.name || '');
  const [description, setDescription] = useState(editingClient?.description || '');
  const [companyLinks, setCompanyLinks] = useState<CompanyLink[]>(
    editingClient?.companyLinks || [{ id: crypto.randomUUID(), type: 'website', url: '' }]
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
    setCompanyLinks([{ id: crypto.randomUUID(), type: 'website', url: '' }]);
    setCategoryPOV('');
    setCompanyMission('');
    setUniqueInsight('');
    setFeatures([]);
    setUseCases([]);
    setDifferentiators([]);
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

  const createClientData = (): { client: Client; productContext?: BusinessContext } => {
    const clientData: Client = {
      id: editingClient?.id || crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      companyLinks: companyLinks.filter(link => link.url.trim() !== ''),
      createdAt: editingClient?.createdAt || new Date().toISOString()
    };

    let productContext: BusinessContext | undefined;
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

    return { client: clientData, productContext };
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Client name is required",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  return {
    // Form state
    name, setName,
    description, setDescription,
    companyLinks, setCompanyLinks,
    categoryPOV, setCategoryPOV,
    companyMission, setCompanyMission,
    uniqueInsight, setUniqueInsight,
    features, setFeatures,
    useCases, setUseCases,
    differentiators, setDifferentiators,
    
    // Analysis state
    isAnalyzing,
    
    // Form actions
    resetForm,
    handleAnalyzeAndComplete,
    createClientData,
    validateForm
  };
};

