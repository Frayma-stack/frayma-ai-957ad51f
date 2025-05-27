
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface TopNavigationProps {
  currentView: 'home' | 'asset' | 'ideas';
  selectedAssetType: string;
  userEmail: string;
}

const TopNavigation: FC<TopNavigationProps> = ({
  currentView,
  selectedAssetType,
  userEmail
}) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const getTitle = () => {
    if (currentView === 'home') return 'Your Dashboard';
    if (currentView === 'ideas') return 'Ideas Bank';
    return selectedAssetType.charAt(0).toUpperCase() + selectedAssetType.slice(1);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {getTitle()}
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{userEmail}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
