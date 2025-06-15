
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader } from 'lucide-react';

interface GenerateNewIdeasCTAProps {
  onGenerateNewIdeas: () => void;
  isGenerating?: boolean;
}

const GenerateNewIdeasCTA: FC<GenerateNewIdeasCTAProps> = ({ 
  onGenerateNewIdeas, 
  isGenerating = false 
}) => {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 shadow-sm">
      <CardContent className="p-8 text-center">
        <h4 className="text-lg font-medium text-gray-800 mb-2">Need More Ideas?</h4>
        <p className="text-gray-600 mb-6 font-light">Auto-craft a fresh batch of Product-Led Storytelling ideas with different angles and perspectives.</p>
        <Button 
          onClick={onGenerateNewIdeas}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm"
          size="lg"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader className="h-5 w-5 mr-2 animate-spin" />
              Minting Fresh Product-Led Ideas
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5 mr-2" />
              Mint New, Product-Led Ideas
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GenerateNewIdeasCTA;
