
import { FC } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from '@/contexts/AuthContext';
import { ViewType } from './AppLayout';

interface AppHeaderProps {
  currentView: ViewType;
}

const AppHeader: FC<AppHeaderProps> = ({ currentView }) => {
  const { user } = useAuth();

  const getViewTitle = () => {
    switch (currentView) {
      case 'home': return 'Your Dashboard';
      case 'ideas': return 'Ideas Bank';
      case 'clients': return 'Client Manager';
      case 'authors': return 'Author Manager';
      case 'icp-scripts': return 'ICP Scripts';
      case 'success-stories': return 'Success Stories';
      case 'product-context': return 'Product Context';
      case 'drafts': return 'Drafts';
      default: return 'Your Dashboard';
    }
  };

  // Get user display name or email
  const getUserDisplay = () => {
    if (!user) return 'Guest';
    
    // Try to get full name from user metadata
    const fullName = user.user_metadata?.full_name;
    if (fullName) return fullName;
    
    // Fallback to email
    return user.email || 'User';
  };

  return (
    <div className="border-b bg-white p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <h2 className="text-lg font-medium text-gray-900">
          {getViewTitle()}
        </h2>
      </div>
      
      <div className="text-sm text-gray-500">
        {getUserDisplay()}
      </div>
    </div>
  );
};

export default AppHeader;
