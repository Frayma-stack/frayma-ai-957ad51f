
import { useState, useEffect, useCallback } from 'react';

interface UseFormPersistenceOptions {
  key: string;
  defaultValues: any;
  debounceMs?: number;
}

export const useFormPersistence = <T extends Record<string, any>>({
  key,
  defaultValues,
  debounceMs = 500
}: UseFormPersistenceOptions) => {
  const [values, setValues] = useState<T>(defaultValues);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted data on mount
  useEffect(() => {
    try {
      const persistedData = localStorage.getItem(`form_${key}`);
      if (persistedData) {
        const parsed = JSON.parse(persistedData);
        setValues({ ...defaultValues, ...parsed });
      }
    } catch (error) {
      console.warn(`Failed to load persisted form data for ${key}:`, error);
    }
    setIsLoaded(true);
  }, [key]);

  // Debounced save to localStorage
  useEffect(() => {
    if (!isLoaded) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(`form_${key}`, JSON.stringify(values));
      } catch (error) {
        console.warn(`Failed to persist form data for ${key}:`, error);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [values, key, debounceMs, isLoaded]);

  const updateValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  const clearPersistedData = useCallback(() => {
    try {
      localStorage.removeItem(`form_${key}`);
      setValues(defaultValues);
    } catch (error) {
      console.warn(`Failed to clear persisted form data for ${key}:`, error);
    }
  }, [key, defaultValues]);

  return {
    values,
    updateValue,
    updateValues,
    clearPersistedData,
    isLoaded
  };
};
