
import { useState, useCallback } from 'react';
import { ProductCampaignAssetType } from '@/types/productCampaignPrompts';
import { getProductCampaignPrompt, interpolateProductCampaignPrompt } from '@/components/product-campaign/prompts';
import { useChatGPT } from '@/contexts/ChatGPTContext';

export const useProductCampaignPrompts = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const { generateContent } = useChatGPT();

  const generateOutline = useCallback(async (
    assetType: ProductCampaignAssetType,
    variables: Record<string, any>
  ): Promise<string> => {
    setIsGenerating(true);
    
    try {
      const promptTemplate = getProductCampaignPrompt(assetType, 'outline');
      
      if (!promptTemplate) {
        throw new Error(`No outline prompt found for asset type: ${assetType}`);
      }

      const interpolatedPrompt = interpolateProductCampaignPrompt(
        promptTemplate.template,
        variables
      );

      console.log(`🎯 Generating outline for ${assetType}:`, {
        promptLength: interpolatedPrompt.length,
        variables: Object.keys(variables)
      });

      const outline = await generateContent(interpolatedPrompt, {
        maxTokens: 3000,
        temperature: 0.7
      });

      const outlineKey = `${assetType}_outline`;
      setGeneratedContent(prev => ({
        ...prev,
        [outlineKey]: outline
      }));

      return outline;
    } catch (error) {
      console.error(`Error generating outline for ${assetType}:`, error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [generateContent]);

  const generateFinalDraft = useCallback(async (
    assetType: ProductCampaignAssetType,
    variables: Record<string, any>,
    approvedOutline: string
  ): Promise<string> => {
    setIsGenerating(true);
    
    try {
      const promptTemplate = getProductCampaignPrompt(assetType, 'final_draft');
      
      if (!promptTemplate) {
        throw new Error(`No final draft prompt found for asset type: ${assetType}`);
      }

      // Include the approved outline in variables
      const enhancedVariables = {
        ...variables,
        approvedOutline
      };

      const interpolatedPrompt = interpolateProductCampaignPrompt(
        promptTemplate.template,
        enhancedVariables
      );

      console.log(`🎯 Generating final draft for ${assetType}:`, {
        promptLength: interpolatedPrompt.length,
        hasOutline: Boolean(approvedOutline),
        variables: Object.keys(enhancedVariables)
      });

      const finalDraft = await generateContent(interpolatedPrompt, {
        maxTokens: 4000,
        temperature: 0.6
      });

      const draftKey = `${assetType}_draft`;
      setGeneratedContent(prev => ({
        ...prev,
        [draftKey]: finalDraft
      }));

      return finalDraft;
    } catch (error) {
      console.error(`Error generating final draft for ${assetType}:`, error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [generateContent]);

  const generateBulkOutlines = useCallback(async (
    assetTypes: ProductCampaignAssetType[],
    variables: Record<string, any>
  ): Promise<Record<string, string>> => {
    setIsGenerating(true);
    const results: Record<string, string> = {};
    
    try {
      // Generate outlines sequentially to avoid API rate limits
      for (const assetType of assetTypes) {
        console.log(`🎯 Generating outline for ${assetType}...`);
        const outline = await generateOutline(assetType, variables);
        results[assetType] = outline;
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      return results;
    } catch (error) {
      console.error('Error generating bulk outlines:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [generateOutline]);

  const generateBulkFinalDrafts = useCallback(async (
    assetOutlines: Record<string, string>,
    variables: Record<string, any>
  ): Promise<Record<string, string>> => {
    setIsGenerating(true);
    const results: Record<string, string> = {};
    
    try {
      // Generate final drafts sequentially
      for (const [assetType, outline] of Object.entries(assetOutlines)) {
        console.log(`🎯 Generating final draft for ${assetType}...`);
        const finalDraft = await generateFinalDraft(
          assetType as ProductCampaignAssetType,
          variables,
          outline
        );
        results[assetType] = finalDraft;
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      return results;
    } catch (error) {
      console.error('Error generating bulk final drafts:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [generateFinalDraft]);

  const clearGeneratedContent = useCallback(() => {
    setGeneratedContent({});
  }, []);

  return {
    isGenerating,
    generatedContent,
    generateOutline,
    generateFinalDraft,
    generateBulkOutlines,
    generateBulkFinalDrafts,
    clearGeneratedContent
  };
};
