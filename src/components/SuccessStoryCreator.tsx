
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

  if (showFlow) {
    return (
      <SuccessStoryFlowCreator
        scripts={scripts}
        successStories={successStories}
        authors={authors}
        productContext={productContext}
        onBack={() => setShowFlow(false)}
        onStoryCreated={onStoryCreated}
      />
    );
  }

  return (
    <Card className="w-full bg-white shadow-md border border-gray-100">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-brand-primary" />
          <CardTitle className="text-brand-primary font-sora">Create Success Story</CardTitle>
        </div>
        <CardDescription>
          Choose how you'd like to create your customer success story
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-brand-primary/20 hover:border-brand-primary/40 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Wand2 className="h-8 w-8 text-brand-primary" />
                <div>
                  <h3 className="font-semibold text-lg">Auto-Craft Success Story</h3>
                  <p className="text-sm text-gray-600">5-step guided flow with AI assistance</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Use our structured 5-step process to collect all necessary inputs and auto-generate 
                a compelling success story using Frayma AI's custom prompts.
              </p>
              <ul className="text-xs text-gray-600 space-y-1 mb-4">
                <li>• Story Brief (Strategic Inputs)</li>
                <li>• Narrative Anchors + Customer Voice</li>
                <li>• Implementation Journey + Assets</li>
                <li>• Outcome Metrics + Results</li>
                <li>• Auto-Crafting Enhancements</li>
              </ul>
              <Button 
                onClick={() => setShowFlow(true)}
                className="w-full bg-brand-primary hover:bg-brand-primary/90"
              >
                Start Auto-Craft Flow
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 hover:border-gray-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Trophy className="h-8 w-8 text-gray-500" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-700">Manual Entry</h3>
                  <p className="text-sm text-gray-600">Traditional form-based approach</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Create a success story using the traditional manual form with basic fields 
                for title, before/after summaries, quotes, and features.
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Note: This option uses the existing simple form interface and does not leverage 
                the new AI-powered auto-crafting capabilities.
              </p>
              <Button 
                variant="outline"
                className="w-full"
                disabled
              >
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

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
