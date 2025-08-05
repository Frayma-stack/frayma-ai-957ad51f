
export interface TriggerInput {
  type: 'text' | 'file';
  content: string;
  fileName?: string;
  fileDescription?: string;
}

export interface ProductContextInputs {
  targetICP: string;
  narrativeAnchor: 'belief' | 'pain' | 'struggle' | 'transformation';
  selectedNarrativeTypes: string[];
  businessContextItem: 'category_pov' | 'unique_insight' | 'mission_vision' | 'success_story' | 'feature' | 'use_case' | 'differentiator' | '';
  selectedFeatures: any[];
  selectedUseCases: any[];
  selectedDifferentiators: any[];
  selectedSuccessStory: any | null;
  customPOV: string;
  povNarrativeDirection: string;
}
