
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SavedIdeas from './SavedIdeas';
import GenerateIdeas from './GenerateIdeas';
import { GeneratedIdea } from '@/types/ideas';

interface IdeasBankProps {
  scripts: any[];
  productContext: any;
  ideas: GeneratedIdea[];
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onIdeaUpdated: (idea: GeneratedIdea) => void;
  onIdeaDeleted: (ideaId: string) => void;
}

const IdeasBank = ({
  scripts,
  productContext,
  ideas,
  onIdeaAdded,
  onIdeaUpdated,
  onIdeaDeleted
}: IdeasBankProps) => {
  const [activeTab, setActiveTab] = useState<string>('saved');

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="saved">
            Saved Ideas
          </TabsTrigger>
          <TabsTrigger value="generate">
            Generate New Ideas
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-story-sand/30 rounded-md text-sm text-gray-600">
            <p className="text-center">
              {activeTab === 'saved' ? 
                'Turn one of your saved ideas into a narrative GTM piece or post' : 
                'Generate new ideas for crafting resonant, compelling GTM narrative pieces or posts'}
            </p>
          </div>
        </div>
        
        <TabsContent value="saved" className="mt-6">
          <SavedIdeas 
            ideas={ideas} 
            scripts={scripts}
            onIdeaUpdated={onIdeaUpdated}
            onIdeaDeleted={onIdeaDeleted}
            onAddManualIdea={onIdeaAdded}
          />
        </TabsContent>
        
        <TabsContent value="generate" className="mt-6">
          <GenerateIdeas 
            productContext={productContext}
            onIdeaSaved={onIdeaAdded}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IdeasBank;
