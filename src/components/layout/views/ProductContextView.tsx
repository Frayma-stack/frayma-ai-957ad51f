
import { FC } from 'react';
import ProductContextManager from '@/components/ProductContextManager';
import { MainContentViewRouterProps } from '../types/MainContentViewRouterTypes';

interface ProductContextViewProps extends Pick<MainContentViewRouterProps, 
  'currentProductContext' | 'onProductContextUpdated'> {}

const ProductContextView: FC<ProductContextViewProps> = ({
  currentProductContext,
  onProductContextUpdated,
}) => {
  return (
    <div className="p-6">
      <ProductContextManager
        productContext={currentProductContext}
        onProductContextUpdated={onProductContextUpdated}
      />
    </div>
  );
};

export default ProductContextView;
