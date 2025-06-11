import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthCard from "@/components/auth/AuthCard";
import AuthSignInForm from "@/components/auth/AuthSignInForm";
import AuthSignUpForm from "@/components/auth/AuthSignUpForm";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { loading, handleSignIn, handleSignUp } = useAuthHandlers();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  const onSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignIn(email, password);
  };

  const onSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignUp(email, password, fullName);
  };

  if (user) {
    return null; // Will redirect via useEffect
  }

  const signInForm = (
    <AuthSignInForm
      email={email}
      password={password}
      loading={loading}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={onSignIn}
    />
  );

  const signUpForm = (
    <AuthSignUpForm
      email={email}
      password={password}
      fullName={fullName}
      loading={loading}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onFullNameChange={setFullName}
      onSubmit={onSignUp}
    />
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <AuthHeader />
        <AuthCard signInForm={signInForm} signUpForm={signUpForm} />
      </div>
    </div>
  );
};

export default Auth;
