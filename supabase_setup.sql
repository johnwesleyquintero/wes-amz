-- Create the ENUM type for user tiers
CREATE TYPE public.user_tier AS ENUM ('Free', 'Enterprise');

-- Create the public.organizations table first
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the public.profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    tier public.user_tier DEFAULT 'Free'::public.user_tier NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the public.organization_members table
CREATE TABLE public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'Member', -- Consider making this an ENUM as well: 'Admin', 'Member'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (organization_id, user_id)
);

-- Add indexes for performance
CREATE INDEX idx_profiles_organization_id ON public.profiles (organization_id);
CREATE INDEX idx_organizations_owner_id ON public.organizations (owner_id);
CREATE INDEX idx_organization_members_organization_id ON public.organization_members (organization_id);
CREATE INDEX idx_organization_members_user_id ON public.organization_members (user_id);

-- Enable Row Level Security (RLS) for all new tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public.profiles
CREATE POLICY "Users can view their own profile." ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for public.organizations
-- Admins/Owners can view organizations
CREATE POLICY "Organization owners and members can view their organization." ON public.organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid())
    OR owner_id = auth.uid()
  );

-- Only owners can update organizations
CREATE POLICY "Organization owners can update their organization." ON public.organizations
  FOR UPDATE USING (owner_id = auth.uid());

-- RLS Policies for public.organization_members
-- Members can view their own organization's members
CREATE POLICY "Organization members can view members of their organization." ON public.organization_members
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid())
  );

-- Only organization admins can insert/update/delete members
CREATE POLICY "Organization admins can manage members." ON public.organization_members
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role = 'Admin'
    )
  );

-- Optional: Function to create a profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Trigger to call handle_new_user on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();