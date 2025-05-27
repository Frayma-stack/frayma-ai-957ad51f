
import { Json } from '@/integrations/supabase/types';
import { 
  CompanyLink, 
  AuthorExperience, 
  AuthorToneItem, 
  AuthorBelief, 
  AuthorSocialLink,
  ICPStoryScriptItem,
  ProductFeature,
  ProductUseCase,
  ProductDifferentiator
} from '@/types/storytelling';

// Safe type conversion utilities for Supabase Json types

export const convertToCompanyLinks = (data: Json | null): CompanyLink[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item: any): boolean => 
    typeof item === 'object' && 
    item !== null && 
    typeof item.type === 'string' && 
    typeof item.url === 'string'
  ).map((item: any) => item as CompanyLink);
};

export const convertToAuthorExperiences = (data: Json | null): AuthorExperience[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item: any): boolean => 
    typeof item === 'object' && 
    item !== null && 
    typeof item.id === 'string' && 
    typeof item.title === 'string' && 
    typeof item.description === 'string'
  ).map((item: any) => item as AuthorExperience);
};

export const convertToAuthorTones = (data: Json | null): AuthorToneItem[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item: any): boolean => 
    typeof item === 'object' && 
    item !== null && 
    typeof item.id === 'string' && 
    typeof item.tone === 'string' && 
    typeof item.description === 'string'
  ).map((item: any) => item as AuthorToneItem);
};

export const convertToAuthorBeliefs = (data: Json | null): AuthorBelief[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item: any): boolean => 
    typeof item === 'object' && 
    item !== null && 
    typeof item.id === 'string' && 
    typeof item.belief === 'string' && 
    typeof item.description === 'string'
  ).map((item: any) => item as AuthorBelief);
};

export const convertToAuthorSocialLinks = (data: Json | null): AuthorSocialLink[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item: any): boolean => 
    typeof item === 'object' && 
    item !== null && 
    typeof item.id === 'string' && 
    typeof item.type === 'string' && 
    typeof item.url === 'string'
  ).map((item: any) => item as AuthorSocialLink);
};

export const convertToICPStoryScriptItems = (data: Json | null): ICPStoryScriptItem[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item: any): boolean => 
    typeof item === 'object' && 
    item !== null && 
    typeof item.id === 'string' && 
    typeof item.content === 'string'
  ).map((item: any) => item as ICPStoryScriptItem);
};

export const convertToProductFeatures = (data: Json | null): ProductFeature[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item: any): boolean => 
    typeof item === 'object' && 
    item !== null && 
    typeof item.id === 'string' && 
    typeof item.name === 'string'
  ).map((item: any) => item as ProductFeature);
};

export const convertToProductUseCases = (data: Json | null): ProductUseCase[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item: any): boolean => 
    typeof item === 'object' && 
    item !== null && 
    typeof item.id === 'string' && 
    typeof item.useCase === 'string'
  ).map((item: any) => item as ProductUseCase);
};

export const convertToProductDifferentiators = (data: Json | null): ProductDifferentiator[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item: any): boolean => 
    typeof item === 'object' && 
    item !== null && 
    typeof item.id === 'string' && 
    typeof item.name === 'string'
  ).map((item: any) => item as ProductDifferentiator);
};

// Convert from our types to Json for Supabase
export const convertFromCompanyLinks = (links: CompanyLink[]): Json => {
  return links as unknown as Json;
};

export const convertFromAuthorExperiences = (experiences: AuthorExperience[]): Json => {
  return experiences as unknown as Json;
};

export const convertFromAuthorTones = (tones: AuthorToneItem[]): Json => {
  return tones as unknown as Json;
};

export const convertFromAuthorBeliefs = (beliefs: AuthorBelief[]): Json => {
  return beliefs as unknown as Json;
};

export const convertFromAuthorSocialLinks = (links: AuthorSocialLink[]): Json => {
  return links as unknown as Json;
};

export const convertFromICPStoryScriptItems = (items: ICPStoryScriptItem[]): Json => {
  return items as unknown as Json;
};

export const convertFromProductFeatures = (features: ProductFeature[]): Json => {
  return features as unknown as Json;
};

export const convertFromProductUseCases = (useCases: ProductUseCase[]): Json => {
  return useCases as unknown as Json;
};

export const convertFromProductDifferentiators = (differentiators: ProductDifferentiator[]): Json => {
  return differentiators as unknown as Json;
};
