
import { FC, useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2, FileText, HelpCircle, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CustomerSuccessStory, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';

interface HeadlineOption {
  id: string;
  text: string;
  isGenerated: boolean;
}

interface OutlineSection {
  id: string;
  type: 'H2' | 'H3' | 'H4';
  title: string;
  context?: string;
  linkedAssetType?: 'success_story' | 'feature' | 'use_case' | 'differentiator';
  linkedAssetId?: string;
  phase: 'attract' | 'filter' | 'engage' | 'results';
}

interface EnhancedContentOutlineData {
  headlineOptions: HeadlineOption[];
  selectedHeadline: string;
  outlineSections: OutlineSection[];
}

interface EnhancedContentOutlineStepProps {
  data: EnhancedContentOutlineData;
  articleSubType: 'newsletter' | 'thought_leadership';
  successStories: CustomerSuccessStory[];
  productFeatures: ProductFeature[];
  productUseCases: ProductUseCase[];
  productDifferentiators: ProductDifferentiator[];
  isGeneratingHeadlines?: boolean;
  isGeneratingOutline?: boolean;
  onDataChange: (field: keyof EnhancedContentOutlineData, value: any) => void;
  onAddHeadline: () => void;
}

const EnhancedContentOutlineStep: FC<EnhancedContentOutlineStepProps> = ({
  data,
  articleSubType,
  successStories,
  productFeatures,
  productUseCases,
  productDifferentiators,
  isGeneratingHeadlines = false,
  isGeneratingOutline = false,
  onDataChange,
  onAddHeadline
}) => {
  const [newHeadlineText, setNewHeadlineText] = useState('');

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'attract': return 'bg-blue-100 text-blue-800';
      case 'filter': return 'bg-yellow-100 text-yellow-800';
      case 'engage': return 'bg-purple-100 text-purple-800';
      case 'results': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateSection = (index: number, field: keyof OutlineSection, value: any) => {
    const newSections = [...data.outlineSections];
    newSections[index] = { ...newSections[index], [field]: value };
    onDataChange('outlineSections', newSections);
  };

  const addCustomHeadline = () => {
    if (!newHeadlineText.trim()) return;
    
    const newHeadline: HeadlineOption = {
      id: `custom_${Date.now()}`,
      text: newHeadlineText,
      isGenerated: false
    };
    
    onDataChange('headlineOptions', [...data.headlineOptions, newHeadline]);
    setNewHeadlineText('');
  };

  const getAssetOptions = (type: string) => {
    switch (type) {
      case 'success_story': return successStories;
      case 'feature': return productFeatures;
      case 'use_case': return productUseCases;
      case 'differentiator': return productDifferentiators;
      default: return [];
    }
  };

  const getAssetDisplayName = (type: string, id: string) => {
    const assets = getAssetOptions(type);
    const asset = assets.find((a: any) => a.id === id);
    
    if (!asset) return 'Unknown';
    
    // Handle different asset types with their specific properties
    switch (type) {
      case 'success_story':
        return (asset as CustomerSuccessStory).title || 'Untitled Story';
      case 'feature':
        return (asset as ProductFeature).name || 'Untitled Feature';
      case 'use_case':
        return (asset as ProductUseCase).useCase || 'Untitled Use Case';
      case 'differentiator':
        return (asset as ProductDifferentiator).title || 'Untitled Differentiator';
      default:
        return 'Unknown';
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Step Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-story-blue mr-2" />
            <h3 className="text-lg font-semibold text-story-blue">Content Architecture</h3>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">Select your headline and refine the AI-generated outline structure</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Headline Selection */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Choose Your Headline</CardTitle>
              {isGeneratingHeadlines && (
                <div className="flex items-center text-sm text-story-blue">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating options...
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.headlineOptions.length > 0 ? (
              <RadioGroup value={data.selectedHeadline} onValueChange={(value) => onDataChange('selectedHeadline', value)}>
                {data.headlineOptions.map((headline) => (
                  <div key={headline.id} className="flex items-start space-x-2">
                    <RadioGroupItem value={headline.id} id={headline.id} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={headline.id} className="text-sm leading-relaxed cursor-pointer">
                        {headline.text}
                      </Label>
                      {headline.isGenerated && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Generated
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Sparkles className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">AI will generate headline options</p>
              </div>
            )}
            
            {/* Add Custom Headline */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium mb-2 block">Add Your Own Headline</Label>
              <div className="flex gap-2">
                <Input
                  value={newHeadlineText}
                  onChange={(e) => setNewHeadlineText(e.target.value)}
                  placeholder="Write your custom headline..."
                  className="flex-1"
                />
                <Button onClick={addCustomHeadline} size="sm" disabled={!newHeadlineText.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Outline */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Content Outline Structure</CardTitle>
              {isGeneratingOutline && (
                <div className="flex items-center text-sm text-story-blue">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Building outline...
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.outlineSections.length > 0 ? (
              data.outlineSections.map((section, index) => (
                <div key={section.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {section.type}
                    </Badge>
                    <Badge className={`text-xs ${getPhaseColor(section.phase)}`}>
                      {section.phase.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <Input
                    value={section.title}
                    onChange={(e) => updateSection(index, 'title', e.target.value)}
                    placeholder={`${section.type} heading`}
                    className="font-medium"
                  />
                  
                  <Textarea
                    value={section.context || ''}
                    onChange={(e) => updateSection(index, 'context', e.target.value)}
                    placeholder="Optional: Add context, direction, or POV to guide AI generation..."
                    rows={2}
                    className="text-sm"
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Select 
                      value={section.linkedAssetType || ''} 
                      onValueChange={(value) => updateSection(index, 'linkedAssetType', value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Link asset type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="success_story">Success Story</SelectItem>
                        <SelectItem value="feature">Product Feature</SelectItem>
                        <SelectItem value="use_case">Use Case</SelectItem>
                        <SelectItem value="differentiator">Differentiator</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {section.linkedAssetType && (
                      <Select 
                        value={section.linkedAssetId || ''} 
                        onValueChange={(value) => updateSection(index, 'linkedAssetId', value)}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select asset" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAssetOptions(section.linkedAssetType).map((asset: any) => (
                            <SelectItem key={asset.id} value={asset.id}>
                              {getAssetDisplayName(section.linkedAssetType!, asset.id)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">AI will generate your content outline structure</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default EnhancedContentOutlineStep;
