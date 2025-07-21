
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
      // Show browser confirmation dialog only for actual navigation/refresh
      // Don't trigger for tab switching (visibility changes)
      if (document.visibilityState !== 'hidden') {
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    const handleVisibilityChange = () => {
      // Save form state when page becomes hidden (user switches tabs)
      if (document.visibilityState === 'hidden') {
        console.log('Page visibility changed to hidden - preserving form state');
        // Store current scroll position and form state
        try {
          localStorage.setItem('app_scroll_position', window.scrollY.toString());
          localStorage.setItem('app_last_visibility_change', Date.now().toString());
        } catch (error) {
          console.warn('Failed to save scroll position:', error);
        }
      } else if (document.visibilityState === 'visible') {
        // Restore scroll position when returning to tab
        try {
          const savedScroll = localStorage.getItem('app_scroll_position');
          const lastChange = localStorage.getItem('app_last_visibility_change');
          
          // Only restore if the visibility change was recent (within 5 minutes)
          if (savedScroll && lastChange && Date.now() - parseInt(lastChange) < 300000) {
            setTimeout(() => {
              window.scrollTo(0, parseInt(savedScroll));
            }, 100);
          }
        } catch (error) {
          console.warn('Failed to restore scroll position:', error);
        }
      }
    };

    // Use both beforeunload and pagehide for better coverage
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    
    // Handle tab switching to preserve state
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, message]);

  const disableProtection = () => {
    // Remove the specific handler to disable protection
    const currentHandler = window.onbeforeunload;
    if (currentHandler) {
      window.removeEventListener('beforeunload', currentHandler as any);
      window.onbeforeunload = null;
    }
  };

  return { disableProtection };
};
