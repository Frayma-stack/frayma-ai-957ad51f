
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, FileText, Target } from 'lucide-react';
import { ProductCampaignBrief, CampaignStep } from './types';
import { ProductCampaignBriefForm } from './steps/ProductCampaignBriefForm';
import { ProductCampaignOutlineGenerator } from './steps/ProductCampaignOutlineGenerator';
import { ProductCampaignDraftGenerator } from './steps/ProductCampaignDraftGenerator';
import { ProductCampaignProgressIndicator } from './components/ProductCampaignProgressIndicator';
import { Author, ICPStoryScript } from '@/types/storytelling';

interface ProductCampaignCreatorProps {
  authors: Author[];
  scripts: ICPStoryScript[];
  onBack: () => void;
  selectedClientId?: string;
}

export const ProductCampaignCreator: React.FC<ProductCampaignCreatorProps> = ({
  authors,
  scripts,
  onBack,
  selectedClientId
}) => {
  const [currentStep, setCurrentStep] = useState<CampaignStep>('brief');
  const [campaignBrief, setCampaignBrief] = useState<ProductCampaignBrief | null>(null);
  const [outlines, setOutlines] = useState<Record<string, any> | null>(null);

  const handleBriefComplete = (brief: ProductCampaignBrief) => {
    setCampaignBrief(brief);
    setCurrentStep('outline');
  };

  const handleOutlinesComplete = (generatedOutlines: Record<string, any>) => {
    setOutlines(generatedOutlines);
    setCurrentStep('drafts');
  };

  const handleStepBack = () => {
    if (currentStep === 'outline') {
      setCurrentStep('brief');
    } else if (currentStep === 'drafts') {
      setCurrentStep('outline');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'brief':
        return (
          <ProductCampaignBriefForm
            authors={authors}
            scripts={scripts}
            selectedClientId={selectedClientId}
            onComplete={handleBriefComplete}
            initialBrief={campaignBrief}
          />
        );
      case 'outline':
        return (
          <ProductCampaignOutlineGenerator
            brief={campaignBrief!}
            onComplete={handleOutlinesComplete}
            onBack={handleStepBack}
            initialOutlines={outlines}
          />
        );
      case 'drafts':
        return (
          <ProductCampaignDraftGenerator
            brief={campaignBrief!}
            outlines={outlines!}
            onBack={handleStepBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-brand-primary/10 to-purple-100 border-brand-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-brand-primary/20 rounded-lg">
                  <Zap className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl text-brand-primary">
                    Product/Feature Update Campaign
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Auto-craft a complete GTM content package using Product-Led Storytelling
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Target className="h-4 w-4" />
              <span>11 GTM Assets</span>
              <FileText className="h-4 w-4 ml-2" />
              <span>PLS Framework</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Indicator */}
      <ProductCampaignProgressIndicator currentStep={currentStep} />

      {/* Step Content */}
      {renderStepContent()}
    </div>
  );
};
