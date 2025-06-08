
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ProductCampaignBrief } from '../types';
import { Author, ICPStoryScript } from '@/types/storytelling';
import { useToast } from '@/hooks/use-toast';

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
          {/* Basic Product Info */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Product Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product/Feature Name *</Label>
                <Input
                  id="productName"
                  placeholder="e.g., Advanced Analytics Dashboard"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coreTransformation">Core Transformation *</Label>
                <Input
                  id="coreTransformation"
                  placeholder="e.g., 10x faster insights discovery"
                  value={formData.coreTransformation}
                  onChange={(e) => handleInputChange('coreTransformation', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featureDescription">Feature Description *</Label>
              <Textarea
                id="featureDescription"
                placeholder="Describe what was shipped and its key capabilities..."
                value={formData.featureDescription}
                onChange={(e) => handleInputChange('featureDescription', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whyBuilt">Why This Was Built *</Label>
              <Textarea
                id="whyBuilt"
                placeholder="What customer problem or trigger led to building this?"
                value={formData.whyBuilt}
                onChange={(e) => handleInputChange('whyBuilt', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Product Context */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Product Context</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feature">Feature</Label>
                <Input
                  id="feature"
                  placeholder="Core feature name"
                  value={formData.productContext?.feature}
                  onChange={(e) => handleInputChange('productContext.feature', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="useCase">Use Case</Label>
                <Input
                  id="useCase"
                  placeholder="Primary use case"
                  value={formData.productContext?.useCase}
                  onChange={(e) => handleInputChange('productContext.useCase', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="differentiator">Differentiator</Label>
                <Input
                  id="differentiator"
                  placeholder="Key differentiator"
                  value={formData.productContext?.differentiator}
                  onChange={(e) => handleInputChange('productContext.differentiator', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Target ICPs */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Target Audiences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryICP">Primary ICP *</Label>
                <Select value={formData.primaryICP || "__none__"} onValueChange={(value) => handleInputChange('primaryICP', value === "__none__" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary ICP" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Select an ICP</SelectItem>
                    {scripts.map((script) => (
                      <SelectItem key={script.id} value={script.id}>
                        {script.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryICP">Secondary ICP (Optional)</Label>
                <Select value={formData.secondaryICP || "__none__"} onValueChange={(value) => handleInputChange('secondaryICP', value === "__none__" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select secondary ICP" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {scripts.map((script) => (
                      <SelectItem key={script.id} value={script.id}>
                        {script.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Positioning & CTA */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Campaign Strategy</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="positioningAngle">Positioning Angle *</Label>
                <Textarea
                  id="positioningAngle"
                  placeholder="How this update strengthens your brand narrative..."
                  value={formData.positioningAngle}
                  onChange={(e) => handleInputChange('positioningAngle', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="desiredCTA">Desired CTA *</Label>
                <Textarea
                  id="desiredCTA"
                  placeholder="e.g., Try it now, Book a demo, Upgrade your plan..."
                  value={formData.desiredCTA}
                  onChange={(e) => handleInputChange('desiredCTA', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="styleDepth">Style & Depth</Label>
              <Select value={formData.styleDepth} onValueChange={(value: any) => handleInputChange('styleDepth', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="punchy">Punchy - Quick, impactful messaging</SelectItem>
                  <SelectItem value="educational">Educational - Detailed, informative</SelectItem>
                  <SelectItem value="technical">Technical - In-depth, specification-focused</SelectItem>
                  <SelectItem value="visual-heavy">Visual-Heavy - Story-driven with visuals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Author Selection */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Author Profiles *</h3>
            <p className="text-sm text-gray-600">Select 1-3 author profiles to use for content generation</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {authors.map((author) => (
                <div key={author.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={`author-${author.id}`}
                    checked={formData.authorProfiles?.includes(author.id) || false}
                    onCheckedChange={(checked) => handleAuthorToggle(author.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={`author-${author.id}`} className="font-medium">
                      {author.name}
                    </Label>
                    <p className="text-sm text-gray-600">{author.role}</p>
                    <p className="text-xs text-gray-500">{author.organization}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
