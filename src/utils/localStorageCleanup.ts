
import { safeGetFromLocalStorage } from '@/hooks/useLocalStorageSafe';

export const cleanupLocalStorage = () => {
  console.log('🧹 Starting comprehensive localStorage cleanup...');
  
  // Get all localStorage keys
  const keys = Object.keys(localStorage);
  let cleanedCount = 0;
  
  keys.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      console.log(`🧹 Checking localStorage key: "${key}", value: "${value}", type: ${typeof value}`);
      
      // Check for problematic values - be more comprehensive
      if (
        value === 'undefined' || 
        value === 'null' || 
        value === '' ||
        value === null ||
        value === undefined
      ) {
        console.log(`🧹 Removing corrupted localStorage key: "${key}" with value: "${value}"`);
        localStorage.removeItem(key);
        cleanedCount++;
        return;
      }
      
      // Try to parse the value to ensure it's valid JSON
      if (value && typeof value === 'string') {
        const trimmedValue = value.trim();
        
        // Additional checks for edge cases
        if (trimmedValue === 'undefined' || trimmedValue === 'null' || trimmedValue === '') {
          console.log(`🧹 Removing localStorage key with invalid trimmed content: "${key}" -> "${trimmedValue}"`);
          localStorage.removeItem(key);
          cleanedCount++;
          return;
        }
        
        // Test JSON parsing
        JSON.parse(trimmedValue);
        console.log(`🧹 Key "${key}" passed JSON validation`);
      }
    } catch (error) {
      console.log(`🧹 Removing corrupted localStorage key: "${key}" due to JSON parse error:`, error);
      localStorage.removeItem(key);
      cleanedCount++;
    }
  });
  
  console.log(`🧹 localStorage cleanup complete. Cleaned ${cleanedCount} corrupted entries.`);
  
  // Log remaining keys for debugging
  const remainingKeys = Object.keys(localStorage);
  console.log(`🧹 Remaining localStorage keys after cleanup:`, remainingKeys);
  remainingKeys.forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`🧹 Key "${key}": "${value}" (${typeof value})`);
  });
};

// Additional utility to force clean specific problematic patterns
export const forceCleanProblematicEntries = () => {
  console.log('🧹 Force cleaning problematic localStorage entries...');
  
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    const value = localStorage.getItem(key);
    if (typeof value === 'string' && (
      value.includes('"undefined"') ||
      value === 'undefined' ||
      value.trim() === 'undefined'
    )) {
      console.log(`🧹 Force removing problematic key: "${key}" with value: "${value}"`);
      localStorage.removeItem(key);
    }
  });
};
