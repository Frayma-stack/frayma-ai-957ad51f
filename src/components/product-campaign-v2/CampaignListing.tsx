import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Target, 
  FileText, 
  Zap 
} from 'lucide-react';
import { ProductUpdateCampaign } from '@/types/productCampaign';

interface CampaignListingProps {
  campaigns: ProductUpdateCampaign[];
  onBack: () => void;
  onCreateNew: () => void;
  onCampaignSelect: (campaign: ProductUpdateCampaign) => void;
}

export const CampaignListing: React.FC<CampaignListingProps> = ({
  campaigns,
  onBack,
  onCreateNew,
  onCampaignSelect
}) => {
  const getCampaignProgress = (campaign: ProductUpdateCampaign) => {
    const completedAssets = campaign.assets.filter(asset => asset.status === 'completed').length;
    const totalAssets = campaign.assets.length;
    return totalAssets > 0 ? (completedAssets / totalAssets) * 100 : 0;
  };

  const getStatusBadge = (progress: number) => {
    if (progress === 100) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Complete</Badge>;
    } else if (progress > 0) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>;
    } else {
      return <Badge variant="outline">Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-brand-primary/10 to-purple-100 border-brand-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-brand-primary/20 rounded-lg">
                  <Zap className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl text-brand-primary">
                    Product/Feature Update Campaigns
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage your GTM campaign workspaces
                  </p>
                </div>
              </div>
            </div>
            <Button 
              onClick={onCreateNew}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start New Campaign
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Campaigns List */}
      {campaigns.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first Product/Feature Update campaign to get started with guided GTM asset creation
            </p>
            <Button 
              onClick={onCreateNew}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start New Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const progress = getCampaignProgress(campaign);
            const completedAssets = campaign.assets.filter(asset => asset.status === 'completed').length;
            
            return (
              <Card 
                key={campaign.id} 
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-brand-primary/30"
                onClick={() => onCampaignSelect(campaign)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{campaign.title}</h3>
                        {getStatusBadge(progress)}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{campaign.summary}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4" />
                          <span>{campaign.productName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span className="capitalize">{campaign.launchGoal}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6 text-right">
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        {completedAssets} of {campaign.assets.length} Assets
                      </div>
                      <div className="w-32 mb-2">
                        <Progress value={progress} className="h-2" />
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(progress)}% Complete
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};