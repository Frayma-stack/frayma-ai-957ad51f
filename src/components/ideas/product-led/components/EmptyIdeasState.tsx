
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';

interface EmptyIdeasStateProps {
  onGenerateNewIdeas: () => void;
}

const EmptyIdeasState: FC<EmptyIdeasStateProps> = ({ onGenerateNewIdeas }) => {
  return (
    <Card className="p-8 text-center">
      <CardContent>
        <p className="text-gray-500 mb-4">No valid ideas were found in the generated content.</p>
        <Button onClick={onGenerateNewIdeas} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
          <RefreshCw className="h-4 w-4 mr-2" />
          Mint Fresh Ideas
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyIdeasState;
