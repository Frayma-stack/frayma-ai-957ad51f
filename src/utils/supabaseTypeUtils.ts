
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
  return data.filter((item): item is CompanyLink => 
    typeof item === 'object' && 
    item !== null && 
    'type' in item && 
    'url' in item
  );
};

export const convertToAuthorExperiences = (data: Json | null): AuthorExperience[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is AuthorExperience => 
    typeof item === 'object' && 
    item !== null && 
    'id' in item && 
    'title' in item && 
    'description' in item
  );
};

export const convertToAuthorTones = (data: Json | null): AuthorToneItem[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is AuthorToneItem => 
    typeof item === 'object' && 
    item !== null && 
    'id' in item && 
    'tone' in item && 
    'description' in item
  );
};

export const convertToAuthorBeliefs = (data: Json | null): AuthorBelief[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is AuthorBelief => 
    typeof item === 'object' && 
    item !== null && 
    'id' in item && 
    'belief' in item && 
    'description' in item
  );
};

export const convertToAuthorSocialLinks = (data: Json | null): AuthorSocialLink[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is AuthorSocialLink => 
    typeof item === 'object' && 
    item !== null && 
    'id' in item && 
    'type' in item && 
    'url' in item
  );
};

export const convertToICPStoryScriptItems = (data: Json | null): ICPStoryScriptItem[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is ICPStoryScriptItem => 
    typeof item === 'object' && 
    item !== null && 
    'id' in item && 
    'content' in item
  );
};

export const convertToProductFeatures = (data: Json | null): ProductFeature[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is ProductFeature => 
    typeof item === 'object' && 
    item !== null && 
    'id' in item && 
    'name' in item
  );
};

export const convertToProductUseCases = (data: Json | null): ProductUseCase[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is ProductUseCase => 
    typeof item === 'object' && 
    item !== null && 
    'id' in item && 
    'useCase' in item
  );
};

export const convertToProductDifferentiators = (data: Json | null): ProductDifferentiator[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is ProductDifferentiator => 
    typeof item === 'object' && 
    item !== null && 
    'id' in item && 
    'name' in item
  );
};

// Convert from our types to Json for Supabase
export const convertFromCompanyLinks = (links: CompanyLink[]): Json => {
  return links as Json;
};

export const convertFromAuthorExperiences = (experiences: AuthorExperience[]): Json => {
  return experiences as Json;
};

export const convertFromAuthorTones = (tones: AuthorToneItem[]): Json => {
  return tones as Json;
};

export const convertFromAuthorBeliefs = (beliefs: AuthorBelief[]): Json => {
  return beliefs as Json;
};

export const convertFromAuthorSocialLinks = (links: AuthorSocialLink[]): Json => {
  return links as Json;
};

export const convertFromICPStoryScriptItems = (items: ICPStoryScriptItem[]): Json => {
  return items as Json;
};

export const convertFromProductFeatures = (features: ProductFeature[]): Json => {
  return features as Json;
};

export const convertFromProductUseCases = (useCases: ProductUseCase[]): Json => {
  return useCases as Json;
};

export const convertFromProductDifferentiators = (differentiators: ProductDifferentiator[]): Json => {
  return differentiators as Json;
};
