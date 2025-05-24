
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, HelpCircle } from "lucide-react";

const NavBar: FC = () => {
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
