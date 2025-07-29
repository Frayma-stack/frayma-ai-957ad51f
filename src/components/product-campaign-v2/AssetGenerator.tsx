import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, FileText, Loader2, User } from 'lucide-react';
import { ProductUpdateCampaign, GTMAsset, getAssetTemplate } from '@/types/productCampaign';
import { Author } from '@/types/storytelling';
import ContentEditor from '@/components/ContentEditor';
import { useToast } from '@/hooks/use-toast';

interface AssetGeneratorProps {
  campaign: ProductUpdateCampaign;
  asset: GTMAsset;
  authors: Author[];
  onBack: () => void;
  onAssetUpdate: (updatedAsset: GTMAsset) => void;
}

export const AssetGenerator: React.FC<AssetGeneratorProps> = ({
  campaign,
  asset,
  authors,
  onBack,
  onAssetUpdate
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'setup' | 'outline' | 'draft'>('setup');
  const [selectedAuthorId, setSelectedAuthorId] = useState(asset.authorId || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [outline, setOutline] = useState(asset.outline || '');
  const [content, setContent] = useState(asset.content || '');

  const template = getAssetTemplate(asset.type);
  
  if (!template) {
    return <div>Asset template not found</div>;
  }

  const handleSetupComplete = () => {
    if (template.requiresAuthor && !selectedAuthorId) {
      toast({
        title: "Select Author",
        description: "This asset type requires an author to be selected.",
        variant: "destructive"
      });
      return;
    }
    
    // Update asset with selected author
    const updatedAsset = {
      ...asset,
      authorId: selectedAuthorId,
      status: 'in_progress' as const,
      lastUpdated: new Date().toISOString()
    };
    onAssetUpdate(updatedAsset);
    
    setCurrentStep('outline');
  };

  const handleGenerateOutline = async () => {
    setIsGenerating(true);
    
    // Simulate outline generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock outline based on campaign data
    const mockOutline = `# ${template.name} for ${campaign.productName}

## Hook
${campaign.whyMatters || 'Compelling opening that captures attention'}

## Main Sections
1. **Introduction**
   - Context: ${campaign.featureDescription}
   - Problem/opportunity this addresses

2. **Core Value**
   - What it enables: ${campaign.enablesWhat || 'Key capabilities'}
   - Why it matters: ${campaign.whyMatters || 'Impact and benefits'}

3. **Product Context**
   - Builds on: ${campaign.productContext.existingFeature || 'Existing functionality'}
   - Advances use case: ${campaign.productContext.useCase || 'User workflows'}
   - Strengthens differentiator: ${campaign.productContext.differentiator || 'Competitive advantage'}

4. **Call to Action**
   - Goal: ${campaign.launchGoal}
   - Next steps for ${template.targetAudience}

**Estimated Length:** ${template.estimatedLength}
**Target Audience:** ${template.targetAudience}`;

    setOutline(mockOutline);
    setIsGenerating(false);
    
    // Update asset with outline
    const updatedAsset = {
      ...asset,
      outline: mockOutline,
      lastUpdated: new Date().toISOString()
    };
    onAssetUpdate(updatedAsset);
  };

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    
    // Simulate draft generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock content based on outline and campaign data
    const mockContent = `# ${template.name}: ${campaign.productName}

${campaign.whyMatters ? `${campaign.whyMatters}\n\n` : ''}

## Introduction

We're excited to introduce ${campaign.productName}, ${campaign.featureDescription}

This ${template.category} is designed specifically for ${template.targetAudience} to help you ${campaign.enablesWhat || 'achieve better outcomes'}.

## Why This Matters

${campaign.whyMatters || 'This update represents a significant step forward in our commitment to providing the best possible experience for our users.'}

The new ${campaign.productName} builds upon our existing ${campaign.productContext.existingFeature || 'platform capabilities'} to ${campaign.enablesWhat || 'unlock new possibilities'}.

## Key Benefits

- Enhanced ${campaign.productContext.useCase || 'user experience'}
- Improved ${campaign.productContext.differentiator || 'competitive positioning'}
- Streamlined workflows for ${template.targetAudience}

## Next Steps

${campaign.launchGoal === 'awareness' ? 'Learn more about this exciting update and how it can benefit your workflow.' : ''}
${campaign.launchGoal === 'conversions' ? 'Ready to get started? Contact our team to begin using these new capabilities.' : ''}
${campaign.launchGoal === 'onboarding' ? 'Follow our step-by-step guide to start using these new features today.' : ''}
${campaign.launchGoal === 'retention' ? 'Discover how these enhancements can improve your existing workflows.' : ''}

---

*This ${template.category} was generated as part of the ${campaign.title} campaign.*`;

    setContent(mockContent);
    setIsGenerating(false);
    setCurrentStep('draft');
    
    // Update asset with content
    const updatedAsset = {
      ...asset,
      content: mockContent,
      title: `${template.name}: ${campaign.productName}`,
      status: 'completed' as const,
      lastUpdated: new Date().toISOString()
    };
    onAssetUpdate(updatedAsset);
  };

  const renderSetupStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-brand-primary">Asset Setup</CardTitle>
        <p className="text-sm text-gray-600">
          Configure settings for generating your {template.name}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">{template.name}</h4>
          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Length: {template.estimatedLength}</span>
            <span>Audience: {template.targetAudience}</span>
            <span>Category: {template.category}</span>
          </div>
        </div>

        {template.requiresAuthor && (
          <div>
            <Label htmlFor="author">Select Author</Label>
            <Select value={selectedAuthorId} onValueChange={setSelectedAuthorId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose the author for this content" />
              </SelectTrigger>
              <SelectContent>
                {authors.map((author) => (
                  <SelectItem key={author.id} value={author.id}>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{author.name} - {author.role}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Campaign Context</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div><span className="font-medium">Product:</span> {campaign.productName}</div>
            <div><span className="font-medium">Goal:</span> {campaign.launchGoal}</div>
            <div><span className="font-medium">Summary:</span> {campaign.summary}</div>
          </div>
        </div>

        <Button 
          onClick={handleSetupComplete}
          className="w-full bg-brand-primary hover:bg-brand-primary/90"
          size="lg"
        >
          Proceed to Outline Generation
        </Button>
      </CardContent>
    </Card>
  );

  const renderOutlineStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-brand-primary">Content Outline</CardTitle>
        <p className="text-sm text-gray-600">
          Generate a structured outline for your {template.name}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!outline ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate Outline</h3>
            <p className="text-gray-600 mb-6">
              AI will create a structured outline based on your campaign context
            </p>
            <Button 
              onClick={handleGenerateOutline}
              disabled={isGenerating}
              className="bg-brand-primary hover:bg-brand-primary/90"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Outline...
                </>
              ) : (
                'Generate Outline'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {outline}
              </pre>
            </div>
            
            <Button 
              onClick={handleGenerateDraft}
              className="w-full bg-brand-primary hover:bg-brand-primary/90"
              size="lg"
            >
              Generate Final Draft
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderDraftStep = () => (
    <ContentEditor
      initialContent={content}
      title={`${template.name}: ${campaign.productName}`}
      onBack={onBack}
    />
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'setup':
        return renderSetupStep();
      case 'outline':
        return renderOutlineStep();
      case 'draft':
        return renderDraftStep();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {currentStep !== 'draft' && (
        <>
          {/* Header */}
          <Card className="bg-gradient-to-r from-brand-primary/10 to-purple-100 border-brand-primary/20">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBack}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Campaign</span>
                </Button>
                <div>
                  <CardTitle className="text-xl text-brand-primary">
                    {template.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {campaign.title}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Step Content */}
          {renderStepContent()}
        </>
      )}

      {currentStep === 'draft' && renderStepContent()}
    </div>
  );
};