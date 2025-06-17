
import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EnforcedOnboardingStepEmailProps {
  onEmailConfirmed: () => void;
}

const EnforcedOnboardingStepEmail: FC<EnforcedOnboardingStepEmailProps> = ({
  onEmailConfirmed,
}) => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setIsConfirmed(user.email_confirmed_at !== null);
    }
  }, [user]);

  const handleResendConfirmation = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast.success('Confirmation email sent! Please check your inbox.');
    } catch (error: any) {
      console.error('Error resending confirmation:', error);
      toast.error(error.message || 'Failed to resend confirmation email');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckStatus = async () => {
    setCheckingStatus(true);
    try {
      const { data: { user: refreshedUser }, error } = await supabase.auth.getUser();
      
      if (error) throw error;

      if (refreshedUser?.email_confirmed_at) {
        setIsConfirmed(true);
        toast.success('Email confirmed successfully!');
        onEmailConfirmed();
      } else {
        toast.info('Email not yet confirmed. Please check your inbox.');
      }
    } catch (error: any) {
      console.error('Error checking email status:', error);
      toast.error('Failed to check email status');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleContinue = () => {
    if (isConfirmed) {
      onEmailConfirmed();
    }
  };

  if (isConfirmed) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <CardTitle className="text-green-800">Email Confirmed!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              ✓ Your email address <strong>{email}</strong> has been confirmed.
            </p>
          </div>
          
          <Button 
            onClick={handleContinue}
            className="w-full bg-story-blue hover:bg-story-light-blue"
          >
            Continue to Subscription Selection
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Mail className="h-6 w-6 text-story-blue" />
          <CardTitle>Confirm Your Email Address</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium">Email confirmation required</p>
              <p className="text-yellow-700 text-sm mt-1">
                Please check your inbox for a confirmation email and click the verification link.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your Email Address</label>
            <Input
              type="email"
              value={email}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleResendConfirmation}
              disabled={isResending}
              variant="outline"
              className="w-full"
            >
              {isResending ? 'Sending...' : 'Resend Confirmation Email'}
            </Button>

            <Button 
              onClick={handleCheckStatus}
              disabled={checkingStatus}
              className="w-full bg-story-blue hover:bg-story-light-blue"
            >
              {checkingStatus ? 'Checking...' : 'I\'ve Confirmed My Email'}
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Can't find the email? Check your spam folder or try resending.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnforcedOnboardingStepEmail;
