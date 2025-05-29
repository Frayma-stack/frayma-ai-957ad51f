
import { useState } from 'react';
import { AuthorSocialLink } from '@/types/storytelling';
import { buildAnalysisPrompt } from '@/utils/promptBuilder';
import { parseAnalysisContent } from '@/utils/responseParser';
import { transformAnalysisResults } from '@/utils/dataTransformer';
import { toast } from 'sonner';

export const useProfileAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeProfile = async (
    socialLinks: AuthorSocialLink[],
    additionalUrls: string,
    authorName: string,
    onAnalysisComplete: (results: any) => void
  ) => {
    setIsAnalyzing(true);
    
    try {
      // Collect all URLs
      const urls = [
        ...socialLinks.map(link => link.url).filter(url => url.trim()),
        ...additionalUrls.split('\n').map(url => url.trim()).filter(url => url)
      ];

      if (urls.length === 0) {
        toast.error('Please add at least one URL to analyze');
        return;
      }

      console.log('🔍 Starting profile analysis for:', authorName, 'with URLs:', urls);

      // Step 1: Scrape content from URLs
      let scrapedContent;
      try {
        console.log('📡 Scraping content from URLs...');
        const scrapeResponse = await fetch('https://rrltvtuuzljqkbdavzyw.supabase.co/functions/v1/scrape-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybHR2dHV1emxqcWtiZGF2enl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDg4ODIsImV4cCI6MjA2MzY4NDg4Mn0.V04fIdJirow_P0GiI6pDiA8eYClkGwL7GHlQNNDsekY'
          },
          body: JSON.stringify({ urls })
        });

        if (!scrapeResponse.ok) {
          throw new Error(`Scraping failed: ${scrapeResponse.status}`);
        }

        scrapedContent = await scrapeResponse.json();
        console.log('✅ Content scraped successfully');
      } catch (scrapeError) {
        console.log('⚠️ Content scraping failed, proceeding with limited data analysis:', scrapeError);
        toast.warning('Content extraction was limited. Proceeding with available information.');
        scrapedContent = { scrapedContent: [] };
      }

      // Step 2: Build enhanced prompt with scraped content
      const { systemPrompt, userPrompt } = buildAnalysisPrompt(urls);
      
      // Enhance the user prompt with scraped content or note the limitations
      let enhancedPrompt = userPrompt;
      if (scrapedContent?.scrapedContent && scrapedContent.scrapedContent.length > 0) {
        const contentToAnalyze = scrapedContent.scrapedContent
          .map((item: any, index: number) => {
            if (item.content && item.content.trim().length > 0) {
              return `--- Content from ${item.url} ---\n${item.content}\n`;
            } else if (item.error) {
              return `--- Error from ${item.url} ---\n${item.error}\n`;
            }
            return '';
          })
          .filter((content: string) => content.length > 0)
          .join('\n');

        if (contentToAnalyze) {
          enhancedPrompt = `${userPrompt}\n\nEXTRACTED CONTENT:\n${contentToAnalyze}`;
        } else {
          enhancedPrompt = `${userPrompt}\n\nNOTE: Content extraction was limited. Please analyze the provided URLs and make reasonable professional inferences based on:
- URL domain names and patterns
- Any available social media information
- Professional context from the URLs provided
- Author name: ${authorName}

Create a complete professional profile with reasonable assumptions.`;
        }
      } else {
        enhancedPrompt = `${userPrompt}\n\nNOTE: No content could be extracted from the provided URLs. Please make reasonable professional inferences based on:
- The URLs provided: ${urls.join(', ')}
- Author name: ${authorName}
- Create a complete professional profile with reasonable assumptions for a professional in their field.`;
      }

      console.log('🤖 Sending analysis request to AI...');

      // Step 3: Send to analysis service
      const analysisResponse = await fetch('https://rrltvtuuzljqkbdavzyw.supabase.co/functions/v1/analyze-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybHR2dHV1emxqcWtiZGF2enl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDg4ODIsImV4cCI6MjA2MzY4NDg4Mn0.V04fIdJirow_P0GiI6pDiA8eYClkGwL7GHlQNNDsekY'
        },
        body: JSON.stringify({
          systemPrompt,
          userPrompt: enhancedPrompt
        })
      });

      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text();
        console.error('❌ Analysis service error:', errorText);
        throw new Error(`Analysis failed: ${analysisResponse.status} - ${errorText}`);
      }

      const analysisData = await analysisResponse.text();
      console.log('✅ Analysis completed, raw response length:', analysisData.length);

      // Step 4: Parse and transform results
      const parsedData = parseAnalysisContent(analysisData);
      const transformedResults = transformAnalysisResults(parsedData);
      
      console.log('🎯 Analysis transformation complete:', {
        experiencesFound: transformedResults.experiences.length,
        tonesFound: transformedResults.tones.length,
        beliefsFound: transformedResults.beliefs.length,
        hasRole: !!transformedResults.currentRole,
        hasOrganization: !!transformedResults.organization
      });

      // Step 5: Notify completion
      onAnalysisComplete(transformedResults);
      toast.success(`Profile analysis completed for ${authorName}!`);

    } catch (error) {
      console.error('❌ Profile analysis failed:', error);
      
      // Provide fallback with minimal but useful data
      const fallbackResults = {
        currentRole: '',
        organization: '',
        backstory: '',
        experiences: [],
        tones: [],
        beliefs: []
      };
      
      onAnalysisComplete(fallbackResults);
      toast.error('Profile analysis encountered issues. You can manually add author information.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    analyzeProfile
  };
};
