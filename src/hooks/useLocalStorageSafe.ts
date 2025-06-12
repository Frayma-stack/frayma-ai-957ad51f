
import { useState, useEffect } from 'react';

// Safe localStorage utilities to prevent JSON.parse errors
export const safeGetFromLocalStorage = (key: string, defaultValue: any = null) => {
  try {
    const item = localStorage.getItem(key);
    // Check for null, undefined, or string 'undefined'
    if (item === null || item === undefined || item === 'undefined' || item === 'null') {
      console.log(`📦 localStorage: Key "${key}" is null/undefined, returning default value`);
      return defaultValue;
    }
    
    // Additional check for empty string
    if (item.trim() === '') {
      console.log(`📦 localStorage: Key "${key}" is empty string, returning default value`);
      return defaultValue;
    }
    
    const parsed = JSON.parse(item);
    console.log(`📦 localStorage: Successfully parsed key "${key}"`);
    return parsed;
  } catch (error) {
    console.error(`📦 localStorage: Error parsing key "${key}":`, error);
    console.error(`📦 localStorage: Raw value was:`, localStorage.getItem(key));
    
    // Clear the corrupted value to prevent future errors
    try {
      localStorage.removeItem(key);
      console.log(`📦 localStorage: Cleared corrupted key "${key}"`);
    } catch (clearError) {
      console.error(`📦 localStorage: Failed to clear corrupted key "${key}":`, clearError);
    }
    
    return defaultValue;
  }
};

export const safeSetToLocalStorage = (key: string, value: any) => {
  try {
    // Don't store undefined values
    if (value === undefined) {
      console.warn(`📦 localStorage: Attempted to store undefined value for key "${key}", skipping`);
      return;
    }
    
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    console.log(`📦 localStorage: Successfully set key "${key}"`);
  } catch (error) {
    console.error(`📦 localStorage: Error setting key "${key}":`, error);
  }
};

export const useLocalStorageSafe = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    console.log(`📦 useLocalStorageSafe: Initializing key "${key}"`);
    return safeGetFromLocalStorage(key, initialValue);
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      console.log(`📦 useLocalStorageSafe: Setting value for key "${key}"`);
      setStoredValue(valueToStore);
      safeSetToLocalStorage(key, valueToStore);
    } catch (error) {
      console.error(`📦 useLocalStorageSafe: Error in setValue for key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};
