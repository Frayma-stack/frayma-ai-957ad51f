
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface ContentTypeSelectorHeaderProps {
  onNavigateToIdeasBank: () => void;
}

const ContentTypeSelectorHeader: React.FC<ContentTypeSelectorHeaderProps> = ({
  onNavigateToIdeasBank
}) => {
  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome, [app user's first name]
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          What GTM asset do you need help auto-crafting?
        </p>
        <p className="text-md text-gray-500">
          Choose or start from a Saved Idea below.
        </p>
      </div>

      {/* Mint New Ideas Section */}
      <div>
        <p className="text-gray-600 mb-4">
          Frame thoughts into freshly-minted GTM asset ideas…
        </p>
        <Button 
          onClick={onNavigateToIdeasBank}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Mint New Ideas
        </Button>
      </div>
    </div>
  );
};

export default ContentTypeSelectorHeader;
