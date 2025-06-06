
import { useState, useEffect } from 'react';

// Safe localStorage utilities to prevent JSON.parse errors
export const safeGetFromLocalStorage = (key: string, defaultValue: any = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined || item === 'undefined') {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error parsing localStorage item "${key}":`, error);
    return defaultValue;
  }
};

export const safeSetToLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage item "${key}":`, error);
  }
};

export const useLocalStorageSafe = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return safeGetFromLocalStorage(key, initialValue);
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      safeSetToLocalStorage(key, valueToStore);
    } catch (error) {
      console.error(`Error in useLocalStorageSafe for key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};
