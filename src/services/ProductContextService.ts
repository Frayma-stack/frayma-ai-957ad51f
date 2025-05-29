
import { supabase } from '@/integrations/supabase/client';
import { ProductContext } from '@/types/storytelling';
import { BaseSupabaseService } from './base/BaseSupabaseService';
import {
  convertToProductFeatures,
  convertToProductUseCases,
  convertToProductDifferentiators,
  convertToCompanyLinks,
  convertFromProductFeatures,
  convertFromProductUseCases,
  convertFromProductDifferentiators,
  convertFromCompanyLinks
} from '@/utils/supabaseTypeUtils';

export class ProductContextService extends BaseSupabaseService {
  async getProductContexts(): Promise<ProductContext[]> {
    const { data, error } = await supabase
      .from('product_contexts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(context => ({
      id: context.id,
      name: context.name || 'Product Context',
      description: context.description || '',
      features: convertToProductFeatures(context.features),
      useCases: convertToProductUseCases(context.use_cases),
      differentiators: convertToProductDifferentiators(context.differentiators),
      categoryPOV: context.category_pov,
      companyMission: context.company_mission,
      uniqueInsight: context.unique_insight,
      companyLinks: convertToCompanyLinks(context.company_links),
      clientId: context.client_id
    }));
  }

  async createProductContext(context: Omit<ProductContext, 'id'>): Promise<ProductContext> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await supabase
      .from('product_contexts')
      .insert({
        user_id: userId,
        name: context.name,
        description: context.description,
        features: convertFromProductFeatures(context.features || []),
        use_cases: convertFromProductUseCases(context.useCases || []),
        differentiators: convertFromProductDifferentiators(context.differentiators || []),
        category_pov: context.categoryPOV,
        company_mission: context.companyMission,
        unique_insight: context.uniqueInsight,
        company_links: convertFromCompanyLinks(context.companyLinks || []),
        client_id: context.clientId || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name || 'Product Context',
      description: data.description || '',
      features: convertToProductFeatures(data.features),
      useCases: convertToProductUseCases(data.use_cases),
      differentiators: convertToProductDifferentiators(data.differentiators),
      categoryPOV: data.category_pov,
      companyMission: data.company_mission,
      uniqueInsight: data.unique_insight,
      companyLinks: convertToCompanyLinks(data.company_links),
      clientId: data.client_id
    };
  }

  async updateProductContext(context: ProductContext): Promise<ProductContext> {
    const { data, error } = await supabase
      .from('product_contexts')
      .update({
        name: context.name,
        description: context.description,
        features: convertFromProductFeatures(context.features || []),
        use_cases: convertFromProductUseCases(context.useCases || []),
        differentiators: convertFromProductDifferentiators(context.differentiators || []),
        category_pov: context.categoryPOV,
        company_mission: context.companyMission,
        unique_insight: context.uniqueInsight,
        company_links: convertFromCompanyLinks(context.companyLinks || []),
        client_id: context.clientId || null
      })
      .eq('id', context.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name || 'Product Context',
      description: data.description || '',
      features: convertToProductFeatures(data.features),
      useCases: convertToProductUseCases(data.use_cases),
      differentiators: convertToProductDifferentiators(data.differentiators),
      categoryPOV: data.category_pov,
      companyMission: data.company_mission,
      uniqueInsight: data.unique_insight,
      companyLinks: convertToCompanyLinks(data.company_links),
      clientId: data.client_id
    };
  }

  async deleteProductContext(contextId: string): Promise<void> {
    const { error } = await supabase
      .from('product_contexts')
      .delete()
      .eq('id', contextId);
    
    if (error) throw error;
  }
}

export const productContextService = new ProductContextService();
