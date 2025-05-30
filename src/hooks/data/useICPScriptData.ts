import { useState } from 'react';
import { supabaseDataService } from '@/services/SupabaseDataService';
import { ICPStoryScript } from '@/types/storytelling';
import { toast } from 'sonner';

export const useICPScriptData = () => {
  const [icpScripts, setICPScripts] = useState<ICPStoryScript[]>([]);

  const loadICPScripts = async () => {
    const data = await supabaseDataService.getICPScripts();
    setICPScripts(data);
    return data;
  };

  const handleICPScriptAdded = async (script: ICPStoryScript) => {
    try {
      console.log('📜 Creating ICP script with client assignment:', {
        name: script.name,
        clientId: script.clientId,
        clientAssignment: script.clientId ? 'client_specific' : 'no_client'
      });

      const newScript = await supabaseDataService.createICPScript(script);
      
      console.log('📜 ICP script created successfully:', {
        id: newScript.id,
        name: newScript.name,
        clientId: newScript.clientId,
        clientAssignment: newScript.clientId ? 'client_specific' : 'no_client'
      });

      setICPScripts(prev => [newScript, ...prev]);
      toast.success(`ICP script created successfully${newScript.clientId ? ' for selected client' : ''}`);
      return newScript;
    } catch (error) {
      console.error('Error creating ICP script:', error);
      toast.error('Failed to create ICP script');
      throw error;
    }
  };

  const handleICPScriptUpdated = async (updatedScript: ICPStoryScript) => {
    try {
      const script = await supabaseDataService.updateICPScript(updatedScript);
      setICPScripts(prev => prev.map(s => s.id === script.id ? script : s));
      toast.success('ICP script updated successfully');
      return script;
    } catch (error) {
      console.error('Error updating ICP script:', error);
      toast.error('Failed to update ICP script');
      throw error;
    }
  };

  const handleICPScriptDeleted = async (scriptId: string) => {
    try {
      await supabaseDataService.deleteICPScript(scriptId);
      setICPScripts(prev => prev.filter(script => script.id !== scriptId));
      toast.success('ICP script deleted successfully');
    } catch (error) {
      console.error('Error deleting ICP script:', error);
      toast.error('Failed to delete ICP script');
      throw error;
    }
  };

  return {
    icpScripts,
    setICPScripts,
    loadICPScripts,
    handleICPScriptAdded,
    handleICPScriptUpdated,
    handleICPScriptDeleted,
  };
};
