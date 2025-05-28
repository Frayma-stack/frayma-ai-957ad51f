
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Loader2 } from "lucide-react";
import { Client, ProductContext } from '@/types/storytelling';
import { useToast } from "@/hooks/use-toast";
import { useClientAnalysis } from '@/hooks/useClientAnalysis';

interface OnboardingStepClientProps {
  onClientAdded: (client: Client, productContext?: ProductContext) => void;
  onNext: () => void;
}

const OnboardingStepClient: FC<OnboardingStepClientProps> = ({
  onClientAdded,
  onNext,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { analyzeClient } = useClientAnalysis();

  const handleCreateClient = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Client name is required",
        variant: "destructive"
      });
      return;
    }

    const client: Client = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      companyLinks: websiteUrl ? [{ type: 'website' as const, url: websiteUrl }] : [],
      createdAt: new Date().toISOString()
    };

    let productContext: ProductContext | undefined;

    // If website URL is provided, try to analyze it
    if (websiteUrl.trim()) {
      setIsAnalyzing(true);
      try {
        await analyzeClient([{ type: 'website', url: websiteUrl }], name, (analyzedContext) => {
          productContext = {
            id: crypto.randomUUID(),
            categoryPOV: analyzedContext.categoryPOV || '',
            companyMission: analyzedContext.companyMission || '',
            uniqueInsight: analyzedContext.uniqueInsight || '',
            features: analyzedContext.features || [],
            useCases: analyzedContext.useCases || [],
            differentiators: analyzedContext.differentiators || [],
            companyLinks: client.companyLinks,
            clientId: client.id
          };
        });
      } catch (error) {
        console.error('Analysis failed:', error);
        toast({
          title: "Analysis Failed",
          description: "Proceeding without analysis. You can add product context later.",
          variant: "destructive"
        });
      } finally {
        setIsAnalyzing(false);
      }
    }

    onClientAdded(client, productContext);
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Building className="h-5 w-5 text-story-blue" />
          <CardTitle>Add Your Business</CardTitle>
        </div>
        <CardDescription>
          Tell us about your company or client. This could be your own business or a client you're creating content for.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="client-name">Business/Client Name *</Label>
          <Input
            id="client-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Acme Corp, My Startup"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="client-description">Brief Description</Label>
          <Textarea
            id="client-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this business do? (optional)"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="website-url">Website URL</Label>
          <Input
            id="website-url"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://example.com (optional - enables auto-analysis)"
          />
        </div>

        <Button 
          onClick={handleCreateClient}
          disabled={!name.trim() || isAnalyzing}
          className="w-full bg-story-blue hover:bg-story-light-blue"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing & Creating...
            </>
          ) : (
            'Create Business Profile'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OnboardingStepClient;
