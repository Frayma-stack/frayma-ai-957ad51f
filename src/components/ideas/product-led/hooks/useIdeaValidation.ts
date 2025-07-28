
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

    // Business Context is now optional - AI will auto-map if not provided
    // Only validate if user has started filling out some fields
    if (productInputs.targetICP && productInputs.selectedNarrativeTypes.length === 0) {
      toast({
        title: "Incomplete Manual Mapping",
        description: "If you select an ICP, please also select at least one narrative type, or clear the ICP selection to use auto-mapping.",
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
