
import { useState } from 'react';

export interface SuccessStoryFlowData {
  // Step 1: Story Brief (Strategic Inputs)
  customerName: string;
  profiledCustomerName: string;
  profiledCustomerUrl: string;
  mainProblem: string;
  significantTransformation: string;
  additionalOutcome01: string;
  additionalOutcome02: string;
  additionalOutcome03: string;
  targetIcp01: string;
  targetIcp02: string;
  coreMessage: string;

  // Step 2: Narrative Anchors + Customer Voice
  customerIndustry: string;
  customerCompanySize: string;
  championRole01: string;
  customerQuote01: string;
  championRole02: string;
  customerQuote02: string;
  championRole03: string;
  customerQuote03: string;
  painPointFraming: string;

  // Step 3: Implementation Journey + Assets
  priorTools: string;
  triggerForChange: string;
  keyDecisionFactors: string;
  implementationTimeline: string;
  feature01: string;
  feature01Description: string;
  feature01Visuals: string[];
  feature02: string;
  feature02Description: string;
  feature02Visuals: string[];
  feature03: string;
  feature03Description: string;
  feature03Visuals: string[];
  useCase01: string;
  useCase01Description: string;
  useCase01Visuals: string[];
  useCase02: string;
  useCase02Description: string;
  useCase02Visuals: string[];

  // Step 4: Outcome Metrics + Persuasive Close
  beforeAfterMetrics: string;
  unexpectedWin01: string;
  unexpectedWin02: string;
  unexpectedWin03: string;
  endorsementQuote01: string;
  endorsementQuote02: string;
  endorsementQuote03: string;
  ctaToReader: string;
  finalNudgingMessage: string;

  // Step 5: Auto-Crafting Enhancements
  selectedAuthor: string;
  writingTone: string;
  credibility01: string;
  credibility02: string;
  credibility03: string;
  narrativePov: string;
  productDifferentiator: string;
}

export const useSuccessStoryFlowData = () => {
  const [formData, setFormData] = useState<SuccessStoryFlowData>({
    // Step 1
    customerName: '',
    profiledCustomerName: '',
    profiledCustomerUrl: '',
    mainProblem: '',
    significantTransformation: '',
    additionalOutcome01: '',
    additionalOutcome02: '',
    additionalOutcome03: '',
    targetIcp01: '',
    targetIcp02: '',
    coreMessage: '',

    // Step 2
    customerIndustry: '',
    customerCompanySize: '',
    championRole01: '',
    customerQuote01: '',
    championRole02: '',
    customerQuote02: '',
    championRole03: '',
    customerQuote03: '',
    painPointFraming: '',

    // Step 3
    priorTools: '',
    triggerForChange: '',
    keyDecisionFactors: '',
    implementationTimeline: '',
    feature01: '',
    feature01Description: '',
    feature01Visuals: [],
    feature02: '',
    feature02Description: '',
    feature02Visuals: [],
    feature03: '',
    feature03Description: '',
    feature03Visuals: [],
    useCase01: '',
    useCase01Description: '',
    useCase01Visuals: [],
    useCase02: '',
    useCase02Description: '',
    useCase02Visuals: [],

    // Step 4
    beforeAfterMetrics: '',
    unexpectedWin01: '',
    unexpectedWin02: '',
    unexpectedWin03: '',
    endorsementQuote01: '',
    endorsementQuote02: '',
    endorsementQuote03: '',
    ctaToReader: '',
    finalNudgingMessage: '',

    // Step 5
    selectedAuthor: '',
    writingTone: '',
    credibility01: '',
    credibility02: '',
    credibility03: '',
    narrativePov: '',
    productDifferentiator: ''
  });

  const handleInputChange = (field: keyof SuccessStoryFlowData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.profiledCustomerName && formData.mainProblem && formData.significantTransformation && formData.targetIcp01);
      case 2:
        return !!(formData.customerIndustry && formData.championRole01 && formData.customerQuote01 && formData.painPointFraming);
      case 3:
        return !!(formData.priorTools && formData.triggerForChange && formData.feature01 && formData.useCase01);
      case 4:
        return !!(formData.beforeAfterMetrics && formData.endorsementQuote01 && formData.ctaToReader);
      case 5:
        return !!(formData.selectedAuthor && formData.writingTone && formData.narrativePov);
      default:
        return false;
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      profiledCustomerName: '',
      profiledCustomerUrl: '',
      mainProblem: '',
      significantTransformation: '',
      additionalOutcome01: '',
      additionalOutcome02: '',
      additionalOutcome03: '',
      targetIcp01: '',
      targetIcp02: '',
      coreMessage: '',
      customerIndustry: '',
      customerCompanySize: '',
      championRole01: '',
      customerQuote01: '',
      championRole02: '',
      customerQuote02: '',
      championRole03: '',
      customerQuote03: '',
      painPointFraming: '',
      priorTools: '',
      triggerForChange: '',
      keyDecisionFactors: '',
      implementationTimeline: '',
      feature01: '',
      feature01Description: '',
      feature01Visuals: [],
      feature02: '',
      feature02Description: '',
      feature02Visuals: [],
      feature03: '',
      feature03Description: '',
      feature03Visuals: [],
      useCase01: '',
      useCase01Description: '',
      useCase01Visuals: [],
      useCase02: '',
      useCase02Description: '',
      useCase02Visuals: [],
      beforeAfterMetrics: '',
      unexpectedWin01: '',
      unexpectedWin02: '',
      unexpectedWin03: '',
      endorsementQuote01: '',
      endorsementQuote02: '',
      endorsementQuote03: '',
      ctaToReader: '',
      finalNudgingMessage: '',
      selectedAuthor: '',
      writingTone: '',
      credibility01: '',
      credibility02: '',
      credibility03: '',
      narrativePov: '',
      productDifferentiator: ''
    });
  };

  return {
    formData,
    handleInputChange,
    canProceedFromStep,
    resetForm
  };
};
