
import { FC } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Mail
} from "lucide-react";
import { ArticleSubType } from './ContentTypeSelector';
import { GeneratedIdea } from '@/types/ideas';
import IdeaSelector from './IdeaSelector';

interface ArticleTypeSelectorProps {
  onSelect: (type: ArticleSubType) => void;
  onBack: () => void;
  ideas?: GeneratedIdea[];
  selectedClientId?: string | null;
  selectedIdeaId?: string | null;
  onIdeaSelect?: (ideaId: string | null) => void;
}

const ArticleTypeSelector: FC<ArticleTypeSelectorProps> = ({ 
  onSelect, 
  onBack,
  ideas = [],
  selectedClientId,
  selectedIdeaId,
  onIdeaSelect
}) => {
  return (
    <div className="space-y-4">
      {/* Idea Selector - only show if we have ideas and the callback function */}
      {ideas.length > 0 && onIdeaSelect && (
        <IdeaSelector
          ideas={ideas}
          selectedIdeaId={selectedIdeaId || null}
          onIdeaSelect={onIdeaSelect}
          selectedClientId={selectedClientId}
        />
      )}

      <Card className="w-full bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-story-blue">Choose Your GTM Narrative Piece Type</CardTitle>
          <CardDescription className="opacity-60">Select the type of narrative you want to create</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-story-blue transition-all"
              onClick={() => onSelect('newsletter')}
            >
              <Mail className="h-8 w-8 text-story-blue" />
              <span className="text-lg font-medium">First-Person Narrative Newsletter</span>
              <span className="text-sm text-gray-500 text-center opacity-70">
                Create an engaging newsletter<br/>
                in first-person voice
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-story-blue transition-all"
              onClick={() => onSelect('thought_leadership')}
            >
              <FileText className="h-8 w-8 text-story-blue" />
              <span className="text-lg font-medium">GTM Thought Leadership Article</span>
              <span className="text-sm text-gray-500 text-center opacity-70">
                Establish authority with insightful<br/>
                industry perspectives
              </span>
            </Button>
          </div>
          
          <div className="flex justify-center mt-4">
            <Button onClick={onBack} variant="outline">
              Back to Content Types
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleTypeSelector;
