
import { useState } from 'react';
import { supabaseDataService } from '@/services/SupabaseDataService';
import { Client, ProductContext } from '@/types/storytelling';
import { toast } from 'sonner';

export const useClientData = () => {
  const [clients, setClients] = useState<Client[]>([]);

  const loadClients = async () => {
    const data = await supabaseDataService.getClients();
    setClients(data);
    return data;
  };

  const handleClientAdded = async (client: Client, productContext?: ProductContext, onProductContextAdded?: (context: ProductContext) => void) => {
    try {
      const newClient = await supabaseDataService.createClient(client);
      setClients(prev => [newClient, ...prev]);
      
      // If product context was provided, save it as well
      if (productContext && onProductContextAdded) {
        console.log('useClientData: Saving product context for new client', productContext);
        const contextWithClientId = { ...productContext, clientId: newClient.id };
        await onProductContextAdded(contextWithClientId);
      }
      
      toast.success('Client created successfully');
      return newClient;
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Failed to create client');
      throw error;
    }
  };

  const handleClientUpdated = async (updatedClient: Client, productContext?: ProductContext, onProductContextAdded?: (context: ProductContext) => void, onProductContextUpdated?: (context: ProductContext) => void, productContexts?: ProductContext[]) => {
    try {
      const client = await supabaseDataService.updateClient(updatedClient);
      setClients(prev => prev.map(c => c.id === client.id ? client : c));
      
      // If product context was provided, handle it
      if (productContext && onProductContextAdded && onProductContextUpdated && productContexts) {
        console.log('useClientData: Handling product context for updated client', productContext);
        const contextWithClientId = { ...productContext, clientId: client.id };
        
        // Check if product context already exists for this client
        const existingContext = productContexts.find(pc => pc.clientId === client.id);
        if (existingContext) {
          const updatedContext = { ...contextWithClientId, id: existingContext.id };
          await onProductContextUpdated(updatedContext);
        } else {
          await onProductContextAdded(contextWithClientId);
        }
      }
      
      toast.success('Client updated successfully');
      return client;
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
      throw error;
    }
  };

  const handleClientDeleted = async (clientId: string) => {
    try {
      await supabaseDataService.deleteClient(clientId);
      setClients(prev => prev.filter(client => client.id !== clientId));
      toast.success('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
      throw error;
    }
  };

  return {
    clients,
    setClients,
    loadClients,
    handleClientAdded,
    handleClientUpdated,
    handleClientDeleted,
  };
};
