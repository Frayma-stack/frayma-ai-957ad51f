
import { supabase } from '@/integrations/supabase/client';
import { CustomerSuccessStory } from '@/types/storytelling';
import { BaseSupabaseService } from './base/BaseSupabaseService';

export class SuccessStoryService extends BaseSupabaseService {
  async getSuccessStories(): Promise<CustomerSuccessStory[]> {
    const { data, error } = await supabase
      .from('success_stories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(story => ({
      id: story.id,
      title: story.title,
      url: story.url,
      beforeSummary: story.before_summary,
      afterSummary: story.after_summary,
      quotes: Array.isArray(story.quotes) ? story.quotes as any[] : [],
      features: Array.isArray(story.features) ? story.features as any[] : [],
      clientId: story.client_id,
      createdAt: story.created_at
    }));
  }

  async createSuccessStory(story: Omit<CustomerSuccessStory, 'id'>): Promise<CustomerSuccessStory> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await supabase
      .from('success_stories')
      .insert({
        user_id: userId,
        title: story.title,
        url: story.url || null,
        before_summary: story.beforeSummary,
        after_summary: story.afterSummary,
        quotes: story.quotes || [],
        features: story.features || [],
        client_id: story.clientId || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      url: data.url,
      beforeSummary: data.before_summary,
      afterSummary: data.after_summary,
      quotes: Array.isArray(data.quotes) ? data.quotes as any[] : [],
      features: Array.isArray(data.features) ? data.features as any[] : [],
      clientId: data.client_id,
      createdAt: data.created_at
    };
  }

  async updateSuccessStory(story: CustomerSuccessStory): Promise<CustomerSuccessStory> {
    const { data, error } = await supabase
      .from('success_stories')
      .update({
        title: story.title,
        url: story.url || null,
        before_summary: story.beforeSummary,
        after_summary: story.afterSummary,
        quotes: story.quotes || [],
        features: story.features || [],
        client_id: story.clientId || null
      })
      .eq('id', story.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      url: data.url,
      beforeSummary: data.before_summary,
      afterSummary: data.after_summary,
      quotes: Array.isArray(data.quotes) ? data.quotes as any[] : [],
      features: Array.isArray(data.features) ? data.features as any[] : [],
      clientId: data.client_id,
      createdAt: data.created_at
    };
  }

  async deleteSuccessStory(storyId: string): Promise<void> {
    const { error } = await supabase
      .from('success_stories')
      .delete()
      .eq('id', storyId);
    
    if (error) throw error;
  }
}

export const successStoryService = new SuccessStoryService();
