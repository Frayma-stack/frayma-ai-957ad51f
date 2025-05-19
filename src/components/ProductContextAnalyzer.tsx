
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator, CompanyLink } from '@/types/storytelling';
import { Loader2, ExternalLink, Plus, Trash } from 'lucide-react';

interface ProductContextAnalyzerProps {
  companyLinks: CompanyLink[];
  onClose: () => void;
  onAnalysisComplete: (results: Partial<ProductContext>) => void;
}

const ProductContextAnalyzer: FC<ProductContextAnalyzerProps> = ({ 
  companyLinks, 
  onClose,
  onAnalysisComplete
}) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [additionalUrls, setAdditionalUrls] = useState('');
  
  const handleAnalyze = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Collect all URLs
      const companyWebsites = companyLinks
        .filter(link => link.type === 'website' && link.url.trim() !== '')
        .map(link => link.url);
      
      const linkedinUrls = companyLinks
        .filter(link => link.type === 'linkedin' && link.url.trim() !== '')
        .map(link => link.url);
      
      const otherUrls = [...companyLinks
        .filter(link => link.type === 'other' && link.url.trim() !== '')
        .map(link => link.url)];
      
      // Add any manually entered URLs
      if (additionalUrls.trim()) {
        additionalUrls.split('\n')
          .map(url => url.trim())
          .filter(url => url !== '')
          .forEach(url => otherUrls.push(url));
      }
      
      const allUrls = [...companyWebsites, ...linkedinUrls, ...otherUrls];
      
      if (allUrls.length === 0) {
        toast({
          title: "No URLs to analyze",
          description: "Please provide at least one company website or LinkedIn URL.",
          variant: "destructive"
        });
        setIsAnalyzing(false);
        return;
      }
      
      // Format the prompt for Perplexity
      const prompt = `Visit the company website and LinkedIn urls: ${allUrls.join(', ')} and extract a summary of the company, their features, solutions, and use cases. For each of these, name each use case, feature, and solution, and add a succinct summary of each in about five sentences under the names. Format the output as a JSON object with these fields: 
      {
        "companyMission": "The company's mission statement or purpose",
        "categoryPOV": "The company's perspective on their industry or product category",
        "uniqueInsight": "What makes this company unique in their space",
        "features": [
          {
            "name": "Feature name",
            "benefits": ["Benefit 1", "Benefit 2"]
          }
        ],
        "useCases": [
          {
            "useCase": "Use case name",
            "userRole": "Target user for this use case",
            "description": "Description of the use case"
          }
        ],
        "differentiators": [
          {
            "name": "Differentiator name",
            "description": "Description of this differentiator",
            "competitorComparison": "How this compares to competitors"
          }
        ]
      }`;
      
      // Call Perplexity API
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at analyzing company websites and LinkedIn profiles. Extract information in the format requested.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 3000,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error from Perplexity API: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error('Invalid response format from Perplexity API');
      }
      
      // Extract JSON from the response
      const content = data.choices[0].message.content;
      let jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/);
      let parsedData;
      
      if (jsonMatch) {
        try {
          parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } catch (e) {
          console.error('Failed to parse JSON from response:', e);
          throw new Error('Failed to parse analysis results');
        }
      } else {
        throw new Error('Could not find JSON in the API response');
      }
      
      // Transform the data to match our expected format
      const transformedData: Partial<ProductContext> = {
        companyMission: parsedData.companyMission || '',
        categoryPOV: parsedData.categoryPOV || '',
        uniqueInsight: parsedData.uniqueInsight || '',
        features: (parsedData.features || []).map((feature: any) => ({
          id: crypto.randomUUID(),
          name: feature.name || '',
          benefits: feature.benefits || ['']
        } as ProductFeature)),
        useCases: (parsedData.useCases || []).map((useCase: any) => ({
          id: crypto.randomUUID(),
          useCase: useCase.useCase || '',
          userRole: useCase.userRole || '',
          description: useCase.description || ''
        } as ProductUseCase)),
        differentiators: (parsedData.differentiators || []).map((diff: any) => ({
          id: crypto.randomUUID(),
          name: diff.name || '',
          description: diff.description || '',
          competitorComparison: diff.competitorComparison || ''
        } as ProductDifferentiator))
      };
      
      if (
        !transformedData.features?.length && 
        !transformedData.useCases?.length && 
        !transformedData.differentiators?.length && 
        !transformedData.companyMission && 
        !transformedData.categoryPOV && 
        !transformedData.uniqueInsight
      ) {
        toast({
          title: "Analysis yielded minimal results",
          description: "Limited information could be extracted from the provided URLs.",
          variant: "destructive"
        });
      } else {
        onAnalysisComplete(transformedData);
        toast({
          title: "Analysis Complete",
          description: "Company information has been extracted successfully."
        });
      }
    } catch (error) {
      console.error('Error analyzing company profile:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred while analyzing the company profile.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue">Analyze Company Profile</CardTitle>
        <CardDescription>
          Use Perplexity AI to analyze the company's online presence
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
          <p className="text-sm text-yellow-800">
            This feature uses Perplexity AI to analyze public information about the company.
            You'll need a Perplexity API key to proceed.
          </p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Perplexity API Key</label>
          <Input 
            type="password"
            placeholder="Enter your Perplexity API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Company URLs to Analyze</label>
          <div className="space-y-2">
            {companyLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="w-20 text-gray-500">{link.type}:</span>
                <div className="flex-1 truncate">{link.url}</div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild
                  className="h-6 w-6"
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Additional URLs (optional)</label>
          <textarea 
            className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Enter additional URLs (one per line)"
            value={additionalUrls}
            onChange={(e) => setAdditionalUrls(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Add links to product pages, case studies, or other content about the company.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2 border-t pt-4">
        <Button variant="outline" onClick={onClose} disabled={isAnalyzing}>
          Cancel
        </Button>
        <Button 
          className="bg-story-blue hover:bg-story-light-blue"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Company'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductContextAnalyzer;
