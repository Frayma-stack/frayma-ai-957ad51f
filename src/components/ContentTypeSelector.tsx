
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
  Send, 
  Settings 
} from "lucide-react";

export type ContentType = 'article' | 'email' | 'linkedin' | 'newsletter' | 'custom';

interface ContentTypeSelectorProps {
  onSelect: (type: ContentType) => void;
}

const ContentTypeSelector: FC<ContentTypeSelectorProps> = ({ onSelect }) => {
  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue">What would you like to create?</CardTitle>
        <CardDescription>Select a content type to begin crafting your message</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-story-blue transition-all"
            onClick={() => onSelect('article')}
          >
            <FileText className="h-8 w-8 text-story-blue" />
            <span className="text-lg font-medium">GTM Article</span>
            <span className="text-sm text-gray-500 text-center">
              Create a full, structured article with high resonance and deep structure
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-story-blue transition-all"
            onClick={() => onSelect('email')}
          >
            <Mail className="h-8 w-8 text-story-blue" />
            <span className="text-lg font-medium">Sales Email</span>
            <span className="text-sm text-gray-500 text-center">
              Craft a compelling sales email using simplified workflow
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-story-blue transition-all"
            onClick={() => onSelect('linkedin')}
          >
            <MessageSquare className="h-8 w-8 text-story-blue" />
            <span className="text-lg font-medium">LinkedIn Post</span>
            <span className="text-sm text-gray-500 text-center">
              Create engaging social media content for professional audiences
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-story-blue transition-all"
            onClick={() => onSelect('newsletter')}
          >
            <Send className="h-8 w-8 text-story-blue" />
            <span className="text-lg font-medium">Newsletter</span>
            <span className="text-sm text-gray-500 text-center">
              Develop a newsletter that keeps your audience engaged
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-6 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-story-blue transition-all"
            onClick={() => onSelect('custom')}
          >
            <Settings className="h-8 w-8 text-story-blue" />
            <span className="text-lg font-medium">Custom</span>
            <span className="text-sm text-gray-500 text-center">
              Advanced mode for custom content types and formats
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentTypeSelector;
