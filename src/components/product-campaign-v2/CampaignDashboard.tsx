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
  CheckCircle2, 
  Clock, 
  Play 
} from 'lucide-react';
import { ProductUpdateCampaign, GTMAsset } from '@/types/productCampaign';
import { getAssetTemplate } from '@/types/productCampaign';

interface CampaignDashboardProps {
  campaign: ProductUpdateCampaign;
  onBack: () => void;
  onAssetStart: (assetType: string) => void;
  onAssetResume: (asset: GTMAsset) => void;
}

export const CampaignDashboard: React.FC<CampaignDashboardProps> = ({
  campaign,
  onBack,
  onAssetStart,
  onAssetResume
}) => {
  const completedAssets = campaign.assets.filter(asset => asset.status === 'completed').length;
  const totalAssets = campaign.assets.length;
  const progressPercentage = totalAssets > 0 ? (completedAssets / totalAssets) * 100 : 0;

  const getStatusIcon = (status: GTMAsset['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Play className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: GTMAsset['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>;
      default:
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
                <span>Back to Campaigns</span>
              </Button>
              <div>
                <CardTitle className="text-xl text-brand-primary">
                  {campaign.title}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {campaign.summary}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {completedAssets} of {totalAssets} Assets Complete
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round(progressPercentage)}% Complete
                </div>
              </div>
              <div className="w-24">
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Campaign Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-sm">Launch Goal</div>
                <div className="text-xs text-gray-600 capitalize">{campaign.launchGoal}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-sm">Product</div>
                <div className="text-xs text-gray-600">{campaign.productName}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium text-sm">Created</div>
                <div className="text-xs text-gray-600">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GTM Assets Checklist */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">GTM Assets Checklist</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {campaign.assets.map((asset) => {
              const template = getAssetTemplate(asset.type);
              if (!template) return null;
              
              return (
                <Card key={asset.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(asset.status)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          <p className="text-xs text-gray-500">{template.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {template.category}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {template.estimatedLength}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(asset.status)}
                        
                        {asset.status === 'not_started' ? (
                          <Button 
                            size="sm"
                            onClick={() => onAssetStart(asset.type)}
                            className="bg-brand-primary hover:bg-brand-primary/90"
                          >
                            Start
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => onAssetResume(asset)}
                          >
                            {asset.status === 'completed' ? 'View' : 'Resume'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};