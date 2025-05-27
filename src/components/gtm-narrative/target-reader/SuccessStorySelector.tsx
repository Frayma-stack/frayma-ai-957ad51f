
import { FC } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerSuccessStory } from '@/types/storytelling';

interface SuccessStorySelectorProps {
  successStory: string;
  successStories: CustomerSuccessStory[];
  onSuccessStoryChange: (story: string) => void;
}

const SuccessStorySelector: FC<SuccessStorySelectorProps> = ({
  successStory,
  successStories,
  onSuccessStoryChange
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Success Story</label>
      <Select 
        value={successStory} 
        onValueChange={onSuccessStoryChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a success story for social proof" />
        </SelectTrigger>
        <SelectContent>
          {successStories.map(story => (
            <SelectItem key={story.id} value={story.id}>
              {story.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SuccessStorySelector;
