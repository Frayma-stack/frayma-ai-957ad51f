
import { supabase } from '@/integrations/supabase/client';
import { ICPStoryScript } from '@/types/storytelling';
import { BaseSupabaseService } from './base/BaseSupabaseService';
import {
  convertToICPStoryScriptItems,
  convertFromICPStoryScriptItems
} from '@/utils/supabaseTypeUtils';

export class ICPScriptService extends BaseSupabaseService {
  async getICPScripts(): Promise<ICPStoryScript[]> {
    const { data, error } = await supabase
      .from('icp_story_scripts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(script => ({
      id: script.id,
      name: script.name,
      demographics: script.demographics,
      coreBeliefs: convertToICPStoryScriptItems(script.core_beliefs),
      internalPains: convertToICPStoryScriptItems(script.internal_pains),
      externalStruggles: convertToICPStoryScriptItems(script.external_struggles),
      desiredTransformations: convertToICPStoryScriptItems(script.desired_transformations),
      clientId: script.client_id
    }));
  }

  async createICPScript(script: Omit<ICPStoryScript, 'id'>): Promise<ICPStoryScript> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await supabase
      .from('icp_story_scripts')
      .insert({
        user_id: userId,
        name: script.name,
        demographics: script.demographics,
        core_beliefs: convertFromICPStoryScriptItems(script.coreBeliefs || []),
        internal_pains: convertFromICPStoryScriptItems(script.internalPains || []),
        external_struggles: convertFromICPStoryScriptItems(script.externalStruggles || []),
        desired_transformations: convertFromICPStoryScriptItems(script.desiredTransformations || []),
        client_id: script.clientId || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      demographics: data.demographics,
      coreBeliefs: convertToICPStoryScriptItems(data.core_beliefs),
      internalPains: convertToICPStoryScriptItems(data.internal_pains),
      externalStruggles: convertToICPStoryScriptItems(data.external_struggles),
      desiredTransformations: convertToICPStoryScriptItems(data.desired_transformations),
      clientId: data.client_id
    };
  }

  async updateICPScript(script: ICPStoryScript): Promise<ICPStoryScript> {
    const { data, error } = await supabase
      .from('icp_story_scripts')
      .update({
        name: script.name,
        demographics: script.demographics,
        core_beliefs: convertFromICPStoryScriptItems(script.coreBeliefs || []),
        internal_pains: convertFromICPStoryScriptItems(script.internalPains || []),
        external_struggles: convertFromICPStoryScriptItems(script.externalStruggles || []),
        desired_transformations: convertFromICPStoryScriptItems(script.desiredTransformations || []),
        client_id: script.clientId || null
      })
      .eq('id', script.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      demographics: data.demographics,
      coreBeliefs: convertToICPStoryScriptItems(data.core_beliefs),
      internalPains: convertToICPStoryScriptItems(data.internal_pains),
      externalStruggles: convertToICPStoryScriptItems(data.external_struggles),
      desiredTransformations: convertToICPStoryScriptItems(data.desired_transformations),
      clientId: data.client_id
    };
  }

  async deleteICPScript(scriptId: string): Promise<void> {
    const { error } = await supabase
      .from('icp_story_scripts')
      .delete()
      .eq('id', scriptId);
    
    if (error) throw error;
  }
}

export const icpScriptService = new ICPScriptService();
