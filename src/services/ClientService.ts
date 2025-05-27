
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/storytelling';
import { BaseSupabaseService } from './base/BaseSupabaseService';
import {
  convertToCompanyLinks,
  convertFromCompanyLinks
} from '@/utils/supabaseTypeUtils';

export class ClientService extends BaseSupabaseService {
  async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(client => ({
      id: client.id,
      name: client.name,
      description: client.description,
      companyLinks: convertToCompanyLinks(client.company_links),
      createdAt: client.created_at
    }));
  }

  async createClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await supabase
      .from('clients')
      .insert({
        user_id: userId,
        name: client.name,
        description: client.description || null,
        company_links: convertFromCompanyLinks(client.companyLinks || [])
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      companyLinks: convertToCompanyLinks(data.company_links),
      createdAt: data.created_at
    };
  }

  async updateClient(client: Client): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: client.name,
        description: client.description || null,
        company_links: convertFromCompanyLinks(client.companyLinks || [])
      })
      .eq('id', client.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      companyLinks: convertToCompanyLinks(data.company_links),
      createdAt: data.created_at
    };
  }

  async deleteClient(clientId: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);
    
    if (error) throw error;
  }
}

export const clientService = new ClientService();
