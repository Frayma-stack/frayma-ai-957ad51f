
import { FC, ReactNode, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PasswordResetForm from './PasswordResetForm';

interface AuthCardProps {
  signInForm: ReactNode;
  signUpForm: ReactNode;
}

const AuthCard: FC<AuthCardProps> = ({ signInForm, signUpForm }) => {
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  if (showPasswordReset) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Password Recovery</CardTitle>
          <CardDescription>
            Reset your password to regain access to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordResetForm onBackToSignIn={() => setShowPasswordReset(false)} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
        <CardDescription>
          Sign in to your account or create a new one to begin crafting compelling narratives.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            {signInForm}
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setShowPasswordReset(true)}
                className="text-sm text-brand-primary hover:text-brand-primary/80"
              >
                Forgot your password?
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="signup">
            {signUpForm}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthCard;
