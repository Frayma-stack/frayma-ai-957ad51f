
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ICPStoryScriptManager from '@/components/ICPStoryScriptManager';
import StoryBriefManager from '@/components/StoryBriefManager';
import EnhancedStoryPreview from '@/components/EnhancedStoryPreview';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { ICPStoryScript, StoryBrief } from '@/types/storytelling';

const Index = () => {
  const [scripts, setScripts] = useState<ICPStoryScript[]>([]);
  const [briefs, setBriefs] = useState<StoryBrief[]>([]);
  const [selectedBrief, setSelectedBrief] = useState<StoryBrief | null>(null);
  const [activeTab, setActiveTab] = useState<string>('icps');
  
  // Load data from localStorage on component mount
  useEffect(() => {
    const savedScripts = localStorage.getItem('icpScripts');
    const savedBriefs = localStorage.getItem('storyBriefs');
    
    if (savedScripts) {
      setScripts(JSON.parse(savedScripts));
    }
    
    if (savedBriefs) {
      setBriefs(JSON.parse(savedBriefs));
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('icpScripts', JSON.stringify(scripts));
  }, [scripts]);
  
  useEffect(() => {
    localStorage.setItem('storyBriefs', JSON.stringify(briefs));
  }, [briefs]);

  // Handle ICP StoryScript operations
  const handleScriptAdded = (script: ICPStoryScript) => {
    setScripts([...scripts, script]);
  };
  
  const handleScriptUpdated = (updatedScript: ICPStoryScript) => {
    setScripts(scripts.map(script => 
      script.id === updatedScript.id ? updatedScript : script
    ));
    
    // Also update any briefs that reference this script
    if (selectedBrief && selectedBrief.targetAudience === updatedScript.id) {
      setSelectedBrief({ ...selectedBrief });
    }
  };
  
  const handleScriptDeleted = (scriptId: string) => {
    setScripts(scripts.filter(script => script.id !== scriptId));
    
    // If any briefs reference this script, update them
    const affectedBriefs = briefs.filter(brief => brief.targetAudience === scriptId);
    if (affectedBriefs.length > 0) {
      // You might want to handle this situation differently
      // This approach just removes the targetAudience reference
      const updatedBriefs = briefs.map(brief => 
        brief.targetAudience === scriptId 
          ? { ...brief, targetAudience: '' } 
          : brief
      );
      setBriefs(updatedBriefs);
    }
    
    // If selected brief references this script, deselect it
    if (selectedBrief && selectedBrief.targetAudience === scriptId) {
      setSelectedBrief(null);
    }
  };
  
  // Handle StoryBrief operations
  const handleBriefAdded = (brief: StoryBrief) => {
    setBriefs([...briefs, brief]);
  };
  
  const handleBriefUpdated = (updatedBrief: StoryBrief) => {
    setBriefs(briefs.map(brief => 
      brief.id === updatedBrief.id ? updatedBrief : brief
    ));
    
    // If this is the currently selected brief, update that reference too
    if (selectedBrief && selectedBrief.id === updatedBrief.id) {
      setSelectedBrief(updatedBrief);
    }
  };
  
  const handleBriefDeleted = (briefId: string) => {
    setBriefs(briefs.filter(brief => brief.id !== briefId));
    
    // If this is the currently selected brief, deselect it
    if (selectedBrief && selectedBrief.id === briefId) {
      setSelectedBrief(null);
    }
  };
  
  const handleBriefSelected = (brief: StoryBrief) => {
    setSelectedBrief(brief);
    setActiveTab('preview');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-story-cream">
      <NavBar />
      
      <div className="container mx-auto py-8 px-4 flex-1">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-story-blue mb-2">StoryCraft</h1>
          <p className="text-xl text-gray-700 mb-4">Product-Led Storytelling Framework</p>
          <div className="inline-flex items-center bg-story-sand/50 p-3 rounded-md text-gray-700">
            <Info className="h-5 w-5 mr-2 text-story-blue" />
            <p>First define your ICPs, then create Story Briefs & Outlines to craft compelling narratives</p>
          </div>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="icps">ICP StoryScripts</TabsTrigger>
              <TabsTrigger value="briefs">Story Briefs & Outlines</TabsTrigger>
              <TabsTrigger value="preview">Story Preview</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="icps" className="space-y-6">
            <ICPStoryScriptManager 
              scripts={scripts}
              onScriptAdded={handleScriptAdded}
              onScriptUpdated={handleScriptUpdated}
              onScriptDeleted={handleScriptDeleted}
            />
            
            {scripts.length > 0 && (
              <div className="flex justify-center">
                <Button onClick={() => setActiveTab('briefs')} className="bg-story-blue hover:bg-story-light-blue">
                  Next: Create Story Briefs
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="briefs" className="space-y-6">
            <StoryBriefManager 
              briefs={briefs}
              scripts={scripts}
              onBriefAdded={handleBriefAdded}
              onBriefUpdated={handleBriefUpdated}
              onBriefDeleted={handleBriefDeleted}
              onBriefSelected={handleBriefSelected}
            />
            
            {briefs.length > 0 && (
              <div className="flex justify-center">
                <Button onClick={() => setActiveTab('preview')} className="bg-story-blue hover:bg-story-light-blue">
                  Next: Preview Your Story
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="preview">
            <EnhancedStoryPreview 
              selectedBrief={selectedBrief} 
              scripts={scripts}
            />
            
            {!selectedBrief && briefs.length > 0 && (
              <div className="text-center mt-4 text-gray-600">
                <p>Select a Story Brief from the Story Briefs tab to preview and edit your narrative</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-8 mb-8">
          <p className="text-gray-500 text-sm">StoryCraft helps you create authentic, resonant stories that sell without feeling like sales</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
