import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types";

interface AuthContextType {
  user: User | null;
  getProfile: (email: string) => Promise<Profile>;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (
    email: string,
    profile: Record<string, unknown>
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const getProfile = async (email: string) => {
    try {
      const profile = await supabase
        .from("profiles")
        .select()
        .eq("email", email)
        .single();

      return profile.data;
    } catch (error) {}
  };

  const updateProfile = async (
    email: string,
    profile: Record<string, unknown>
  ) => {
    const data: Record<string, unknown> = {};

    if (profile?.hasCompletedOnboarding !== undefined)
      data.hasCompletedOnboarding = profile.hasCompletedOnboarding;
    if (profile?.avatar_url !== undefined) data.avatar_url = profile.avatar_url;
    if (profile?.full_name !== undefined) data.full_name = profile.full_name;

    const r = await supabase
      .from("profiles")
      .update({
        ...data,
      })
      .eq("email", email);

    console.log(r, "Updated");
  };

  const value = {
    user,
    getProfile,
    session,
    loading,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
