
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
import { AuthorSocialLink, AuthorExperience, AuthorToneItem } from '@/types/storytelling';
import { Loader2, ExternalLink } from 'lucide-react';

interface ProfileAnalyzerProps {
  socialLinks: AuthorSocialLink[];
  onClose: () => void;
  onAnalysisComplete: (results: {
    experiences?: AuthorExperience[],
    tones?: AuthorToneItem[]
  }) => void;
}

const ProfileAnalyzer: FC<ProfileAnalyzerProps> = ({ 
  socialLinks, 
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
      const linkedinUrls = socialLinks
        .filter(link => link.type === 'linkedin' && link.url.trim() !== '')
        .map(link => link.url);
      
      const otherUrls = [...socialLinks
        .filter(link => link.type !== 'linkedin' && link.url.trim() !== '')
        .map(link => link.url)];
      
      // Add any manually entered URLs
      if (additionalUrls.trim()) {
        additionalUrls.split('\n')
          .map(url => url.trim())
          .filter(url => url !== '')
          .forEach(url => otherUrls.push(url));
      }
      
      if (linkedinUrls.length === 0 && otherUrls.length === 0) {
        toast({
          title: "No URLs to analyze",
          description: "Please provide at least one LinkedIn profile or other URL.",
          variant: "destructive"
        });
        setIsAnalyzing(false);
        return;
      }
      
      // Format the prompt for Perplexity
      let prompt = "";
      if (linkedinUrls.length > 0) {
        prompt += `Visit the last 20 posts on ${linkedinUrls.length > 1 ? 'these LinkedIn profiles' : 'this LinkedIn profile'}: ${linkedinUrls.join(', ')}`;
      }
      
      if (otherUrls.length > 0) {
        if (prompt) prompt += " and ";
        prompt += `the following urls: ${otherUrls.join(', ')}`;
      }
      
      prompt += " and create a summary of their experiences and their writing tones. Then give each experience and tone a name and a succinct summary of each in five sentences or less. Format the output as a JSON object with two arrays: 'experiences' (with fields 'title' and 'description') and 'tones' (with fields 'tone' and 'description').";
      
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
              content: 'You are an expert at analyzing professional profiles and content. Extract information in the format requested.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 2000,
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
      const experiences: AuthorExperience[] = (parsedData.experiences || []).map((exp: any) => ({
        id: crypto.randomUUID(),
        title: exp.title || '',
        description: exp.description || ''
      }));
      
      const tones: AuthorToneItem[] = (parsedData.tones || []).map((tone: any) => ({
        id: crypto.randomUUID(),
        tone: tone.tone || '',
        description: tone.description || ''
      }));
      
      if (experiences.length === 0 && tones.length === 0) {
        toast({
          title: "Analysis yielded no results",
          description: "No experiences or tones could be extracted from the provided URLs.",
          variant: "warning"
        });
      } else {
        onAnalysisComplete({
          experiences: experiences.length > 0 ? experiences : undefined,
          tones: tones.length > 0 ? tones : undefined
        });
      }
    } catch (error) {
      console.error('Error analyzing profile:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred while analyzing the profile.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue">Analyze Author's Online Presence</CardTitle>
        <CardDescription>
          Use Perplexity AI to analyze the author's LinkedIn profile and other online content
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
          <p className="text-sm text-yellow-800">
            This feature uses Perplexity AI to analyze public information about the author.
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
          <label className="text-sm font-medium">LinkedIn and Other URLs to Analyze</label>
          <div className="space-y-2">
            {socialLinks.map((link, index) => (
              <div key={link.id} className="flex items-center gap-2 text-sm">
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
            Add links to blog posts, articles, or other content written by the author.
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
            'Analyze Profile'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileAnalyzer;
