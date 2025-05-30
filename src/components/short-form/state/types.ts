
export type ContentGoal = {
  type: 'book_call' | 'learn_more' | 'try_product' | 'reply' | 'visit_article';
  description: string;
};

export interface ProductContextInputs {
  selectedProductContextType: 'features' | 'usecases' | 'differentiators' | '';
  selectedFeatures: any[];
  selectedUseCases: any[];
  selectedDifferentiators: any[];
}
