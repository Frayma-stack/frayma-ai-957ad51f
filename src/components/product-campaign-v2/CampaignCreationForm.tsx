import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Zap } from 'lucide-react';
import { ProductUpdateCampaign, GTM_ASSET_TEMPLATES } from '@/types/productCampaign';
import { ICPStoryScript } from '@/types/storytelling';
import { useToast } from '@/hooks/use-toast';

interface CampaignCreationFormProps {
  scripts: ICPStoryScript[];
  selectedClientId?: string;
  onBack: () => void;
  onComplete: (campaign: ProductUpdateCampaign) => void;
}

export const CampaignCreationForm: React.FC<CampaignCreationFormProps> = ({
  scripts,
  selectedClientId,
  onBack,
  onComplete
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    productName: '',
    featureDescription: '',
    enablesWhat: '',
    whyMatters: '',
    launchGoal: 'awareness' as const,
    targetICPs: [] as string[],
    icpStoryScriptId: '',
    existingFeature: '',
    useCase: '',
    differentiator: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.title || !formData.productName || !formData.featureDescription) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in the campaign title, product name, and feature description.",
        variant: "destructive"
      });
      return;
    }

    const campaign: ProductUpdateCampaign = {
      id: `campaign-${Date.now()}`,
      title: formData.title,
      summary: formData.featureDescription,
      productName: formData.productName,
      featureDescription: formData.featureDescription,
      whyBuilt: `To ${formData.enablesWhat}`, // Simplified for now
      enablesWhat: formData.enablesWhat,
      whyMatters: formData.whyMatters,
      launchGoal: formData.launchGoal,
      targetICPs: formData.targetICPs,
      icpStoryScriptId: formData.icpStoryScriptId,
      productContext: {
        existingFeature: formData.existingFeature,
        useCase: formData.useCase,
        differentiator: formData.differentiator
      },
      assets: GTM_ASSET_TEMPLATES.map(template => ({
        id: `asset-${template.type}-${Date.now()}`,
        campaignId: `campaign-${Date.now()}`,
        type: template.type,
        status: 'not_started' as const,
        lastUpdated: new Date().toISOString()
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clientId: selectedClientId
    };

    onComplete(campaign);
  };

  return (
    <div className="space-y-6">
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
              <span>Back</span>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-brand-primary/20 rounded-lg">
                <Zap className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <CardTitle className="text-xl text-brand-primary">
                  Start New Campaign
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Set up your Product/Feature Update campaign workspace
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Setup</CardTitle>
          <p className="text-sm text-gray-600">
            Provide the core context that will power all your GTM assets
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Campaign Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Q4 Advanced Analytics Feature Launch"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="productName">What's being launched? *</Label>
              <Input
                id="productName"
                placeholder="Product update or new feature name"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="featureDescription">Short summary of what it is *</Label>
              <Textarea
                id="featureDescription"
                placeholder="Brief description of the feature or update"
                value={formData.featureDescription}
                onChange={(e) => handleInputChange('featureDescription', e.target.value)}
                className="h-20"
              />
            </div>

            <div>
              <Label htmlFor="enablesWhat">What does it enable?</Label>
              <Textarea
                id="enablesWhat"
                placeholder="What new capabilities or outcomes does this provide?"
                value={formData.enablesWhat}
                onChange={(e) => handleInputChange('enablesWhat', e.target.value)}
                className="h-20"
              />
            </div>

            <div>
              <Label htmlFor="whyMatters">Why does it matter?</Label>
              <Textarea
                id="whyMatters"
                placeholder="Why should your audience care about this update?"
                value={formData.whyMatters}
                onChange={(e) => handleInputChange('whyMatters', e.target.value)}
                className="h-20"
              />
            </div>
          </div>

          {/* Strategy */}
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Launch Strategy</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="launchGoal">Launch Goal</Label>
                <Select value={formData.launchGoal} onValueChange={(value: any) => handleInputChange('launchGoal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Awareness</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="retention">Retention</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {scripts.length > 0 && (
                <div>
                  <Label htmlFor="icpScript">Target ICP StoryScript</Label>
                  <Select value={formData.icpStoryScriptId} onValueChange={(value) => handleInputChange('icpStoryScriptId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ICP script to tie to" />
                    </SelectTrigger>
                    <SelectContent>
                      {scripts.map((script) => (
                        <SelectItem key={script.id} value={script.id}>
                          {script.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Product Context */}
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Product Context</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="existingFeature">Existing feature it makes better</Label>
                <Input
                  id="existingFeature"
                  placeholder="Which existing feature does this improve?"
                  value={formData.existingFeature}
                  onChange={(e) => handleInputChange('existingFeature', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="useCase">Use case it advances/introduces</Label>
                <Input
                  id="useCase"
                  placeholder="What use case does this enable or improve?"
                  value={formData.useCase}
                  onChange={(e) => handleInputChange('useCase', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="differentiator">Differentiator it advances</Label>
                <Input
                  id="differentiator"
                  placeholder="How does this strengthen your competitive advantage?"
                  value={formData.differentiator}
                  onChange={(e) => handleInputChange('differentiator', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full bg-brand-primary hover:bg-brand-primary/90"
            size="lg"
          >
            Create Campaign Workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};