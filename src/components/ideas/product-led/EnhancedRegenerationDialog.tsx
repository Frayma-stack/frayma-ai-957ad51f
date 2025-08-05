import { FC, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader, ArrowRight, RotateCcw, Zap } from 'lucide-react';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { ProductContextInputs } from './hooks/types';

interface EnhancedRegenerationDialogProps {
  isOpen: boolean;
  isGenerating: boolean;
  regenerationDirection: string;
  currentProductInputs: ProductContextInputs;
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  successStories: any[];
  onRegenerationDirectionChange: (value: string) => void;
  onRegenerate: (newInputs: ProductContextInputs, direction: string) => void;
  onClose: () => void;
}

const EnhancedRegenerationDialog: FC<EnhancedRegenerationDialogProps> = ({
  isOpen,
  isGenerating,
  regenerationDirection,
  currentProductInputs,
  icpScripts,
  productContext,
  successStories,
  onRegenerationDirectionChange,
  onRegenerate,
  onClose
}) => {
  const [newInputs, setNewInputs] = useState<ProductContextInputs>(currentProductInputs);
  const [keepCurrentICP, setKeepCurrentICP] = useState(true);
  const [keepCurrentBusinessContext, setKeepCurrentBusinessContext] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setNewInputs(currentProductInputs);
      setKeepCurrentICP(true);
      setKeepCurrentBusinessContext(true);
    }
  }, [isOpen, currentProductInputs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If keeping current ICP, use existing values, otherwise use newly selected ones
    const finalInputs = {
      ...newInputs,
      targetICP: keepCurrentICP ? currentProductInputs.targetICP : newInputs.targetICP,
      narrativeAnchor: keepCurrentICP ? currentProductInputs.narrativeAnchor : newInputs.narrativeAnchor,
      selectedNarrativeTypes: keepCurrentICP ? currentProductInputs.selectedNarrativeTypes : newInputs.selectedNarrativeTypes,
      businessContextItem: keepCurrentBusinessContext ? currentProductInputs.businessContextItem : newInputs.businessContextItem,
      selectedFeatures: keepCurrentBusinessContext ? currentProductInputs.selectedFeatures : newInputs.selectedFeatures,
      selectedUseCases: keepCurrentBusinessContext ? currentProductInputs.selectedUseCases : newInputs.selectedUseCases,
      selectedDifferentiators: keepCurrentBusinessContext ? currentProductInputs.selectedDifferentiators : newInputs.selectedDifferentiators,
      selectedSuccessStory: keepCurrentBusinessContext ? currentProductInputs.selectedSuccessStory : newInputs.selectedSuccessStory,
    };
    
    onRegenerate(finalInputs, regenerationDirection);
  };

  const selectedICP = icpScripts.find(icp => icp.id === (keepCurrentICP ? currentProductInputs.targetICP : newInputs.targetICP));

  const getNarrativeTypes = () => {
    if (!selectedICP) return [];
    
    const anchor = keepCurrentICP ? currentProductInputs.narrativeAnchor : newInputs.narrativeAnchor;
    switch (anchor) {
      case 'belief': return selectedICP.coreBeliefs || [];
      case 'pain': return selectedICP.internalPains || [];
      case 'struggle': return selectedICP.externalStruggles || [];
      case 'transformation': return selectedICP.desiredTransformations || [];
      default: return [];
    }
  };

  const narrativeTypes = getNarrativeTypes();

  const getBusinessContextOptions = () => [
    { value: 'category_pov', label: 'Category POV' },
    { value: 'unique_insight', label: 'Unique Insight' },
    { value: 'mission_vision', label: 'Mission/Vision' },
    { value: 'success_story', label: 'Customer Success Story' },
    { value: 'feature', label: 'Product Features' },
    { value: 'use_case', label: 'Use Cases' },
    { value: 'differentiator', label: 'Key Differentiators' }
  ];

  const isFormValid = regenerationDirection.trim() && 
                    (keepCurrentICP || (newInputs.targetICP && newInputs.selectedNarrativeTypes.length > 0)) &&
                    (keepCurrentBusinessContext || newInputs.businessContextItem);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-story-blue" />
            Enhanced Regeneration with New Context
          </DialogTitle>
          <DialogDescription>
            Regenerate your ideas with different ICP targeting, business context, and narrative direction. 
            This allows you to explore fresh angles while maintaining the Product-Led Storytelling approach.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* POV/Narrative Direction - First and Compulsory */}
          <div className="space-y-2">
            <Label htmlFor="regeneration-direction" className="text-sm font-medium flex items-center gap-1">
              New POV/Narrative Direction *
              <span className="text-xs text-muted-foreground">(Required)</span>
            </Label>
            <Textarea
              id="regeneration-direction"
              placeholder="Example: Focus on the emotional cost of manual processes instead of just efficiency gains... or... Frame this from a founder's perspective who's been burned by oversold promises... or... Challenge the assumption that bigger teams solve scaling problems..."
              value={regenerationDirection}
              onChange={(e) => onRegenerationDirectionChange(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={isGenerating}
            />
            <p className="text-sm text-muted-foreground">
              Be specific about the narrative angle, emotional frame, or contrarian perspective you want to explore.
            </p>
          </div>

          {/* ICP and Narrative Selection */}
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Target ICP & Narrative</Label>
              
              {/* Keep Current ICP Option */}
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="keep-current-icp"
                  name="icp-choice"
                  checked={keepCurrentICP}
                  onChange={() => setKeepCurrentICP(true)}
                  disabled={isGenerating}
                />
                <Label htmlFor="keep-current-icp" className="text-sm cursor-pointer">
                  Keep current ICP ({icpScripts.find(icp => icp.id === currentProductInputs.targetICP)?.name}) with different Narrative Anchor + Type
                </Label>
              </div>

              {/* Choose New ICP Option */}
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="choose-new-icp"
                  name="icp-choice"
                  checked={!keepCurrentICP}
                  onChange={() => setKeepCurrentICP(false)}
                  disabled={isGenerating}
                />
                <Label htmlFor="choose-new-icp" className="text-sm cursor-pointer">
                  Choose a different ICP entirely
                </Label>
              </div>
            </div>

            {/* Show ICP selector only if choosing new ICP */}
            {!keepCurrentICP && (
              <div className="space-y-2 ml-6">
                <Label className="text-sm font-medium">Select New ICP</Label>
                <Select 
                  value={newInputs.targetICP} 
                  onValueChange={(value) => setNewInputs({ 
                    ...newInputs, 
                    targetICP: value,
                    selectedNarrativeTypes: [] // Reset narrative types when ICP changes
                  })}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target ICP" />
                  </SelectTrigger>
                  <SelectContent>
                    {icpScripts.map(icp => (
                      <SelectItem key={icp.id} value={icp.id}>{icp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Narrative Anchor Selection */}
            {(!keepCurrentICP || keepCurrentICP) && (
              <div className="space-y-2 ml-6">
                <Label className="text-sm font-medium">Narrative Anchor</Label>
                <Select 
                  value={keepCurrentICP ? currentProductInputs.narrativeAnchor : newInputs.narrativeAnchor} 
                  onValueChange={(value: 'belief' | 'pain' | 'struggle' | 'transformation') => {
                    if (!keepCurrentICP) {
                      setNewInputs({ 
                        ...newInputs, 
                        narrativeAnchor: value,
                        selectedNarrativeTypes: [] // Reset when anchor changes
                      });
                    }
                  }}
                  disabled={isGenerating || keepCurrentICP}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="belief">Core Beliefs</SelectItem>
                    <SelectItem value="pain">Internal Pains</SelectItem>
                    <SelectItem value="struggle">External Struggles</SelectItem>
                    <SelectItem value="transformation">Desired Transformations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Narrative Types */}
            {narrativeTypes.length > 0 && (!keepCurrentICP || keepCurrentICP) && (
              <div className="space-y-2 ml-6">
                <Label className="text-sm font-medium">Specific Narrative Types</Label>
                <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
                  {narrativeTypes.map((type) => (
                    <label key={type.id} className="flex items-start space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={keepCurrentICP ? 
                          currentProductInputs.selectedNarrativeTypes.includes(type.id) :
                          newInputs.selectedNarrativeTypes.includes(type.id)
                        }
                        onChange={(e) => {
                          if (!keepCurrentICP) {
                            if (e.target.checked) {
                              setNewInputs({
                                ...newInputs,
                                selectedNarrativeTypes: [...newInputs.selectedNarrativeTypes, type.id]
                              });
                            } else {
                              setNewInputs({
                                ...newInputs,
                                selectedNarrativeTypes: newInputs.selectedNarrativeTypes.filter(id => id !== type.id)
                              });
                            }
                          }
                        }}
                        disabled={isGenerating || keepCurrentICP}
                        className="mt-1"
                      />
                      <span className="leading-tight">{type.content}</span>
                    </label>
                  ))}
                </div>
                {keepCurrentICP && (
                  <p className="text-xs text-muted-foreground">
                    Current selection will be used for regeneration
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Business Context Selection */}
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Business Context Item</Label>
              
              {/* Keep Current Business Context Option */}
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="keep-current-context"
                  name="context-choice"
                  checked={keepCurrentBusinessContext}
                  onChange={() => setKeepCurrentBusinessContext(true)}
                  disabled={isGenerating}
                />
                <Label htmlFor="keep-current-context" className="text-sm cursor-pointer">
                  Keep current business context ({getBusinessContextOptions().find(opt => opt.value === currentProductInputs.businessContextItem)?.label})
                </Label>
              </div>

              {/* Choose New Business Context Option */}
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="choose-new-context"
                  name="context-choice"
                  checked={!keepCurrentBusinessContext}
                  onChange={() => setKeepCurrentBusinessContext(false)}
                  disabled={isGenerating}
                />
                <Label htmlFor="choose-new-context" className="text-sm cursor-pointer">
                  Choose a different business context item
                </Label>
              </div>
            </div>

            {/* Show business context selector only if choosing new context */}
            {!keepCurrentBusinessContext && (
              <div className="space-y-2 ml-6">
                <Label className="text-sm font-medium">Select New Business Context</Label>
                <Select 
                  value={newInputs.businessContextItem} 
                  onValueChange={(value) => setNewInputs({ 
                    ...newInputs, 
                    businessContextItem: value as any,
                    // Reset related selections when context changes
                    selectedFeatures: [],
                    selectedUseCases: [],
                    selectedDifferentiators: [],
                    selectedSuccessStory: null
                  })}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business context to weave in" />
                  </SelectTrigger>
                  <SelectContent>
                    {getBusinessContextOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Context-specific selections for new business context */}
                {newInputs.businessContextItem === 'success_story' && successStories.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <Label className="text-sm font-medium">Select Success Story</Label>
                    <Select 
                      value={newInputs.selectedSuccessStory?.id || ''} 
                      onValueChange={(value) => {
                        const story = successStories.find(s => s.id === value);
                        setNewInputs({ ...newInputs, selectedSuccessStory: story });
                      }}
                      disabled={isGenerating}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a success story" />
                      </SelectTrigger>
                      <SelectContent>
                        {successStories.map(story => (
                          <SelectItem key={story.id} value={story.id}>{story.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {newInputs.businessContextItem === 'feature' && productContext?.features && (
                  <div className="space-y-2 mt-3">
                    <Label className="text-sm font-medium">Select Features</Label>
                    <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
                      {productContext.features.map((feature) => (
                        <label key={feature.id} className="flex items-start space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={newInputs.selectedFeatures.some(f => f.id === feature.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewInputs({
                                  ...newInputs,
                                  selectedFeatures: [...newInputs.selectedFeatures, feature]
                                });
                              } else {
                                setNewInputs({
                                  ...newInputs,
                                  selectedFeatures: newInputs.selectedFeatures.filter(f => f.id !== feature.id)
                                });
                              }
                            }}
                            disabled={isGenerating}
                            className="mt-1"
                          />
                          <span className="leading-tight">{feature.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-story-blue hover:bg-story-light-blue"
              disabled={isGenerating || !isFormValid}
            >
              {isGenerating ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating Ideas...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Regenerate with New Context
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedRegenerationDialog;