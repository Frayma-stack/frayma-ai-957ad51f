
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Globe } from "lucide-react";
import { Client, ProductContext, CompanyLink } from '@/types/storytelling';

interface OnboardingStepClientProps {
  onClientAdded: (client: Client, productContext?: ProductContext) => void;
  onNext: () => void;
}

const OnboardingStepClient: FC<OnboardingStepClientProps> = ({
  onClientAdded,
  onNext,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [companyLinks, setCompanyLinks] = useState<CompanyLink[]>([
    { type: 'website', url: '' }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const addCompanyLink = () => {
    setCompanyLinks([
      ...companyLinks,
      { type: 'website', url: '' }
    ]);
  };

  const removeCompanyLink = (index: number) => {
    setCompanyLinks(companyLinks.filter((_, i) => i !== index));
  };

  const updateCompanyLink = (index: number, field: keyof CompanyLink, value: string) => {
    setCompanyLinks(companyLinks.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    ));
  };

  const handleAnalyze = async () => {
    if (!companyName.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate analysis (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockClient: Client = {
      id: crypto.randomUUID(),
      name: companyName.trim(),
      description: 'AI-powered content creation platform',
      companyLinks: companyLinks.filter(link => link.url.trim()),
      createdAt: new Date().toISOString()
    };

    const mockProductContext: ProductContext = {
      id: crypto.randomUUID(),
      categoryPOV: 'AI should democratize content creation for businesses of all sizes',
      companyMission: 'To empower every business to create compelling, authentic content at scale',
      uniqueInsight: 'The best content comes from understanding your audience deeply and speaking their language',
      features: [
        {
          id: crypto.randomUUID(),
          name: 'AI Content Generation',
          benefits: ['Save time', 'Consistent quality', 'Scalable output']
        },
        {
          id: crypto.randomUUID(),
          name: 'Audience Analysis',
          benefits: ['Deep insights', 'Personalized content', 'Better engagement']
        }
      ],
      useCases: [
        {
          id: crypto.randomUUID(),
          useCase: 'Blog Content Creation',
          userRole: 'Content Manager',
          description: 'Generate thought leadership articles that establish expertise'
        }
      ],
      differentiators: [
        {
          id: crypto.randomUUID(),
          name: 'Deep Audience Understanding',
          description: 'Goes beyond demographics to understand beliefs and motivations',
          competitorComparison: 'While others focus on keywords, we focus on psychology'
        }
      ],
      companyLinks: companyLinks.filter(link => link.url.trim())
    };

    onClientAdded(mockClient, mockProductContext);
    setIsAnalyzing(false);
    setHasAnalyzed(true);
  };

  const handleSkip = () => {
    const basicClient: Client = {
      id: crypto.randomUUID(),
      name: companyName.trim() || 'My Company',
      description: '',
      companyLinks: [],
      createdAt: new Date().toISOString()
    };
    
    onClientAdded(basicClient);
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label>Company Name *</Label>
            <Input
              placeholder="Enter your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div>
            <Label>Company Links</Label>
            <p className="text-sm text-gray-600 mb-3">
              Add links to help us understand your business, products, and positioning
            </p>
            
            <div className="space-y-3">
              {companyLinks.map((link, index) => (
                <div key={index} className="flex space-x-2">
                  <select
                    value={link.type}
                    onChange={(e) => updateCompanyLink(index, 'type', e.target.value)}
                    className="px-3 py-2 border rounded-md w-32"
                  >
                    <option value="website">Website</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="about">About Page</option>
                    <option value="other">Other</option>
                  </select>
                  
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Globe className="h-4 w-4" />
                    </div>
                    <Input
                      placeholder="Enter URL"
                      value={link.url}
                      onChange={(e) => updateCompanyLink(index, 'url', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {companyLinks.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCompanyLink(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={addCompanyLink}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasAnalyzed && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <p className="text-green-800 font-medium">
              🚀 Excellent! We've analyzed your company and extracted your unique value proposition, 
              key features, and market positioning. This will help create content that truly represents your brand.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex space-x-3">
        <Button
          onClick={handleAnalyze}
          disabled={!companyName.trim() || isAnalyzing || hasAnalyzed}
          className="flex-1 bg-story-blue hover:bg-story-light-blue"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Company...
            </>
          ) : hasAnalyzed ? (
            'Analysis Complete ✓'
          ) : (
            'Analyze My Company'
          )}
        </Button>
        
        {hasAnalyzed && (
          <Button onClick={onNext} className="flex-1">
            Continue
          </Button>
        )}
        
        <Button variant="outline" onClick={handleSkip}>
          Skip
        </Button>
      </div>
    </div>
  );
};

export default OnboardingStepClient;
