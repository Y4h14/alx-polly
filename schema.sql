-- Alx-Polly Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT,
  avatar_url TEXT
);

-- Polls Table
CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Poll Options Table
CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Votes Table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  voter_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

-- QR Codes Table
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_id ON profiles(id);
CREATE INDEX idx_polls_created_by ON polls(created_by);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_option_id ON votes(option_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_qr_codes_poll_id ON qr_codes(poll_id);

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_polls_updated_at
    BEFORE UPDATE ON polls
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_qr_codes_updated_at
    BEFORE UPDATE ON qr_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Polls policies
CREATE POLICY "Polls are viewable by everyone"
    ON polls FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Users can create polls"
    ON polls FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own polls"
    ON polls FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by);

-- Poll options policies
CREATE POLICY "Poll options are viewable by everyone"
    ON poll_options FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Users can insert poll options for their polls"
    ON poll_options FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM polls
            WHERE polls.id = poll_options.poll_id
            AND polls.created_by = auth.uid()
        )
    );
    
-- Votes policies
CREATE POLICY "Votes are viewable by everyone"
    ON votes FOR SELECT
    TO authenticated, anon
    USING (true);
    
CREATE POLICY "Anyone can vote"
    ON votes FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);
    
CREATE POLICY "Users can only update their own votes"
    ON votes FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());
    
-- QR codes policies
CREATE POLICY "QR codes are viewable by poll creators"
    ON qr_codes FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM polls
            WHERE polls.id = qr_codes.poll_id
            AND polls.created_by = auth.uid()
        )
    );
    
CREATE POLICY "Users can create QR codes for their polls"
    ON qr_codes FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM polls
            WHERE polls.id = qr_codes.poll_id
            AND polls.created_by = auth.uid()
        )
    );
    
CREATE POLICY "Users can delete QR codes for their polls"
    ON qr_codes FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM polls
            WHERE polls.id = qr_codes.poll_id
            AND polls.created_by = auth.uid()
        )
    );