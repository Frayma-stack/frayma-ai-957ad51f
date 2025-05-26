
import { ProductContext } from '@/types/storytelling';

interface UseProductContextManagerProps {
  selectedClientId: string | null;
  getCurrentProductContext: () => ProductContext | null;
  onProductContextAdded: (context: ProductContext) => void;
  onProductContextUpdated: (context: ProductContext) => void;
}

export const useProductContextManager = ({
  selectedClientId,
  getCurrentProductContext,
  onProductContextAdded,
  onProductContextUpdated,
}: UseProductContextManagerProps) => {
  const handleProductContextCreatedOrUpdated = (productContext: ProductContext) => {
    const existingContext = getCurrentProductContext();
    if (existingContext) {
      onProductContextUpdated(productContext);
    } else {
      // Set clientId if we have a selected client
      if (selectedClientId) {
        productContext.clientId = selectedClientId;
      }
      onProductContextAdded(productContext);
    }
  };

  return {
    handleProductContextCreatedOrUpdated,
  };
};
