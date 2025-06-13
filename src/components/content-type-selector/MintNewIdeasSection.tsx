
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface MintNewIdeasSectionProps {
  onNavigateToIdeasBank: () => void;
}

const MintNewIdeasSection: React.FC<MintNewIdeasSectionProps> = ({
  onNavigateToIdeasBank
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-gray-700">
        Frame thoughts into sharp POVs and freshly-minted GTM asset ideas...
      </p>
      <Button 
        onClick={onNavigateToIdeasBank}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Mint New Product-Led Ideas
      </Button>
    </div>
  );
};

export default MintNewIdeasSection;
