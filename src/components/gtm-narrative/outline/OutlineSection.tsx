
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, MoveUp, MoveDown, HelpCircle, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CustomerSuccessStory, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';

interface OutlineSection {
  id: string;
  type: 'H2' | 'H3' | 'H4';
  title: string;
  context?: string;
  linkedAssetType?: 'success_story' | 'feature' | 'use_case' | 'differentiator';
  linkedAssetId?: string;
  phase: 'attract' | 'filter' | 'engage' | 'results';
}

interface OutlineSectionProps {
  section: OutlineSection;
  index: number;
  totalSections: number;
  successStories: CustomerSuccessStory[];
  productFeatures: ProductFeature[];
  productUseCases: ProductUseCase[];
  productDifferentiators: ProductDifferentiator[];
  onUpdateSection: (field: keyof OutlineSection, value: any) => void;
  onMoveSection: (direction: 'up' | 'down') => void;
  onAddSection: () => void;
  onRemoveSection: () => void;
}

const OutlineSectionComponent: FC<OutlineSectionProps> = ({
  section,
  index,
  totalSections,
  successStories,
  productFeatures,
  productUseCases,
  productDifferentiators,
  onUpdateSection,
  onMoveSection,
  onAddSection,
  onRemoveSection
}) => {
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
          icon: Target,
          label: phase.toUpperCase(),
          description: 'Content section'
        };
    }
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

  const getHeadingStylePreview = (type: 'H2' | 'H3' | 'H4', title: string) => {
    const styles = {
      H2: 'text-xl font-bold text-gray-900',
      H3: 'text-lg font-semibold text-gray-800',
      H4: 'text-base font-medium text-gray-700'
    };
    return (
      <div className={`${styles[type]} mb-1`}>
        {title}
      </div>
    );
  };

  const phaseInfo = getPhaseInfo(section.phase);
  const PhaseIcon = phaseInfo.icon;

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
      {/* Section Header with Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMoveSection('up')}
            disabled={index === 0}
            className="h-8 w-8 p-0"
          >
            <MoveUp className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMoveSection('down')}
            disabled={index === totalSections - 1}
            className="h-8 w-8 p-0"
          >
            <MoveDown className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddSection}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveSection}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Heading Level and Title */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Heading Level</Label>
          <Select 
            value={section.type} 
            onValueChange={(value: 'H2' | 'H3' | 'H4') => onUpdateSection('type', value)}
          >
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="H2">H2 - Major Section</SelectItem>
              <SelectItem value="H3">H3 - Subsection</SelectItem>
              <SelectItem value="H4">H4 - Minor Section</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="lg:col-span-2">
          <Label className="text-xs text-gray-500 mb-1 block">Section Title</Label>
          <Input
            value={section.title}
            onChange={(e) => onUpdateSection('title', e.target.value)}
            placeholder={`${section.type} heading`}
            className="font-medium"
          />
        </div>
      </div>

      {/* Preview of how the heading will look */}
      <div className="bg-white p-3 border rounded">
        <Label className="text-xs text-gray-500 mb-2 block">Preview</Label>
        {getHeadingStylePreview(section.type, section.title)}
      </div>
        
      {/* POV/Context Section */}
      <div>
        <Label className="text-xs text-gray-500 mb-1 block">Your POV/Direction (Optional)</Label>
        <Textarea
          value={section.context || ''}
          onChange={(e) => onUpdateSection('context', e.target.value)}
          placeholder="Add your perspective, specific direction, or key points you want Frayma AI to focus on when generating this section..."
          rows={3}
          className="text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">
          This helps guide the AI to generate content aligned with your vision for this section.
        </p>
      </div>
      
      {/* Asset Linking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Link Asset Type</Label>
          <Select 
            value={section.linkedAssetType || '__none__'} 
            onValueChange={(value) => onUpdateSection('linkedAssetType', value)}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Optional asset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>
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
              value={section.linkedAssetId || '__none__'} 
              onValueChange={(value) => onUpdateSection('linkedAssetId', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Choose asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
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

      {/* Asset linking explanation */}
      {section.linkedAssetType && section.linkedAssetId && (
        <div className="bg-blue-50 p-3 rounded text-xs text-blue-700">
          This section will reference your selected {section.linkedAssetType.replace('_', ' ')} to provide specific, relevant content.
        </div>
      )}
    </div>
  );
};

export default OutlineSectionComponent;
