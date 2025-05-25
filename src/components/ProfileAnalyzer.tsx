
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
import { usePerplexity } from '@/contexts/PerplexityContext';

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
  const [additionalUrls, setAdditionalUrls] = useState('');
  const { apiKey } = usePerplexity();
  
  const handleAnalyze = async () => {
    console.log('Starting analysis...');
    console.log('API key available:', !!apiKey);
    console.log('API key length:', apiKey?.length);
    
    if (!apiKey) {
      console.log('No API key found');
      toast({
        title: "Service Unavailable",
        description: "The analysis service is currently unavailable. Please try again later.",
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
      
      console.log('LinkedIn URLs:', linkedinUrls);
      console.log('Other URLs:', otherUrls);
      
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
      
      console.log('Sending prompt to Perplexity:', prompt);
      
      // Call Perplexity API with enhanced error handling
      console.log('Making fetch request to Perplexity API...');
      
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
              content: 'You are an expert at analyzing professional profiles and content. Extract information in the format requested and return valid JSON only.'
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
      
      console.log('Fetch completed. Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        
        let errorMessage = "An error occurred while analyzing the profile.";
        
        if (response.status === 401) {
          errorMessage = "Authentication failed. Please check your API configuration.";
        } else if (response.status === 429) {
          errorMessage = "Rate limit exceeded. Please try again in a few minutes.";
        } else if (response.status === 403) {
          errorMessage = "Access forbidden. Please check your API permissions.";
        } else if (response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
        
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response format from analysis service');
      }
      
      // Extract JSON from the response
      const content = data.choices[0].message.content;
      console.log('Raw content from API:', content);
      
      let jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```([\s\S]*?)```/) || content.match(/{[\s\S]*}/);
      let parsedData;
      
      if (jsonMatch) {
        try {
          const jsonString = jsonMatch[1] || jsonMatch[0];
          console.log('Extracted JSON string:', jsonString);
          parsedData = JSON.parse(jsonString);
          console.log('Parsed data:', parsedData);
        } catch (e) {
          console.error('Failed to parse JSON from response:', e);
          console.error('JSON string that failed to parse:', jsonMatch[1] || jsonMatch[0]);
          throw new Error('Failed to parse analysis results - invalid JSON format');
        }
      } else {
        console.error('Could not find JSON in response content:', content);
        throw new Error('Could not find JSON in the analysis response');
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
      
      console.log('Transformed experiences:', experiences);
      console.log('Transformed tones:', tones);
      
      if (experiences.length === 0 && tones.length === 0) {
        toast({
          title: "Analysis yielded no results",
          description: "No experiences or tones could be extracted from the provided URLs.",
          variant: "destructive"
        });
      } else {
        onAnalysisComplete({
          experiences: experiences.length > 0 ? experiences : undefined,
          tones: tones.length > 0 ? tones : undefined
        });
        toast({
          title: "Analysis complete",
          description: `Successfully extracted ${experiences.length} experiences and ${tones.length} tones.`,
        });
      }
    } catch (error) {
      console.error('Error analyzing profile:', error);
      
      let errorMessage = "An unknown error occurred while analyzing the profile.";
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = "Network error: Unable to connect to the analysis service. Please check your internet connection and try again.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue">Smart Author Profile Analysis</CardTitle>
        <CardDescription>
          Automatically extract professional experiences and writing style from online profiles to speed up author creation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">How it works:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• We analyze public content from the provided links</li>
            <li>• Extract key professional experiences and achievements</li>
            <li>• Identify unique writing tones and communication style</li>
            <li>• Auto-populate the author form to save you time</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">LinkedIn and Other URLs to Analyze</label>
          <div className="space-y-2">
            {socialLinks.map((link) => (
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
              Analyzing Profile...
            </>
          ) : (
            'Analyze & Auto-Fill'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileAnalyzer;
