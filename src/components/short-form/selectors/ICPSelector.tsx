
import { FC } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { ICPStoryScript } from '@/types/storytelling';

interface ICPSelectorProps {
  selectedICP: string;
  scripts: ICPStoryScript[];
  onICPChange: (value: string) => void;
}

const ICPSelector: FC<ICPSelectorProps> = ({
  selectedICP,
  scripts,
  onICPChange
}) => {
  // Handle value changes to convert special "__no_scripts__" value back to empty string
  const handleICPChange = (value: string) => {
    onICPChange(value === "__no_scripts__" ? "" : value);
  };

  return (
    <div>
      <div className="flex items-center">
        <label className="text-sm font-medium">Target ICP *</label>
        <Users className="ml-2 h-4 w-4 text-gray-400" />
      </div>
      <Select value={selectedICP || "__no_scripts__"} onValueChange={handleICPChange}>
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Select ICP StoryScript" />
        </SelectTrigger>
        <SelectContent>
          {scripts.length === 0 ? (
            <SelectItem value="__no_scripts__">
              No ICP StoryScripts found for this client
            </SelectItem>
          ) : (
            scripts
              .filter(script => script.id && script.id.trim() !== '')
              .map(script => (
                <SelectItem key={script.id} value={script.id}>
                  {script.name}
                </SelectItem>
              ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ICPSelector;
