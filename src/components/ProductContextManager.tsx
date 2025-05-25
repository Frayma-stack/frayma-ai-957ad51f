
import { FC } from 'react';
import { ProductContext } from '@/types/storytelling';
import CollapsibleProductContext from './CollapsibleProductContext';

interface ProductContextManagerProps {
  productContext: ProductContext | null;
  onProductContextUpdated: (productContext: ProductContext) => void;
}

const ProductContextManager: FC<ProductContextManagerProps> = ({ 
  productContext, 
  onProductContextUpdated 
}) => {
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
