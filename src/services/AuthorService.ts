
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
    console.log('AuthorService.getAuthors called');
    
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching authors:', error);
      throw error;
    }
    
    console.log('Authors fetched successfully:', data?.length || 0);
    
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
    console.log('AuthorService.createAuthor called with:', {
      name: author.name,
      role: author.role,
      organization: author.organization,
      experiencesCount: author.experiences?.length || 0,
      tonesCount: author.tones?.length || 0,
      beliefsCount: author.beliefs?.length || 0,
      socialLinksCount: author.socialLinks?.length || 0
    });
    
    const userId = await this.getCurrentUserId();
    console.log('Current user ID:', userId);
    
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

    console.log('Insert data prepared:', {
      ...insertData,
      experiences: `${JSON.stringify(insertData.experiences).length} chars`,
      tones: `${JSON.stringify(insertData.tones).length} chars`,
      beliefs: `${JSON.stringify(insertData.beliefs).length} chars`,
      social_links: `${JSON.stringify(insertData.social_links).length} chars`
    });
    
    const { data, error } = await supabase
      .from('authors')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating author:', error);
      throw error;
    }
    
    console.log('Author created successfully with ID:', data.id);
    
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
    console.log('AuthorService.updateAuthor called with:', {
      id: author.id,
      name: author.name,
      role: author.role,
      organization: author.organization
    });
    
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

    console.log('Update data prepared for author:', author.id);
    
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
    
    console.log('Author updated successfully:', data.id);
    
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
    console.log('AuthorService.deleteAuthor called for:', authorId);
    
    const { error } = await supabase
      .from('authors')
      .delete()
      .eq('id', authorId);
    
    if (error) {
      console.error('Error deleting author:', error);
      throw error;
    }
    
    console.log('Author deleted successfully:', authorId);
  }
}

export const authorService = new AuthorService();
