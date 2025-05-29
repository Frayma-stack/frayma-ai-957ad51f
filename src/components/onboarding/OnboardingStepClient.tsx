
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Sparkles, Edit } from "lucide-react";
import { Client, ProductContext } from '@/types/storytelling';
import EnhancedClientDialog from '@/components/EnhancedClientDialog';

interface OnboardingStepClientProps {
  onClientAdded: (client: Client, productContext?: ProductContext) => void;
  onNext: () => void;
}

const OnboardingStepClient: FC<OnboardingStepClientProps> = ({
  onClientAdded,
  onNext,
}) => {
  const [hasCreatedClient, setHasCreatedClient] = useState(false);
  const [createdClient, setCreatedClient] = useState<Client | null>(null);
  const [createdProductContext, setCreatedProductContext] = useState<ProductContext | null>(null);
  const [showEditMode, setShowEditMode] = useState(false);

  const handleClientCreated = (client: Client, productContext?: ProductContext) => {
    console.log('🏢 Client created in onboarding:', client.name);
    setCreatedClient(client);
    setCreatedProductContext(productContext || null);
    setHasCreatedClient(true);
    setShowEditMode(false);
    onClientAdded(client, productContext);
  };

  const handleNext = () => {
    if (!hasCreatedClient) return;
    onNext();
  };

  const handleEditClient = () => {
    setShowEditMode(true);
  };

  if (showEditMode) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-story-blue" />
            <CardTitle>Edit Business Information</CardTitle>
          </div>
          <CardDescription>
            Refine the business analysis created by the Frayma AI Narrative Engine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedClientDialog
            open={true}
            onOpenChange={() => setShowEditMode(false)}
            onClientAdded={handleClientCreated}
            initialClient={createdClient}
            initialProductContext={createdProductContext}
          />
        </CardContent>
      </Card>
    );
  }

  if (hasCreatedClient && createdClient) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-story-blue" />
              <CardTitle>Business Profile Created!</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={handleEditClient}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Business
            </Button>
          </div>
          <CardDescription>
            The Frayma AI Narrative Engine has analyzed your business. Review the insights below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-blue-800">Frayma AI Business Analysis</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-blue-700">Company:</span> {createdClient.name}
              </div>
              {createdClient.description && (
                <div>
                  <span className="font-medium text-blue-700">Description:</span> {createdClient.description}
                </div>
              )}
              {createdProductContext && (
                <>
                  {createdProductContext.features && createdProductContext.features.length > 0 && (
                    <div>
                      <span className="font-medium text-blue-700">Key Features:</span>
                      <ul className="mt-1 ml-4 list-disc">
                        {createdProductContext.features.slice(0, 3).map((feature) => (
                          <li key={feature.id} className="text-blue-600">{feature.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {createdProductContext.differentiators && createdProductContext.differentiators.length > 0 && (
                    <div>
                      <span className="font-medium text-blue-700">Differentiators:</span>
                      <ul className="mt-1 ml-4 list-disc">
                        {createdProductContext.differentiators.slice(0, 2).map((diff) => (
                          <li key={diff.id} className="text-blue-600">{diff.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <Button 
            onClick={handleNext}
            className="w-full bg-story-blue hover:bg-story-light-blue"
          >
            Continue to Audience Definition
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Building className="h-5 w-5 text-story-blue" />
          <CardTitle>Define Your Business</CardTitle>
        </div>
        <CardDescription>
          Let the Frayma AI Narrative Engine analyze your business to understand your unique value proposition and market position.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EnhancedClientDialog
          open={true}
          onOpenChange={() => {}}
          onClientAdded={handleClientCreated}
        />
      </CardContent>
    </Card>
  );
};

export default OnboardingStepClient;
