
import { FC, createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboardingProgress, OnboardingProgress } from '@/hooks/useOnboardingProgress';

interface EnforcedOnboardingContextType {
  progress: OnboardingProgress | null;
  currentStep: number;
  totalSteps: number;
  isOnboardingRequired: boolean;
  canAccessStep: (step: number) => boolean;
  isStepCompleted: (step: number) => boolean;
  completeStep: (step: number) => Promise<void>;
  markClientCreated: () => Promise<void>;
  markAuthorCreated: () => Promise<void>;
  markICPScriptCreated: () => Promise<void>;
  markSubscriptionCompleted: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  loading: boolean;
}

const EnforcedOnboardingContext = createContext<EnforcedOnboardingContextType | undefined>(undefined);

export const useEnforcedOnboarding = () => {
  const context = useContext(EnforcedOnboardingContext);
  if (!context) {
    throw new Error('useEnforcedOnboarding must be used within an EnforcedOnboardingProvider');
  }
  return context;
};

interface EnforcedOnboardingProviderProps {
  children: React.ReactNode;
}

export const EnforcedOnboardingProvider: FC<EnforcedOnboardingProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const {
    progress,
    loading,
    completeStep: progressCompleteStep,
    markClientCreated: progressMarkClientCreated,
    markAuthorCreated: progressMarkAuthorCreated,
    markICPScriptCreated: progressMarkICPScriptCreated,
    markSubscriptionCompleted: progressMarkSubscriptionCompleted,
    completeOnboarding: progressCompleteOnboarding,
    canAccessStep: progressCanAccessStep,
    isStepCompleted: progressIsStepCompleted
  } = useOnboardingProgress();

  const totalSteps = 5; // Reduced from 7 - removed author step and product context
  const currentStep = progress?.current_step || 1;
  
  // Determine if onboarding is required
  const isOnboardingRequired = Boolean(
    user && 
    progress && 
    !progress.onboarding_completed
  );

  const completeStep = async (step: number) => {
    await progressCompleteStep(step);
  };

  const markClientCreated = async () => {
    await progressMarkClientCreated();
  };

  const markAuthorCreated = async () => {
    await progressMarkAuthorCreated();
  };

  const markICPScriptCreated = async () => {
    await progressMarkICPScriptCreated();
  };

  const markSubscriptionCompleted = async () => {
    await progressMarkSubscriptionCompleted();
  };

  const completeOnboarding = async () => {
    await progressCompleteOnboarding();
  };

  const canAccessStep = (step: number): boolean => {
    return progressCanAccessStep(step);
  };

  const isStepCompleted = (step: number): boolean => {
    return progressIsStepCompleted(step);
  };

  return (
    <EnforcedOnboardingContext.Provider
      value={{
        progress,
        currentStep,
        totalSteps,
        isOnboardingRequired,
        canAccessStep,
        isStepCompleted,
        completeStep,
        markClientCreated,
        markAuthorCreated,
        markICPScriptCreated,
        markSubscriptionCompleted,
        completeOnboarding,
        loading
      }}
    >
      {children}
    </EnforcedOnboardingContext.Provider>
  );
};
