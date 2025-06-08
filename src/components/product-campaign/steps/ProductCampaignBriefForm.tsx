
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductCampaignBrief } from '../types';
import { Author, ICPStoryScript } from '@/types/storytelling';
import { useToast } from '@/hooks/use-toast';
import { ProductInfoSection } from '../forms/ProductInfoSection';
import { ProductContextSection } from '../forms/ProductContextSection';
import { TargetAudienceSection } from '../forms/TargetAudienceSection';
import { CampaignStrategySection } from '../forms/CampaignStrategySection';
import { AuthorSelectionSection } from '../forms/AuthorSelectionSection';

interface ProductCampaignBriefFormProps {
  authors: Author[];
  scripts: ICPStoryScript[];
  selectedClientId?: string;
  onComplete: (brief: ProductCampaignBrief) => void;
  initialBrief?: ProductCampaignBrief | null;
}

export const ProductCampaignBriefForm: React.FC<ProductCampaignBriefFormProps> = ({
  authors,
  scripts,
  selectedClientId,
  onComplete,
  initialBrief
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<ProductCampaignBrief>>({
    productName: initialBrief?.productName || '',
    featureDescription: initialBrief?.featureDescription || '',
    whyBuilt: initialBrief?.whyBuilt || '',
    productContext: initialBrief?.productContext || {
      feature: '',
      useCase: '',
      differentiator: ''
    },
    coreTransformation: initialBrief?.coreTransformation || '',
    primaryICP: initialBrief?.primaryICP || '',
    secondaryICP: initialBrief?.secondaryICP || '',
    positioningAngle: initialBrief?.positioningAngle || '',
    desiredCTA: initialBrief?.desiredCTA || '',
    authorProfiles: initialBrief?.authorProfiles || [],
    styleDepth: initialBrief?.styleDepth || 'educational',
    clientId: selectedClientId
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAuthorToggle = (authorId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      authorProfiles: checked 
        ? [...(prev.authorProfiles || []), authorId]
        : (prev.authorProfiles || []).filter(id => id !== authorId)
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.productName || !formData.featureDescription || !formData.primaryICP) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.authorProfiles || formData.authorProfiles.length === 0) {
      toast({
        title: "Select Authors",
        description: "Please select at least one author profile for content generation.",
        variant: "destructive"
      });
      return;
    }

    const brief: ProductCampaignBrief = {
      id: initialBrief?.id || `campaign-${Date.now()}`,
      productName: formData.productName!,
      featureDescription: formData.featureDescription!,
      whyBuilt: formData.whyBuilt!,
      productContext: formData.productContext!,
      coreTransformation: formData.coreTransformation!,
      primaryICP: formData.primaryICP!,
      secondaryICP: formData.secondaryICP,
      positioningAngle: formData.positioningAngle!,
      desiredCTA: formData.desiredCTA!,
      authorProfiles: formData.authorProfiles!,
      styleDepth: formData.styleDepth!,
      createdAt: initialBrief?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clientId: selectedClientId
    };

    onComplete(brief);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-brand-primary">Strategic Campaign Brief</CardTitle>
          <p className="text-sm text-gray-600">
            Provide the core context for your product/feature update campaign
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProductInfoSection
            formData={formData}
            onInputChange={handleInputChange}
          />

          <ProductContextSection
            formData={formData}
            onInputChange={handleInputChange}
          />

          <TargetAudienceSection
            formData={formData}
            scripts={scripts}
            onInputChange={handleInputChange}
          />

          <CampaignStrategySection
            formData={formData}
            onInputChange={handleInputChange}
          />

          <AuthorSelectionSection
            formData={formData}
            authors={authors}
            onAuthorToggle={handleAuthorToggle}
          />

          <Button 
            onClick={handleSubmit}
            className="w-full bg-brand-primary hover:bg-brand-primary/90"
            size="lg"
          >
            Generate Content Outlines
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
