
import { FC } from 'react';
import { 
  DialogContent,
  DialogDescription,
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Client, CompanyLink, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import ClientBasicInfoForm from './ClientBasicInfoForm';
import ProductContextForm from './ProductContextForm';

interface EnhancedClientDialogContentProps {
  editingClient?: Client | null;
  
  // Form state
  name: string;
  description: string;
  companyLinks: CompanyLink[];
  categoryPOV: string;
  companyMission: string;
  uniqueInsight: string;
  features: ProductFeature[];
  useCases: ProductUseCase[];
  differentiators: ProductDifferentiator[];
  
  // Form handlers
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCompanyLinksChange: (links: CompanyLink[]) => void;
  onCategoryPOVChange: (value: string) => void;
  onCompanyMissionChange: (value: string) => void;
  onUniqueInsightChange: (value: string) => void;
  onFeaturesChange: (features: ProductFeature[]) => void;
  onUseCasesChange: (useCases: ProductUseCase[]) => void;
  onDifferentiatorsChange: (differentiators: ProductDifferentiator[]) => void;
  
  // Analysis state
  isAnalyzing: boolean;
  
  // Actions
  onAnalyze: () => void;
  onCreateClient: () => void;
  onClose: () => void;
}

const EnhancedClientDialogContent: FC<EnhancedClientDialogContentProps> = ({
  editingClient,
  name,
  description,
  companyLinks,
  categoryPOV,
  companyMission,
  uniqueInsight,
  features,
  useCases,
  differentiators,
  onNameChange,
  onDescriptionChange,
  onCompanyLinksChange,
  onCategoryPOVChange,
  onCompanyMissionChange,
  onUniqueInsightChange,
  onFeaturesChange,
  onUseCasesChange,
  onDifferentiatorsChange,
  isAnalyzing,
  onAnalyze,
  onCreateClient,
  onClose
}) => {
  return (
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
            onNameChange={onNameChange}
            onDescriptionChange={onDescriptionChange}
            onCompanyLinksChange={onCompanyLinksChange}
            onAnalyze={onAnalyze}
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
            onCategoryPOVChange={onCategoryPOVChange}
            onCompanyMissionChange={onCompanyMissionChange}
            onUniqueInsightChange={onUniqueInsightChange}
            onFeaturesChange={onFeaturesChange}
            onUseCasesChange={onUseCasesChange}
            onDifferentiatorsChange={onDifferentiatorsChange}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onCreateClient} className="bg-story-blue hover:bg-story-light-blue">
          {editingClient ? 'Update Client' : 'Create Client'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default EnhancedClientDialogContent;
