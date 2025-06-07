
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit3, CheckCircle, RefreshCw } from 'lucide-react';
import { ProductCampaignBrief, CAMPAIGN_ASSET_TYPES, CampaignOutline } from '../types';
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCampaignOutlineGeneratorProps {
  brief: ProductCampaignBrief;
  onComplete: (outlines: Record<string, CampaignOutline>) => void;
  onBack: () => void;
  initialOutlines?: Record<string, any> | null;
}

export const ProductCampaignOutlineGenerator: React.FC<ProductCampaignOutlineGeneratorProps> = ({
  brief,
  onComplete,
  onBack,
  initialOutlines
}) => {
  const { generateContent } = useChatGPT();
  const { toast } = useToast();
  const [outlines, setOutlines] = useState<Record<string, CampaignOutline>>(initialOutlines || {});
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [regeneratingAsset, setRegeneratingAsset] = useState<string | null>(null);

  const generateOutlineForAsset = async (assetType: any) => {
    try {
      const prompt = `
Using the Product-Led Storytelling (PLS) approach and the 3Rs Formula (Resonance, Relevance, Results), create a detailed content outline for a ${assetType.name}.

Campaign Brief:
- Product/Feature: ${brief.productName}
- Description: ${brief.featureDescription}
- Why Built: ${brief.whyBuilt}
- Core Transformation: ${brief.coreTransformation}
- Positioning: ${brief.positioningAngle}
- CTA: ${brief.desiredCTA}
- Style: ${brief.styleDepth}

Target Audience: ${assetType.targetAudience}
Estimated Length: ${assetType.estimatedLength}

Create an outline with:
1. Compelling hook that demonstrates resonance with the target audience
2. 3-5 main sections with H2 headings
3. 2-3 H3 subheadings per section
4. Suggested visuals/screenshots for each section
5. Clear CTA that drives the desired action
6. Estimated word count

Format as JSON with this structure:
{
  "title": "Content title",
  "hook": "Opening hook/intro",
  "sections": [
    {
      "heading": "H2 heading",
      "subheadings": ["H3 subheading 1", "H3 subheading 2"],
      "suggestedVisuals": ["Visual description 1", "Visual description 2"]
    }
  ],
  "cta": "Call to action text",
  "estimatedWordCount": 800
}
`;

      const response = await generateContent(prompt, { maxTokens: 1500 });
      
      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }
      
      const outline = JSON.parse(jsonMatch[0]);
      return {
        assetType: assetType.id,
        ...outline
      };
    } catch (error) {
      console.error('Error generating outline:', error);
      throw error;
    }
  };

  const generateAllOutlines = async () => {
    setIsGenerating(true);
    
    try {
      const newOutlines: Record<string, CampaignOutline> = {};
      
      // Filter asset types based on whether secondary ICP is provided
      const relevantAssetTypes = CAMPAIGN_ASSET_TYPES.filter(asset => {
        if (asset.id === 'icp-02-article' && !brief.secondaryICP) {
          return false;
        }
        return true;
      });
      
      for (const assetType of relevantAssetTypes) {
        try {
          const outline = await generateOutlineForAsset(assetType);
          newOutlines[assetType.id] = outline;
          
          // Add small delay between requests
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error generating outline for ${assetType.id}:`, error);
          toast({
            title: "Generation Error",
            description: `Failed to generate outline for ${assetType.name}`,
            variant: "destructive"
          });
        }
      }
      
      setOutlines(newOutlines);
      
      toast({
        title: "Outlines Generated",
        description: `Generated ${Object.keys(newOutlines).length} content outlines successfully.`
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content outlines. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateOutline = async (assetId: string) => {
    setRegeneratingAsset(assetId);
    
    try {
      const assetType = CAMPAIGN_ASSET_TYPES.find(a => a.id === assetId);
      if (!assetType) return;
      
      const outline = await generateOutlineForAsset(assetType);
      setOutlines(prev => ({
        ...prev,
        [assetId]: outline
      }));
      
      toast({
        title: "Outline Regenerated",
        description: `Updated outline for ${assetType.name}`
      });
    } catch (error) {
      toast({
        title: "Regeneration Failed",
        description: "Failed to regenerate outline. Please try again.",
        variant: "destructive"
      });
    } finally {
      setRegeneratingAsset(null);
    }
  };

  const updateOutline = (assetId: string, field: string, value: any) => {
    setOutlines(prev => ({
      ...prev,
      [assetId]: {
        ...prev[assetId],
        [field]: value
      }
    }));
  };

  const canProceed = Object.keys(outlines).length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-brand-primary">Content Outlines</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Review and edit generated outlines before creating final drafts
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onBack} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Brief
              </Button>
              {Object.keys(outlines).length === 0 && (
                <Button 
                  onClick={generateAllOutlines}
                  disabled={isGenerating}
                  className="bg-brand-primary hover:bg-brand-primary/90"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate All Outlines'
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Outlines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CAMPAIGN_ASSET_TYPES
          .filter(asset => asset.id !== 'icp-02-article' || brief.secondaryICP)
          .map((assetType) => {
            const outline = outlines[assetType.id];
            const isEditing = editingAsset === assetType.id;
            const isRegenerating = regeneratingAsset === assetType.id;
            
            return (
              <Card key={assetType.id} className="h-fit">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {assetType.name}
                      </CardTitle>
                      <p className="text-xs text-gray-500 mt-1">
                        {assetType.estimatedLength} • {assetType.targetAudience}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {outline && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => regenerateOutline(assetType.id)}
                            disabled={isRegenerating}
                          >
                            <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingAsset(isEditing ? null : assetType.id)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {outline && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {outline ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-700">Title</label>
                        {isEditing ? (
                          <Textarea
                            value={outline.title}
                            onChange={(e) => updateOutline(assetType.id, 'title', e.target.value)}
                            className="mt-1"
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm mt-1 font-medium">{outline.title}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-700">Hook</label>
                        {isEditing ? (
                          <Textarea
                            value={outline.hook}
                            onChange={(e) => updateOutline(assetType.id, 'hook', e.target.value)}
                            className="mt-1"
                            rows={3}
                          />
                        ) : (
                          <p className="text-sm mt-1 text-gray-600">{outline.hook}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-700">Sections</label>
                        <div className="mt-1 space-y-2">
                          {outline.sections?.map((section, index) => (
                            <div key={index} className="text-sm">
                              <div className="font-medium">{section.heading}</div>
                              <div className="text-gray-600 ml-2">
                                {section.subheadings?.map((sub, subIndex) => (
                                  <div key={subIndex}>• {sub}</div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-700">CTA</label>
                        {isEditing ? (
                          <Textarea
                            value={outline.cta}
                            onChange={(e) => updateOutline(assetType.id, 'cta', e.target.value)}
                            className="mt-1"
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm mt-1 text-gray-600">{outline.cta}</p>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Estimated: {outline.estimatedWordCount} words
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-sm">Outline not generated yet</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>

      {canProceed && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Ready to Generate Content</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {Object.keys(outlines).length} outlines ready for final draft generation
                </p>
              </div>
              <Button 
                onClick={() => onComplete(outlines)}
                className="bg-brand-primary hover:bg-brand-primary/90"
                size="lg"
              >
                Generate Final Drafts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
