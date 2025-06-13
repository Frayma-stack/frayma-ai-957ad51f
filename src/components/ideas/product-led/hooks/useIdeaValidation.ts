
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

    if (!productInputs.targetICP) {
      toast({
        title: "Missing Target ICP",
        description: "Please select a target ICP.",
        variant: "destructive",
      });
      return false;
    }

    if (productInputs.selectedNarrativeTypes.length === 0) {
      toast({
        title: "Missing Narrative Types",
        description: "Please select at least one narrative type.",
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
