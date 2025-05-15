
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import StoryForm, { StoryDetails } from '@/components/StoryForm';
import StoryPreview from '@/components/StoryPreview';
import PromptGuide from '@/components/PromptGuide';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

const Index = () => {
  const [storyDetails, setStoryDetails] = useState<StoryDetails | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-story-cream">
      <NavBar />
      
      <div className="container mx-auto py-8 px-4 flex-1">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-story-blue mb-2">StoryCraft</h1>
          <p className="text-xl text-gray-700 mb-4">Craft compelling narratives that sell without feeling like sales</p>
          <div className="inline-flex items-center bg-story-sand/50 p-3 rounded-md text-gray-700">
            <Info className="h-5 w-5 mr-2 text-story-blue" />
            <p>Fill in your product details, follow the story prompts, and customize your narrative</p>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StoryForm onStoryDetailsChange={setStoryDetails} />
          <PromptGuide storyDetails={storyDetails} />
        </div>
        
        <div className="mb-8">
          <StoryPreview storyDetails={storyDetails} />
        </div>
        
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">StoryCraft helps you tell authentic stories about your products and services</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
