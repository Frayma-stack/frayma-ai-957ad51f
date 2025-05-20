
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, HelpCircle, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePerplexity } from "@/contexts/PerplexityContext";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

const NavBar: FC = () => {
  const { apiKey, setApiKey, isConfigured } = usePerplexity();
  const [tempApiKey, setTempApiKey] = useState(apiKey === "YOUR_API_KEY_HERE" ? "" : apiKey);
  const { toast } = useToast();
  
  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    toast({
      title: "API Key Saved",
      description: "Your Perplexity API key has been saved successfully."
    });
  };

  return (
    <nav className="bg-story-blue text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span className="text-xl font-semibold">Frayma AI</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-story-light-blue">
                <Settings className="h-5 w-5 mr-2" />
                API Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>API Configuration</DialogTitle>
                <DialogDescription>
                  Enter your Perplexity API key to enable automatic extraction of success stories from URLs.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="apiKey" className="text-sm font-medium">
                    Perplexity API Key
                  </label>
                  <div className="flex gap-2">
                    <Input 
                      id="apiKey"
                      type="password"
                      value={tempApiKey} 
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="flex-1"
                    />
                    <Button onClick={handleSaveApiKey}>Save</Button>
                  </div>
                </div>
                <div className={`px-3 py-2 rounded-md text-sm ${isConfigured ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`}>
                  <p className="font-medium">{isConfigured ? "API Key Configured" : "API Key Not Configured"}</p>
                  <p className="text-xs mt-1">
                    {isConfigured 
                      ? "URL extraction is enabled." 
                      : "Without a valid API key, you won't be able to automatically extract information from URLs."}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="ghost" className="text-white hover:bg-story-light-blue">
            <HelpCircle className="h-5 w-5 mr-2" />
            How it works
          </Button>
          <Button className="bg-story-sand text-story-blue hover:bg-story-sand/90">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
