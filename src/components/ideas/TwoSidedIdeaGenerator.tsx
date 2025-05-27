
import { FC, useState } from 'react';
import { useTwoSidedIdeaGeneration } from '@/hooks/useTwoSidedIdeaGeneration';
import { GeneratedIdea } from '@/types/ideas';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import FormatSelectionCard from './FormatSelectionCard';
import AIGenerationSection from './AIGenerationSection';
import ManualEntrySection from './ManualEntrySection';
import RecentIdeasSection from './RecentIdeasSection';

interface TwoSidedIdeaGeneratorProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
  selectedClientId?: string;
  ideas: GeneratedIdea[];
}

const TwoSidedIdeaGenerator: FC<TwoSidedIdeaGeneratorProps> = ({
  icpScripts,
  productContext,
  onIdeaAdded,
  onContentTypeSelect,
  selectedClientId,
  ideas
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'structured' | 'open'>('structured');
  const [manualTitle, setManualTitle] = useState('');
  const [manualNarrative, setManualNarrative] = useState('');
  const [manualProductTieIn, setManualProductTieIn] = useState('');
  const [manualCTA, setManualCTA] = useState('');

  const {
    prompt,
    selectedICPScript,
    generatedIdeas,
    isGenerating,
    handleInputChange,
    handleICPScriptChange,
    generateIdeas
  } = useTwoSidedIdeaGeneration({
    icpScripts,
    productContext
  });

  const handleAddManualIdea = () => {
    if (!manualTitle.trim() || !manualNarrative.trim()) {
      return;
    }

    const newIdea: GeneratedIdea = {
      id: crypto.randomUUID(),
      title: manualTitle.trim(),
      narrative: manualNarrative.trim(),
      productTieIn: manualProductTieIn.trim() || '',
      cta: manualCTA.trim() || '',
      clientId: selectedClientId,
      createdAt: new Date().toISOString(),
      score: { value: 0, label: '0' },
      source: { type: 'manual', content: 'Manual entry' },
      icpId: '',
      narrativeAnchor: 'belief',
      narrativeItemId: '',
      productFeatures: []
    };

    onIdeaAdded(newIdea);

    // Reset form
    setManualTitle('');
    setManualNarrative('');
    setManualProductTieIn('');
    setManualCTA('');
  };

  const handleSaveIdea = (idea: string) => {
    // Parse the generated idea (assuming it's in a specific format)
    const lines = idea.split('\n').filter(line => line.trim());
    const title = lines[0]?.replace(/^\d+\.\s*/, '').trim() || 'Generated Idea';
    const narrative = lines.slice(1).join(' ').trim() || idea;

    const newIdea: GeneratedIdea = {
      id: crypto.randomUUID(),
      title,
      narrative,
      productTieIn: '',
      cta: '',
      clientId: selectedClientId,
      createdAt: new Date().toISOString(),
      score: { value: 0, label: '0' },
      source: { type: 'text', content: 'AI generated' },
      icpId: selectedICPScript?.id || '',
      narrativeAnchor: 'belief',
      narrativeItemId: '',
      productFeatures: []
    };

    onIdeaAdded(newIdea);
  };

  return (
    <div className="space-y-6">
      <FormatSelectionCard
        selectedFormat={selectedFormat}
        onFormatChange={setSelectedFormat}
      />

      {selectedFormat === 'structured' ? (
        <AIGenerationSection
          icpScripts={icpScripts}
          prompt={prompt}
          selectedICPScript={selectedICPScript}
          generatedIdeas={generatedIdeas}
          isGenerating={isGenerating}
          onInputChange={handleInputChange}
          onICPScriptChange={handleICPScriptChange}
          onGenerateIdeas={generateIdeas}
          onSaveIdea={handleSaveIdea}
        />
      ) : (
        <ManualEntrySection
          manualTitle={manualTitle}
          manualNarrative={manualNarrative}
          manualProductTieIn={manualProductTieIn}
          manualCTA={manualCTA}
          onTitleChange={setManualTitle}
          onNarrativeChange={setManualNarrative}
          onProductTieInChange={setManualProductTieIn}
          onCTAChange={setManualCTA}
          onAddManualIdea={handleAddManualIdea}
        />
      )}

      <RecentIdeasSection ideas={ideas} />
    </div>
  );
};

export default TwoSidedIdeaGenerator;
