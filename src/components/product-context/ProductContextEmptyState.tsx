
import { FC } from 'react';
import { Package } from 'lucide-react';

const ProductContextEmptyState: FC = () => {
  return (
    <div className="text-center py-6 border border-dashed rounded-md">
      <Package className="h-8 w-8 mx-auto text-gray-400 mb-2" />
      <p className="text-gray-500 text-sm">No product context added yet</p>
      <p className="text-gray-400 text-xs">Add product information to enhance content generation</p>
    </div>
  );
};

export default ProductContextEmptyState;
