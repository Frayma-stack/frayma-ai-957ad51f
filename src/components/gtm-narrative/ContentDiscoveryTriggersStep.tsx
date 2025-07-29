
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2, Sparkles } from 'lucide-react';

interface HeadlineOption {
  id: string;
  text: string;
  isGenerated: boolean;
}

interface ContentDiscoveryTriggersData {
  relatedKeywords: string[];
  searchQueries: string[];
  problemStatements: string[];
  headlineOptions: HeadlineOption[];
  selectedHeadline: string;
}

interface ContentDiscoveryTriggersStepProps {
  data: ContentDiscoveryTriggersData;
  isGenerating?: boolean;
  onDataChange: (field: keyof ContentDiscoveryTriggersData, value: any) => void;
  onRegenerateContent?: () => void;
}

const ContentDiscoveryTriggersStep: FC<ContentDiscoveryTriggersStepProps> = ({
  data,
  isGenerating = false,
  onDataChange,
  onRegenerateContent
}) => {
  const updateArray = (field: 'relatedKeywords' | 'searchQueries' | 'problemStatements', index: number, value: string) => {
    const newArray = [...(data[field] as string[])];
    newArray[index] = value;
    onDataChange(field, newArray);
  };

  const removeFromArray = (field: 'relatedKeywords' | 'searchQueries' | 'problemStatements', index: number) => {
    const newArray = (data[field] as string[]).filter((_, i) => i !== index);
    onDataChange(field, newArray);
  };

  const addToArray = (field: 'relatedKeywords' | 'searchQueries' | 'problemStatements') => {
    onDataChange(field, [...(data[field] as string[]), '']);
  };

  const handleHeadlineSelect = (headlineId: string) => {
    const selectedHeadline = data.headlineOptions.find(h => h.id === headlineId);
    if (selectedHeadline) {
      onDataChange('selectedHeadline', selectedHeadline.text);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-story-blue">Content Discovery Triggers</h3>
        <div className="flex items-center gap-3">
          {onRegenerateContent && !isGenerating && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerateContent}
              className="text-xs"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Regenerate
            </Button>
          )}
          {isGenerating && (
            <div className="flex items-center text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Generating suggestions...
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Related Keywords</label>
        <div className="space-y-2">
          {data.relatedKeywords.map((keyword, index) => (
            <div key={index} className="flex gap-2">
              <Input 
                value={keyword}
                onChange={(e) => updateArray('relatedKeywords', index, e.target.value)}
                placeholder={`Related keyword ${index + 1}`}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeFromArray('relatedKeywords', index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addToArray('relatedKeywords')}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Keyword
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Search Queries</label>
        <div className="space-y-2">
          {data.searchQueries.map((query, index) => (
            <div key={index} className="flex gap-2">
              <Textarea 
                value={query}
                onChange={(e) => updateArray('searchQueries', index, e.target.value)}
                placeholder={`Search query ${index + 1}`}
                rows={2}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeFromArray('searchQueries', index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addToArray('searchQueries')}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Query
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Problem Statements</label>
        <div className="space-y-2">
          {data.problemStatements.map((statement, index) => (
            <div key={index} className="flex gap-2">
              <Textarea 
                value={statement}
                onChange={(e) => updateArray('problemStatements', index, e.target.value)}
                placeholder={`Problem statement ${index + 1}`}
                rows={2}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeFromArray('problemStatements', index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addToArray('problemStatements')}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Problem Statement
          </Button>
        </div>
      </div>

    </div>
  );
};

export default ContentDiscoveryTriggersStep;
