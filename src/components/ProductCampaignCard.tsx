
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, FileText, Users } from 'lucide-react';

interface ProductCampaignCardProps {
  onClick: () => void;
}

const ProductCampaignCard: React.FC<ProductCampaignCardProps> = ({ onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-brand-primary/30 bg-gradient-to-br from-brand-primary/5 to-purple-50"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-brand-primary/20 rounded-lg w-fit">
            <Zap className="h-6 w-6 text-brand-primary" />
          </div>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
            NEW
          </Badge>
        </div>
        <CardTitle className="text-xl text-brand-primary">
          Product/Feature Update Campaign
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Auto-craft complete GTM content packages for product updates using Product-Led Storytelling
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Target className="h-4 w-4 text-brand-primary" />
            <span>11 GTM Assets</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FileText className="h-4 w-4 text-brand-primary" />
            <span>PLS Framework</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-brand-primary" />
            <span>ICP-Targeted</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Zap className="h-4 w-4 text-brand-primary" />
            <span>Auto-Generated</span>
          </div>
        </div>
        
        <div className="border-t pt-3 mt-4">
          <p className="text-xs text-gray-500 mb-2">Generated Assets Include:</p>
          <div className="text-xs text-gray-600 space-y-1">
            <div>• Articles (General + ICP-specific)</div>
            <div>• Social Posts (LinkedIn, Twitter)</div>
            <div>• Email Newsletter & Changelog</div>
            <div>• Product Video Script</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCampaignCard;
