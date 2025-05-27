import { FC, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { 
  ICPStoryScript, 
  Author, 
  CustomerSuccessStory,
  NarrativeSelection
} from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import IdeaSelector from './IdeaSelector';
import ShortFormHeader from './short-form/ShortFormHeader';
import ICPAuthorSelectors from './short-form/ICPAuthorSelectors';
import NarrativeAnchorSelector from './short-form/NarrativeAnchorSelector';
import ContentOptionsSection from './short-form/ContentOptionsSection';
import ContentGenerationDisplay from './short-form/ContentGenerationDisplay';
import { useShortFormState } from './short-form/useShortFormState';
import { useContentGeneration } from './short-form/useContentGeneration';

type NarrativeAnchor = 'belief' | 'pain' | 'struggle' | 'transformation';
type ContentGoal = 'book_call' | 'learn_more' | 'try_product' | 'reply' | 'visit_article';

interface ShortFormContentCreatorProps {
  contentType: 'email' | 'linkedin' | 'custom';
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  ideas?: GeneratedIdea[];
  selectedClientId?: string | null;
  onBack: () => void;
}

const ShortFormContentCreator: FC<ShortFormContentCreatorProps> = ({ 
  contentType, 
  scripts,
  authors,
  successStories,
  ideas = [],
  selectedClientId,
  onBack
}) => {
  const {
    selectedICP,
    selectedAuthor,
    selectedAuthorTone,
    selectedAuthorExperience,
    narrativeSelections,
    contentGoal,
    generatedContent,
    isGenerating,
    clientName,
    additionalContext,
    selectedSuccessStory,
    wordCount,
    emailCount,
    availableAnchors,
    selectedIdeaId,
    toast,
    getSelectedIdea,
    setSelectedICP,
    setSelectedAuthor,
    setSelectedAuthorTone,
    setSelectedAuthorExperience,
    setNarrativeSelections,
    setContentGoal,
    setGeneratedContent,
    setIsGenerating,
    setAdditionalContext,
    setSelectedSuccessStory,
    setWordCount,
    setEmailCount,
    setSelectedIdeaId
  } = useShortFormState({ scripts, authors, successStories, ideas });

  const {
    getSelectedICPScript,
    getSelectedAuthor,
    getSelectedSuccessStory,
    generateEmailContent,
    generateLinkedInContent,
    generateCustomContent
  } = useContentGeneration({
    contentType,
    scripts,
    authors,
    successStories,
    narrativeSelections,
    selectedICP,
    selectedAuthor,
    selectedAuthorTone,
    selectedAuthorExperience,
    selectedSuccessStory,
    contentGoal,
    wordCount,
    emailCount,
    additionalContext
  });

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'email': return 'Sales Email';
      case 'linkedin': return 'LinkedIn Post';
      case 'custom': return 'Custom Content';
      default: return 'Content';
    }
  };

  // Check if a narrative anchor type is selected
  const isAnchorTypeSelected = (type: NarrativeAnchor) => {
    return narrativeSelections.some(selection => selection.type === type);
  };
  
  // Add or remove a narrative anchor type
  const toggleAnchorType = (type: NarrativeAnchor) => {
    if (isAnchorTypeSelected(type)) {
      setNarrativeSelections(narrativeSelections.filter(selection => selection.type !== type));
    } else {
      setNarrativeSelections([...narrativeSelections, { type, items: [] }]);
    }
  };

  // Toggle an item selection for a specific narrative anchor type
  const toggleItemSelection = (type: NarrativeAnchor, itemId: string) => {
    setNarrativeSelections(narrativeSelections.map(selection => {
      if (selection.type === type) {
        if (selection.items.includes(itemId)) {
          return { ...selection, items: selection.items.filter(id => id !== itemId) };
        } else {
          return { ...selection, items: [...selection.items, itemId] };
        }
      }
      return selection;
    }));
  };
  
  // Check if form is valid for generation
  const isFormValid = () => {
    // If an idea is selected, we don't need ICP and narrative selections
    if (getSelectedIdea()) {
      return selectedAuthor;
    }
    
    // Otherwise, we need the full form
    if (!selectedICP || !selectedAuthor) return false;
    
    const hasSelectedItems = narrativeSelections.some(
      selection => selection.items.length > 0
    );
    
    return hasSelectedItems;
  };

  const generateContent = () => {
    if (!isFormValid()) {
      const selectedIdea = getSelectedIdea();
      if (selectedIdea) {
        toast({
          title: "Missing information",
          description: "Please select an author to generate content using your saved idea.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Missing information",
          description: "Please select an ICP, author, and at least one narrative item to generate content.",
          variant: "destructive"
        });
      }
      return;
    }

    setIsGenerating(true);

    // Simulate content generation
    setTimeout(() => {
      const script = getSelectedICPScript();
      const author = getSelectedAuthor();
      const successStory = getSelectedSuccessStory();
      const selectedIdea = getSelectedIdea();
      
      if (!author) {
        setIsGenerating(false);
        return;
      }
      
      let content = "";
      
      if (contentType === 'email') {
        content = generateEmailContent(script, author, successStory, selectedIdea);
      } else if (contentType === 'linkedin') {
        content = generateLinkedInContent(script, author, successStory, selectedIdea);
      } else if (contentType === 'custom') {
        content = generateCustomContent(script, author, successStory, selectedIdea);
      }
      
      setGeneratedContent(content);
      setIsGenerating(false);
      
      toast({
        title: `${getContentTypeLabel()} generated`,
        description: "Your content has been created. Feel free to edit it as needed."
      });
    }, 1500);
  };

  const selectedIdea = getSelectedIdea();

  return (
    <div className="space-y-4">
      {/* Idea Selector */}
      {ideas.length > 0 && (
        <IdeaSelector
          ideas={ideas}
          selectedIdeaId={selectedIdeaId}
          onIdeaSelect={setSelectedIdeaId}
          selectedClientId={selectedClientId}
        />
      )}

      <Card className="w-full bg-white shadow-md">
        <ShortFormHeader
          contentType={contentType}
          clientName={clientName}
          onBack={onBack}
        />
        
        <CardContent className="space-y-6">
          <ICPAuthorSelectors
            selectedICP={selectedICP}
            selectedAuthor={selectedAuthor}
            selectedAuthorTone={selectedAuthorTone}
            selectedAuthorExperience={selectedAuthorExperience}
            scripts={scripts}
            authors={authors}
            selectedIdea={selectedIdea}
            onICPChange={setSelectedICP}
            onAuthorChange={setSelectedAuthor}
            onAuthorToneChange={setSelectedAuthorTone}
            onAuthorExperienceChange={setSelectedAuthorExperience}
          />
          
          {!selectedIdea && (
            <NarrativeAnchorSelector
              selectedICP={selectedICP}
              scripts={scripts}
              narrativeSelections={narrativeSelections}
              availableAnchors={availableAnchors}
              onToggleAnchorType={toggleAnchorType}
              onToggleItemSelection={toggleItemSelection}
            />
          )}
          
          <ContentOptionsSection
            contentType={contentType}
            selectedSuccessStory={selectedSuccessStory}
            contentGoal={contentGoal}
            wordCount={wordCount}
            emailCount={emailCount}
            additionalContext={additionalContext}
            successStories={successStories}
            onSuccessStoryChange={setSelectedSuccessStory}
            onContentGoalChange={setContentGoal}
            onWordCountChange={setWordCount}
            onEmailCountChange={setEmailCount}
            onAdditionalContextChange={setAdditionalContext}
          />
          
          <Button 
            className="w-full bg-story-blue hover:bg-story-light-blue"
            onClick={generateContent}
            disabled={isGenerating || !isFormValid()}
          >
            {isGenerating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              `Generate ${getContentTypeLabel()}`
            )}
          </Button>
        </CardContent>
        
        <ContentGenerationDisplay
          contentType={contentType}
          generatedContent={generatedContent}
          onContentChange={setGeneratedContent}
        />
      </Card>
    </div>
  );
};

export default ShortFormContentCreator;
