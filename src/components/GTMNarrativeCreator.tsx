
import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ArrowRight, Loader2, Plus, X } from 'lucide-react';
import { ICPStoryScript, CustomerSuccessStory } from '@/types/storytelling';
import { ArticleSubType } from './ContentTypeSelector';
import { useChatGPT } from '@/contexts/ChatGPTContext';

interface GTMNarrativeCreatorProps {
  articleSubType: ArticleSubType;
  scripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  onBack: () => void;
}

interface FormData {
  // Strategic Alignment
  ideaTrigger: string;
  mutualGoal: string;
  targetKeyword: string;
  contentCluster: string;
  publishReason: string;
  callToAction: string;
  
  // Target Reader Resonance
  mainTargetICP: string;
  journeyStage: 'TOFU' | 'MOFU' | 'BOFU' | '';
  broaderAudience: string;
  readingPrompt: string;
  narrativeAnchors: Array<{
    type: 'belief' | 'pain' | 'struggle' | 'transformation';
    itemId: string;
    content: string;
  }>;
  successStory: string;
  
  // Content Discovery Triggers
  relatedKeywords: string[];
  searchQueries: string[];
  problemStatements: string[];
}

const GTMNarrativeCreator: FC<GTMNarrativeCreatorProps> = ({
  articleSubType,
  scripts,
  successStories,
  onBack
}) => {
  const { toast } = useToast();
  const { generateContent, isConfigured } = useChatGPT();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    ideaTrigger: '',
    mutualGoal: '',
    targetKeyword: '',
    contentCluster: '',
    publishReason: '',
    callToAction: '',
    mainTargetICP: '',
    journeyStage: '',
    broaderAudience: '',
    readingPrompt: '',
    narrativeAnchors: [],
    successStory: '',
    relatedKeywords: [],
    searchQueries: [],
    problemStatements: []
  });

  const getTitle = () => {
    return articleSubType === 'newsletter' 
      ? 'Create First-Person Narrative Newsletter'
      : 'Create GTM Thought Leadership Article';
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addNarrativeAnchor = (type: 'belief' | 'pain' | 'struggle' | 'transformation', itemId: string) => {
    const selectedScript = scripts.find(s => s.id === formData.mainTargetICP);
    if (!selectedScript) return;

    let content = '';
    switch (type) {
      case 'belief':
        content = selectedScript.coreBeliefs.find(item => item.id === itemId)?.content || '';
        break;
      case 'pain':
        content = selectedScript.internalPains.find(item => item.id === itemId)?.content || '';
        break;
      case 'struggle':
        content = selectedScript.externalStruggles.find(item => item.id === itemId)?.content || '';
        break;
      case 'transformation':
        content = selectedScript.desiredTransformations.find(item => item.id === itemId)?.content || '';
        break;
    }

    const newAnchor = { type, itemId, content };
    setFormData(prev => ({
      ...prev,
      narrativeAnchors: [...prev.narrativeAnchors, newAnchor]
    }));
  };

  const removeNarrativeAnchor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      narrativeAnchors: prev.narrativeAnchors.filter((_, i) => i !== index)
    }));
  };

  const generateContentTriggers = async () => {
    if (!isConfigured) {
      toast({
        title: "ChatGPT not configured",
        description: "Please configure your ChatGPT API key to use auto-generation.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const selectedScript = scripts.find(s => s.id === formData.mainTargetICP);
      const selectedSuccessStory = successStories.find(s => s.id === formData.successStory);
      
      const prompt = `Based on the following GTM narrative piece information, suggest relevant content discovery triggers:

STRATEGIC ALIGNMENT:
- Idea/Trigger: ${formData.ideaTrigger}
- Mutual Goal: ${formData.mutualGoal}
- Target Keyword: ${formData.targetKeyword}
- Content Cluster: ${formData.contentCluster}
- Publish Reason: ${formData.publishReason}
- Call to Action: ${formData.callToAction}

TARGET READER RESONANCE:
- Main Target ICP: ${selectedScript?.name || 'Not selected'}
- Journey Stage: ${formData.journeyStage}
- Reading Prompt: ${formData.readingPrompt}
- Narrative Anchors: ${formData.narrativeAnchors.map(anchor => `${anchor.type}: ${anchor.content}`).join('; ')}
- Success Story: ${selectedSuccessStory?.title || 'Not selected'}

Please provide:
1. 5-8 related keywords to "${formData.targetKeyword}"
2. 3-5 real search queries that the target audience would use
3. 3-5 specific problem statements that the piece should address

Format your response as JSON with the following structure:
{
  "relatedKeywords": ["keyword1", "keyword2", ...],
  "searchQueries": ["query1", "query2", ...],
  "problemStatements": ["statement1", "statement2", ...]
}`;

      const response = await generateContent(prompt);
      
      // Parse the JSON response
      const suggestions = JSON.parse(response);
      
      setFormData(prev => ({
        ...prev,
        relatedKeywords: suggestions.relatedKeywords || [],
        searchQueries: suggestions.searchQueries || [],
        problemStatements: suggestions.problemStatements || []
      }));

      toast({
        title: "Content triggers generated",
        description: "Review and modify the suggested content discovery triggers as needed."
      });
    } catch (error) {
      console.error('Error generating content triggers:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate content triggers. Please try again or fill them manually.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      // Validate required fields before moving to step 3
      if (!formData.mainTargetICP || !formData.journeyStage || !formData.readingPrompt) {
        toast({
          title: "Missing information",
          description: "Please complete all required fields in Target Reader Resonance.",
          variant: "destructive"
        });
        return;
      }
      
      // Auto-generate content triggers
      await generateContentTriggers();
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const canProceedFromStep1 = () => {
    return formData.ideaTrigger && formData.mutualGoal && formData.targetKeyword && 
           formData.contentCluster && formData.publishReason && formData.callToAction;
  };

  const canProceedFromStep2 = () => {
    return formData.mainTargetICP && formData.journeyStage && formData.readingPrompt;
  };

  const selectedScript = scripts.find(s => s.id === formData.mainTargetICP);

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-story-blue">{getTitle()}</CardTitle>
            <CardDescription>Step {currentStep} of 3 - Guided content creation process</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-story-blue' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-story-blue text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">Strategic Alignment</span>
          </div>
          <div className={`flex items-center ${currentStep >= 2 ? 'text-story-blue' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-story-blue text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">Target Reader Resonance</span>
          </div>
          <div className={`flex items-center ${currentStep >= 3 ? 'text-story-blue' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-story-blue text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="ml-2 text-sm font-medium">Content Discovery</span>
          </div>
        </div>

        {/* Step 1: Strategic Alignment */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-story-blue">Strategic Alignment</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Idea/Trigger/Thesis/Antithesis *</label>
              <Textarea 
                placeholder="What's the core idea, trigger, thesis, or antithesis prompting you to create this piece?"
                value={formData.ideaTrigger}
                onChange={(e) => handleInputChange('ideaTrigger', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mutual Goal *</label>
              <Input 
                placeholder="What's the mutual goal for this piece?"
                value={formData.mutualGoal}
                onChange={(e) => handleInputChange('mutualGoal', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Main Target Keyword *</label>
              <Input 
                placeholder="Primary keyword or topic focus"
                value={formData.targetKeyword}
                onChange={(e) => handleInputChange('targetKeyword', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content/Service/Product Cluster *</label>
              <Input 
                placeholder="What content, service, or product cluster does this relate to?"
                value={formData.contentCluster}
                onChange={(e) => handleInputChange('contentCluster', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Why Publish This? *</label>
              <Textarea 
                placeholder="Why should you/your business publish this piece?"
                value={formData.publishReason}
                onChange={(e) => handleInputChange('publishReason', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Call to Action *</label>
              <Input 
                placeholder="What action should readers take after reading?"
                value={formData.callToAction}
                onChange={(e) => handleInputChange('callToAction', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Target Reader Resonance */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-story-blue">Target Reader Resonance</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Main Target ICP *</label>
              <Select 
                value={formData.mainTargetICP} 
                onValueChange={(value) => handleInputChange('mainTargetICP', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select the main ICP you're writing for" />
                </SelectTrigger>
                <SelectContent>
                  {scripts.map(script => (
                    <SelectItem key={script.id} value={script.id}>
                      {script.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Journey Stage *</label>
              <Select 
                value={formData.journeyStage} 
                onValueChange={(value: 'TOFU' | 'MOFU' | 'BOFU') => handleInputChange('journeyStage', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select journey stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOFU">TOFU (Top of Funnel)</SelectItem>
                  <SelectItem value="MOFU">MOFU (Middle of Funnel)</SelectItem>
                  <SelectItem value="BOFU">BOFU (Bottom of Funnel)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Broader Audience</label>
              <Select 
                value={formData.broaderAudience} 
                onValueChange={(value) => handleInputChange('broaderAudience', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select broader audience who could find this valuable" />
                </SelectTrigger>
                <SelectContent>
                  {scripts.filter(script => script.id !== formData.mainTargetICP).map(script => (
                    <SelectItem key={script.id} value={script.id}>
                      {script.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reading Prompt *</label>
              <Textarea 
                placeholder="What's likely to prompt the main target ICP to read this piece?"
                value={formData.readingPrompt}
                onChange={(e) => handleInputChange('readingPrompt', e.target.value)}
                rows={3}
              />
            </div>

            {/* Narrative Anchors */}
            {selectedScript && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Narrative Anchors</label>
                <div className="space-y-3 border p-4 rounded-md bg-gray-50">
                  <p className="text-sm text-gray-600">Select narrative elements from the ICP StoryScript to anchor your storytelling:</p>
                  
                  {['belief', 'pain', 'struggle', 'transformation'].map(type => (
                    <div key={type} className="space-y-2">
                      <h4 className="text-sm font-medium capitalize">{type === 'belief' ? 'Core Beliefs' : type === 'pain' ? 'Internal Pains' : type === 'struggle' ? 'External Struggles' : 'Desired Transformations'}</h4>
                      <div className="grid gap-2">
                        {(type === 'belief' ? selectedScript.coreBeliefs :
                          type === 'pain' ? selectedScript.internalPains :
                          type === 'struggle' ? selectedScript.externalStruggles :
                          selectedScript.desiredTransformations).map(item => (
                          <div key={item.id} className="flex items-center justify-between p-2 border rounded text-sm">
                            <span>{item.content}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addNarrativeAnchor(type as any, item.id)}
                              disabled={formData.narrativeAnchors.some(anchor => anchor.itemId === item.id)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Anchors */}
                {formData.narrativeAnchors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Selected Narrative Anchors:</h4>
                    <div className="space-y-2">
                      {formData.narrativeAnchors.map((anchor, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <div>
                            <span className="text-xs font-semibold capitalize text-blue-700">{anchor.type}: </span>
                            <span className="text-sm">{anchor.content}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeNarrativeAnchor(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Success Story</label>
              <Select 
                value={formData.successStory} 
                onValueChange={(value) => handleInputChange('successStory', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a success story for social proof" />
                </SelectTrigger>
                <SelectContent>
                  {successStories.map(story => (
                    <SelectItem key={story.id} value={story.id}>
                      {story.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 3: Content Discovery Triggers */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-story-blue">Content Discovery Triggers</h3>
              {isGenerating && (
                <div className="flex items-center text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating suggestions...
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Related Keywords</label>
              <div className="space-y-2">
                {formData.relatedKeywords.map((keyword, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={keyword}
                      onChange={(e) => {
                        const newKeywords = [...formData.relatedKeywords];
                        newKeywords[index] = e.target.value;
                        handleInputChange('relatedKeywords', newKeywords);
                      }}
                      placeholder={`Related keyword ${index + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newKeywords = formData.relatedKeywords.filter((_, i) => i !== index);
                        handleInputChange('relatedKeywords', newKeywords);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange('relatedKeywords', [...formData.relatedKeywords, ''])}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Keyword
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search Queries</label>
              <div className="space-y-2">
                {formData.searchQueries.map((query, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea 
                      value={query}
                      onChange={(e) => {
                        const newQueries = [...formData.searchQueries];
                        newQueries[index] = e.target.value;
                        handleInputChange('searchQueries', newQueries);
                      }}
                      placeholder={`Search query ${index + 1}`}
                      rows={2}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newQueries = formData.searchQueries.filter((_, i) => i !== index);
                        handleInputChange('searchQueries', newQueries);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange('searchQueries', [...formData.searchQueries, ''])}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Query
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Problem Statements</label>
              <div className="space-y-2">
                {formData.problemStatements.map((statement, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea 
                      value={statement}
                      onChange={(e) => {
                        const newStatements = [...formData.problemStatements];
                        newStatements[index] = e.target.value;
                        handleInputChange('problemStatements', newStatements);
                      }}
                      placeholder={`Problem statement ${index + 1}`}
                      rows={2}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newStatements = formData.problemStatements.filter((_, i) => i !== index);
                        handleInputChange('problemStatements', newStatements);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange('problemStatements', [...formData.problemStatements, ''])}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Problem Statement
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 3 ? (
            <Button 
              onClick={handleNext}
              disabled={(currentStep === 1 && !canProceedFromStep1()) || 
                       (currentStep === 2 && !canProceedFromStep2()) ||
                       isGenerating}
              className="bg-story-blue hover:bg-story-light-blue"
            >
              {currentStep === 2 && isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={() => {
                toast({
                  title: "Content framework complete",
                  description: "Your GTM narrative framework is ready for content generation."
                });
                // TODO: Implement content generation logic
              }}
              className="bg-story-blue hover:bg-story-light-blue"
            >
              Generate Content
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GTMNarrativeCreator;
