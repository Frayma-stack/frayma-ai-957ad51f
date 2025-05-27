
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
  Mail, 
  MessageSquare, 
  Settings, 
  Lightbulb,
  Trophy
} from "lucide-react";
import { GeneratedIdea } from '@/types/ideas';
import IdeaSelector from './IdeaSelector';

export type ContentType = 'article' | 'email' | 'linkedin' | 'custom' | 'generate-ideas' | 'success-story';
export type ArticleSubType = 'thought_leadership' | 'newsletter';

interface ContentTypeSelectorProps {
  onSelect: (type: ContentType) => void;
  onSelectArticleSubtype?: (subtype: ArticleSubType) => void;
  ideas?: GeneratedIdea[];
  selectedClientId?: string | null;
  selectedIdeaId?: string | null;
  onIdeaSelect?: (ideaId: string | null) => void;
}

const ContentTypeSelector: FC<ContentTypeSelectorProps> = ({ 
  onSelect, 
  onSelectArticleSubtype,
  ideas = [],
  selectedClientId,
  selectedIdeaId,
  onIdeaSelect
}) => {
  // Handler for selecting article type
  const handleArticleSelection = () => {
    onSelect('article');
  };

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

      <Card className="w-full bg-white shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-brand-primary font-sora text-2xl">What would you like to create?</CardTitle>
          <CardDescription className="opacity-60">
            {selectedIdeaId ? 'Creating content based on your selected idea' : 'Select a content type to begin crafting your message'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-brand-primary transition-all card-hover"
              onClick={handleArticleSelection}
            >
              <FileText className="h-8 w-8 text-brand-primary" />
              <span className="text-lg font-medium font-sora">GTM Narrative Piece</span>
              <span className="text-sm text-gray-500 text-center opacity-70">
                Create a full, structured<br/>
                article with high resonance<br/>
                and deep structure
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-brand-primary transition-all card-hover"
              onClick={() => onSelect('success-story')}
            >
              <Trophy className="h-8 w-8 text-brand-primary" />
              <span className="text-lg font-medium font-sora">Success Story</span>
              <span className="text-sm text-gray-500 text-center opacity-70">
                Auto-craft compelling<br/>
                customer success stories<br/>
                with structured narrative
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-brand-primary transition-all card-hover"
              onClick={() => onSelect('email')}
            >
              <Mail className="h-8 w-8 text-brand-primary" />
              <span className="text-lg font-medium font-sora">Sales Email</span>
              <span className="text-sm text-gray-500 text-center opacity-70">
                Craft a compelling sales<br/>
                email using simplified<br/>
                workflow
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-brand-primary transition-all card-hover"
              onClick={() => onSelect('linkedin')}
            >
              <MessageSquare className="h-8 w-8 text-brand-primary" />
              <span className="text-lg font-medium font-sora">LinkedIn Post</span>
              <span className="text-sm text-gray-500 text-center opacity-70">
                Create engaging social<br/>
                media content for<br/>
                professional audiences
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-brand-primary transition-all card-hover"
              onClick={() => onSelect('custom')}
            >
              <Settings className="h-8 w-8 text-brand-primary" />
              <span className="text-lg font-medium font-sora">Custom</span>
              <span className="text-sm text-gray-500 text-center opacity-70">
                Create a custom GTM<br/>
                narrative piece in your<br/>
                unique voice
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-brand-primary transition-all card-hover"
              onClick={() => onSelect('generate-ideas')}
            >
              <Lightbulb className="h-8 w-8 text-brand-primary" />
              <span className="text-lg font-medium font-sora">Mint New Narrative Ideas</span>
              <span className="text-sm text-gray-500 text-center opacity-70">
                Generate resonant,<br/>
                compelling GTM<br/>
                narrative ideas
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentTypeSelector;
