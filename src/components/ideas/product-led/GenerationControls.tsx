
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
    <Card className="border-0 shadow-sm">
      <CardContent className="pt-6">
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm"
          onClick={onGenerateIdeas}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Generating Fresh Ideas...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate New Ideas
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GenerationControls;
