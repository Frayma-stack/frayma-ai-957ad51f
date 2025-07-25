
import { supabase } from '@/integrations/supabase/client';

export abstract class BaseSupabaseService {
  protected async getCurrentUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    return user.id;
  }
}
