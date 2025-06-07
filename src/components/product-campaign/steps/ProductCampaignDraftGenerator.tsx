
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Download, Edit3, RefreshCw, Eye } from 'lucide-react';
import { ProductCampaignBrief, CampaignOutline, CAMPAIGN_ASSET_TYPES } from '../types';
import { ContentEditorWithFrayma } from '@/components/content-editor/ContentEditorWithFrayma';
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCampaignDraftGeneratorProps {
  brief: ProductCampaignBrief;
  outlines: Record<string, CampaignOutline>;
  onBack: () => void;
}

export const ProductCampaignDraftGenerator: React.FC<ProductCampaignDraftGeneratorProps> = ({
  brief,
  outlines,
  onBack
}) => {
  const { generateContent } = useChatGPT();
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);

  const generateDraftForAsset = async (assetId: string) => {
    setIsGenerating(prev => ({ ...prev, [assetId]: true }));
    
    try {
      const assetType = CAMPAIGN_ASSET_TYPES.find(a => a.id === assetId);
      const outline = outlines[assetId];
      
      if (!assetType || !outline) return;

      const prompt = `
Using the Product-Led Storytelling (PLS) approach and the 3Rs Formula (Resonance, Relevance, Results), write a complete ${assetType.name} based on the following campaign brief and approved outline.

Campaign Brief:
- Product/Feature: ${brief.productName}
- Description: ${brief.featureDescription}
- Why Built: ${brief.whyBuilt}
- Core Transformation: ${brief.coreTransformation}
- Positioning: ${brief.positioningAngle}
- CTA: ${brief.desiredCTA}
- Style: ${brief.styleDepth}

Content Outline:
- Title: ${outline.title}
- Hook: ${outline.hook}
- Sections: ${outline.sections?.map(s => `${s.heading}: ${s.subheadings?.join(', ')}`).join(' | ')}
- CTA: ${outline.cta}
- Target Word Count: ${outline.estimatedWordCount}

Instructions:
1. Write in first-person narrative using an empathetic, human tone
2. Follow the PLS framework: Attract with clarity → Filter/Engage with relevance → Show transformation → Persuade with results
3. Inject specific product context and ICP-relevant narrative anchors
4. Avoid being overly sales-focused; aim for belief-led storytelling
5. Include natural product tie-ins and clear value demonstrations
6. End with the specified CTA in a compelling, non-pushy way

Write the complete ${assetType.category} content now:
`;

      const response = await generateContent(prompt, { 
        maxTokens: assetType.category === 'article' ? 2000 : 800,
        temperature: 0.7 
      });
      
      setDrafts(prev => ({ ...prev, [assetId]: response }));
      
      toast({
        title: "Draft Generated",
        description: `Created ${assetType.name} successfully.`
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: `Failed to generate ${assetType?.name || 'content'}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(prev => ({ ...prev, [assetId]: false }));
    }
  };

  const generateAllDrafts = async () => {
    const assetIds = Object.keys(outlines);
    
    for (const assetId of assetIds) {
      if (!drafts[assetId]) {
        await generateDraftForAsset(assetId);
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  };

  const handleCopyToClipboard = async (content: string, assetName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: `${assetName} content has been copied.`
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = (content: string, assetName: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${assetName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download started",
      description: `${assetName} is being downloaded.`
    });
  };

  const handleOpenInEditor = (assetId: string) => {
    setEditingAsset(assetId);
  };

  const handleBackFromEditor = () => {
    setEditingAsset(null);
  };

  const handleContentChange = (assetId: string, newContent: string) => {
    setDrafts(prev => ({ ...prev, [assetId]: newContent }));
  };

  // If showing the Frayma Editor, render it instead
  if (editingAsset && drafts[editingAsset]) {
    const assetType = CAMPAIGN_ASSET_TYPES.find(a => a.id === editingAsset);
    return (
      <ContentEditorWithFrayma
        initialContent={drafts[editingAsset]}
        contentType={editingAsset}
        contentTypeLabel={assetType?.name || 'Content'}
        onBack={handleBackFromEditor}
        onContentChange={(content) => handleContentChange(editingAsset, content)}
      />
    );
  }

  const totalDrafts = Object.keys(outlines).length;
  const completedDrafts = Object.keys(drafts).length;
  const hasAnyDrafts = completedDrafts > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-brand-primary">Final Draft Generation</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Auto-craft final GTM content using Product-Led Storytelling approach
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {completedDrafts} / {totalDrafts} Generated
              </Badge>
              <Button variant="outline" onClick={onBack} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Outlines
              </Button>
              {!hasAnyDrafts && (
                <Button 
                  onClick={generateAllDrafts}
                  className="bg-brand-primary hover:bg-brand-primary/90"
                >
                  Generate All Drafts
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Drafts Grid */}
      <div className="grid grid-cols-1 gap-6">
        {Object.keys(outlines).map((assetId) => {
          const assetType = CAMPAIGN_ASSET_TYPES.find(a => a.id === assetId);
          const draft = drafts[assetId];
          const isGeneratingDraft = isGenerating[assetId];
          const isExpanded = expandedAsset === assetId;
          
          if (!assetType) return null;

          return (
            <Card key={assetId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-medium">
                      {assetType.name}
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant="secondary">{assetType.category}</Badge>
                      <span className="text-sm text-gray-500">{assetType.estimatedLength}</span>
                      {draft && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Generated
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {draft && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedAsset(isExpanded ? null : assetId)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenInEditor(assetId)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyToClipboard(draft, assetType.name)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(draft, assetType.name)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generateDraftForAsset(assetId)}
                          disabled={isGeneratingDraft}
                        >
                          <RefreshCw className={`h-4 w-4 ${isGeneratingDraft ? 'animate-spin' : ''}`} />
                        </Button>
                      </>
                    )}
                    {!draft && (
                      <Button
                        onClick={() => generateDraftForAsset(assetId)}
                        disabled={isGeneratingDraft}
                        size="sm"
                        className="bg-brand-primary hover:bg-brand-primary/90"
                      >
                        {isGeneratingDraft ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          'Generate Draft'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {draft ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className={`prose max-w-none ${isExpanded ? '' : 'line-clamp-6'}`}>
                        <div className="whitespace-pre-wrap text-sm">
                          {draft}
                        </div>
                      </div>
                      {draft.length > 500 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedAsset(isExpanded ? null : assetId)}
                          className="mt-2"
                        >
                          {isExpanded ? 'Show Less' : 'Show More'}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : isGeneratingDraft ? (
                  <div className="flex items-center justify-center py-8 text-gray-500">
                    <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                    <span>Auto-crafting {assetType.category}...</span>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-sm">Click "Generate Draft" to create this content</div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Campaign Summary */}
      {hasAnyDrafts && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-medium text-green-800 mb-2">Campaign Generated Successfully!</h3>
              <p className="text-sm text-green-700 mb-4">
                Your Product/Feature Update Campaign is ready with {completedDrafts} GTM assets
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-green-600">
                <span>✓ Product-Led Storytelling Applied</span>
                <span>✓ ICP-Targeted Content</span>
                <span>✓ 3Rs Framework Integrated</span>
                <span>✓ Ready for Distribution</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
