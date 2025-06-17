
import { useState, useEffect } from 'react';

// Safe localStorage utilities to prevent JSON.parse errors
export const safeGetFromLocalStorage = (key: string, defaultValue: any = null) => {
  try {
    const item = localStorage.getItem(key);
    
    // Comprehensive check for problematic values
    if (
      item === null || 
      item === undefined || 
      item === 'undefined' || 
      item === 'null' ||
      item === '' ||
      typeof item !== 'string'
    ) {
      console.log(`📦 localStorage: Key "${key}" has problematic value: ${item}, returning default`);
      return defaultValue;
    }
    
    // Additional validation before parsing
    const trimmedItem = item.trim();
    if (trimmedItem === '' || trimmedItem === 'undefined' || trimmedItem === 'null') {
      console.log(`📦 localStorage: Key "${key}" has invalid content after trim: "${trimmedItem}", returning default`);
      // Clear the corrupted value
      try {
        localStorage.removeItem(key);
        console.log(`📦 localStorage: Cleared problematic key "${key}"`);
      } catch (clearError) {
        console.error(`📦 localStorage: Failed to clear key "${key}":`, clearError);
      }
      return defaultValue;
    }
    
    const parsed = JSON.parse(trimmedItem);
    console.log(`📦 localStorage: Successfully parsed key "${key}"`);
    return parsed;
  } catch (error) {
    console.error(`📦 localStorage: Error parsing key "${key}":`, error);
    console.error(`📦 localStorage: Raw value was:`, localStorage.getItem(key));
    console.error(`📦 localStorage: Type of raw value:`, typeof localStorage.getItem(key));
    
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
    // Prevent storing undefined or null values
    if (value === undefined) {
      console.warn(`📦 localStorage: Attempted to store undefined value for key "${key}", removing key instead`);
      localStorage.removeItem(key);
      return;
    }
    
    if (value === null) {
      console.warn(`📦 localStorage: Storing null value for key "${key}"`);
    }
    
    const stringValue = JSON.stringify(value);
    
    // Additional validation before storing
    if (stringValue === 'undefined' || stringValue === undefined) {
      console.error(`📦 localStorage: Prevented storing invalid stringified value for key "${key}": ${stringValue}`);
      localStorage.removeItem(key);
      return;
    }
    
    localStorage.setItem(key, stringValue);
    console.log(`📦 localStorage: Successfully set key "${key}" with value type:`, typeof value);
  } catch (error) {
    console.error(`📦 localStorage: Error setting key "${key}":`, error);
    console.error(`📦 localStorage: Attempted value:`, value);
    console.error(`📦 localStorage: Value type:`, typeof value);
  }
};

export const useLocalStorageSafe = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    console.log(`📦 useLocalStorageSafe: Initializing key "${key}"`);
    const retrieved = safeGetFromLocalStorage(key, initialValue);
    console.log(`📦 useLocalStorageSafe: Retrieved value for "${key}":`, retrieved, 'type:', typeof retrieved);
    return retrieved;
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      console.log(`📦 useLocalStorageSafe: Setting value for key "${key}":`, valueToStore, 'type:', typeof valueToStore);
      
      // Additional check before storing
      if (valueToStore === undefined) {
        console.warn(`📦 useLocalStorageSafe: Prevented setting undefined value for key "${key}"`);
        return;
      }
      
      setStoredValue(valueToStore);
      safeSetToLocalStorage(key, valueToStore);
    } catch (error) {
      console.error(`📦 useLocalStorageSafe: Error in setValue for key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};
