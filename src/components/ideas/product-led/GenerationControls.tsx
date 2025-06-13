
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, Sparkles } from 'lucide-react';

interface GenerationControlsProps {
  isGenerating: boolean;
  onGenerateIdeas: () => void;
}

const GenerationControls: FC<GenerationControlsProps> = ({
  isGenerating,
  onGenerateIdeas
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <Button 
          className="w-full bg-story-blue hover:bg-story-light-blue"
          onClick={onGenerateIdeas}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Minting Fresh Product-Led Ideas...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Mint New Product-Led Ideas
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GenerationControls;
