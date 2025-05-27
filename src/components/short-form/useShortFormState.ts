
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { ICPStoryScript, Author, CustomerSuccessStory, NarrativeSelection } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

type NarrativeAnchor = 'belief' | 'pain' | 'struggle' | 'transformation';
type ContentGoal = 'book_call' | 'learn_more' | 'try_product' | 'reply' | 'visit_article';

interface UseShortFormStateProps {
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  ideas: GeneratedIdea[];
}

export const useShortFormState = ({ scripts, authors, successStories, ideas }: UseShortFormStateProps) => {
  const [selectedICP, setSelectedICP] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedAuthorTone, setSelectedAuthorTone] = useState('');
  const [selectedAuthorExperience, setSelectedAuthorExperience] = useState('');
  const [narrativeSelections, setNarrativeSelections] = useState<NarrativeSelection[]>([]);
  const [contentGoal, setContentGoal] = useState<ContentGoal>('book_call');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [clientName, setClientName] = useState<string | null>(null);
  const [additionalContext, setAdditionalContext] = useState('');
  const [selectedSuccessStory, setSelectedSuccessStory] = useState('none');
  const [wordCount, setWordCount] = useState(300);
  const [emailCount, setEmailCount] = useState(1);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

  const { toast } = useToast();

  const availableAnchors = [
    { value: 'belief', label: 'Core Beliefs' },
    { value: 'pain', label: 'Internal Pains' },
    { value: 'struggle', label: 'External Struggles' },
    { value: 'transformation', label: 'Desired Transformations' }
  ];

  const getSelectedIdea = () => {
    if (!selectedIdeaId) return null;
    return ideas.find(idea => idea.id === selectedIdeaId) || null;
  };

  // Auto-select ICP when an idea is selected (if the idea has ICP data)
  useEffect(() => {
    const selectedIdea = getSelectedIdea();
    if (selectedIdea && selectedIdea.icpId && selectedIdea.icpId !== selectedICP) {
      const icpExists = scripts.find(script => script.id === selectedIdea.icpId);
      if (icpExists) {
        setSelectedICP(selectedIdea.icpId);
      }
    }
  }, [selectedIdeaId, scripts, selectedICP]);

  return {
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
  };
};
