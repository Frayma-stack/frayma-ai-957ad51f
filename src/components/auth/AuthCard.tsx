
import { FC, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthCardProps {
  signInForm: ReactNode;
  signUpForm: ReactNode;
}

const AuthCard: FC<AuthCardProps> = ({ signInForm, signUpForm }) => {
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
          
          <TabsContent value="signin">
            {signInForm}
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
