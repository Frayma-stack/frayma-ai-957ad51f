
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { HelpCircle, LogOut, User } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const NavBar: FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  return (
    <nav className="bg-brand-primary text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/c03df3aa-a5a4-4db8-8a06-910f2452d629.png" 
              alt="Frayma AI Logo" 
              className="h-8 w-8" 
            />
            <span className="text-xl font-sora font-semibold">Frayma AI</span>
          </div>
          <p className="text-sm mt-1 opacity-90">
            Powered by the Product-Led Storytelling Approach, Its Execution Frameworks, & the 3Rs Formula.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white hover:bg-brand-primary/80">
            <HelpCircle className="h-5 w-5 mr-2" />
            How it works
          </Button>
          
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-brand-primary/80"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              className="bg-brand-cta text-white hover:bg-brand-cta/90"
              onClick={handleAuthClick}
            >
              Get Started
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
