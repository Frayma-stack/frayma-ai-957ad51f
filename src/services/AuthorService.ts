
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
      bio: '', // Not stored in DB, using default
      company: '', // Not stored in DB, using default
      title: '', // Not stored in DB, using default
      email: '', // Not stored in DB, using default
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
    console.log('Creating author:', author);
    
    const userId = await this.getCurrentUserId();
    
    // Prepare the data for insertion
    const insertData = {
      user_id: userId,
      name: author.name,
      role: author.role || 'Professional',
      organization: author.organization || 'Unknown Organization',
      backstory: author.backstory || 'Professional background to be updated.',
      experiences: convertFromAuthorExperiences(author.experiences || []),
      tones: convertFromAuthorTones(author.tones || []),
      beliefs: convertFromAuthorBeliefs(author.beliefs || []),
      social_links: convertFromAuthorSocialLinks(author.socialLinks || []),
      client_id: author.clientId || null
    };

    console.log('Insert data:', insertData);
    
    const { data, error } = await supabase
      .from('authors')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating author:', error);
      throw error;
    }
    
    console.log('Author created successfully:', data);
    
    return {
      id: data.id,
      name: data.name,
      bio: '',
      company: '',
      title: '',
      email: '',
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
    console.log('Updating author:', author);
    
    const updateData = {
      name: author.name,
      role: author.role || 'Professional',
      organization: author.organization || 'Unknown Organization',
      backstory: author.backstory || 'Professional background to be updated.',
      experiences: convertFromAuthorExperiences(author.experiences || []),
      tones: convertFromAuthorTones(author.tones || []),
      beliefs: convertFromAuthorBeliefs(author.beliefs || []),
      social_links: convertFromAuthorSocialLinks(author.socialLinks || []),
      client_id: author.clientId || null
    };

    console.log('Update data:', updateData);
    
    const { data, error } = await supabase
      .from('authors')
      .update(updateData)
      .eq('id', author.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating author:', error);
      throw error;
    }
    
    console.log('Author updated successfully:', data);
    
    return {
      id: data.id,
      name: data.name,
      bio: '',
      company: '',
      title: '',
      email: '',
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
    console.log('Deleting author:', authorId);
    
    const { error } = await supabase
      .from('authors')
      .delete()
      .eq('id', authorId);
    
    if (error) {
      console.error('Error deleting author:', error);
      throw error;
    }
    
    console.log('Author deleted successfully');
  }
}

export const authorService = new AuthorService();
