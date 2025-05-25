
import { FC } from 'react';
import { ProductContext } from '@/types/storytelling';
import { Package, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProductContextSummaryProps {
  productContext: ProductContext;
  onEdit: () => void;
}

const ProductContextSummary: FC<ProductContextSummaryProps> = ({ 
  productContext, 
  onEdit 
}) => {
  return (
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
  );
};

export default ProductContextSummary;
