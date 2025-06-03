
import { FC, useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2, FileText, HelpCircle, Sparkles, Lightbulb, Target, TrendingUp } from 'lucide-react';
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

  const getPhaseInfo = (phase: string) => {
    switch (phase) {
      case 'attract':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: Target,
          label: 'ATTRACT (Resonance)',
          description: 'Hook & capture attention'
        };
      case 'filter':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: Target,
          label: 'FILTER (Resonance)',
          description: 'Qualify target audience'
        };
      case 'engage':
        return {
          color: 'bg-purple-100 text-purple-800',
          icon: Lightbulb,
          label: 'ENGAGE (Relevance)',
          description: 'Deliver value & insights'
        };
      case 'results':
        return {
          color: 'bg-green-100 text-green-800',
          icon: TrendingUp,
          label: 'RESULTS (Results)',
          description: 'Drive action & conversion'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: FileText,
          label: phase.toUpperCase(),
          description: 'Content section'
        };
    }
  };

  const updateSection = (index: number, field: keyof OutlineSection, value: any) => {
    const newSections = [...data.outlineSections];
    newSections[index] = { ...newSections[index], [field]: value };
    onDataChange('outlineSections', newSections);
  };

  const addSection = () => {
    const newSection: OutlineSection = {
      id: `custom_${Date.now()}`,
      type: 'H2',
      title: 'New Section',
      context: '',
      phase: 'engage',
      linkedAssetType: undefined,
      linkedAssetId: undefined
    };
    onDataChange('outlineSections', [...data.outlineSections, newSection]);
  };

  const removeSection = (index: number) => {
    const newSections = data.outlineSections.filter((_, i) => i !== index);
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
    
    switch (type) {
      case 'success_story':
        return (asset as CustomerSuccessStory).title || 'Untitled Story';
      case 'feature':
        return (asset as ProductFeature).name || 'Untitled Feature';
      case 'use_case':
        return (asset as ProductUseCase).useCase || 'Untitled Use Case';
      case 'differentiator':
        return (asset as ProductDifferentiator).name || 'Untitled Differentiator';
      default:
        return 'Unknown';
    }
  };

  const getContentTypeLabel = () => {
    return articleSubType === 'newsletter' 
      ? 'First-Person Narrative Newsletter'
      : 'Thought Leadership & How-to Guide';
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
                <p className="text-xs max-w-xs">
                  AI has generated a {getContentTypeLabel()} outline using the Product-Led Storytelling approach and your content discovery triggers. 
                  Customize headlines, sections, and link assets to guide the auto-crafting.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* 3Rs Formula Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <Sparkles className="h-4 w-4 text-story-blue mr-2" />
              <h4 className="text-sm font-semibold text-story-blue">Product-Led Storytelling (PLS) Framework</h4>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Your outline follows the 3Rs Formula: <strong>Resonance</strong> (attract & filter audience), 
              <strong>Relevance</strong> (engage with valuable insights), and <strong>Results</strong> (drive action).
            </p>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="flex items-center">
                <Target className="h-3 w-3 text-blue-600 mr-1" />
                <span className="text-blue-700">Attract</span>
              </div>
              <div className="flex items-center">
                <Target className="h-3 w-3 text-yellow-600 mr-1" />
                <span className="text-yellow-700">Filter</span>
              </div>
              <div className="flex items-center">
                <Lightbulb className="h-3 w-3 text-purple-600 mr-1" />
                <span className="text-purple-700">Engage</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-700">Results</span>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <p className="text-sm">AI will generate headline options based on your content triggers</p>
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
              <CardTitle className="text-base">PLS-Based Content Outline</CardTitle>
              {isGeneratingOutline && (
                <div className="flex items-center text-sm text-story-blue">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Building outline...
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">
              AI-generated outline using your content discovery triggers. Edit sections, add your POV, and link assets.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.outlineSections.length > 0 ? (
              <>
                {data.outlineSections.map((section, index) => {
                  const phaseInfo = getPhaseInfo(section.phase);
                  const PhaseIcon = phaseInfo.icon;
                  
                  return (
                    <div key={section.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {section.type}
                          </Badge>
                          <Badge className={`text-xs ${phaseInfo.color}`}>
                            <PhaseIcon className="h-3 w-3 mr-1" />
                            {phaseInfo.label}
                          </Badge>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-3 w-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{phaseInfo.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSection(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">Section Title</Label>
                          <Input
                            value={section.title}
                            onChange={(e) => updateSection(index, 'title', e.target.value)}
                            placeholder={`${section.type} heading`}
                            className="font-medium"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">Your POV/Context (Optional)</Label>
                          <Textarea
                            value={section.context || ''}
                            onChange={(e) => updateSection(index, 'context', e.target.value)}
                            placeholder="Add your perspective, direction, or specific points to guide AI generation..."
                            rows={2}
                            className="text-sm"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Link Asset Type</Label>
                            <Select 
                              value={section.linkedAssetType || ''} 
                              onValueChange={(value) => updateSection(index, 'linkedAssetType', value)}
                            >
                              <SelectTrigger className="text-sm">
                                <SelectValue placeholder="Optional asset" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                <SelectItem value="success_story">Success Story</SelectItem>
                                <SelectItem value="feature">Product Feature</SelectItem>
                                <SelectItem value="use_case">Use Case</SelectItem>
                                <SelectItem value="differentiator">Differentiator</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {section.linkedAssetType && (
                            <div>
                              <Label className="text-xs text-gray-500 mb-1 block">Select Asset</Label>
                              <Select 
                                value={section.linkedAssetId || ''} 
                                onValueChange={(value) => updateSection(index, 'linkedAssetId', value)}
                              >
                                <SelectTrigger className="text-sm">
                                  <SelectValue placeholder="Choose asset" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getAssetOptions(section.linkedAssetType).map((asset: any) => (
                                    <SelectItem key={asset.id} value={asset.id}>
                                      {getAssetDisplayName(section.linkedAssetType!, asset.id)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <Button 
                  variant="outline" 
                  onClick={addSection}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </>
            ) : (
              <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">AI will generate your {getContentTypeLabel()} outline using the PLS framework</p>
                <p className="text-xs text-gray-400 mt-1">Structure will include content discovery triggers and follow the 3Rs Formula</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default EnhancedContentOutlineStep;
