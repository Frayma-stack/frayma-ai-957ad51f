
import { FC } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ICPStoryScript } from '@/types/storytelling';

interface ICPJourneySelectorData {
  mainTargetICP: string;
  journeyStage: 'TOFU' | 'MOFU' | 'BOFU' | '';
  broaderAudience: string;
  readingPrompt: string;
}

interface ICPJourneySelectorsProps {
  data: ICPJourneySelectorData;
  scripts: ICPStoryScript[];
  onDataChange: (field: keyof ICPJourneySelectorData, value: any) => void;
}

const ICPJourneySelectors: FC<ICPJourneySelectorsProps> = ({
  data,
  scripts,
  onDataChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Main Target ICP *</label>
        <Select 
          value={data.mainTargetICP} 
          onValueChange={(value) => onDataChange('mainTargetICP', value)}
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
          value={data.journeyStage} 
          onValueChange={(value: 'TOFU' | 'MOFU' | 'BOFU') => onDataChange('journeyStage', value)}
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
          value={data.broaderAudience} 
          onValueChange={(value) => onDataChange('broaderAudience', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select broader audience who could find this valuable" />
          </SelectTrigger>
          <SelectContent>
            {scripts.filter(script => script.id !== data.mainTargetICP).map(script => (
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
          value={data.readingPrompt}
          onChange={(e) => onDataChange('readingPrompt', e.target.value)}
          rows={3}
        />
      </div>
    </>
  );
};

export default ICPJourneySelectors;
