
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles } from 'lucide-react';

interface GTMNarrativeHeaderProps {
  articleSubType: 'newsletter' | 'thought_leadership';
  contentPhase: 'outline' | 'intro' | 'body' | 'conclusion';
  onBack: () => void;
}

const GTMNarrativeHeader: FC<GTMNarrativeHeaderProps> = ({
  articleSubType,
  contentPhase,
  onBack
}) => {
  return (
    <CardHeader className="pb-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <CardTitle className="text-story-blue flex items-center text-lg">
            <Sparkles className="h-5 w-5 mr-2" />
            Story-Brief Your Next GTM Article
          </CardTitle>
        </div>
      </div>
    </CardHeader>
  );
};

export default GTMNarrativeHeader;
