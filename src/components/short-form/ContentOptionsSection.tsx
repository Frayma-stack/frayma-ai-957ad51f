
import { FC } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Star, TextCursor, MailPlus, Info } from "lucide-react";
import { CustomerSuccessStory } from '@/types/storytelling';

type ContentGoal = 'book_call' | 'learn_more' | 'try_product' | 'reply' | 'visit_article';

interface ContentOptionsSectionProps {
  contentType: 'email' | 'linkedin' | 'custom';
  selectedSuccessStory: string;
  contentGoal: ContentGoal;
  wordCount: number;
  emailCount: number;
  additionalContext: string;
  successStories: CustomerSuccessStory[];
  onSuccessStoryChange: (value: string) => void;
  onContentGoalChange: (value: ContentGoal) => void;
  onWordCountChange: (value: number) => void;
  onEmailCountChange: (value: number) => void;
  onAdditionalContextChange: (value: string) => void;
}

const ContentOptionsSection: FC<ContentOptionsSectionProps> = ({
  contentType,
  selectedSuccessStory,
  contentGoal,
  wordCount,
  emailCount,
  additionalContext,
  successStories,
  onSuccessStoryChange,
  onContentGoalChange,
  onWordCountChange,
  onEmailCountChange,
  onAdditionalContextChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center">
          <label className="text-sm font-medium">Success Story (Optional)</label>
          <Star className="ml-2 h-4 w-4 text-gray-400" />
        </div>
        <Select 
          value={selectedSuccessStory} 
          onValueChange={onSuccessStoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a success story (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {successStories.map(story => (
              <SelectItem key={story.id} value={story.id}>
                {story.title}
              </SelectItem>
            ))}
            {successStories.length === 0 && (
              <SelectItem value="no-stories" disabled>
                No success stories available. Add stories in Assets tab.
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Content Goal / CTA</label>
          <Select 
            value={contentGoal} 
            onValueChange={(value) => onContentGoalChange(value as ContentGoal)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="book_call">Book a call</SelectItem>
              <SelectItem value="learn_more">Learn more</SelectItem>
              <SelectItem value="try_product">Try product</SelectItem>
              <SelectItem value="reply">Reply to email</SelectItem>
              <SelectItem value="visit_article">Visit article</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {contentType === 'email' ? (
          <div className="space-y-2">
            <div className="flex items-center">
              <label className="text-sm font-medium">Number of Emails</label>
              <MailPlus className="ml-2 h-4 w-4 text-gray-400" />
            </div>
            <Select 
              value={emailCount.toString()} 
              onValueChange={(value) => onEmailCountChange(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 email</SelectItem>
                <SelectItem value="2">2 emails</SelectItem>
                <SelectItem value="3">3 emails</SelectItem>
                <SelectItem value="4">4 emails</SelectItem>
                <SelectItem value="5">5 emails</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center">
              <label className="text-sm font-medium">Word Count</label>
              <TextCursor className="ml-2 h-4 w-4 text-gray-400" />
            </div>
            <Select 
              value={wordCount.toString()} 
              onValueChange={(value) => onWordCountChange(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="150">Short (~150 words)</SelectItem>
                <SelectItem value="300">Medium (~300 words)</SelectItem>
                <SelectItem value="500">Long (~500 words)</SelectItem>
                <SelectItem value="1000">Extra long (~1000 words)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Additional Context (Optional)</label>
          <span className="text-xs text-gray-500 flex items-center">
            <Info className="h-3 w-3 mr-1" />
            Add specific details to guide generation
          </span>
        </div>
        <Textarea 
          placeholder="Add any additional context, market insights, or specific points you want to highlight in the generated content..."
          value={additionalContext}
          onChange={(e) => onAdditionalContextChange(e.target.value)}
          className="min-h-[80px]"
          disabled={additionalContext.startsWith('Based on saved idea:')}
        />
      </div>
    </>
  );
};

export default ContentOptionsSection;
