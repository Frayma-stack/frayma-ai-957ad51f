
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import BaseIdeaGenerator from './product-led/BaseIdeaGenerator';
import ManualIdeaAdder from './ManualIdeaAdder';

interface TwoSidedIdeaGeneratorProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
  selectedClientId?: string;
  ideas?: GeneratedIdea[];
}

const TwoSidedIdeaGenerator = ({
  icpScripts,
  productContext,
  onIdeaAdded,
  onContentTypeSelect,
  selectedClientId,
  ideas = []
}: TwoSidedIdeaGeneratorProps) => {
  const [activeTab, setActiveTab] = useState('ai-generation');

  return (
    <div className="w-full h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ai-generation">AI Generation</TabsTrigger>
          <TabsTrigger value="manual-entry">Manual Entry</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ai-generation" className="mt-6">
          <BaseIdeaGenerator
            icpScripts={icpScripts}
            productContext={productContext}
            onIdeaAdded={onIdeaAdded}
            onContentTypeSelect={onContentTypeSelect}
            selectedClientId={selectedClientId}
            layout="vertical"
            ideas={ideas}
          />
        </TabsContent>
        
        <TabsContent value="manual-entry" className="mt-6">
          <ManualIdeaAdder
            icpScripts={icpScripts}
            onIdeaAdded={onIdeaAdded}
            selectedClientId={selectedClientId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TwoSidedIdeaGenerator;
