import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Upload, FileText, Image, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { ICPStoryScript, ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { useChatGPT } from '@/contexts/ChatGPTContext';

interface ProductLedIdeaGeneratorProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  selectedClientId?: string;
}

interface TriggerInput {
  type: 'text' | 'image' | 'file';
  content: string;
}

interface ProductContextInputs {
  targetICP: string;
  narrativeAnchor: 'belief' | 'pain' | 'struggle' | 'transformation';
  narrativeType: string;
  selectedFeatures: ProductFeature[];
  selectedUseCases: ProductUseCase[];
  selectedDifferentiators: ProductDifferentiator[];
  customPOV: string;
}

const ProductLedIdeaGenerator: FC<ProductLedIdeaGeneratorProps> = ({
  icpScripts,
  productContext,
  onIdeaAdded,
  selectedClientId
}) => {
  const { toast } = useToast();
  const { generateContent } = useChatGPT();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);

  const [triggerInput, setTriggerInput] = useState<TriggerInput>({
    type: 'text',
    content: ''
  });

  const [productInputs, setProductInputs] = useState<ProductContextInputs>({
    targetICP: '',
    narrativeAnchor: 'belief',
    narrativeType: '',
    selectedFeatures: [],
    selectedUseCases: [],
    selectedDifferentiators: [],
    customPOV: ''
  });

  const selectedICP = icpScripts.find(icp => icp.id === productInputs.targetICP);

  const getNarrativeTypes = () => {
    if (!selectedICP) return [];
    
    switch (productInputs.narrativeAnchor) {
      case 'belief':
        return selectedICP.coreBeliefs;
      case 'pain':
        return selectedICP.internalPains;
      case 'struggle':
        return selectedICP.externalStruggles;
      case 'transformation':
        return selectedICP.desiredTransformations;
      default:
        return [];
    }
  };

  const handleFeatureToggle = (feature: ProductFeature) => {
    setProductInputs(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.find(f => f.id === feature.id)
        ? prev.selectedFeatures.filter(f => f.id !== feature.id)
        : [...prev.selectedFeatures, feature]
    }));
  };

  const handleUseCaseToggle = (useCase: ProductUseCase) => {
    setProductInputs(prev => ({
      ...prev,
      selectedUseCases: prev.selectedUseCases.find(u => u.id === useCase.id)
        ? prev.selectedUseCases.filter(u => u.id !== useCase.id)
        : [...prev.selectedUseCases, useCase]
    }));
  };

  const handleDifferentiatorToggle = (differentiator: ProductDifferentiator) => {
    setProductInputs(prev => ({
      ...prev,
      selectedDifferentiators: prev.selectedDifferentiators.find(d => d.id === differentiator.id)
        ? prev.selectedDifferentiators.filter(d => d.id !== differentiator.id)
        : [...prev.selectedDifferentiators, differentiator]
    }));
  };

  const buildPrompt = (): string => {
    const narrativeTypeContent = getNarrativeTypes().find(n => n.id === productInputs.narrativeType)?.content || '';
    
    let prompt = `About Product-Led Storytelling (PLS):
PLS is a B2B content approach that crafts first-person, narrative-led GTM assets that resonate with ICPs by anchoring content on their beliefs, pains, and goals. It uses structured storytelling frameworks (like ICP StoryScripts, StoryBriefs & Outlines, and the 3Rs Formula: Resonance, Relevance, Results) to subtly show, not tell, a product's unique value. The goal is to move readers to feel, think, and act—not through generic how-to's, but through compelling, point-of-view-driven narratives that match how buyers think and decide.

You are a world-class narrative strategist helping B2B SaaS teams craft compelling, resonant GTM narratives. Using the Product-Led Storytelling approach above, generate 15 rare, non-obvious content ideas (for articles, newsletters, sales emails, and LinkedIn posts) that subtly weave in product value without sounding salesy.

Trigger/thesis/anti-thesis: ${triggerInput.content}
Target audience: ${selectedICP?.name || 'Not specified'}
Narrative angle to address: ${productInputs.narrativeAnchor} — "${narrativeTypeContent}"`;

    // Add product features if selected
    if (productInputs.selectedFeatures.length > 0) {
      prompt += `\nProduct features and/or benefits:\n`;
      productInputs.selectedFeatures.forEach(feature => {
        prompt += `• ${feature.name}: ${feature.benefits.join(', ')}\n`;
      });
    }

    // Add use cases if selected
    if (productInputs.selectedUseCases.length > 0) {
      prompt += `\nSpecific use cases to subtly highlight:\n`;
      productInputs.selectedUseCases.forEach(useCase => {
        prompt += `• ${useCase.useCase} (${useCase.userRole}): ${useCase.description}\n`;
      });
    }

    // Add differentiators if selected
    if (productInputs.selectedDifferentiators.length > 0) {
      prompt += `\nProduct differentiators to weave in:\n`;
      productInputs.selectedDifferentiators.forEach(diff => {
        prompt += `• ${diff.name}: ${diff.description}\n`;
      });
    }

    // Add custom POV if provided
    if (productInputs.customPOV.trim()) {
      prompt += `\nThe user's personal POV or perspective to shape the tone of ideas:\nPOV: ${productInputs.customPOV}`;
    }

    prompt += `\n\nFor each idea, return the following structure:
Title – punchy and specific (not generic, not clickbait).
Narrative – what's the tension or belief this idea challenges or advances?
Product Tie-in – how can this idea naturally surface the selected product's unique value?
CTA – one specific, low-friction action the reader would be compelled to take.

Make each idea smart, strategic, and tailored to ${selectedICP?.name || 'the target ICP'}—as if you're helping them see themselves in the story.
Avoid fluff. Think like a narrative strategist guiding a category-defining founder or Head of Marketing.`;

    return prompt;
  };

  const handleGenerateIdeas = async () => {
    if (!triggerInput.content.trim()) {
      toast({
        title: "Missing Trigger",
        description: "Please provide a trigger/thesis to generate ideas.",
        variant: "destructive",
      });
      return;
    }

    if (!productInputs.targetICP) {
      toast({
        title: "Missing Target ICP",
        description: "Please select a target ICP.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = buildPrompt();
      const response = await generateContent(prompt);
      
      if (response) {
        // Parse the response into individual ideas
        const ideas = response.split(/(?=Title[\s\-–:]+)/i).filter(idea => idea.trim() !== '');
        setGeneratedIdeas(ideas);
        
        toast({
          title: "Ideas Generated",
          description: `Generated ${ideas.length} Product-Led Storytelling ideas.`,
        });
      } else {
        throw new Error('No response received');
      }
    } catch (error) {
      console.error("Error generating ideas:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddIdea = (ideaText: string) => {
    const newIdea: GeneratedIdea = {
      id: crypto.randomUUID(),
      title: ideaText.substring(0, 100),
      narrative: ideaText,
      productTieIn: '',
      cta: '',
      createdAt: new Date().toISOString(),
      score: null,
      source: {
        type: 'manual',
        content: ideaText,
      },
      icpId: selectedICP || '',
      narrativeAnchor: 'belief',
      narrativeItemId: '',
      productFeatures: [],
      clientId: selectedClientId || undefined,
    };
    onIdeaAdded(newIdea);
    
    toast({
      title: "Idea Added",
      description: "New idea has been added to your collection.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Pane - Trigger Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-story-blue flex items-center space-x-2">
              <Lightbulb className="h-5 w-5" />
              <span>Idea Trigger</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Input Type</Label>
              <div className="flex space-x-2 mt-2">
                <Button
                  variant={triggerInput.type === 'text' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTriggerInput(prev => ({ ...prev, type: 'text' }))}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Text
                </Button>
                <Button
                  variant={triggerInput.type === 'image' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTriggerInput(prev => ({ ...prev, type: 'image' }))}
                >
                  <Image className="h-4 w-4 mr-1" />
                  Image
                </Button>
                <Button
                  variant={triggerInput.type === 'file' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTriggerInput(prev => ({ ...prev, type: 'file' }))}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  File
                </Button>
              </div>
            </div>

            <div>
              <Label>Trigger/Thesis/Anti-thesis</Label>
              <Textarea
                placeholder="What triggered you to mint new ideas? Paste text, describe an image, or explain file content..."
                value={triggerInput.content}
                onChange={(e) => setTriggerInput(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[200px] mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Right Pane - Product Context */}
        <Card>
          <CardHeader>
            <CardTitle className="text-story-blue">Product Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Target ICP</Label>
              <Select value={productInputs.targetICP} onValueChange={(value) => setProductInputs(prev => ({ ...prev, targetICP: value, narrativeType: '' }))}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select ICP StoryScript" />
                </SelectTrigger>
                <SelectContent>
                  {icpScripts.map(icp => (
                    <SelectItem key={icp.id} value={icp.id}>{icp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Narrative Anchor</Label>
              <Select value={productInputs.narrativeAnchor} onValueChange={(value: any) => setProductInputs(prev => ({ ...prev, narrativeAnchor: value, narrativeType: '' }))}>
                <SelectTrigger className="mt-2">
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

            {selectedICP && (
              <div>
                <Label>Narrative Type</Label>
                <Select value={productInputs.narrativeType} onValueChange={(value) => setProductInputs(prev => ({ ...prev, narrativeType: value }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select specific narrative" />
                  </SelectTrigger>
                  <SelectContent>
                    {getNarrativeTypes().map(narrative => (
                      <SelectItem key={narrative.id} value={narrative.id}>{narrative.content}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {productContext && (
              <>
                {productContext.features.length > 0 && (
                  <div>
                    <Label>Product Features (optional)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {productContext.features.map(feature => (
                        <Badge
                          key={feature.id}
                          variant={productInputs.selectedFeatures.find(f => f.id === feature.id) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => handleFeatureToggle(feature)}
                        >
                          {feature.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {productContext.useCases.length > 0 && (
                  <div>
                    <Label>Use Cases (optional)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {productContext.useCases.map(useCase => (
                        <Badge
                          key={useCase.id}
                          variant={productInputs.selectedUseCases.find(u => u.id === useCase.id) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => handleUseCaseToggle(useCase)}
                        >
                          {useCase.useCase}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {productContext.differentiators.length > 0 && (
                  <div>
                    <Label>Differentiators (optional)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {productContext.differentiators.map(diff => (
                        <Badge
                          key={diff.id}
                          variant={productInputs.selectedDifferentiators.find(d => d.id === diff.id) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => handleDifferentiatorToggle(diff)}
                        >
                          {diff.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <Label>Personal POV (optional)</Label>
              <Textarea
                placeholder="Add your personal POV, narrative, or thinking to shape the ideas..."
                value={productInputs.customPOV}
                onChange={(e) => setProductInputs(prev => ({ ...prev, customPOV: e.target.value }))}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleGenerateIdeas}
          disabled={isGenerating}
          className="bg-story-blue hover:bg-story-light-blue text-white px-8 py-3"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Product-Led Ideas...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-5 w-5" />
              Generate Ideas
            </>
          )}
        </Button>
      </div>

      {generatedIdeas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Generated Product-Led Storytelling Ideas</h3>
          <div className="grid gap-4">
            {generatedIdeas.map((idea, index) => (
              <Card key={index} className="border-l-4 border-l-story-blue">
                <CardContent className="p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">{idea}</pre>
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={() => handleAddIdea(idea)}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Add to Bank
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductLedIdeaGenerator;
