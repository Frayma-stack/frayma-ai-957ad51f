
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader
} from "@/components/ui/card";
import { ProductContext } from '@/types/storytelling';
import ProductContextForm from './ProductContextForm';
import ProductContextHeader from './product-context/ProductContextHeader';
import ProductContextSummary from './product-context/ProductContextSummary';
import ProductContextEmptyState from './product-context/ProductContextEmptyState';

interface CollapsibleProductContextProps {
  productContext: ProductContext | null;
  onProductContextUpdated: (productContext: ProductContext) => void;
}

const CollapsibleProductContext: FC<CollapsibleProductContextProps> = ({ 
  productContext, 
  onProductContextUpdated 
}) => {
  const [isExpanded, setIsExpanded] = useState(!productContext);
  const [showForm, setShowForm] = useState(!productContext);
  
  const handleSave = (context: ProductContext) => {
    onProductContextUpdated(context);
    setShowForm(false);
  };
  
  const handleCancel = () => {
    if (productContext) {
      setShowForm(false);
    }
  };

  const handleEdit = () => {
    setShowForm(true);
    setIsExpanded(true);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && !productContext) {
      setShowForm(true);
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <ProductContextHeader
          productContext={productContext}
          isExpanded={isExpanded}
          showForm={showForm}
          onToggleExpand={handleToggleExpand}
          onEdit={handleEdit}
        />
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          {showForm ? (
            <ProductContextForm 
              isOpen={true}
              onClose={handleCancel}
              onProductContextCreated={handleSave}
              editingProductContext={productContext}
            />
          ) : productContext ? (
            <ProductContextSummary
              productContext={productContext}
              onEdit={handleEdit}
            />
          ) : (
            <ProductContextEmptyState />
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default CollapsibleProductContext;
