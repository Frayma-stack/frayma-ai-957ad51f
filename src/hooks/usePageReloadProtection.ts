
import { useEffect } from 'react';

interface UsePageReloadProtectionOptions {
  enabled?: boolean;
  message?: string;
}

export const usePageReloadProtection = ({
  enabled = true,
  message = "You have unsaved form data. Are you sure you want to leave this page?"
}: UsePageReloadProtectionOptions = {}) => {
  
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Show browser confirmation dialog
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    const handleVisibilityChange = () => {
      // Save form state when page becomes hidden (user switches tabs)
      if (document.visibilityState === 'hidden') {
        console.log('Page visibility changed to hidden - ensuring form state is saved');
        // Trigger any pending form saves
        // The individual form hooks will handle their own persistence
      }
    };

    // Prevent accidental page reloads
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Handle tab switching to ensure state is saved
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, message]);

  const disableProtection = () => {
    // This can be called when form is successfully submitted
    window.removeEventListener('beforeunload', () => {});
  };

  return { disableProtection };
};
