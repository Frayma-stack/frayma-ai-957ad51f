
import { PromptCategory, PromptTemplate } from './types';
import { DEFAULT_PROMPTS } from './defaultPrompts';

const STORAGE_KEY = 'gtm_prompts';

export const loadPromptsFromStorage = (): Record<PromptCategory, PromptTemplate> | null => {
  try {
    const savedPrompts = window.localStorage.getItem(STORAGE_KEY);
    return savedPrompts ? JSON.parse(savedPrompts) : null;
  } catch (error) {
    console.error('Error loading saved prompts:', error);
    return null;
  }
};

export const savePromptsToStorage = (prompts: Record<PromptCategory, PromptTemplate>): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  } catch (error) {
    console.error('Error saving prompts:', error);
  }
};

export const resetPromptsInStorage = (): void => {
  savePromptsToStorage(DEFAULT_PROMPTS);
};
