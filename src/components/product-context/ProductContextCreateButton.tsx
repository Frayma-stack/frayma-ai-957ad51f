
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from 'lucide-react';

interface ProductContextCreateButtonProps {
  onCreateClick: () => void;
}

const ProductContextCreateButton: FC<ProductContextCreateButtonProps> = ({
  onCreateClick
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-story-blue flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Business Context
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 border border-dashed rounded-md">
          <Package className="h-10 w-10 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 mb-2">No business context found</p>
          <p className="text-gray-400 text-sm mb-4">
            Create business context to enhance content generation with features, use cases, and differentiators
          </p>
          <Button 
            onClick={onCreateClick}
            className="bg-story-blue hover:bg-story-light-blue"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Business Context
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductContextCreateButton;
