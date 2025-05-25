
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductContext } from '@/types/storytelling';
import { ChevronDown, ChevronUp, Package, Edit } from 'lucide-react';
import ProductContextForm from './ProductContextForm';

interface CollapsibleProductContextProps {
  productContext: ProductContext | null;
  onProductContextUpdated: (productContext: ProductContext) => void;
}

const CollapsibleProductContext: FC<CollapsibleProductContextProps> = ({ 
  productContext, 
  onProductContextUpdated 
}) => {
  const [isExpanded, setIsExpanded] = useState(!productContext); // Expand if no context exists
  const [showForm, setShowForm] = useState(!productContext); // Show form if no context exists
  
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

  // Count total items
  const getTotalItems = () => {
    if (!productContext) return 0;
    return productContext.features.length + 
           productContext.useCases.length + 
           productContext.differentiators.length;
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle 
            className="text-story-blue flex items-center cursor-pointer"
            onClick={handleToggleExpand}
          >
            <Package className="h-5 w-5 mr-2" />
            Product Context
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
          </CardTitle>
          
          {productContext && !showForm && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEdit}
              className="flex items-center"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
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
            <div className="space-y-4">
              {/* Core Narrative Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {productContext.categoryPOV && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-xs font-medium text-story-blue mb-1">Category POV</h4>
                    <p className="text-xs text-gray-700">{productContext.categoryPOV.slice(0, 100)}...</p>
                  </div>
                )}
                {productContext.companyMission && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-xs font-medium text-story-blue mb-1">Company Mission</h4>
                    <p className="text-xs text-gray-700">{productContext.companyMission.slice(0, 100)}...</p>
                  </div>
                )}
                {productContext.uniqueInsight && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-xs font-medium text-story-blue mb-1">Unique Insight</h4>
                    <p className="text-xs text-gray-700">{productContext.uniqueInsight.slice(0, 100)}...</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-2 rounded-md">
                  <p className="text-lg font-semibold text-story-blue">{productContext.features.length}</p>
                  <p className="text-xs text-gray-600">Features</p>
                </div>
                <div className="bg-green-50 p-2 rounded-md">
                  <p className="text-lg font-semibold text-green-600">{productContext.useCases.length}</p>
                  <p className="text-xs text-gray-600">Use Cases</p>
                </div>
                <div className="bg-purple-50 p-2 rounded-md">
                  <p className="text-lg font-semibold text-purple-600">{productContext.differentiators.length}</p>
                  <p className="text-xs text-gray-600">Differentiators</p>
                </div>
              </div>

              {/* Company Links */}
              {productContext.companyLinks && productContext.companyLinks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Company Links</h4>
                  <div className="flex flex-wrap gap-1">
                    {productContext.companyLinks.map((link, index) => (
                      <a 
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700"
                      >
                        {link.type}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed rounded-md">
              <Package className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">No product context added yet</p>
              <p className="text-gray-400 text-xs">Add product information to enhance content generation</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default CollapsibleProductContext;
