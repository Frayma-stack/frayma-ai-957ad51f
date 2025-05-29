
import { FC, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const EmailConfirmed: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect to main app after a short delay
    if (user) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleContinue = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-green-800">Email Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-3">
              <p className="text-green-700">
                Welcome to Frayma AI! Your email has been successfully confirmed.
              </p>
              <p className="text-sm text-green-600">
                You'll be automatically redirected to the app in a few seconds, or click below to continue.
              </p>
            </div>

            <div className="bg-white/50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Sparkles className="h-5 w-5 text-story-blue" />
                <span className="font-medium text-story-blue">What's Next?</span>
              </div>
              <p className="text-sm text-gray-700">
                The Frayma AI Narrative Engine will guide you through setting up your profile, 
                business context, and target audience to start generating compelling content.
              </p>
            </div>

            <Button 
              onClick={handleContinue}
              className="w-full bg-story-blue hover:bg-story-light-blue text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start Using Frayma AI
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirmed;
