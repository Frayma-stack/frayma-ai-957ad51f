
-- Create a table to track onboarding progress and enforce step completion
CREATE TABLE public.onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 1,
  completed_steps JSONB NOT NULL DEFAULT '[]',
  client_created BOOLEAN NOT NULL DEFAULT false,
  author_created BOOLEAN NOT NULL DEFAULT false,
  icp_script_created BOOLEAN NOT NULL DEFAULT false,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  subscription_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for onboarding progress
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for onboarding progress
CREATE POLICY "Users can view their own onboarding progress" 
  ON public.onboarding_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding progress" 
  ON public.onboarding_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding progress" 
  ON public.onboarding_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create a table to store transcript uploads for ICP analysis
CREATE TABLE public.transcript_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  onboarding_progress_id UUID REFERENCES public.onboarding_progress(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_content TEXT NOT NULL,
  upload_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  analyzed BOOLEAN NOT NULL DEFAULT false,
  analysis_result JSONB
);

-- Enable RLS for transcript uploads
ALTER TABLE public.transcript_uploads ENABLE ROW LEVEL SECURITY;

-- Create policies for transcript uploads
CREATE POLICY "Users can view their own transcript uploads" 
  ON public.transcript_uploads 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transcript uploads" 
  ON public.transcript_uploads 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transcript uploads" 
  ON public.transcript_uploads 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at timestamp
CREATE TRIGGER update_onboarding_progress_updated_at
  BEFORE UPDATE ON public.onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create function to initialize onboarding progress for new users
CREATE OR REPLACE FUNCTION public.initialize_onboarding_progress()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.onboarding_progress (user_id, email, current_step)
  VALUES (NEW.id, NEW.email, 1);
  RETURN NEW;
END;
$$;

-- Create trigger to initialize onboarding progress
CREATE TRIGGER on_auth_user_created_onboarding
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.initialize_onboarding_progress();
