import { FC, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Package, Loader2 } from 'lucide-react';

interface BusinessContent {
  id: string;
  type: 'feature' | 'useCase' | 'differentiator';
  title: string;
  description: string;
}

interface BusinessContentSelectorProps {
  selectedText: string;
  fullContent: string;
  narrativeDirection?: string;
  onWeaveContent: (content: string) => void;
  onClose: () => void;
}

const BusinessContentSelector: FC<BusinessContentSelectorProps> = ({
  selectedText,
  fullContent,
  narrativeDirection,
  onWeaveContent,
  onClose
}) => {
  const [businessContents, setBusinessContents] = useState<BusinessContent[]>([]);
  const [selectedContentId, setSelectedContentId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWeaving, setIsWeaving] = useState(false);

  // Mock business content for now - in production this would come from the database
  useEffect(() => {
    const mockContent: BusinessContent[] = [
      {
        id: '1',
        type: 'feature',
        title: 'AI-Powered Analytics',
        description: 'Advanced machine learning algorithms that provide real-time insights into customer behavior and market trends.'
      },
      {
        id: '2',
        type: 'useCase',
        title: 'Customer Onboarding Automation',
        description: 'Streamlined process that reduces onboarding time by 75% while improving customer satisfaction scores.'
      },
      {
        id: '3',
        type: 'differentiator',
        title: 'Zero-Configuration Setup',
        description: 'Unlike competitors, our platform requires no technical configuration - setup takes less than 5 minutes.'
      }
    ];
    setBusinessContents(mockContent);
  }, []);

  const handleWeaveContent = async () => {
    if (!selectedContentId) return;
    
    setIsWeaving(true);
    
    try {
      const selectedContent = businessContents.find(c => c.id === selectedContentId);
      if (!selectedContent) return;

      // Simulate API call to OpenAI for content weaving
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock the enhanced content
      const enhancedContent = `${selectedText} 

[Enhanced with ${selectedContent.title}]: This approach leverages ${selectedContent.description.toLowerCase()} to deliver exceptional results for our clients.`;
      
      onWeaveContent(enhancedContent);
    } catch (error) {
      console.error('Error weaving content:', error);
    } finally {
      setIsWeaving(false);
    }
  };

  const selectedContent = businessContents.find(c => c.id === selectedContentId);

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground">
        Selected text: "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium">Choose Business Content Item</label>
        <Select value={selectedContentId} onValueChange={setSelectedContentId}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select content to weave in..." />
          </SelectTrigger>
          <SelectContent>
            {businessContents.map((content) => (
              <SelectItem key={content.id} value={content.id} className="text-xs">
                <div className="flex items-center space-x-2">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    content.type === 'feature' ? 'bg-blue-100 text-blue-700' :
                    content.type === 'useCase' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {content.type}
                  </span>
                  <span>{content.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedContent && (
        <div className="p-3 bg-muted/50 rounded-md">
          <div className="text-xs font-medium mb-1">{selectedContent.title}</div>
          <div className="text-xs text-muted-foreground">{selectedContent.description}</div>
        </div>
      )}

      {narrativeDirection && (
        <div className="space-y-2">
          <label className="text-xs font-medium">Narrative Direction</label>
          <Textarea
            value={narrativeDirection}
            readOnly
            rows={2}
            className="text-xs resize-none bg-muted/50"
          />
        </div>
      )}

      <div className="flex space-x-2">
        <Button
          onClick={handleWeaveContent}
          disabled={!selectedContentId || isWeaving}
          size="sm"
          className="flex-1"
        >
          {isWeaving ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Weaving...
            </>
          ) : (
            <>
              <Package className="h-3 w-3 mr-1" />
              Weave Content
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          size="sm"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default BusinessContentSelector;