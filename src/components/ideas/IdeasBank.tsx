
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import SavedIdeas from './SavedIdeas';
import ProductLedIdeaGenerator from './ProductLedIdeaGenerator';
import { GeneratedIdea } from '@/types/ideas';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';

interface IdeasBankProps {
  scripts: ICPStoryScript[];
  productContext: ProductContext | null;
  ideas: GeneratedIdea[];
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onIdeaUpdated: (idea: GeneratedIdea) => void;
  onIdeaDeleted: (ideaId: string) => void;
  selectedClientId?: string;
}

const IdeasBank = ({
  scripts,
  productContext,
  ideas,
  onIdeaAdded,
  onIdeaUpdated,
  onIdeaDeleted,
  selectedClientId
}: IdeasBankProps) => {
  const [activeTab, setActiveTab] = useState<string>('saved');

  // Filter ideas to only show those for the selected client
  const filteredIdeas = selectedClientId 
    ? ideas.filter(idea => idea.clientId === selectedClientId)
    : [];

  // Enhanced idea handler to ensure client association
  const handleIdeaAdded = (idea: GeneratedIdea) => {
    const ideaWithClient = {
      ...idea,
      clientId: selectedClientId
    };
    onIdeaAdded(ideaWithClient);
  };

  // Don't show if no client is selected
  if (!selectedClientId) {
    return (
      <Card className="w-full bg-white shadow-md">
        <CardContent className="p-8 text-center">
          <Users className="mx-auto h-12 w-12 opacity-30 mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Client</h3>
          <p className="text-gray-500">
            Please select a client from the sidebar to view and manage their Ideas Bank.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="saved">
            Saved Ideas ({filteredIdeas.length})
          </TabsTrigger>
          <TabsTrigger value="generate">
            Mint New Ideas
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-story-sand/30 rounded-md text-sm text-gray-600">
            <p className="text-center">
              {activeTab === 'saved' ? 
                'Turn one of your saved ideas into a resonant GTM narrative piece or post' : 
                'Generate Product-Led Storytelling ideas that subtly weave in product value through compelling narratives'}
            </p>
          </div>
        </div>
        
        <TabsContent value="saved" className="mt-6">
          <SavedIdeas 
            ideas={filteredIdeas} 
            scripts={scripts}
            onIdeaUpdated={onIdeaUpdated}
            onIdeaDeleted={onIdeaDeleted}
            onAddManualIdea={handleIdeaAdded}
          />
        </TabsContent>
        
        <TabsContent value="generate" className="mt-6">
          <ProductLedIdeaGenerator 
            icpScripts={scripts}
            productContext={productContext}
            onIdeaAdded={handleIdeaAdded}
            selectedClientId={selectedClientId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IdeasBank;
