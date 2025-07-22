
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Package, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { ProductContext } from '@/types/storytelling';

interface ProductContextHeaderProps {
  productContext: ProductContext | null;
  isExpanded: boolean;
  showForm: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
}

const ProductContextHeader: FC<ProductContextHeaderProps> = ({
  productContext,
  isExpanded,
  showForm,
  onToggleExpand,
  onEdit
}) => {
  const getTotalItems = () => {
    if (!productContext) return 0;
    return productContext.features.length + 
           productContext.useCases.length + 
           productContext.differentiators.length;
  };

  return (
    <div className="flex justify-between items-center">
      <div 
        className="text-story-blue flex items-center cursor-pointer"
        onClick={onToggleExpand}
      >
        <Package className="h-5 w-5 mr-2" />
        <span className="text-2xl font-semibold leading-none tracking-tight">Business Context</span>
        {productContext && (
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({getTotalItems()} items)
          </span>
        )}
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 ml-2" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-2" />
        )}
      </div>
      
      {productContext && !showForm && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onEdit}
          className="flex items-center"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      )}
    </div>
  );
};

export default ProductContextHeader;
