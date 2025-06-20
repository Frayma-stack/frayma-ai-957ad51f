
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PasswordResetFormProps {
  onBackToSignIn: () => void;
}

const PasswordResetForm: FC<PasswordResetFormProps> = ({ onBackToSignIn }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      setSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Check Your Email</h3>
          <p className="text-sm text-gray-600">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Click the link in the email to reset your password.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onBackToSignIn}
          className="w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handlePasswordReset} className="space-y-4">
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold">Reset Your Password</h3>
        <p className="text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <Input
          id="reset-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Button 
          type="submit" 
          className="w-full bg-brand-primary hover:bg-brand-primary/90"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Reset Link
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onBackToSignIn}
          className="w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Button>
      </div>
    </form>
  );
};

export default PasswordResetForm;
