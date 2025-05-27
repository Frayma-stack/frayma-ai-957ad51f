
import { FC } from 'react';
import { Dialog } from "@/components/ui/dialog";
import { Client, ProductContext } from '@/types/storytelling';
import { useEnhancedClientDialog } from '@/hooks/useEnhancedClientDialog';
import EnhancedClientDialogContent from './client-dialog/EnhancedClientDialogContent';

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
  const {
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
  } = useEnhancedClientDialog(editingClient);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreateClient = () => {
    if (!validateForm()) {
      return;
    }

    const { client, productContext } = createClientData();
    onClientCreated(client, productContext);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <EnhancedClientDialogContent
        editingClient={editingClient}
        name={name}
        description={description}
        companyLinks={companyLinks}
        categoryPOV={categoryPOV}
        companyMission={companyMission}
        uniqueInsight={uniqueInsight}
        features={features}
        useCases={useCases}
        differentiators={differentiators}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onCompanyLinksChange={setCompanyLinks}
        onCategoryPOVChange={setCategoryPOV}
        onCompanyMissionChange={setCompanyMission}
        onUniqueInsightChange={setUniqueInsight}
        onFeaturesChange={setFeatures}
        onUseCasesChange={setUseCases}
        onDifferentiatorsChange={setDifferentiators}
        isAnalyzing={isAnalyzing}
        onAnalyze={handleAnalyzeAndComplete}
        onCreateClient={handleCreateClient}
        onClose={handleClose}
      />
    </Dialog>
  );
};

export default EnhancedClientDialog;
