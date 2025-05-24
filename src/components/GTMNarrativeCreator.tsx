import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { ICPStoryScript, CustomerSuccessStory } from '@/types/storytelling';
import { ArticleSubType } from './ContentTypeSelector';
import { useChatGPT } from '@/contexts/ChatGPTContext';
import ProgressIndicator from './gtm-narrative/ProgressIndicator';
import StrategicAlignmentStep from './gtm-narrative/StrategicAlignmentStep';
import TargetReaderResonanceStep from './gtm-narrative/TargetReaderResonanceStep';
import ContentDiscoveryTriggersStep from './gtm-narrative/ContentDiscoveryTriggersStep';
import EnhancedContentOutlineStep from './gtm-narrative/EnhancedContentOutlineStep';
import ContentGenerationEditor from './gtm-narrative/ContentGenerationEditor';

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
  
  // Enhanced Content Outline
  headlineOptions: HeadlineOption[];
  selectedHeadline: string;
  outlineSections: OutlineSection[];
  
  // Content Generation
  generatedIntro: string;
  generatedBody: string;
  generatedConclusion: string;
}

interface GTMNarrativeCreatorProps {
  articleSubType: ArticleSubType;
  scripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  onBack: () => void;
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
  const [contentPhase, setContentPhase] = useState<'outline' | 'intro' | 'body' | 'conclusion'>('outline');
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
    headlineOptions: [],
    selectedHeadline: '',
    outlineSections: [],
    generatedIntro: '',
    generatedBody: '',
    generatedConclusion: ''
  });

  const getTitle = () => {
    return articleSubType === 'newsletter' 
      ? 'AI-Powered First-Person Narrative Newsletter'
      : 'AI-Powered GTM Thought Leadership Article';
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

  const generateHeadlines = async () => {
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
      
      const prompt = `Based on the following strategic inputs, generate 9-12 compelling headline alternatives for a ${articleSubType === 'newsletter' ? 'first-person narrative newsletter' : 'thought leadership article'}:

STRATEGIC CONTEXT:
- Core Idea: ${formData.ideaTrigger}
- Target Keyword: ${formData.targetKeyword}
- Target Audience: ${selectedScript?.name || 'Professional audience'}
- Journey Stage: ${formData.journeyStage}
- Mutual Goal: ${formData.mutualGoal}

DISCOVERY TRIGGERS:
- Related Keywords: ${formData.relatedKeywords.join(', ')}
- Problem Statements: ${formData.problemStatements.join('; ')}

Create headlines that are:
1. Compelling and attention-grabbing
2. Include the target keyword naturally
3. Speak directly to the target audience's challenges
4. Promise a clear value proposition

Format as JSON:
{
  "headlines": ["headline1", "headline2", ...]
}`;

      const response = await generateContent(prompt);
      const headlineData = JSON.parse(response);
      
      const headlineOptions: HeadlineOption[] = headlineData.headlines.map((text: string, index: number) => ({
        id: `generated_${index}`,
        text,
        isGenerated: true
      }));
      
      handleInputChange('headlineOptions', headlineOptions);
      
      // Generate outline sections after headlines
      await generateOutlineSections();
      
      toast({
        title: "Headlines generated",
        description: "Review and select your preferred headline, then refine the content outline."
      });
    } catch (error) {
      console.error('Error generating headlines:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate headlines. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateOutlineSections = async () => {
    try {
      const selectedScript = scripts.find(s => s.id === formData.mainTargetICP);
      
      const prompt = `Create a detailed Product-Led Storytelling outline with the 9-step approach organized into 3Rs phases:

CONTEXT:
- Article Type: ${articleSubType}
- Core Idea: ${formData.ideaTrigger}
- Target Audience: ${selectedScript?.name || 'Professional audience'}
- Problems to Address: ${formData.problemStatements.join('; ')}

Create sections following this structure:
- ATTRACT (PLS Step 1): H2/H3 for hook and resonance
- FILTER (PLS Steps 2-3): H2/H3 for context and transition  
- ENGAGE (PLS Steps 4-6): H2/H3/H4 for main content body
- RESULTS (PLS Steps 7-9): H2/H3/H4 for outcomes and CTA

Format as JSON:
{
  "sections": [
    {
      "type": "H2",
      "title": "Section Title",
      "phase": "attract|filter|engage|results"
    }
  ]
}`;

      const response = await generateContent(prompt);
      const outlineData = JSON.parse(response);
      
      const outlineSections: OutlineSection[] = outlineData.sections.map((section: any, index: number) => ({
        id: `section_${index}`,
        type: section.type,
        title: section.title,
        phase: section.phase,
        context: '',
        linkedAssetType: undefined,
        linkedAssetId: undefined
      }));
      
      handleInputChange('outlineSections', outlineSections);
    } catch (error) {
      console.error('Error generating outline sections:', error);
    }
  };

  const generatePhaseContent = async (phase: 'intro' | 'body' | 'conclusion') => {
    if (!isConfigured) return;
    
    setIsGenerating(true);
    
    try {
      const selectedScript = scripts.find(s => s.id === formData.mainTargetICP);
      const selectedHeadline = formData.headlineOptions.find(h => h.id === formData.selectedHeadline);
      
      let phasePrompt = '';
      let contentKey: keyof FormData = 'generatedIntro';
      
      switch (phase) {
        case 'intro':
          contentKey = 'generatedIntro';
          phasePrompt = `Generate a compelling introduction and first section content for:
          
HEADLINE: ${selectedHeadline?.text}
TARGET AUDIENCE: ${selectedScript?.name}
CORE IDEA: ${formData.ideaTrigger}

Include:
1. Hook that resonates with the target audience
2. Introduction of the problem/challenge
3. Personal connection or credibility
4. Preview of what's coming

Write in a ${articleSubType === 'newsletter' ? 'first-person narrative style' : 'thought leadership tone'}.`;
          break;
          
        case 'body':
          contentKey = 'generatedBody';
          phasePrompt = `Generate the main body content following the outline sections for ENGAGE phase:

SECTIONS: ${formData.outlineSections.filter(s => s.phase === 'engage').map(s => s.title).join(', ')}
CONTEXT: ${formData.outlineSections.filter(s => s.phase === 'engage' && s.context).map(s => s.context).join('; ')}

Focus on:
1. Core framework/solution presentation
2. Detailed explanation with examples
3. Value demonstration
4. Practical application`;
          break;
          
        case 'conclusion':
          contentKey = 'generatedConclusion';
          phasePrompt = `Generate the conclusion content for RESULTS phase:

SECTIONS: ${formData.outlineSections.filter(s => s.phase === 'results').map(s => s.title).join(', ')}
CALL TO ACTION: ${formData.callToAction}

Include:
1. Summary of key points
2. Results and benefits
3. Future implications
4. Clear call to action`;
          break;
      }

      const fullPrompt = `${phasePrompt}

Write comprehensive, engaging content that aligns with the overall narrative strategy.`;

      const response = await generateContent(fullPrompt);
      handleInputChange(contentKey, response);
      
      toast({
        title: "Content generated",
        description: `${phase.charAt(0).toUpperCase() + phase.slice(1)} section has been generated successfully.`
      });
    } catch (error) {
      console.error(`Error generating ${phase} content:`, error);
      toast({
        title: "Generation failed",
        description: `Failed to generate ${phase} content. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceedFromStep1 = () => {
    return formData.ideaTrigger && formData.mutualGoal && formData.targetKeyword && 
           formData.contentCluster && formData.publishReason && formData.callToAction;
  };

  const canProceedFromStep2 = () => {
    return formData.mainTargetICP && formData.journeyStage && formData.readingPrompt;
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      if (!formData.mainTargetICP || !formData.journeyStage || !formData.readingPrompt) {
        toast({
          title: "Missing information",
          description: "Please complete all required fields in Target Reader Resonance.",
          variant: "destructive"
        });
        return;
      }
      
      await generateContentTriggers();
    }
    
    if (currentStep === 3) {
      await generateHeadlines();
    }
    
    if (currentStep === 4) {
      if (!formData.selectedHeadline) {
        toast({
          title: "Please select a headline",
          description: "Choose one of the generated headlines or add your own.",
          variant: "destructive"
        });
        return;
      }
      
      // Move to content generation phase
      setContentPhase('intro');
      await generatePhaseContent('intro');
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const handleContentPhaseNext = async () => {
    switch (contentPhase) {
      case 'intro':
        setContentPhase('body');
        await generatePhaseContent('body');
        break;
      case 'body':
        setContentPhase('conclusion');
        await generatePhaseContent('conclusion');
        break;
      case 'conclusion':
        // Complete the process
        toast({
          title: "Content Creation Complete!",
          description: "Your GTM narrative has been successfully generated. You can now export or continue editing."
        });
        break;
    }
  };

  const renderCurrentStep = () => {
    if (contentPhase !== 'outline') {
      const phaseConfig = {
        intro: {
          title: 'Introduction & Hook',
          description: 'AI-generated opening that captures attention and establishes credibility',
          content: formData.generatedIntro,
          contentKey: 'generatedIntro' as keyof FormData
        },
        body: {
          title: 'Main Content Body',
          description: 'Core framework and value demonstration following your strategic outline',
          content: formData.generatedBody,
          contentKey: 'generatedBody' as keyof FormData
        },
        conclusion: {
          title: 'Results & Call to Action',
          description: 'Compelling conclusion with clear next steps for your audience',
          content: formData.generatedConclusion,
          contentKey: 'generatedConclusion' as keyof FormData
        }
      };

      const config = phaseConfig[contentPhase];
      
      return (
        <ContentGenerationEditor
          currentPhase={contentPhase}
          phaseTitle={config.title}
          phaseDescription={config.description}
          generatedContent={config.content}
          onContentChange={(content) => handleInputChange(config.contentKey, content)}
          onRegenerate={() => generatePhaseContent(contentPhase)}
          onContinue={handleContentPhaseNext}
          onBack={() => setContentPhase('outline')}
          isGenerating={isGenerating}
          canContinue={!!config.content}
        />
      );
    }

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
          <EnhancedContentOutlineStep
            data={{
              headlineOptions: formData.headlineOptions,
              selectedHeadline: formData.selectedHeadline,
              outlineSections: formData.outlineSections
            }}
            articleSubType={articleSubType}
            successStories={successStories}
            productFeatures={[]} // TODO: Add these props when available
            productUseCases={[]}
            productDifferentiators={[]}
            isGeneratingHeadlines={isGenerating}
            isGeneratingOutline={isGenerating}
            onDataChange={(field, value) => handleInputChange(field, value)}
            onAddHeadline={() => {}} // Handled in the component
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <CardTitle className="text-story-blue flex items-center text-lg">
              <Sparkles className="h-5 w-5 mr-2" />
              {articleSubType === 'newsletter' 
                ? 'AI-Powered First-Person Narrative Newsletter'
                : 'AI-Powered GTM Thought Leadership Article'}
            </CardTitle>
            <CardDescription className="text-xs">
              {contentPhase === 'outline' 
                ? 'Building your personalized content creation blueprint'
                : 'AI-crafting your resonant GTM narrative'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {contentPhase === 'outline' && <ProgressIndicator currentStep={currentStep} />}
        
        <div className="min-h-[400px]">
          {renderCurrentStep()}
        </div>

        {contentPhase === 'outline' && (
          <div className="flex justify-between pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 1}
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={isGenerating}
              className="bg-story-blue hover:bg-story-light-blue"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  AI Building...
                </>
              ) : currentStep === 4 ? (
                <>
                  Start Content Generation
                  <Sparkles className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GTMNarrativeCreator;
