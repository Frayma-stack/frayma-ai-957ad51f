
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, HelpCircle } from "lucide-react";

const NavBar: FC = () => {
  return (
    <nav className="bg-story-blue text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span className="text-xl font-semibold">StoryCraft</span>
        </div>
        
        <div className="flex items-center space-x-4">
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
