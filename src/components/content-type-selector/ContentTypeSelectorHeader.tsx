
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ContentTypeSelectorHeaderProps {
  onNavigateToIdeasBank: () => void;
}

const ContentTypeSelectorHeader: React.FC<ContentTypeSelectorHeaderProps> = ({
  onNavigateToIdeasBank
}) => {
  const { user } = useAuth();
  
  // Extract first name from user email or display name
  const getFirstName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user?.email) {
      // Extract name before @ symbol and capitalize
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return 'there';
  };

  return (
    <div className="space-y-6">
      {/* Greeting Card */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {getFirstName()}
          </h2>
          <p className="text-base text-gray-700 mb-1">
            What GTM asset do you need help auto-crafting?
          </p>
          <p className="text-sm text-gray-500">
            Choose or start from a Saved Idea below.
          </p>
        </CardContent>
      </Card>

      {/* Mint New Ideas Section */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-700">
          Frame thoughts into sharp POVs and freshly-minted GTM asset ideas...
        </p>
        <Button 
          onClick={onNavigateToIdeasBank}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Mint New Ideas
        </Button>
      </div>
    </div>
  );
};

export default ContentTypeSelectorHeader;
