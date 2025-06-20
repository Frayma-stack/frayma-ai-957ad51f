
import { FC } from 'react';
import SelectedHeadlineDisplay from './SelectedHeadlineDisplay';
import HeadlinePLSSection from './HeadlinePLSSection';

interface HeadlineOption {
  id: string;
  text: string;
  isGenerated: boolean;
}

interface HeadlineManagerProps {
  headlineOptions: HeadlineOption[];
  selectedHeadline: string;
  introPOV: string;
  isGeneratingHeadlines: boolean;
  onHeadlineChange: (value: string) => void;
  onIntroPOVChange: (value: string) => void;
  onAddHeadline: (headline: HeadlineOption) => void;
}

const HeadlineManager: FC<HeadlineManagerProps> = ({
  headlineOptions,
  selectedHeadline,
  introPOV,
  isGeneratingHeadlines,
  onHeadlineChange,
  onIntroPOVChange,
  onAddHeadline
}) => {
  return (
    <div className="space-y-6">
      {/* Show Selected Headline */}
      <SelectedHeadlineDisplay 
        selectedHeadline={selectedHeadline}
        headlineOptions={headlineOptions}
      />

      <HeadlinePLSSection
        headlineOptions={headlineOptions}
        selectedHeadline={selectedHeadline}
        introPOV={introPOV}
        isGeneratingHeadlines={isGeneratingHeadlines}
        onHeadlineChange={onHeadlineChange}
        onIntroPOVChange={onIntroPOVChange}
        onAddHeadline={onAddHeadline}
      />
    </div>
  );
};

export default HeadlineManager;
