
import { FC } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { IdeaScore } from '@/types/ideas';
import { SCORE_OPTIONS } from '../utils/IdeaParsingUtils';

interface IdeaScoreSelectorProps {
  score: IdeaScore | null;
  onScoreChange: (score: IdeaScore) => void;
}

const IdeaScoreSelector: FC<IdeaScoreSelectorProps> = ({ score, onScoreChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Label className="text-sm">Score:</Label>
      <Select 
        value={score?.value !== undefined ? score.value.toString() : '__no_score__'} 
        onValueChange={(value) => {
          if (value === '__no_score__') return;
          const selectedScore = SCORE_OPTIONS.find(s => s.value.toString() === value);
          if (selectedScore) onScoreChange(selectedScore);
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select score" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__no_score__">No Score</SelectItem>
          {SCORE_OPTIONS.map(option => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default IdeaScoreSelector;
