
export type ContentType = 'email' | 'linkedin' | 'custom';

export interface ProductContextInputs {
  selectedProductContextType: 'features' | 'usecases' | 'differentiators' | '';
  selectedFeatures: any[];
  selectedUseCases: any[];
  selectedDifferentiators: any[];
}

// Re-export ContentGoal from the state types to maintain consistency
export type { ContentGoal } from './state/types';
