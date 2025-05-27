
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
    typeof (item as any).type === 'string' && 
    typeof (item as any).url === 'string'
  ).map(item => item as CompanyLink);
};

export const convertToAuthorExperiences = (data: Json | null): AuthorExperience[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is AuthorExperience => 
    typeof item === 'object' && 
    item !== null && 
    typeof (item as any).id === 'string' && 
    typeof (item as any).title === 'string' && 
    typeof (item as any).description === 'string'
  ).map(item => item as AuthorExperience);
};

export const convertToAuthorTones = (data: Json | null): AuthorToneItem[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is AuthorToneItem => 
    typeof item === 'object' && 
    item !== null && 
    typeof (item as any).id === 'string' && 
    typeof (item as any).tone === 'string' && 
    typeof (item as any).description === 'string'
  ).map(item => item as AuthorToneItem);
};

export const convertToAuthorBeliefs = (data: Json | null): AuthorBelief[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is AuthorBelief => 
    typeof item === 'object' && 
    item !== null && 
    typeof (item as any).id === 'string' && 
    typeof (item as any).belief === 'string' && 
    typeof (item as any).description === 'string'
  ).map(item => item as AuthorBelief);
};

export const convertToAuthorSocialLinks = (data: Json | null): AuthorSocialLink[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is AuthorSocialLink => 
    typeof item === 'object' && 
    item !== null && 
    typeof (item as any).id === 'string' && 
    typeof (item as any).type === 'string' && 
    typeof (item as any).url === 'string'
  ).map(item => item as AuthorSocialLink);
};

export const convertToICPStoryScriptItems = (data: Json | null): ICPStoryScriptItem[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is ICPStoryScriptItem => 
    typeof item === 'object' && 
    item !== null && 
    typeof (item as any).id === 'string' && 
    typeof (item as any).content === 'string'
  ).map(item => item as ICPStoryScriptItem);
};

export const convertToProductFeatures = (data: Json | null): ProductFeature[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is ProductFeature => 
    typeof item === 'object' && 
    item !== null && 
    typeof (item as any).id === 'string' && 
    typeof (item as any).name === 'string'
  ).map(item => item as ProductFeature);
};

export const convertToProductUseCases = (data: Json | null): ProductUseCase[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is ProductUseCase => 
    typeof item === 'object' && 
    item !== null && 
    typeof (item as any).id === 'string' && 
    typeof (item as any).useCase === 'string'
  ).map(item => item as ProductUseCase);
};

export const convertToProductDifferentiators = (data: Json | null): ProductDifferentiator[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is ProductDifferentiator => 
    typeof item === 'object' && 
    item !== null && 
    typeof (item as any).id === 'string' && 
    typeof (item as any).name === 'string'
  ).map(item => item as ProductDifferentiator);
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
