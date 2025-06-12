
import { safeGetFromLocalStorage } from '@/hooks/useLocalStorageSafe';

export const cleanupLocalStorage = () => {
  console.log('🧹 Starting localStorage cleanup...');
  
  // Get all localStorage keys
  const keys = Object.keys(localStorage);
  let cleanedCount = 0;
  
  keys.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      
      // Check for problematic values
      if (value === 'undefined' || value === 'null' || value === '') {
        console.log(`🧹 Removing corrupted localStorage key: ${key} with value: ${value}`);
        localStorage.removeItem(key);
        cleanedCount++;
        return;
      }
      
      // Try to parse the value to ensure it's valid JSON
      if (value) {
        JSON.parse(value);
      }
    } catch (error) {
      console.log(`🧹 Removing corrupted localStorage key: ${key} due to JSON parse error`);
      localStorage.removeItem(key);
      cleanedCount++;
    }
  });
  
  console.log(`🧹 localStorage cleanup complete. Cleaned ${cleanedCount} corrupted entries.`);
};
