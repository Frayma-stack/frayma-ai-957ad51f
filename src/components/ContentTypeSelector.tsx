
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
  Lightbulb 
} from "lucide-react";

export type ContentType = 'article' | 'email' | 'linkedin' | 'custom' | 'generate-ideas';
export type ArticleSubType = 'thought_leadership' | 'customer_success' | 'newsletter';

interface ContentTypeSelectorProps {
  onSelect: (type: ContentType) => void;
  onSelectArticleSubtype?: (subtype: ArticleSubType) => void;
}

const ContentTypeSelector: FC<ContentTypeSelectorProps> = ({ onSelect, onSelectArticleSubtype }) => {
  // Handler for GTM Narrative Piece selection
  const handleArticleSelection = () => {
    onSelect('article');
  };

  return (
    <Card className="w-full bg-white shadow-md border border-gray-100">
      <CardHeader>
        <CardTitle className="text-brand-primary font-sora text-2xl">What would you like to create?</CardTitle>
        <CardDescription>Select a content type to begin crafting your message</CardDescription>
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
            <span className="text-sm text-gray-500 text-center">
              Create a full, structured article with 
              high resonance and deep structure
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-brand-primary transition-all card-hover"
            onClick={() => onSelect('email')}
          >
            <Mail className="h-8 w-8 text-brand-primary" />
            <span className="text-lg font-medium font-sora">Sales Email</span>
            <span className="text-sm text-gray-500 text-center">
              Craft a compelling sales email 
              using simplified workflow
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-brand-primary transition-all card-hover"
            onClick={() => onSelect('linkedin')}
          >
            <MessageSquare className="h-8 w-8 text-brand-primary" />
            <span className="text-lg font-medium font-sora">LinkedIn Post</span>
            <span className="text-sm text-gray-500 text-center">
              Create engaging social media content 
              for professional audiences
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-brand-primary transition-all card-hover"
            onClick={() => onSelect('custom')}
          >
            <Settings className="h-8 w-8 text-brand-primary" />
            <span className="text-lg font-medium font-sora">Custom</span>
            <span className="text-sm text-gray-500 text-center">
              Create a custom GTM narrative piece 
              in your unique voice
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-brand-primary transition-all card-hover"
            onClick={() => onSelect('generate-ideas')}
          >
            <Lightbulb className="h-8 w-8 text-brand-primary" />
            <span className="text-lg font-medium font-sora">Generate New Narrative Ideas</span>
            <span className="text-sm text-gray-500 text-center">
              Generate resonant, compelling 
              GTM narrative ideas
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentTypeSelector;
