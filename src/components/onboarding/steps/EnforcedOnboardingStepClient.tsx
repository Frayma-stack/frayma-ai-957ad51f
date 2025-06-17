
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Sparkles } from "lucide-react";
import { Client, ProductContext } from '@/types/storytelling';
import EnhancedClientDialog from '@/components/EnhancedClientDialog';

interface EnforcedOnboardingStepClientProps {
  onClientAdded: (client: Client, productContext?: ProductContext) => void;
}

const EnforcedOnboardingStepClient: FC<EnforcedOnboardingStepClientProps> = ({
  onClientAdded,
}) => {
  const [dialogOpen, setDialogOpen] = useState(true);

  const handleClientCreated = (client: Client, productContext?: ProductContext) => {
    setDialogOpen(false);
    onClientAdded(client, productContext);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Building className="h-6 w-6 text-story-blue" />
          <CardTitle>Set Up Your Business</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-blue-800">Frayma AI Business Analysis</h4>
          </div>
          <p className="text-blue-700 text-sm">
            Provide your business information so Frayma AI can understand your unique value proposition, 
            product features, and market position to generate highly relevant content.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Required Information:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Company name and description</li>
            <li>• Website URL for analysis</li>
            <li>• LinkedIn company page</li>
            <li>• About page or additional URLs</li>
            <li>• Product features and differentiators</li>
            <li>• Use cases and target market</li>
          </ul>
        </div>

        <EnhancedClientDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onClientCreated={handleClientCreated}
        />
      </CardContent>
    </Card>
  );
};

export default EnforcedOnboardingStepClient;
