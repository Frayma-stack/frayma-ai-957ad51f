
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import SavedIdeas from './SavedIdeas';
import TwoSidedIdeaGenerator from './TwoSidedIdeaGenerator';
import { GeneratedIdea } from '@/types/ideas';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { ScrollArea } from "@/components/ui/scroll-area";

interface IdeasBankProps {
  scripts: ICPStoryScript[];
  productContext: ProductContext | null;
  ideas: GeneratedIdea[];
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onIdeaUpdated: (idea: GeneratedIdea) => void;
  onIdeaDeleted: (ideaId: string) => void;
  selectedClientId?: string;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
}

const IdeasBank = ({
  scripts,
  productContext,
  ideas,
  onIdeaAdded,
  onIdeaUpdated,
  onIdeaDeleted,
  selectedClientId,
  onContentTypeSelect
}: IdeasBankProps) => {
  const [activeTab, setActiveTab] = useState<string>('saved');

  console.log('💡 IdeasBank render:', {
    selectedClientId,
    ideasCount: ideas.length,
    scriptsCount: scripts.length,
    productContext: productContext?.name || 'none',
    activeTab
  });

  // Filter ideas to only show those for the selected client
  const filteredIdeas = selectedClientId 
    ? ideas.filter(idea => idea.clientId === selectedClientId)
    : [];

  // Enhanced idea handler to ensure client association
  const handleIdeaAdded = (idea: GeneratedIdea) => {
    console.log('💡 IdeasBank: Adding idea with client association:', { ideaId: idea.id, selectedClientId });
    const ideaWithClient = {
      ...idea,
      clientId: selectedClientId
    };
    onIdeaAdded(ideaWithClient);
  };

  const handleAddManualIdea = () => {
    console.log('💡 IdeasBank: Manual add idea triggered, switching to generate tab');
    setActiveTab('generate');
  };

  // Don't show if no client is selected
  if (!selectedClientId) {
    return (
      <div className="p-6">
        <Card className="w-full bg-white shadow-md">
          <CardContent className="p-8 text-center">
            <Users className="mx-auto h-12 w-12 opacity-30 mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Client</h3>
            <p className="text-gray-500 opacity-70">
              Please select a client from the sidebar to view and manage their Ideas Bank.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="w-full h-full flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="saved">
              Saved Ideas ({filteredIdeas.length})
            </TabsTrigger>
            <TabsTrigger value="generate">
              Mint New Ideas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved" className="mt-6 flex-1">
            <ScrollArea className="h-[calc(100vh-250px)]">
              <SavedIdeas 
                ideas={filteredIdeas} 
                scripts={scripts}
                onIdeaUpdated={onIdeaUpdated}
                onIdeaDeleted={onIdeaDeleted}
                onAddManualIdea={handleAddManualIdea}
                onContentTypeSelect={onContentTypeSelect}
              />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="generate" className="mt-6 flex-1">
            <ScrollArea className="h-[calc(100vh-250px)]">
              <TwoSidedIdeaGenerator 
                icpScripts={scripts}
                productContext={productContext}
                onIdeaAdded={handleIdeaAdded}
                onContentTypeSelect={onContentTypeSelect}
                selectedClientId={selectedClientId}
                ideas={filteredIdeas}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IdeasBank;
