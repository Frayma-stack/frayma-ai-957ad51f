
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Wand2 } from 'lucide-react';
import { ICPStoryScript, CustomerSuccessStory, Author, ProductContext } from '@/types/storytelling';
import SuccessStoryFlowCreator from './success-stories/SuccessStoryFlowCreator';

interface SuccessStoryCreatorProps {
  scripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  authors: Author[];
  productContext: ProductContext | null;
  onBack: () => void;
  onStoryCreated: (story: CustomerSuccessStory) => void;
}

const SuccessStoryCreator: FC<SuccessStoryCreatorProps> = ({ 
  scripts,
  successStories,
  authors,
  productContext,
  onBack,
  onStoryCreated
}) => {
  const [showFlow, setShowFlow] = useState(false);

  console.log('SuccessStoryCreator rendered, showFlow:', showFlow);
  console.log('Props:', { 
    scriptsCount: scripts.length, 
    successStoriesCount: successStories.length, 
    authorsCount: authors.length, 
    hasProductContext: !!productContext 
  });

  const handleStartFlow = () => {
    console.log('Starting flow...');
    setShowFlow(true);
  };

  if (showFlow) {
    console.log('Rendering SuccessStoryFlowCreator...');
    return (
      <SuccessStoryFlowCreator
        scripts={scripts}
        successStories={successStories}
        authors={authors}
        productContext={productContext}
        onBack={() => {
          console.log('Flow back clicked, returning to main creator');
          setShowFlow(false);
        }}
        onStoryCreated={onStoryCreated}
      />
    );
  }

  console.log('Rendering main creator interface...');

  return (
    <Card className="w-full bg-white shadow-md border border-gray-100">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-brand-primary" />
          <CardTitle className="text-brand-primary font-sora">Create Success Story</CardTitle>
        </div>
        <CardDescription>
          Craft compelling customer success stories using Frayma AI's Product-Led Storytelling approach
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Auto-Craft Flow */}
        <Card className="border-2 border-brand-primary bg-gradient-to-br from-brand-primary/5 to-brand-primary/10 hover:from-brand-primary/10 hover:to-brand-primary/15 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-brand-primary rounded-lg">
                <Wand2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-brand-primary">Auto-Craft Success Story</h3>
                <p className="text-sm text-gray-600">Product-Led Storytelling with AI-powered crafting</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-3">
                Use Frayma AI's unique <strong>Product-Led Storytelling (PLS)</strong> approach with our proven 
                3Rs Formula: <em>Resonance, Relevance, Results</em>. This structured 5-step process ensures 
                your success stories truly resonate, engage, and convert.
              </p>
              
              <div className="bg-white/70 rounded-lg p-3 mb-4">
                <h4 className="font-medium text-sm text-brand-primary mb-2">5-Step Guided Process:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• <strong>Story Brief:</strong> Strategic inputs & narrative direction</li>
                  <li>• <strong>Narrative Anchors:</strong> Customer voice & resonance setup</li>
                  <li>• <strong>Implementation Journey:</strong> Features, use cases & assets</li>
                  <li>• <strong>Outcome Metrics:</strong> Results & persuasive evidence</li>
                  <li>• <strong>Auto-Crafting:</strong> AI-powered story generation</li>
                </ul>
              </div>
            </div>
            
            <Button 
              onClick={handleStartFlow}
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-medium"
              size="lg"
            >
              Start Auto-Craft Flow
              <Wand2 className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack}>
            Back to Content Types
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessStoryCreator;
