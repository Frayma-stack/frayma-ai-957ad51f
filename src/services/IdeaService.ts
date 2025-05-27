
import { supabase } from '@/integrations/supabase/client';
import { GeneratedIdea } from '@/types/ideas';
import { BaseSupabaseService } from './base/BaseSupabaseService';

export class IdeaService extends BaseSupabaseService {
  async getIdeas(): Promise<GeneratedIdea[]> {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(idea => ({
      id: idea.id,
      title: idea.title,
      narrative: idea.narrative || '',
      productTieIn: idea.product_tie_in || '',
      cta: idea.cta || '',
      createdAt: idea.created_at,
      score: idea.score ? { value: idea.score as 0 | 1 | 2 | 3, label: `${idea.score}` } : null,
      source: { type: 'text' as const, content: 'Stored in database' },
      clientId: idea.client_id,
      // Default values for required fields
      icpId: '',
      narrativeAnchor: 'belief' as const,
      narrativeItemId: '',
      productFeatures: []
    }));
  }

  async createIdea(idea: Omit<GeneratedIdea, 'id'>): Promise<GeneratedIdea> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await supabase
      .from('ideas')
      .insert({
        user_id: userId,
        title: idea.title,
        narrative: idea.narrative || null,
        product_tie_in: idea.productTieIn || null,
        cta: idea.cta || null,
        score: idea.score?.value || 1,
        client_id: idea.clientId || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      narrative: data.narrative || '',
      productTieIn: data.product_tie_in || '',
      cta: data.cta || '',
      createdAt: data.created_at,
      score: data.score ? { value: data.score as 0 | 1 | 2 | 3, label: `${data.score}` } : null,
      source: { type: 'text' as const, content: 'Stored in database' },
      clientId: data.client_id,
      icpId: '',
      narrativeAnchor: 'belief' as const,
      narrativeItemId: '',
      productFeatures: []
    };
  }

  async updateIdea(idea: GeneratedIdea): Promise<GeneratedIdea> {
    const { data, error } = await supabase
      .from('ideas')
      .update({
        title: idea.title,
        narrative: idea.narrative || null,
        product_tie_in: idea.productTieIn || null,
        cta: idea.cta || null,
        score: idea.score?.value || 1,
        client_id: idea.clientId || null
      })
      .eq('id', idea.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      narrative: data.narrative || '',
      productTieIn: data.product_tie_in || '',
      cta: data.cta || '',
      createdAt: data.created_at,
      score: data.score ? { value: data.score as 0 | 1 | 2 | 3, label: `${data.score}` } : null,
      source: { type: 'text' as const, content: 'Stored in database' },
      clientId: data.client_id,
      icpId: idea.icpId,
      narrativeAnchor: idea.narrativeAnchor,
      narrativeItemId: idea.narrativeItemId,
      productFeatures: idea.productFeatures
    };
  }

  async deleteIdea(ideaId: string): Promise<void> {
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', ideaId);
    
    if (error) throw error;
  }
}

export const ideaService = new IdeaService();
