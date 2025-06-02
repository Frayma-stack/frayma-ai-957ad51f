
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';

interface GenerateNewIdeasCTAProps {
  onGenerateNewIdeas: () => void;
}

const GenerateNewIdeasCTA: FC<GenerateNewIdeasCTAProps> = ({ onGenerateNewIdeas }) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300">
      <CardContent className="p-8 text-center">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Need More Ideas?</h4>
        <p className="text-gray-600 mb-4">Auto-craft a fresh batch of Product-Led Storytelling ideas with different angles and perspectives.</p>
        <Button 
          onClick={onGenerateNewIdeas}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white"
          size="lg"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Mint Fresh Ideas
        </Button>
      </CardContent>
    </Card>
  );
};

export default GenerateNewIdeasCTA;
