import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FC, createContext, useContext, useState, useEffect } from "react";

interface OnboardingContextType {
  isOnboarding: boolean;
  currentStep: number;
  totalSteps: number;
  startOnboarding: () => void;
  nextStep: () => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: FC<OnboardingProviderProps> = ({
  children,
}) => {
  const { user, getProfile, updateProfile } = useAuth();

  const [isOnboarding, setIsOnboarding] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  useEffect(() => {
    // Start onboarding if user hasn't completed it and has no data
    getProfile(user.email).then(({ hasCompletedOnboarding }) => {
      if (!hasCompletedOnboarding) setIsOnboarding(true);
    });
  }, [user]);

  const startOnboarding = () => {
    setIsOnboarding(true);
    setCurrentStep(1);
  };

  const nextStep = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    setIsOnboarding(false);
    await updateProfile(user.email, {
      hasCompletedOnboarding: true,
    });
  };

  const skipOnboarding = async () => {
    setIsOnboarding(false);
    await updateProfile(user.email, {
      hasCompletedOnboarding: true,
    });
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarding,
        currentStep,
        totalSteps,
        startOnboarding,
        nextStep,
        completeOnboarding,
        skipOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
