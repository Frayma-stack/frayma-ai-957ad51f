
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { ProductCampaignBrief, CAMPAIGN_ASSET_TYPES } from '../types';

interface ProductCampaignOutlineGeneratorProps {
  brief: ProductCampaignBrief;
  onComplete: (outlines: Record<string, any>) => void;
  onBack: () => void;
  initialOutlines?: Record<string, any> | null;
}

export const ProductCampaignOutlineGenerator: React.FC<ProductCampaignOutlineGeneratorProps> = ({
  brief,
  onComplete,
  onBack,
  initialOutlines
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [outlines, setOutlines] = useState<Record<string, any>>(initialOutlines || {});

  const handleGenerateOutlines = async () => {
    setIsGenerating(true);
    
    // Simulate outline generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedOutlines: Record<string, any> = {};
    
    CAMPAIGN_ASSET_TYPES.forEach(assetType => {
      generatedOutlines[assetType.id] = {
        title: `${assetType.name} for ${brief.productName}`,
        hook: `Compelling hook for ${assetType.targetAudience}`,
        sections: [
          {
            heading: 'Introduction',
            subheadings: ['Problem Context', 'Solution Preview'],
            suggestedVisuals: ['Hero image', 'Problem illustration']
          },
          {
            heading: 'Core Value',
            subheadings: ['Key Benefits', 'Transformation Story'],
            suggestedVisuals: ['Before/after comparison', 'Feature screenshots']
          },
          {
            heading: 'Call to Action',
            subheadings: ['Next Steps', 'How to Get Started'],
            suggestedVisuals: ['CTA button', 'Contact information']
          }
        ],
        cta: brief.desiredCTA,
        estimatedWordCount: assetType.estimatedLength === '8-12 tweets' ? 280 : 
                           assetType.estimatedLength.includes('800-1200') ? 1000 :
                           assetType.estimatedLength.includes('600-900') ? 750 :
                           assetType.estimatedLength.includes('300-500') ? 400 :
                           assetType.estimatedLength.includes('200-400') ? 300 :
                           assetType.estimatedLength.includes('500-800') ? 650 :
                           assetType.estimatedLength.includes('150-300') ? 225 : 500
      };
    });
    
    setOutlines(generatedOutlines);
    setIsGenerating(false);
  };

  const handleProceed = () => {
    onComplete(outlines);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Brief
              </Button>
              <div>
                <CardTitle className="text-brand-primary">Content Outlines</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Generate structured outlines for all {CAMPAIGN_ASSET_TYPES.length} GTM assets
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.keys(outlines).length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate Outlines</h3>
              <p className="text-gray-600 mb-6">
                AI will create structured outlines for all {CAMPAIGN_ASSET_TYPES.length} GTM assets based on your brief
              </p>
              <Button 
                onClick={handleGenerateOutlines}
                disabled={isGenerating}
                className="bg-brand-primary hover:bg-brand-primary/90"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Outlines...
                  </>
                ) : (
                  'Generate Content Outlines'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CAMPAIGN_ASSET_TYPES.map((assetType) => {
                  const outline = outlines[assetType.id];
                  return (
                    <Card key={assetType.id} className="border-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">{assetType.name}</CardTitle>
                        <p className="text-xs text-gray-500">{assetType.description}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {outline && (
                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="font-medium">Hook:</span>
                              <p className="text-gray-600">{outline.hook}</p>
                            </div>
                            <div>
                              <span className="font-medium">Sections:</span>
                              <ul className="text-gray-600 ml-2">
                                {outline.sections.map((section: any, idx: number) => (
                                  <li key={idx}>• {section.heading}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="font-medium">Est. Words:</span>
                              <span className="text-gray-600 ml-1">{outline.estimatedWordCount}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <div className="border-t pt-6">
                <Button 
                  onClick={handleProceed}
                  className="w-full bg-brand-primary hover:bg-brand-primary/90"
                  size="lg"
                >
                  Proceed to Draft Generation
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
