import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { ICPStoryScript, CustomerSuccessStory } from '@/types/storytelling';
import { ArticleSubType } from './ContentTypeSelector';
import { useChatGPT } from '@/contexts/ChatGPTContext';
import ProgressIndicator from './gtm-narrative/ProgressIndicator';
import StrategicAlignmentStep from './gtm-narrative/StrategicAlignmentStep';
import TargetReaderResonanceStep from './gtm-narrative/TargetReaderResonanceStep';
import ContentDiscoveryTriggersStep from './gtm-narrative/ContentDiscoveryTriggersStep';
import ContentOutlineStep from './gtm-narrative/ContentOutlineStep';

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
  
  // Content Outline
  outlineSteps: string[];
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
    problemStatements: [],
    outlineSteps: []
  });

  const getTitle = () => {
    return articleSubType === 'newsletter' 
      ? 'AI-Powered First-Person Narrative Newsletter'
      : 'AI-Powered GTM Thought Leadership Article';
  };

  const getDescription = () => {
    return `Building your StoryBrief to guide AI content creation - Step ${currentStep} of 4`;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        title: "AI suggestions generated",
        description: "Review and refine the content discovery triggers to guide your narrative creation."
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

  const generateContentOutline = async () => {
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
      
      const prompt = `Based on the complete GTM narrative piece information below, create a detailed content outline:

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

CONTENT DISCOVERY TRIGGERS:
- Related Keywords: ${formData.relatedKeywords.join(', ')}
- Search Queries: ${formData.searchQueries.join('; ')}
- Problem Statements: ${formData.problemStatements.join('; ')}

Content Type: ${articleSubType === 'newsletter' ? 'First-Person Narrative Newsletter' : 'GTM Thought Leadership Article'}

Please create a structured content outline with 6-10 main sections/steps that will guide the creation of this piece. Each step should be a clear, actionable section title.

Format your response as JSON with the following structure:
{
  "outlineSteps": ["Step 1: Title", "Step 2: Title", ...]
}`;

      const response = await generateContent(prompt);
      
      // Parse the JSON response
      const outline = JSON.parse(response);
      
      setFormData(prev => ({
        ...prev,
        outlineSteps: outline.outlineSteps || []
      }));

      toast({
        title: "AI content outline generated",
        description: "Your strategic inputs have been transformed into a compelling content structure."
      });
    } catch (error) {
      console.error('Error generating content outline:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate content outline. Please try again or fill them manually.",
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
    
    if (currentStep === 3) {
      // Auto-generate content outline
      await generateContentOutline();
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StrategicAlignmentStep
            data={{
              ideaTrigger: formData.ideaTrigger,
              mutualGoal: formData.mutualGoal,
              targetKeyword: formData.targetKeyword,
              contentCluster: formData.contentCluster,
              publishReason: formData.publishReason,
              callToAction: formData.callToAction
            }}
            onDataChange={(field, value) => handleInputChange(field, value)}
          />
        );
      case 2:
        return (
          <TargetReaderResonanceStep
            data={{
              mainTargetICP: formData.mainTargetICP,
              journeyStage: formData.journeyStage,
              broaderAudience: formData.broaderAudience,
              readingPrompt: formData.readingPrompt,
              narrativeAnchors: formData.narrativeAnchors,
              successStory: formData.successStory
            }}
            scripts={scripts}
            successStories={successStories}
            onDataChange={(field, value) => handleInputChange(field, value)}
          />
        );
      case 3:
        return (
          <ContentDiscoveryTriggersStep
            data={{
              relatedKeywords: formData.relatedKeywords,
              searchQueries: formData.searchQueries,
              problemStatements: formData.problemStatements
            }}
            isGenerating={isGenerating}
            onDataChange={(field, value) => handleInputChange(field, value)}
          />
        );
      case 4:
        return (
          <ContentOutlineStep
            data={{
              outlineSteps: formData.outlineSteps
            }}
            articleSubType={articleSubType}
            isGenerating={isGenerating}
            onDataChange={(field, value) => handleInputChange(field, value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <CardTitle className="text-story-blue flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              {getTitle()}
            </CardTitle>
            <CardDescription>{getDescription()}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProgressIndicator currentStep={currentStep} />
        
        {renderCurrentStep()}

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
          
          {currentStep < 4 ? (
            <Button 
              onClick={handleNext}
              disabled={(currentStep === 1 && !canProceedFromStep1()) || 
                       (currentStep === 2 && !canProceedFromStep2()) ||
                       isGenerating}
              className="bg-story-blue hover:bg-story-light-blue"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  AI Generating...
                </>
              ) : (
                <>
                  Continue Building
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={() => {
                toast({
                  title: "StoryBrief & Outline Complete!",
                  description: "Ready to generate your AI-powered GTM narrative in the Frayma Editor."
                });
                // TODO: Navigate to Frayma AI Editor with the complete StoryBrief data
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Content
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GTMNarrativeCreator;
