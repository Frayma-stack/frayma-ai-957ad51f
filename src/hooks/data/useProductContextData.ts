
import { useState } from 'react';
import { supabaseDataService } from '@/services/SupabaseDataService';
import { ProductContext } from '@/types/storytelling';
import { toast } from 'sonner';

export const useProductContextData = () => {
  const [productContexts, setProductContexts] = useState<ProductContext[]>([]);

  const loadProductContexts = async () => {
    const data = await supabaseDataService.getProductContexts();
    setProductContexts(data);
    return data;
  };

  const handleProductContextAdded = async (context: ProductContext) => {
    try {
      const newContext = await supabaseDataService.createProductContext(context);
      setProductContexts(prev => [newContext, ...prev]);
      console.log('useProductContextData: Product context added successfully', newContext);
      toast.success('Product context created successfully');
      return newContext;
    } catch (error) {
      console.error('Error creating product context:', error);
      toast.error('Failed to create product context');
      throw error;
    }
  };

  const handleProductContextUpdated = async (updatedContext: ProductContext) => {
    try {
      const context = await supabaseDataService.updateProductContext(updatedContext);
      setProductContexts(prev => prev.map(c => c.id === context.id ? context : c));
      console.log('useProductContextData: Product context updated successfully', context);
      toast.success('Product context updated successfully');
      return context;
    } catch (error) {
      console.error('Error updating product context:', error);
      toast.error('Failed to update product context');
      throw error;
    }
  };

  const handleProductContextDeleted = async (contextId: string) => {
    try {
      await supabaseDataService.deleteProductContext(contextId);
      setProductContexts(prev => prev.filter(context => context.id !== contextId));
      toast.success('Product context deleted successfully');
    } catch (error) {
      console.error('Error deleting product context:', error);
      toast.error('Failed to delete product context');
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
