
import { FC, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, MoveUp, MoveDown, HelpCircle, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CustomerSuccessStory, ProductFeature, ProductUseCase, ProductDifferentiator, Author } from '@/types/storytelling';

interface OutlineSection {
  id: string;
  type: 'H2' | 'H3' | 'H4';
  title: string;
  context?: string;
  linkedAssetType?: 'categoryPOV' | 'uniqueInsight' | 'companyMission' | 'success_story' | 'feature' | 'use_case' | 'differentiator';
  linkedAssetId?: string;
  phase: 'resonance' | 'relevance' | 'results';
  plsSteps: string;
  authorExperienceId?: string;
  authorCredibilityType?: 'experience' | 'belief';
}

interface OutlineSectionProps {
  section: OutlineSection;
  index: number;
  totalSections: number;
  successStories: CustomerSuccessStory[];
  productFeatures: ProductFeature[];
  productUseCases: ProductUseCase[];
  productDifferentiators: ProductDifferentiator[];
  selectedAuthor?: Author;
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
  selectedAuthor,
  onUpdateSection,
  onMoveSection,
  onAddSection,
  onRemoveSection
}) => {

  const getPhaseInfo = (phase: string) => {
    switch (phase) {
      case 'resonance':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: Target,
          label: 'RESONANCE',
          description: 'Filter & build rapport with target ICP'
        };
      case 'relevance':
        return {
          color: 'bg-purple-100 text-purple-800',
          icon: Lightbulb,
          label: 'RELEVANCE',
          description: 'Engage with valuable insights'
        };
      case 'results':
        return {
          color: 'bg-green-100 text-green-800',
          icon: TrendingUp,
          label: 'RESULTS',
          description: 'Persuade & drive conversion'
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
      case 'success_story': return successStories || [];
      case 'feature': return productFeatures || [];
      case 'use_case': return productUseCases || [];
      case 'differentiator': return productDifferentiators || [];
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

  const handleAssetTypeChange = (value: string) => {
    if (value === '__none__') {
      onUpdateSection('linkedAssetType', undefined);
      onUpdateSection('linkedAssetId', undefined);
    } else {
      onUpdateSection('linkedAssetType', value as any);
      onUpdateSection('linkedAssetId', undefined); // Reset asset selection when type changes
    }
  };

  const handleAssetIdChange = (value: string) => {
    if (value === '__none__' || value === '__empty__') {
      onUpdateSection('linkedAssetId', undefined);
    } else {
      onUpdateSection('linkedAssetId', value);
    }
  };

  const phaseInfo = getPhaseInfo(section.phase);
  const PhaseIcon = phaseInfo.icon;
  const currentAssetOptions = section.linkedAssetType ? getAssetOptions(section.linkedAssetType) : [];

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
      {/* Section Header with Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className={`text-xs ${phaseInfo.color}`}>
            <PhaseIcon className="h-3 w-3 mr-1" />
            {phaseInfo.label}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {section.plsSteps}
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
        <Label className="text-xs text-gray-500 mb-1 block">Your POV/Direction/Narrative (Optional)</Label>
        <Textarea
          value={section.context || ''}
          onChange={(e) => onUpdateSection('context', e.target.value)}
          placeholder="Add your perspective, specific direction, narrative angle, or key points you want Frayma AI to focus on when generating this section..."
          rows={3}
          className="text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">
          This helps guide the AI to generate content aligned with your vision for this section and the overall PLS approach.
        </p>
      </div>
      
      {/* Business Context Linking */}
      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">
            Link a Business Context Item to weave into this section of your article
          </Label>
          <Select 
            value={section.linkedAssetType || '__none__'} 
            onValueChange={handleAssetTypeChange}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Choose business context type...">
                {section.linkedAssetType ? (
                  section.linkedAssetType === 'categoryPOV' ? 'Category Point of View' :
                  section.linkedAssetType === 'uniqueInsight' ? 'Unique Insight' :
                  section.linkedAssetType === 'companyMission' ? 'Mission/Vision' :
                  section.linkedAssetType === 'success_story' ? 'Success Story' :
                  section.linkedAssetType === 'feature' ? 'Feature' :
                  section.linkedAssetType === 'use_case' ? 'Use Case' :
                  section.linkedAssetType === 'differentiator' ? 'Differentiator' : 'None'
                ) : 'Choose business context type...'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="z-[100] bg-white dark:bg-gray-900 border shadow-lg">
              <SelectItem value="__none__">None</SelectItem>
              <SelectItem value="categoryPOV">Category Point of View</SelectItem>
              <SelectItem value="uniqueInsight">Unique Insight</SelectItem>
              <SelectItem value="companyMission">Mission/Vision</SelectItem>
              <SelectItem value="success_story">Success Story ({successStories?.length || 0})</SelectItem>
              <SelectItem value="feature">Feature ({productFeatures?.length || 0})</SelectItem>
              <SelectItem value="use_case">Use Case ({productUseCases?.length || 0})</SelectItem>
              <SelectItem value="differentiator">Differentiator ({productDifferentiators?.length || 0})</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {section.linkedAssetType && ['success_story', 'feature', 'use_case', 'differentiator'].includes(section.linkedAssetType) && (
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">
              Select Specific {section.linkedAssetType === 'success_story' ? 'Success Story' :
                              section.linkedAssetType === 'use_case' ? 'Use Case' : 
                              section.linkedAssetType === 'feature' ? 'Feature' : 
                              'Differentiator'} ({currentAssetOptions.length} available)
            </Label>
            <Select 
              value={section.linkedAssetId || '__none__'} 
              onValueChange={handleAssetIdChange}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder={`Choose a ${section.linkedAssetType.replace('_', ' ')}...`}>
                  {section.linkedAssetId ? 
                    getAssetDisplayName(section.linkedAssetType, section.linkedAssetId) : 
                    `Choose a ${section.linkedAssetType.replace('_', ' ')}...`}
                </SelectValue>
              </SelectTrigger>
            <SelectContent className="z-[100] bg-white dark:bg-gray-900 border shadow-lg">
              <SelectItem value="__none__">None</SelectItem>
              {currentAssetOptions.length === 0 ? (
                <SelectItem value="__empty__" disabled>
                  No {section.linkedAssetType.replace('_', ' ')}s available
                </SelectItem>
              ) : (
                currentAssetOptions.map((asset: any) => (
                  <SelectItem key={asset.id} value={asset.id} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">
                        {section.linkedAssetType === 'success_story' ? asset.title :
                         section.linkedAssetType === 'feature' ? asset.name :
                         section.linkedAssetType === 'use_case' ? asset.useCase :
                         section.linkedAssetType === 'differentiator' ? asset.name : 'Unknown'}
                      </span>
                      {asset.description && (
                        <span className="text-xs text-muted-foreground line-clamp-2">
                          {asset.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
            </Select>
            {currentAssetOptions.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                No {section.linkedAssetType.replace('_', ' ')}s found. Add some in your Account settings first.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Business context linking explanation */}
      {section.linkedAssetType && section.linkedAssetId && (
        <div className="bg-blue-50 p-3 rounded text-xs text-blue-700">
          This section will reference your selected {section.linkedAssetType.replace('_', ' ')} to provide specific, relevant content that supports the PLS approach.
        </div>
      )}
      
      {section.linkedAssetType && !['success_story', 'feature', 'use_case', 'differentiator'].includes(section.linkedAssetType) && (
        <div className="bg-amber-50 p-3 rounded text-xs text-amber-700">
          This section will be guided by your {section.linkedAssetType === 'categoryPOV' ? 'Category Point of View' : 
                                                section.linkedAssetType === 'uniqueInsight' ? 'Unique Insight' : 
                                                'Mission/Vision'} to provide strategic narrative alignment.
        </div>
      )}

      {/* Author Experience Linking */}
      {selectedAuthor && (
        <div className="space-y-3 border-t pt-4">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">
              Link Author's Experience/Belief for First-Person Narrative
            </Label>
            <div className="space-y-2">
              <Select 
                value={section.authorCredibilityType || '__none__'} 
                onValueChange={(value) => {
                  if (value === '__none__') {
                    onUpdateSection('authorCredibilityType', undefined);
                    onUpdateSection('authorExperienceId', undefined);
                  } else {
                    onUpdateSection('authorCredibilityType', value as 'experience' | 'belief');
                    onUpdateSection('authorExperienceId', undefined);
                  }
                }}
              >
                <SelectTrigger className="text-sm">
                <SelectValue placeholder="Choose type of author credibility...">
                    {section.authorCredibilityType ? (
                      section.authorCredibilityType === 'experience' ? 'Personal Experience' : 'Core Belief'
                    ) : 'Choose type of author credibility...'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="z-[100] bg-white dark:bg-gray-900 border shadow-lg">
                  <SelectItem value="__none__">None</SelectItem>
                  <SelectItem value="experience">Personal Experience ({selectedAuthor.experiences?.length || 0})</SelectItem>
                  <SelectItem value="belief">Core Belief ({selectedAuthor.beliefs?.length || 0})</SelectItem>
                </SelectContent>
              </Select>

              {section.authorCredibilityType && (
                <Select 
                  value={section.authorExperienceId || '__none__'} 
                  onValueChange={(value) => {
                    if (value === '__none__') {
                      onUpdateSection('authorExperienceId', undefined);
                    } else {
                      onUpdateSection('authorExperienceId', value);
                    }
                  }}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder={`Choose ${section.authorCredibilityType}...`}>
                      {section.authorExperienceId ? (
                        section.authorCredibilityType === 'experience' 
                          ? selectedAuthor?.experiences?.find(exp => exp.id === section.authorExperienceId)?.title || 'Unknown Experience'
                          : selectedAuthor?.beliefs?.find(belief => belief.id === section.authorExperienceId)?.belief || 'Unknown Belief'
                      ) : `Choose ${section.authorCredibilityType}...`}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="z-[100] bg-white dark:bg-gray-900 border shadow-lg">
                    <SelectItem value="__none__">None</SelectItem>
                    {section.authorCredibilityType === 'experience' && selectedAuthor.experiences?.map((exp: any) => (
                      <SelectItem key={exp.id} value={exp.id} className="cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{exp.title}</span>
                          {exp.description && (
                            <span className="text-xs text-muted-foreground line-clamp-2">
                              {exp.description}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                     {section.authorCredibilityType === 'belief' && selectedAuthor.beliefs?.map((belief: any) => (
                       <SelectItem key={belief.id} value={belief.id} className="cursor-pointer">
                         <div className="flex flex-col gap-1">
                           <span className="font-medium">{belief.belief}</span>
                           {belief.description && (
                             <span className="text-xs text-muted-foreground line-clamp-2">
                               {belief.description}
                             </span>
                           )}
                         </div>
                       </SelectItem>
                     ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {section.authorCredibilityType && section.authorExperienceId && (
            <div className="bg-green-50 p-3 rounded text-xs text-green-700">
              This section will incorporate {selectedAuthor.name}'s {section.authorCredibilityType} to create a more authentic first-person narrative that resonates with target readers.
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default OutlineSectionComponent;
