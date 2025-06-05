import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Badge } from '@/components/ui/badge';
import { Crown, User, LogOut, CreditCard } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

export const AppHeader = () => {
  const { user, signOut } = useAuth();
  const { subscription_tier, subscribed } = useSubscription();

  const getTierDisplay = () => {
    if (subscription_tier === 'free') return 'Free';
    return subscription_tier;
  };

  const getTierColor = () => {
    switch (subscription_tier) {
      case 'Narrative Starter':
        return 'bg-blue-500';
      case 'Narrative Pro':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex-1">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Frayma AI
          </Link>
        </div>
        
        {user && (
          <div className="flex items-center gap-2">
            <Badge className={getTierColor()}>
              {subscribed && <Crown className="h-3 w-3 mr-1" />}
              {getTierDisplay()}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/subscription" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Subscription
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};
