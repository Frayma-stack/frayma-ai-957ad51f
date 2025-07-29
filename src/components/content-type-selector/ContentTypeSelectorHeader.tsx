
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const ContentTypeSelectorHeader: React.FC = () => {
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
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome, {getFirstName()}
        </h2>
        <p className="text-base text-gray-700">
          What GTM asset do you need help auto-crafting?
        </p>
      </CardContent>
    </Card>
  );
};

export default ContentTypeSelectorHeader;
