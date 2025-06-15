
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
    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-100">
      <p className="text-gray-700 font-light">
        Frame thoughts into sharp POVs and freshly-minted GTM asset ideas...
      </p>
      <Button 
        onClick={onNavigateToIdeasBank}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Mint New, Product-Led Ideas
      </Button>
    </div>
  );
};

export default MintNewIdeasSection;
