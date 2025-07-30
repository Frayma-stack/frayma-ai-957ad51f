
import { FC } from 'react';
import { ICPStoryScript, CustomerSuccessStory, Author } from '@/types/storytelling';
import ICPJourneySelectors from './target-reader/ICPJourneySelectors';
import NarrativeAnchorsSelector from './target-reader/NarrativeAnchorsSelector';
import SuccessStorySelector from './target-reader/SuccessStorySelector';
import ArticleAuthorSelector from './target-reader/ArticleAuthorSelector';

interface NarrativeAnchor {
  type: 'belief' | 'pain' | 'struggle' | 'transformation';
  itemId: string;
  content: string;
}

interface TargetReaderResonanceData {
  mainTargetICP: string;
  journeyStage: 'TOFU' | 'MOFU' | 'BOFU' | '';
  broaderAudience: string;
  readingPrompt: string;
  narrativeAnchors: NarrativeAnchor[];
  successStory: string;
  articleAuthor: string;
}

interface TargetReaderResonanceStepProps {
  data: TargetReaderResonanceData;
  scripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  authors: Author[];
  onDataChange: (field: keyof TargetReaderResonanceData, value: any) => void;
}

const TargetReaderResonanceStep: FC<TargetReaderResonanceStepProps> = ({
  data,
  scripts,
  successStories,
  authors,
  onDataChange
}) => {
  const selectedScript = scripts.find(s => s.id === data.mainTargetICP);

  const addNarrativeAnchor = (type: 'belief' | 'pain' | 'struggle' | 'transformation', itemId: string) => {
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
    onDataChange('narrativeAnchors', [...data.narrativeAnchors, newAnchor]);
  };

  const removeNarrativeAnchor = (index: number) => {
    onDataChange('narrativeAnchors', data.narrativeAnchors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-story-blue">Reader Resonance</h3>
      
      <ICPJourneySelectors
        data={{
          mainTargetICP: data.mainTargetICP,
          journeyStage: data.journeyStage,
          broaderAudience: data.broaderAudience,
          readingPrompt: data.readingPrompt
        }}
        scripts={scripts}
        onDataChange={onDataChange}
      />
      
      <NarrativeAnchorsSelector
        narrativeAnchors={data.narrativeAnchors}
        selectedScript={selectedScript}
        onAddNarrativeAnchor={addNarrativeAnchor}
        onRemoveNarrativeAnchor={removeNarrativeAnchor}
      />

      <ArticleAuthorSelector
        selectedAuthor={data.articleAuthor}
        authors={authors}
        onAuthorChange={(value) => onDataChange('articleAuthor', value)}
      />

      <SuccessStorySelector
        successStory={data.successStory}
        successStories={successStories}
        onSuccessStoryChange={(value) => onDataChange('successStory', value)}
      />
    </div>
  );
};

export default TargetReaderResonanceStep;
