import { useState } from 'react';
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { useSuccessStoryPromptConfig } from './useSuccessStoryPromptConfig';
import { SuccessStoryFlowData } from './useSuccessStoryFlowData';
import { Author, ProductContext } from '@/types/storytelling';
import { SuccessStoryPromptCategory } from '@/types/successStoryPrompts';

export interface GenerationOptions {
  wordCount?: number;
  customInstructions?: string;
}

export const useSuccessStoryGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const { generateContent } = useChatGPT();
  const { generatePromptWithVariables } = useSuccessStoryPromptConfig();

  const prepareVariables = (
    formData: SuccessStoryFlowData,
    author?: Author,
    productContext?: ProductContext | null
  ): Record<string, string> => {
    return {
      PROFILED_CUSTOMER_NAME: formData.profiledCustomerName,
      PROFILED_CUSTOMER_URL: formData.profiledCustomerUrl,
      CUSTOMER_INDUSTRY: formData.customerIndustry,
      COMPANY_SIZE: formData.customerCompanySize,
      MAIN_PROBLEM_CHALLENGE: formData.mainProblem,
      MOST_SIGNIFICANT_TRANSFORMATION_OUTCOME: formData.significantTransformation,
      ADDITIONAL_OUTCOME_01: formData.additionalOutcome01,
      ADDITIONAL_OUTCOME_02: formData.additionalOutcome02,
      ADDITIONAL_OUTCOME_03: formData.additionalOutcome03,
      TARGET_ICP_01: formData.targetIcp01,
      TARGET_ICP_02: formData.targetIcp02,
      CORE_MESSAGE: formData.coreMessage,
      NARRATIVE_POV: formData.narrativePov,
      CHAMPION_USER_01_ROLE_QUOTE: `${formData.championRole01}: "${formData.customerQuote01}"`,
      CHAMPION_USER_02_ROLE_QUOTE: `${formData.championRole02}: "${formData.customerQuote02}"`,
      CHAMPION_USER_03_ROLE_QUOTE: `${formData.championRole03}: "${formData.customerQuote03}"`,
      PAIN_POINT_NARRATIVE: formData.painPointFraming,
      BEFORE_SOLUTION: formData.priorTools,
      TRIGGER: formData.triggerForChange,
      WHY_THIS_PRODUCT: formData.keyDecisionFactors,
      ROLL_OUT_PERIOD: formData.implementationTimeline,
      FEATURE_01_DETAILS: `${formData.feature01}: ${formData.feature01Description}`,
      FEATURE_02_DETAILS: `${formData.feature02}: ${formData.feature02Description}`,
      FEATURE_03_DETAILS: `${formData.feature03}: ${formData.feature03Description}`,
      USE_CASE_01_DETAILS: `${formData.useCase01}: ${formData.useCase01Description}`,
      USE_CASE_02_DETAILS: `${formData.useCase02}: ${formData.useCase02Description}`,
      KPI_SHIFT_DATA: formData.beforeAfterMetrics,
      UNEXPECTED_WIN_01: formData.unexpectedWin01,
      UNEXPECTED_WIN_02: formData.unexpectedWin02,
      UNEXPECTED_WIN_03: formData.unexpectedWin03,
      ENDORSEMENT_QUOTE_01: formData.endorsementQuote01,
      ENDORSEMENT_QUOTE_02: formData.endorsementQuote02,
      ENDORSEMENT_QUOTE_03: formData.endorsementQuote03,
      CTA_TO_READER: formData.ctaToReader,
      FINAL_NUDGE_TEXT: formData.finalNudgingMessage,
      AUTHOR_NAME: author?.name || '',
      AUTHOR_ROLE: author?.role || '',
      AUTHOR_WRITING_TONE: formData.writingTone,
      AUTHOR_CREDIBILITY_01: formData.credibility01,
      AUTHOR_CREDIBILITY_02: formData.credibility02,
      AUTHOR_CREDIBILITY_03: formData.credibility03,
      PRODUCT_DIFFERENTIATOR: formData.productDifferentiator
    };
  };

  const generateHeadlineAndOutline = async (
    formData: SuccessStoryFlowData,
    author?: Author,
    productContext?: ProductContext | null,
    options?: GenerationOptions
  ): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      const variables = prepareVariables(formData, author, productContext);
      const prompt = generatePromptWithVariables('headline_outline_generation', variables);

      const content = await generateContent(prompt, {
        maxTokens: 2000,
        temperature: 0.7
      });

      setGeneratedContent(prev => ({ ...prev, headlineOutline: content }));
      return content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate headline and outline';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateIntroduction = async (
    formData: SuccessStoryFlowData,
    author?: Author,
    productContext?: ProductContext | null,
    selectedHeadline?: string,
    firstH2?: string,
    firstH3?: string,
    options?: GenerationOptions
  ): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      const variables = {
        ...prepareVariables(formData, author, productContext),
        SELECTED_HEADLINE: selectedHeadline || '',
        FIRST_H2: firstH2 || '',
        FIRST_H3: firstH3 || '',
        USER_SPECIFIED_WORD_COUNT: options?.wordCount?.toString() || '400-600',
        OPTIONAL_CONTEXT: options?.customInstructions || ''
      };

      const prompt = generatePromptWithVariables('intro_first_section', variables);

      const content = await generateContent(prompt, {
        maxTokens: 1500,
        temperature: 0.7
      });

      setGeneratedContent(prev => ({ ...prev, introduction: content }));
      return content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate introduction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const recraftIntroduction = async (
    formData: SuccessStoryFlowData,
    author?: Author,
    productContext?: ProductContext | null,
    newDirection?: string,
    selectedHeadline?: string,
    firstH2?: string,
    firstH3?: string,
    options?: GenerationOptions
  ): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      const variables = {
        ...prepareVariables(formData, author, productContext),
        NEW_USER_PROVIDED_DIRECTION: newDirection || '',
        FINAL_HEADLINE: selectedHeadline || '',
        FIRST_H2: firstH2 || '',
        FIRST_H3: firstH3 || '',
        USER_SPECIFIED_RANGE: options?.wordCount?.toString() || '400-600'
      };

      const prompt = generatePromptWithVariables('intro_recrafting', variables);

      const content = await generateContent(prompt, {
        maxTokens: 1500,
        temperature: 0.7
      });

      setGeneratedContent(prev => ({ ...prev, introduction: content }));
      return content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to recraft introduction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBodySection = async (
    formData: SuccessStoryFlowData,
    author?: Author,
    productContext?: ProductContext | null,
    previousSections?: {
      headline?: string;
      outline?: string;
      introduction?: string;
    },
    options?: GenerationOptions
  ): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      const variables = {
        ...prepareVariables(formData, author, productContext),
        USER_DEFINED_WORD_COUNT: options?.wordCount?.toString() || '600-800',
        HEADLINE: previousSections?.headline || '',
        RELEVANCE_PHASE_OUTLINE: previousSections?.outline || '',
        INTRO_FIRST_H2_H3_CONTENT: previousSections?.introduction || ''
      };

      const prompt = generatePromptWithVariables('body_sections', variables);

      const content = await generateContent(prompt, {
        maxTokens: 2000,
        temperature: 0.7
      });

      setGeneratedContent(prev => ({ ...prev, body: content }));
      return content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate body section';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const recraftBodySection = async (
    formData: SuccessStoryFlowData,
    author?: Author,
    productContext?: ProductContext | null,
    newDirection?: string,
    previousSections?: {
      headline?: string;
      introduction?: string;
    },
    options?: GenerationOptions
  ): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      const variables = {
        ...prepareVariables(formData, author, productContext),
        UPDATED_WORD_COUNT: options?.wordCount?.toString() || '600-800',
        USER_PROVIDED_CONTEXT_POV_NARRATIVE: newDirection || '',
        HEADLINE: previousSections?.headline || '',
        PREVIOUS_SECTION: previousSections?.introduction || ''
      };

      // Note: Using body_sections category for recrafting as well
      const prompt = generatePromptWithVariables('body_sections', variables);

      const content = await generateContent(prompt, {
        maxTokens: 2000,
        temperature: 0.7
      });

      setGeneratedContent(prev => ({ ...prev, body: content }));
      return content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to recraft body section';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateConclusion = async (
    formData: SuccessStoryFlowData,
    author?: Author,
    productContext?: ProductContext | null,
    previousSections?: {
      headline?: string;
      outline?: string;
      introduction?: string;
      body?: string;
    },
    options?: GenerationOptions
  ): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      const variables = {
        ...prepareVariables(formData, author, productContext),
        DESIRED_WORD_COUNT: options?.wordCount?.toString() || '400-600',
        APPROVED_HEADLINE: previousSections?.headline || '',
        APPROVED_OUTLINE: previousSections?.outline || '',
        CRAFTED_INTRO_SECTION: previousSections?.introduction || '',
        CRAFTED_MAIN_BODY: previousSections?.body || ''
      };

      const prompt = generatePromptWithVariables('conclusion_generation', variables);

      const content = await generateContent(prompt, {
        maxTokens: 1500,
        temperature: 0.7
      });

      setGeneratedContent(prev => ({ ...prev, conclusion: content }));
      return content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate conclusion';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const recraftConclusion = async (
    formData: SuccessStoryFlowData,
    author?: Author,
    productContext?: ProductContext | null,
    newDirection?: string,
    previousSections?: {
      headline?: string;
      outline?: string;
      introduction?: string;
      body?: string;
    },
    options?: GenerationOptions
  ): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      const variables = {
        ...prepareVariables(formData, author, productContext),
        USER_PROVIDED_ADDITIONAL_CONTEXT_OR_DIRECTION: newDirection || '',
        DESIRED_WORD_COUNT: options?.wordCount?.toString() || '400-600',
        APPROVED_HEADLINE: previousSections?.headline || '',
        APPROVED_OUTLINE: previousSections?.outline || '',
        APPROVED_INTRO_SECTION: previousSections?.introduction || '',
        APPROVED_MAIN_BODY: previousSections?.body || ''
      };

      const prompt = generatePromptWithVariables('conclusion_generation', variables);

      const content = await generateContent(prompt, {
        maxTokens: 1500,
        temperature: 0.7
      });

      setGeneratedContent(prev => ({ ...prev, conclusion: content }));
      return content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to recraft conclusion';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatedContent,
    error,
    generateHeadlineAndOutline,
    generateIntroduction,
    recraftIntroduction,
    generateBodySection,
    recraftBodySection,
    generateConclusion,
    recraftConclusion,
    setError
  };
};
