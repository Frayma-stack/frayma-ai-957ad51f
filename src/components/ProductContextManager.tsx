
import { FC, useState } from 'react';
import { ProductContext } from '@/types/storytelling';
import CollapsibleProductContext from './CollapsibleProductContext';
import ProductContextCreationForm from './product-context/ProductContextCreationForm';
import ProductContextCreateButton from './product-context/ProductContextCreateButton';

interface ProductContextManagerProps {
  productContext: ProductContext | null;
  selectedClientId?: string;
  onProductContextUpdated: (productContext: ProductContext) => void;
}

const ProductContextManager: FC<ProductContextManagerProps> = ({ 
  productContext, 
  selectedClientId,
  onProductContextUpdated 
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateClick = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  const handleProductContextCreated = (newProductContext: ProductContext) => {
    onProductContextUpdated(newProductContext);
    setIsCreating(false);
  };

  if (!productContext && !isCreating) {
    return (
      <div className="space-y-4">
        <ProductContextCreateButton onCreateClick={handleCreateClick} />
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="space-y-4">
        <ProductContextCreationForm
          onProductContextCreated={handleProductContextCreated}
          onCancel={handleCancelCreate}
          selectedClientId={selectedClientId}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CollapsibleProductContext
        productContext={productContext}
        onProductContextUpdated={onProductContextUpdated}
      />
    </div>
  );
};

export default ProductContextManager;
