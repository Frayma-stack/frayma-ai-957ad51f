
export interface TriggerInput {
  type: 'text' | 'file';
  content: string;
}

export interface ProductContextInputs {
  targetICP: string;
  narrativeAnchor: 'belief' | 'pain' | 'struggle' | 'transformation';
  selectedNarrativeTypes: string[];
  selectedFeatures: any[];
  selectedUseCases: any[];
  selectedDifferentiators: any[];
  productContextType: 'features' | 'usecases' | 'differentiators' | '';
  customPOV: string;
  povNarrativeDirection: string;
}
