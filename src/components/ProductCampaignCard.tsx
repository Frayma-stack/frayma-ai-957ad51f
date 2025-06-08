
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from 'lucide-react';

interface ProductCampaignCardProps {
  onClick: () => void;
}

const ProductCampaignCard = ({ onClick }: ProductCampaignCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-brand-primary/30 bg-gradient-to-br from-brand-primary/5 to-brand-primary/10"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Zap className="h-8 w-8 text-brand-primary" />
          <Badge className="bg-brand-primary text-white">NEW</Badge>
        </div>
        <CardTitle className="text-xl text-brand-primary">Product/Feature Update Campaign</CardTitle>
        <p className="text-gray-600 text-sm">
          Auto-craft complete GTM content packages for product or feature updates using the Product-Led Storytelling approach.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline">11 GTM Assets</Badge>
            <Badge variant="outline">PLS Framework</Badge>
            <Badge variant="outline">ICP-Targeted</Badge>
            <Badge variant="outline">Auto-Crafted</Badge>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium text-sm text-gray-900">Generated Assets Include:</p>
            <div className="space-y-1 text-sm text-gray-600">
              <div>• Articles (General + ICP-specific)</div>
              <div>• Social Posts (LinkedIn, Twitter)</div>
              <div>• Email Newsletter & Changelog</div>
              <div>• Product Video Script</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCampaignCard;
