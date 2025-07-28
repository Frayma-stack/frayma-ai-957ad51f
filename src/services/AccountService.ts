import { supabase } from '@/integrations/supabase/client';
import { Account } from '@/types/storytelling';
import { BaseSupabaseService } from './base/BaseSupabaseService';
import {
  convertToCompanyLinks,
  convertFromCompanyLinks
} from '@/utils/supabaseTypeUtils';

export class AccountService extends BaseSupabaseService {
  async getAccounts(): Promise<Account[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(account => ({
      id: account.id,
      name: account.name,
      description: account.description,
      companyLinks: convertToCompanyLinks(account.company_links),
      createdAt: account.created_at
    }));
  }

  async createAccount(account: Omit<Account, 'id' | 'createdAt'>): Promise<Account> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await supabase
      .from('clients')
      .insert({
        user_id: userId,
        name: account.name,
        description: account.description || null,
        company_links: convertFromCompanyLinks(account.companyLinks || [])
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

  async updateAccount(account: Account): Promise<Account> {
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: account.name,
        description: account.description || null,
        company_links: convertFromCompanyLinks(account.companyLinks || [])
      })
      .eq('id', account.id)
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

  async deleteAccount(accountId: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', accountId);
    
    if (error) throw error;
  }
  
  // Legacy methods for backward compatibility
  getClients = this.getAccounts;
  createClient = this.createAccount;
  updateClient = this.updateAccount;
  deleteClient = this.deleteAccount;
}

export const accountService = new AccountService();

// Legacy export for backward compatibility
export const clientService = accountService;