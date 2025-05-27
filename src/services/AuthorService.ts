
import { supabase } from '@/integrations/supabase/client';
import { Author } from '@/types/storytelling';
import { BaseSupabaseService } from './base/BaseSupabaseService';
import {
  convertToAuthorExperiences,
  convertToAuthorTones,
  convertToAuthorBeliefs,
  convertToAuthorSocialLinks,
  convertFromAuthorExperiences,
  convertFromAuthorTones,
  convertFromAuthorBeliefs,
  convertFromAuthorSocialLinks
} from '@/utils/supabaseTypeUtils';

export class AuthorService extends BaseSupabaseService {
  async getAuthors(): Promise<Author[]> {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(author => ({
      id: author.id,
      name: author.name,
      role: author.role,
      organization: author.organization,
      backstory: author.backstory,
      experiences: convertToAuthorExperiences(author.experiences),
      tones: convertToAuthorTones(author.tones),
      beliefs: convertToAuthorBeliefs(author.beliefs),
      socialLinks: convertToAuthorSocialLinks(author.social_links),
      clientId: author.client_id
    }));
  }

  async createAuthor(author: Omit<Author, 'id'>): Promise<Author> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await supabase
      .from('authors')
      .insert({
        user_id: userId,
        name: author.name,
        role: author.role,
        organization: author.organization,
        backstory: author.backstory,
        experiences: convertFromAuthorExperiences(author.experiences || []),
        tones: convertFromAuthorTones(author.tones || []),
        beliefs: convertFromAuthorBeliefs(author.beliefs || []),
        social_links: convertFromAuthorSocialLinks(author.socialLinks || []),
        client_id: author.clientId || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      organization: data.organization,
      backstory: data.backstory,
      experiences: convertToAuthorExperiences(data.experiences),
      tones: convertToAuthorTones(data.tones),
      beliefs: convertToAuthorBeliefs(data.beliefs),
      socialLinks: convertToAuthorSocialLinks(data.social_links),
      clientId: data.client_id
    };
  }

  async updateAuthor(author: Author): Promise<Author> {
    const { data, error } = await supabase
      .from('authors')
      .update({
        name: author.name,
        role: author.role,
        organization: author.organization,
        backstory: author.backstory,
        experiences: convertFromAuthorExperiences(author.experiences || []),
        tones: convertFromAuthorTones(author.tones || []),
        beliefs: convertFromAuthorBeliefs(author.beliefs || []),
        social_links: convertFromAuthorSocialLinks(author.socialLinks || []),
        client_id: author.clientId || null
      })
      .eq('id', author.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      organization: data.organization,
      backstory: data.backstory,
      experiences: convertToAuthorExperiences(data.experiences),
      tones: convertToAuthorTones(data.tones),
      beliefs: convertToAuthorBeliefs(data.beliefs),
      socialLinks: convertToAuthorSocialLinks(data.social_links),
      clientId: data.client_id
    };
  }

  async deleteAuthor(authorId: string): Promise<void> {
    const { error } = await supabase
      .from('authors')
      .delete()
      .eq('id', authorId);
    
    if (error) throw error;
  }
}

export const authorService = new AuthorService();
