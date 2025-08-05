
import { useToast } from "@/hooks/use-toast";
import { ProductContextInputs, TriggerInput } from './types';

export const useIdeaValidation = () => {
  const { toast } = useToast();

  const validateInputs = (triggerInput: TriggerInput, productInputs: ProductContextInputs): boolean => {
    if (!triggerInput.content.trim()) {
      toast({
        title: "Missing Trigger",
        description: "Please provide a trigger/thesis to generate ideas.",
        variant: "destructive",
      });
      return false;
    }

    // Target ICP is now required
    if (!productInputs.targetICP) {
      toast({
        title: "Missing Target ICP",
        description: "Please select a Target ICP to generate ideas.",
        variant: "destructive",
      });
      return false;
    }

    // Narrative Types are now required
    if (productInputs.selectedNarrativeTypes.length === 0) {
      toast({
        title: "Missing Narrative Type",
        description: "Please select at least one narrative type to generate ideas.",
        variant: "destructive",
      });
      return false;
    }

    // Business Context Item is now required
    if (!productInputs.businessContextItem) {
      toast({
        title: "Missing Business Context Item",
        description: "Please select a Business Context Item to generate ideas.",
        variant: "destructive",
      });
      return false;
    }

    // Validate specific business context selections
    if (productInputs.businessContextItem === 'success_story' && !productInputs.selectedSuccessStory) {
      toast({
        title: "Missing Success Story",
        description: "Please select a specific success story.",
        variant: "destructive",
      });
      return false;
    }

    if (productInputs.businessContextItem === 'feature' && productInputs.selectedFeatures.length === 0) {
      toast({
        title: "Missing Features",
        description: "Please select at least one feature.",
        variant: "destructive",
      });
      return false;
    }

    if (productInputs.businessContextItem === 'use_case' && productInputs.selectedUseCases.length === 0) {
      toast({
        title: "Missing Use Cases",
        description: "Please select at least one use case.",
        variant: "destructive",
      });
      return false;
    }

    if (productInputs.businessContextItem === 'differentiator' && productInputs.selectedDifferentiators.length === 0) {
      toast({
        title: "Missing Differentiators",
        description: "Please select at least one differentiator.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validateRegenerationDirection = (regenerationDirection: string): boolean => {
    if (!regenerationDirection.trim()) {
      toast({
        title: "Missing Direction",
        description: "Please provide a new direction or angle for regeneration.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return {
    validateInputs,
    validateRegenerationDirection
  };
};
