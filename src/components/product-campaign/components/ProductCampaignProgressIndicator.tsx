
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Circle, FileText, Eye, Zap } from 'lucide-react';
import { CampaignStep } from '../types';

interface ProductCampaignProgressIndicatorProps {
  currentStep: CampaignStep;
}

export const ProductCampaignProgressIndicator: React.FC<ProductCampaignProgressIndicatorProps> = ({
  currentStep
}) => {
  const steps = [
    {
      id: 'brief' as CampaignStep,
      title: 'Strategic Brief',
      description: 'Product context & campaign inputs',
      icon: FileText,
      completed: currentStep !== 'brief'
    },
    {
      id: 'outline' as CampaignStep,
      title: 'Content Outlines',
      description: 'Generate & review asset structures',
      icon: Eye,
      completed: currentStep === 'drafts'
    },
    {
      id: 'drafts' as CampaignStep,
      title: 'Auto-Craft Drafts',
      description: 'Generate final GTM content',
      icon: Zap,
      completed: false
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = step.completed;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors
                    ${isCompleted 
                      ? 'bg-green-100 border-green-500 text-green-600' 
                      : isActive 
                        ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="text-center mt-3">
                    <h3 className={`font-medium text-sm ${
                      isActive ? 'text-brand-primary' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-[120px]">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 transition-colors ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
