
import { FC, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ICPStoryScript, CustomerSuccessStory } from '@/types/storytelling';
import { ArticleSubType } from './ContentTypeSelector';
import ProgressIndicator from './gtm-narrative/ProgressIndicator';
import StrategicAlignmentStep from './gtm-narrative/StrategicAlignmentStep';
import TargetReaderResonanceStep from './gtm-narrative/TargetReaderResonanceStep';
import ContentDiscoveryTriggersStep from './gtm-narrative/ContentDiscoveryTriggersStep';
import EnhancedContentOutlineStep from './gtm-narrative/EnhancedContentOutlineStep';
import ContentGenerationEditor from './gtm-narrative/ContentGenerationEditor';
import GTMNarrativeHeader from './gtm-narrative/GTMNarrativeHeader';
import GTMNarrativeNavigation from './gtm-narrative/GTMNarrativeNavigation';
import { useGTMNarrativeData } from './gtm-narrative/useGTMNarrativeData';
import { useGTMNarrativeGeneration } from './gtm-narrative/useGTMNarrativeGeneration';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [contentPhase, setContentPhase] = useState<'outline' | 'intro' | 'body' | 'conclusion'>('outline');

  const {
    formData,
    handleInputChange,
    canProceedFromStep1,
    canProceedFromStep2
  } = useGTMNarrativeData();

  const {
    isGenerating,
    generateContentTriggers,
    generateHeadlines,
    generatePhaseContent
  } = useGTMNarrativeGeneration({
    formData,
    scripts,
    successStories,
    onDataChange: handleInputChange
  });

  const handleNext = async () => {
    if (currentStep === 2) {
      if (!canProceedFromStep2()) {
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
          contentKey: 'generatedIntro' as keyof typeof formData
        },
        body: {
          title: 'Main Content Body',
          description: 'Core framework and value demonstration following your strategic outline',
          content: formData.generatedBody,
          contentKey: 'generatedBody' as keyof typeof formData
        },
        conclusion: {
          title: 'Results & Call to Action',
          description: 'Compelling conclusion with clear next steps for your audience',
          content: formData.generatedConclusion,
          contentKey: 'generatedConclusion' as keyof typeof formData
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
            productFeatures={[]}
            productUseCases={[]}
            productDifferentiators={[]}
            isGeneratingHeadlines={isGenerating}
            isGeneratingOutline={isGenerating}
            onDataChange={(field, value) => handleInputChange(field, value)}
            onAddHeadline={() => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm border-gray-200">
      <GTMNarrativeHeader
        articleSubType={articleSubType}
        contentPhase={contentPhase}
        onBack={onBack}
      />
      
      <CardContent className="space-y-6">
        {contentPhase === 'outline' && <ProgressIndicator currentStep={currentStep} />}
        
        <div className="min-h-[400px]">
          {renderCurrentStep()}
        </div>

        {contentPhase === 'outline' && (
          <GTMNarrativeNavigation
            currentStep={currentStep}
            isGenerating={isGenerating}
            onPrevious={() => setCurrentStep(prev => prev - 1)}
            onNext={handleNext}
            canProceed={currentStep === 1 ? canProceedFromStep1() : true}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default GTMNarrativeCreator;
