
import { useState } from 'react';
import { supabaseDataService } from '@/services/SupabaseDataService';
import { BusinessContext } from '@/types/storytelling';
import { toast } from 'sonner';

export const useProductContextData = () => {
  const [productContexts, setProductContexts] = useState<BusinessContext[]>([]);

  const loadProductContexts = async () => {
    const data = await supabaseDataService.getProductContexts();
    setProductContexts(data);
    return data;
  };

  const handleProductContextAdded = async (context: BusinessContext) => {
    try {
      const newContext = await supabaseDataService.createProductContext(context);
      setProductContexts(prev => [newContext, ...prev]);
      console.log('useProductContextData: Business context added successfully', newContext);
      toast.success('Business context created successfully');
      return newContext;
    } catch (error) {
      console.error('Error creating business context:', error);
      toast.error('Failed to create business context');
      throw error;
    }
  };

  const handleProductContextUpdated = async (updatedContext: BusinessContext) => {
    try {
      const context = await supabaseDataService.updateProductContext(updatedContext);
      setProductContexts(prev => prev.map(c => c.id === context.id ? context : c));
      console.log('useProductContextData: Business context updated successfully', context);
      toast.success('Business context updated successfully');
      return context;
    } catch (error) {
      console.error('Error updating business context:', error);
      toast.error('Failed to update business context');
      throw error;
    }
  };

  const handleProductContextDeleted = async (contextId: string) => {
    try {
      await supabaseDataService.deleteProductContext(contextId);
      setProductContexts(prev => prev.filter(context => context.id !== contextId));
      toast.success('Business context deleted successfully');
    } catch (error) {
      console.error('Error deleting business context:', error);
      toast.error('Failed to delete business context');
      throw error;
    }
  };

  return {
    productContexts,
    setProductContexts,
    loadProductContexts,
    handleProductContextAdded,
    handleProductContextUpdated,
    handleProductContextDeleted,
  };
};
