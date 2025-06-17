import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OnboardingProgress {
  id: string;
  user_id: string;
  email: string;
  current_step: number;
  completed_steps: number[];
  client_created: boolean;
  author_created: boolean;
  icp_script_created: boolean;
  onboarding_completed: boolean;
  subscription_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useOnboardingProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProgress = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Convert Json type to number[] for completed_steps
        const transformedData: OnboardingProgress = {
          ...data,
          completed_steps: Array.isArray(data.completed_steps) ? data.completed_steps as number[] : []
        };
        setProgress(transformedData);
      } else {
        setProgress(null);
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
      toast.error('Failed to load onboarding progress');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (updates: Partial<OnboardingProgress>) => {
    if (!user || !progress) return;

    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Convert Json type to number[] for completed_steps
      const transformedData: OnboardingProgress = {
        ...data,
        completed_steps: Array.isArray(data.completed_steps) ? data.completed_steps as number[] : []
      };
      setProgress(transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error updating onboarding progress:', error);
      toast.error('Failed to update progress');
      throw error;
    }
  };

  const completeStep = async (stepNumber: number) => {
    if (!progress) return;

    const completedSteps = [...(progress.completed_steps || [])];
    if (!completedSteps.includes(stepNumber)) {
      completedSteps.push(stepNumber);
    }

    const nextStep = Math.max(progress.current_step, stepNumber + 1);

    return updateProgress({
      current_step: nextStep,
      completed_steps: completedSteps
    });
  };

  const markClientCreated = async () => {
    return updateProgress({ client_created: true });
  };

  const markAuthorCreated = async () => {
    return updateProgress({ author_created: true });
  };

  const markICPScriptCreated = async () => {
    return updateProgress({ icp_script_created: true });
  };

  const markSubscriptionCompleted = async () => {
    return updateProgress({ subscription_completed: true });
  };

  const completeOnboarding = async () => {
    return updateProgress({
      onboarding_completed: true,
      current_step: 8 // Final step
    });
  };

  const canAccessStep = (stepNumber: number): boolean => {
    if (!progress) return false;
    
    // Can always access current step or completed steps
    if (stepNumber <= progress.current_step) return true;
    
    // Can access next step if current requirements are met
    if (stepNumber === progress.current_step + 1) {
      return progress.completed_steps?.includes(progress.current_step) || false;
    }
    
    return false;
  };

  const isStepCompleted = (stepNumber: number): boolean => {
    return progress?.completed_steps?.includes(stepNumber) || false;
  };

  useEffect(() => {
    loadProgress();
  }, [user]);

  return {
    progress,
    loading,
    loadProgress,
    updateProgress,
    completeStep,
    markClientCreated,
    markAuthorCreated,
    markICPScriptCreated,
    markSubscriptionCompleted,
    completeOnboarding,
    canAccessStep,
    isStepCompleted
  };
};
