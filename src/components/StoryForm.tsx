
import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export interface StoryDetails {
  product: string;
  keyFeatures: string[];
  targetAudience: string;
  problem: string;
  solution: string;
  uniqueValue: string;
}

interface StoryFormProps {
  onStoryDetailsChange: (details: StoryDetails) => void;
}

const StoryForm: FC<StoryFormProps> = ({ onStoryDetailsChange }) => {
  const { toast } = useToast();
  const [storyDetails, setStoryDetails] = useState<StoryDetails>({
    product: '',
    keyFeatures: ['', '', ''],
    targetAudience: '',
    problem: '',
    solution: '',
    uniqueValue: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setStoryDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...storyDetails.keyFeatures];
    updatedFeatures[index] = value;
    setStoryDetails(prev => ({
      ...prev,
      keyFeatures: updatedFeatures
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!storyDetails.product || !storyDetails.targetAudience || !storyDetails.problem) {
      toast({
        title: "Missing information",
        description: "Please fill in the required fields to generate your story.",
        variant: "destructive"
      });
      return;
    }

    // Filter out empty features
    const updatedDetails = {
      ...storyDetails,
      keyFeatures: storyDetails.keyFeatures.filter(feature => feature.trim() !== '')
    };

    onStoryDetailsChange(updatedDetails);
    toast({
      title: "Story details updated",
      description: "Your narrative framework has been updated with your details.",
    });
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue">Your Story Details</CardTitle>
        <CardDescription>Fill in the details about your product or service to craft your narrative</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="story">Story Elements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product or Service Name*</label>
              <Input 
                placeholder="What is your product or service called?"
                value={storyDetails.product}
                onChange={(e) => handleInputChange('product', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Key Features (up to 3)</label>
              {storyDetails.keyFeatures.map((feature, index) => (
                <Input 
                  key={index}
                  placeholder={`Feature ${index + 1}`}
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="mb-2"
                />
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience*</label>
              <Input 
                placeholder="Who is your product or service for?"
                value={storyDetails.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="story" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Problem Addressed*</label>
              <Textarea 
                placeholder="What problem does your product or service solve?"
                value={storyDetails.problem}
                onChange={(e) => handleInputChange('problem', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Solution Offered</label>
              <Textarea 
                placeholder="How does your product or service solve this problem?"
                value={storyDetails.solution}
                onChange={(e) => handleInputChange('solution', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Unique Value Proposition</label>
              <Textarea 
                placeholder="What makes your solution unique or better than alternatives?"
                value={storyDetails.uniqueValue}
                onChange={(e) => handleInputChange('uniqueValue', e.target.value)}
                rows={3}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <Button 
          className="mt-6 w-full bg-story-blue hover:bg-story-light-blue"
          onClick={handleSubmit}
        >
          Update Story Framework
        </Button>
      </CardContent>
    </Card>
  );
};

export default StoryForm;
