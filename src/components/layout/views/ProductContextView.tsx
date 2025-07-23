
import { FC } from 'react';
import ProductContextManager from '@/components/ProductContextManager';
import { MainContentViewRouterProps } from '../types/MainContentViewRouterTypes';

interface ProductContextViewProps extends Pick<MainContentViewRouterProps, 
  'selectedClientId' | 'currentProductContext' | 'onProductContextUpdated'> {}

const ProductContextView: FC<ProductContextViewProps> = ({
  selectedClientId,
  currentProductContext,
  onProductContextUpdated,
}) => {
  return (
    <div className="p-6">
      <ProductContextManager
        productContext={currentProductContext}
        selectedClientId={selectedClientId}
        onProductContextUpdated={onProductContextUpdated}
      />
    </div>
  );
};

export default ProductContextView;
