
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Loader2, Download, Eye } from 'lucide-react';
import { ProductCampaignBrief, CAMPAIGN_ASSET_TYPES, CampaignDraft } from '../types';

interface ProductCampaignDraftGeneratorProps {
  brief: ProductCampaignBrief;
  outlines: Record<string, any>;
  onBack: () => void;
}

export const ProductCampaignDraftGenerator: React.FC<ProductCampaignDraftGeneratorProps> = ({
  brief,
  outlines,
  onBack
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, CampaignDraft>>({});
  const [selectedDraft, setSelectedDraft] = useState<string | null>(null);

  const handleGenerateDrafts = async () => {
    setIsGenerating(true);
    
    // Simulate draft generation
    const generatedDrafts: Record<string, CampaignDraft> = {};
    
    for (const assetType of CAMPAIGN_ASSET_TYPES) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate generation time
      
      generatedDrafts[assetType.id] = {
        assetType: assetType.id,
        title: `${assetType.name} for ${brief.productName}`,
        content: `This is a placeholder draft for ${assetType.name}.\n\nThe content would be generated based on:\n- Product: ${brief.productName}\n- Core Transformation: ${brief.coreTransformation}\n- Target Audience: ${assetType.targetAudience}\n- Style: ${brief.styleDepth}\n\nThis draft follows the outline structure and incorporates the key messaging from your strategic brief.`,
        authorId: brief.authorProfiles[0] || '',
        version: 1,
        generatedAt: new Date().toISOString()
      };
    }
    
    setDrafts(generatedDrafts);
    setIsGenerating(false);
  };

  const getAssetTypeInfo = (assetId: string) => {
    return CAMPAIGN_ASSET_TYPES.find(type => type.id === assetId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Outlines
              </Button>
              <div>
                <CardTitle className="text-brand-primary">Auto-Craft Drafts</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Generate complete GTM content package ({CAMPAIGN_ASSET_TYPES.length} assets)
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.keys(drafts).length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Auto-Craft Drafts</h3>
              <p className="text-gray-600 mb-6">
                AI will generate complete, ready-to-use content for all {CAMPAIGN_ASSET_TYPES.length} GTM assets
              </p>
              <Button 
                onClick={handleGenerateDrafts}
                disabled={isGenerating}
                className="bg-brand-primary hover:bg-brand-primary/90"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Auto-Crafting Drafts...
                  </>
                ) : (
                  'Auto-Craft All Drafts'
                )}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Asset List */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Generated Assets</h3>
                <div className="space-y-2">
                  {Object.entries(drafts).map(([assetId, draft]) => {
                    const assetInfo = getAssetTypeInfo(assetId);
                    return (
                      <Card 
                        key={assetId} 
                        className={`cursor-pointer border-2 transition-colors ${
                          selectedDraft === assetId ? 'border-brand-primary bg-brand-primary/5' : 'hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedDraft(assetId)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{assetInfo?.name}</h4>
                              <p className="text-xs text-gray-500">{assetInfo?.targetAudience}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {assetInfo?.category}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <div className="border-t pt-4">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Assets
                  </Button>
                </div>
              </div>

              {/* Draft Preview */}
              <div className="space-y-4">
                {selectedDraft ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        {getAssetTypeInfo(selectedDraft)?.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {getAssetTypeInfo(selectedDraft)?.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Title:</h4>
                          <p className="text-sm bg-gray-50 p-2 rounded">
                            {drafts[selectedDraft].title}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-2">Content:</h4>
                          <div className="text-sm bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">
                            <pre className="whitespace-pre-wrap font-sans">
                              {drafts[selectedDraft].content}
                            </pre>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Version {drafts[selectedDraft].version}</span>
                          <span>Generated {new Date(drafts[selectedDraft].generatedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                      <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        Select an asset to preview its content
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
