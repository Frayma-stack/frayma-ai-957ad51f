
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, CreditCard } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { format } from 'date-fns';

export const SubscriptionStatus = () => {
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    max_users, 
    openCustomerPortal,
    checkSubscription,
    loading 
  } = useSubscription();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP');
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Narrative Starter':
        return 'bg-blue-500';
      case 'Narrative Pro':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Subscription Status
              <Badge className={getTierColor(subscription_tier)}>
                {subscription_tier === 'free' ? 'Free' : subscription_tier}
              </Badge>
            </CardTitle>
            <CardDescription>
              {subscribed ? 'Active subscription' : 'Free tier'}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkSubscription}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Team Members</p>
              <p className="text-xs text-gray-600">Up to {max_users} users</p>
            </div>
          </div>
          
          {subscription_end && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Next Billing</p>
                <p className="text-xs text-gray-600">{formatDate(subscription_end)}</p>
              </div>
            </div>
          )}
          
          {subscribed && (
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Manage</p>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-xs"
                  onClick={openCustomerPortal}
                >
                  Billing Portal
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
