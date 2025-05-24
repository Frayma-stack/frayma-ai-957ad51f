
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, HelpCircle, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { usePerplexity } from "@/contexts/PerplexityContext";

const NavBar: FC = () => {
  const { isConfigured } = usePerplexity();

  return (
    <nav className="bg-brand-primary text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/c03df3aa-a5a4-4db8-8a06-910f2452d629.png" 
            alt="Frayma AI Logo" 
            className="h-8 w-8" 
          />
          <span className="text-xl font-sora font-semibold">Frayma AI</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-brand-primary/80">
                <Settings className="h-5 w-5 mr-2" />
                API Status
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-sora">API Configuration</DialogTitle>
                <DialogDescription>
                  Frayma AI uses integrated API services for content generation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className={`px-3 py-2 rounded-md text-sm ${isConfigured ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`}>
                  <p className="font-medium">{isConfigured ? "API Services Active" : "API Services Not Available"}</p>
                  <p className="text-xs mt-1">
                    {isConfigured 
                      ? "All content generation features are enabled." 
                      : "Content generation services are temporarily unavailable."}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="ghost" className="text-white hover:bg-brand-primary/80">
            <HelpCircle className="h-5 w-5 mr-2" />
            How it works
          </Button>
          <Button className="bg-brand-cta text-white hover:bg-brand-cta/90">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
