
import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Mail, ArrowLeft } from "lucide-react";
import { ArticleSubType } from './ContentTypeSelector';
import { GeneratedIdea } from '@/types/ideas';
import IdeaSelector from './IdeaSelector';

interface ArticleTypeSelectorProps {
  onSelect: (subtype: ArticleSubType) => void;
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

      <Card className="w-full bg-white shadow-md border border-gray-100">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-brand-primary font-sora text-2xl">Choose Article Type</CardTitle>
              <CardDescription className="opacity-60">
                {selectedIdeaId ? 'Creating article based on your selected idea' : 'What type of GTM narrative piece would you like to create?'}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button 
              variant="outline" 
              className="h-auto p-8 flex flex-col items-center gap-4 hover:bg-slate-50 hover:border-brand-primary transition-all card-hover"
              onClick={() => onSelect('thought_leadership')}
            >
              <FileText className="h-12 w-12 text-brand-primary" />
              <div className="text-center">
                <span className="text-xl font-medium font-sora block mb-2">Thought Leadership</span>
                <span className="text-sm text-gray-500 opacity-70">
                  Create authoritative content that positions you as an industry expert with unique insights and perspectives
                </span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-8 flex flex-col items-center gap-4 hover:bg-slate-50 hover:border-brand-primary transition-all card-hover"
              onClick={() => onSelect('newsletter')}
            >
              <Mail className="h-12 w-12 text-brand-primary" />
              <div className="text-center">
                <span className="text-xl font-medium font-sora block mb-2">Newsletter</span>
                <span className="text-sm text-gray-500 opacity-70">
                  Craft engaging newsletter content that nurtures relationships and drives consistent engagement
                </span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleTypeSelector;
