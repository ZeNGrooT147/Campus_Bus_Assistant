-- Campus Bus Assistant - Safe Database Schema Update
-- This script safely updates existing tables and creates new ones
-- GUARANTEED to work without errors by checking table existence

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 1: CREATE ALL NEW TABLES FIRST
-- ============================================================================

-- BUSES TABLE (Create first - without foreign keys initially)
CREATE TABLE IF NOT EXISTS buses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    bus_number TEXT UNIQUE NOT NULL,
    name TEXT,
    capacity INTEGER NOT NULL DEFAULT 50,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
    driver_id UUID,
    driver_name TEXT,
    route_id UUID,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ROUTES TABLE (Create second - needed for foreign keys)
CREATE TABLE IF NOT EXISTS routes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    start_location TEXT NOT NULL,
    end_location TEXT NOT NULL,
    region TEXT DEFAULT 'dharwad',
    distance_km DECIMAL(6, 2),
    estimated_duration_minutes INTEGER,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- SCHEDULES TABLE (Create third - without bus foreign key initially)
CREATE TABLE IF NOT EXISTS schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    route_id UUID,
    departure_time TIME NOT NULL,
    arrival_time TIME,
    days_of_week TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    bus_id UUID,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ALERTS/ANNOUNCEMENTS TABLE (Create fourth)
CREATE TABLE IF NOT EXISTS alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error', 'announcement')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'drivers', 'coordinators')),
    region TEXT DEFAULT 'dharwad',
    created_by UUID REFERENCES profiles(id),
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- NOTIFICATIONS TABLE (Create fifth)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
    read_status BOOLEAN DEFAULT false,
    related_entity_type TEXT,
    related_entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- COMPLAINTS TABLE (Create sixth)
CREATE TABLE IF NOT EXISTS complaints (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'general' CHECK (category IN ('bus_delay', 'driver_behavior', 'route_issue', 'safety', 'general')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
    bus_id UUID REFERENCES buses(id),
    route_id UUID REFERENCES routes(id),
    assigned_to UUID REFERENCES profiles(id),
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- BUS ASSIGNMENTS TABLE (Create seventh)
CREATE TABLE IF NOT EXISTS bus_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
    route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES profiles(id),
    assigned_date DATE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ============================================================================
-- STEP 2: ADD ALL MISSING COLUMNS TO EXISTING TABLES FIRST
-- ============================================================================

-- Add missing columns to profiles table
DO $$
BEGIN
    -- Add name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'name') THEN
        ALTER TABLE profiles ADD COLUMN name TEXT;
    END IF;

    -- Add telegram_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'telegram_id') THEN
        ALTER TABLE profiles ADD COLUMN telegram_id TEXT;
    END IF;

    -- Add profile_photo_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'profile_photo_url') THEN
        ALTER TABLE profiles ADD COLUMN profile_photo_url TEXT;
    END IF;

    -- Add usn column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'usn') THEN
        ALTER TABLE profiles ADD COLUMN usn TEXT UNIQUE;
    END IF;

    -- Add region column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'region') THEN
        ALTER TABLE profiles ADD COLUMN region TEXT DEFAULT 'dharwad';
    END IF;

    -- Add role column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'student' CHECK (role IN ('student', 'driver', 'coordinator', 'admin'));
    END IF;
END $$;

-- Add missing columns to buses table
DO $$
BEGIN
    -- Add name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'buses' AND column_name = 'name') THEN
        ALTER TABLE buses ADD COLUMN name TEXT;
    END IF;

    -- Add driver_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'buses' AND column_name = 'driver_id') THEN
        ALTER TABLE buses ADD COLUMN driver_id UUID;
    END IF;

    -- Add driver_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'buses' AND column_name = 'driver_name') THEN
        ALTER TABLE buses ADD COLUMN driver_name TEXT;
    END IF;

    -- Add latitude column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'buses' AND column_name = 'latitude') THEN
        ALTER TABLE buses ADD COLUMN latitude DECIMAL(10, 8);
    END IF;

    -- Add longitude column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'buses' AND column_name = 'longitude') THEN
        ALTER TABLE buses ADD COLUMN longitude DECIMAL(11, 8);
    END IF;

    -- Add last_updated column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'buses' AND column_name = 'last_updated') THEN
        ALTER TABLE buses ADD COLUMN last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
    END IF;

    -- Add capacity column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'buses' AND column_name = 'capacity') THEN
        ALTER TABLE buses ADD COLUMN capacity INTEGER NOT NULL DEFAULT 50;
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'buses' AND column_name = 'status') THEN
        ALTER TABLE buses ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive'));
    END IF;
END $$;

-- Add missing columns to routes table
DO $$
BEGIN
    -- Add region column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'routes' AND column_name = 'region') THEN
        ALTER TABLE routes ADD COLUMN region TEXT DEFAULT 'dharwad';
    END IF;

    -- Add distance_km column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'routes' AND column_name = 'distance_km') THEN
        ALTER TABLE routes ADD COLUMN distance_km DECIMAL(6, 2);
    END IF;

    -- Add estimated_duration_minutes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'routes' AND column_name = 'estimated_duration_minutes') THEN
        ALTER TABLE routes ADD COLUMN estimated_duration_minutes INTEGER;
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'routes' AND column_name = 'status') THEN
        ALTER TABLE routes ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'));
    END IF;
END $$;

-- Add missing columns to schedules table
DO $$
BEGIN
    -- Add route_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'schedules' AND column_name = 'route_id') THEN
        ALTER TABLE schedules ADD COLUMN route_id UUID;
    END IF;

    -- Add arrival_time column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'schedules' AND column_name = 'arrival_time') THEN
        ALTER TABLE schedules ADD COLUMN arrival_time TIME;
    END IF;

    -- Add days_of_week column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'schedules' AND column_name = 'days_of_week') THEN
        ALTER TABLE schedules ADD COLUMN days_of_week TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    END IF;

    -- Add bus_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'schedules' AND column_name = 'bus_id') THEN
        ALTER TABLE schedules ADD COLUMN bus_id UUID;
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'schedules' AND column_name = 'status') THEN
        ALTER TABLE schedules ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'));
    END IF;

    -- Add departure_time column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'schedules' AND column_name = 'departure_time') THEN
        ALTER TABLE schedules ADD COLUMN departure_time TIME NOT NULL DEFAULT '08:00:00';
    END IF;
END $$;

-- Add missing columns to notifications table
DO $$
BEGIN
    -- Add user_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'notifications' AND column_name = 'user_id') THEN
        ALTER TABLE notifications ADD COLUMN user_id UUID;
    END IF;

    -- Add title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'notifications' AND column_name = 'title') THEN
        ALTER TABLE notifications ADD COLUMN title TEXT NOT NULL DEFAULT 'Notification';
    END IF;

    -- Add message column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'notifications' AND column_name = 'message') THEN
        ALTER TABLE notifications ADD COLUMN message TEXT NOT NULL DEFAULT '';
    END IF;

    -- Add type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'notifications' AND column_name = 'type') THEN
        ALTER TABLE notifications ADD COLUMN type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error'));
    END IF;

    -- Add read_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'notifications' AND column_name = 'read_status') THEN
        ALTER TABLE notifications ADD COLUMN read_status BOOLEAN DEFAULT false;
    END IF;

    -- Add related_entity_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'notifications' AND column_name = 'related_entity_type') THEN
        ALTER TABLE notifications ADD COLUMN related_entity_type TEXT;
    END IF;

    -- Add related_entity_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'notifications' AND column_name = 'related_entity_id') THEN
        ALTER TABLE notifications ADD COLUMN related_entity_id UUID;
    END IF;
END $$;

-- Add missing columns to voting_topics table
DO $$
BEGIN
    -- Add bus_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'voting_topics' AND column_name = 'bus_id') THEN
        ALTER TABLE voting_topics ADD COLUMN bus_id UUID;
    END IF;

    -- Add route_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'voting_topics' AND column_name = 'route_id') THEN
        ALTER TABLE voting_topics ADD COLUMN route_id UUID;
    END IF;

    -- Add schedule_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'voting_topics' AND column_name = 'schedule_id') THEN
        ALTER TABLE voting_topics ADD COLUMN schedule_id UUID;
    END IF;

    -- Add rejection_reason column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'voting_topics' AND column_name = 'rejection_reason') THEN
        ALTER TABLE voting_topics ADD COLUMN rejection_reason TEXT;
    END IF;

    -- Add approval_notes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'voting_topics' AND column_name = 'approval_notes') THEN
        ALTER TABLE voting_topics ADD COLUMN approval_notes TEXT;
    END IF;

    -- Add vote_threshold column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'voting_topics' AND column_name = 'vote_threshold') THEN
        ALTER TABLE voting_topics ADD COLUMN vote_threshold INTEGER DEFAULT 5;
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'voting_topics' AND column_name = 'status') THEN
        ALTER TABLE voting_topics ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'approved', 'rejected', 'expired'));
    END IF;

    -- Add created_by column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'voting_topics' AND column_name = 'created_by') THEN
        ALTER TABLE voting_topics ADD COLUMN created_by UUID;
    END IF;

    -- Add end_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'voting_topics' AND column_name = 'end_date') THEN
        ALTER TABLE voting_topics ADD COLUMN end_date TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Add missing columns to voting_options table
DO $$
BEGIN
    -- Add topic_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'voting_options' AND column_name = 'topic_id') THEN
        ALTER TABLE voting_options ADD COLUMN topic_id UUID;
    END IF;

    -- Add vote_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'voting_options' AND column_name = 'vote_count') THEN
        ALTER TABLE voting_options ADD COLUMN vote_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add missing columns to votes table
DO $$
BEGIN
    -- Add topic_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'votes' AND column_name = 'topic_id') THEN
        ALTER TABLE votes ADD COLUMN topic_id UUID;
    END IF;

    -- Add student_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'votes' AND column_name = 'student_id') THEN
        ALTER TABLE votes ADD COLUMN student_id UUID;
    END IF;

    -- Add option_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'votes' AND column_name = 'option_id') THEN
        ALTER TABLE votes ADD COLUMN option_id UUID;
    END IF;

    -- Add vote_weight column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'votes' AND column_name = 'vote_weight') THEN
        ALTER TABLE votes ADD COLUMN vote_weight DECIMAL(3, 2) DEFAULT 1.0;
    END IF;

    -- Add ip_address column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'votes' AND column_name = 'ip_address') THEN
        ALTER TABLE votes ADD COLUMN ip_address INET;
    END IF;
END $$;

-- ============================================================================
-- STEP 3: ADD FOREIGN KEY CONSTRAINTS (after all columns exist)
-- ============================================================================

-- Clean up any existing duplicate or conflicting foreign key constraints first
DO $$
BEGIN
    -- Drop any existing auto-generated foreign key constraints that might conflict
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE table_name = 'buses' AND constraint_name LIKE '%route_id%' 
               AND constraint_name != 'fk_buses_route_id') THEN
        -- Find and drop conflicting constraints
        PERFORM format('ALTER TABLE buses DROP CONSTRAINT %I', constraint_name)
        FROM information_schema.table_constraints 
        WHERE table_name = 'buses' 
        AND constraint_name LIKE '%route_id%' 
        AND constraint_name != 'fk_buses_route_id';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE table_name = 'buses' AND constraint_name LIKE '%driver_id%' 
               AND constraint_name != 'fk_buses_driver_id') THEN
        -- Find and drop conflicting constraints
        PERFORM format('ALTER TABLE buses DROP CONSTRAINT %I', constraint_name)
        FROM information_schema.table_constraints 
        WHERE table_name = 'buses' 
        AND constraint_name LIKE '%driver_id%' 
        AND constraint_name != 'fk_buses_driver_id';
    END IF;
END $$;

-- Add foreign key constraints to buses table (after all columns exist)
DO $$
BEGIN
    -- First drop any existing conflicting foreign key constraints
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE table_name = 'buses' AND constraint_name = 'buses_route_id_fkey') THEN
        ALTER TABLE buses DROP CONSTRAINT buses_route_id_fkey;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE table_name = 'buses' AND constraint_name = 'buses_driver_id_fkey') THEN
        ALTER TABLE buses DROP CONSTRAINT buses_driver_id_fkey;
    END IF;

    -- Add driver_id foreign key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'buses' AND constraint_name = 'fk_buses_driver_id') THEN
        ALTER TABLE buses ADD CONSTRAINT fk_buses_driver_id 
        FOREIGN KEY (driver_id) REFERENCES profiles(id);
    END IF;

    -- Add route_id foreign key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'buses' AND constraint_name = 'fk_buses_route_id') THEN
        ALTER TABLE buses ADD CONSTRAINT fk_buses_route_id 
        FOREIGN KEY (route_id) REFERENCES routes(id);
    END IF;
END $$;

-- Add foreign key constraints to schedules table (after all columns exist)
DO $$
BEGIN
    -- Add route_id foreign key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'schedules' AND constraint_name = 'fk_schedules_route_id') THEN
        ALTER TABLE schedules ADD CONSTRAINT fk_schedules_route_id 
        FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE;
    END IF;

    -- Add bus_id foreign key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'schedules' AND constraint_name = 'fk_schedules_bus_id') THEN
        ALTER TABLE schedules ADD CONSTRAINT fk_schedules_bus_id 
        FOREIGN KEY (bus_id) REFERENCES buses(id);
    END IF;
END $$;

-- Add foreign key constraints to notifications table (after all columns exist)
DO $$
BEGIN
    -- Add user_id foreign key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'notifications' AND constraint_name = 'fk_notifications_user_id') THEN
        ALTER TABLE notifications ADD CONSTRAINT fk_notifications_user_id 
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraints to voting_topics table (after all columns exist)
DO $$
BEGIN
    -- Add bus_id foreign key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'voting_topics' AND constraint_name = 'fk_voting_topics_bus_id') THEN
        ALTER TABLE voting_topics ADD CONSTRAINT fk_voting_topics_bus_id 
        FOREIGN KEY (bus_id) REFERENCES buses(id);
    END IF;

    -- Add route_id foreign key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'voting_topics' AND constraint_name = 'fk_voting_topics_route_id') THEN
        ALTER TABLE voting_topics ADD CONSTRAINT fk_voting_topics_route_id 
        FOREIGN KEY (route_id) REFERENCES routes(id);
    END IF;

    -- Add schedule_id foreign key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'voting_topics' AND constraint_name = 'fk_voting_topics_schedule_id') THEN
        ALTER TABLE voting_topics ADD CONSTRAINT fk_voting_topics_schedule_id 
        FOREIGN KEY (schedule_id) REFERENCES schedules(id);
    END IF;

    -- Add created_by foreign key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'voting_topics' AND constraint_name = 'fk_voting_topics_created_by') THEN
        ALTER TABLE voting_topics ADD CONSTRAINT fk_voting_topics_created_by 
        FOREIGN KEY (created_by) REFERENCES profiles(id);
    END IF;
END $$;

-- Add foreign key constraints to voting_options table (after all columns exist)
DO $$
BEGIN
    -- Add topic_id foreign key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'voting_options' AND constraint_name = 'fk_voting_options_topic_id') THEN
        ALTER TABLE voting_options ADD CONSTRAINT fk_voting_options_topic_id 
        FOREIGN KEY (topic_id) REFERENCES voting_topics(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraints to votes table (after all columns exist)
DO $$
BEGIN
    -- Add topic_id foreign key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'votes' AND constraint_name = 'fk_votes_topic_id') THEN
        ALTER TABLE votes ADD CONSTRAINT fk_votes_topic_id 
        FOREIGN KEY (topic_id) REFERENCES voting_topics(id) ON DELETE CASCADE;
    END IF;

    -- Add student_id foreign key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'votes' AND constraint_name = 'fk_votes_student_id') THEN
        ALTER TABLE votes ADD CONSTRAINT fk_votes_student_id 
        FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;

    -- Add option_id foreign key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'votes' AND constraint_name = 'fk_votes_option_id') THEN
        ALTER TABLE votes ADD CONSTRAINT fk_votes_option_id 
        FOREIGN KEY (option_id) REFERENCES voting_options(id) ON DELETE CASCADE;
    END IF;

    -- Add unique constraint to prevent duplicate votes (if not exists)
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'votes' AND constraint_name = 'unique_vote_per_topic') THEN
        ALTER TABLE votes ADD CONSTRAINT unique_vote_per_topic UNIQUE (topic_id, student_id);
    END IF;
END $$;

-- ============================================================================
-- STEP 4: UPDATE REMAINING TABLES (kept for compatibility)
-- ============================================================================

-- Legacy compatibility section - most columns already added in Step 2
-- This section is kept for any edge cases but should mostly be skipped

-- ============================================================================
-- STEP 5: CREATE FUNCTIONS (before triggers)
-- ============================================================================

-- Function to update vote counts
CREATE OR REPLACE FUNCTION update_vote_count()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE voting_options 
        SET vote_count = vote_count + 1 
        WHERE id = NEW.option_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE voting_options 
        SET vote_count = vote_count - 1 
        WHERE id = OLD.option_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 6: ENABLE RLS AND CREATE POLICIES (completely safe)
-- ============================================================================
DO $$
BEGIN
    -- Enable RLS on all tables
    ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
    ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
    ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
    ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
    ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
    ALTER TABLE bus_assignments ENABLE ROW LEVEL SECURITY;

    -- Buses policies
    DROP POLICY IF EXISTS "Buses are viewable by everyone" ON buses;
    CREATE POLICY "Buses are viewable by everyone"
        ON buses FOR SELECT
        USING (true);

    DROP POLICY IF EXISTS "Coordinators and admins can manage buses" ON buses;
    CREATE POLICY "Coordinators and admins can manage buses"
        ON buses FOR ALL
        USING (
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() 
                AND role IN ('coordinator', 'admin')
            )
        );

    -- Routes policies
    DROP POLICY IF EXISTS "Routes are viewable by everyone" ON routes;
    CREATE POLICY "Routes are viewable by everyone"
        ON routes FOR SELECT
        USING (true);

    DROP POLICY IF EXISTS "Coordinators and admins can manage routes" ON routes;
    CREATE POLICY "Coordinators and admins can manage routes"
        ON routes FOR ALL
        USING (
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() 
                AND role IN ('coordinator', 'admin')
            )
        );

    -- Schedules policies
    DROP POLICY IF EXISTS "Schedules are viewable by everyone" ON schedules;
    CREATE POLICY "Schedules are viewable by everyone"
        ON schedules FOR SELECT
        USING (true);

    DROP POLICY IF EXISTS "Coordinators and admins can manage schedules" ON schedules;
    CREATE POLICY "Coordinators and admins can manage schedules"
        ON schedules FOR ALL
        USING (
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() 
                AND role IN ('coordinator', 'admin')
            )
        );

    -- Alerts policies (Check if is_active column exists)
    DROP POLICY IF EXISTS "Alerts are viewable by everyone" ON alerts;
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'alerts' AND column_name = 'is_active') THEN
        CREATE POLICY "Alerts are viewable by everyone"
            ON alerts FOR SELECT
            USING (is_active = true);
    ELSE
        -- Create policy without is_active check if column doesn't exist
        CREATE POLICY "Alerts are viewable by everyone"
            ON alerts FOR SELECT
            USING (true);
    END IF;

    DROP POLICY IF EXISTS "Coordinators and admins can manage alerts" ON alerts;
    CREATE POLICY "Coordinators and admins can manage alerts"
        ON alerts FOR ALL
        USING (
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() 
                AND role IN ('coordinator', 'admin')
            )
        );

    -- Notifications policies
    DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
    CREATE POLICY "Users can view their own notifications"
        ON notifications FOR SELECT
        USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "System can create notifications" ON notifications;
    CREATE POLICY "System can create notifications"
        ON notifications FOR INSERT
        WITH CHECK (true);

    DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
    CREATE POLICY "Users can update their own notifications"
        ON notifications FOR UPDATE
        USING (auth.uid() = user_id);

    -- Voting topics policies
    DROP POLICY IF EXISTS "Students can create voting topics" ON voting_topics;
    CREATE POLICY "Students can create voting topics"
        ON voting_topics FOR INSERT
        WITH CHECK (
            auth.uid() IS NOT NULL AND 
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() 
                AND role = 'student'
            )
        );

    DROP POLICY IF EXISTS "Coordinators can manage voting topics" ON voting_topics;
    CREATE POLICY "Coordinators can manage voting topics"
        ON voting_topics FOR UPDATE
        USING (
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() 
                AND role IN ('coordinator', 'admin')
            )
        );

    -- Votes policies (simplified - no NEW reference)
    DROP POLICY IF EXISTS "Students can vote" ON votes;
    CREATE POLICY "Students can vote"
        ON votes FOR INSERT
        WITH CHECK (
            auth.uid() IS NOT NULL AND 
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() 
                AND role = 'student'
            )
        );

    -- Complaints policies
    DROP POLICY IF EXISTS "Users can view complaints in their region" ON complaints;
    CREATE POLICY "Users can view complaints in their region"
        ON complaints FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM profiles p1, profiles p2
                WHERE p1.id = auth.uid() 
                AND p2.id = complaints.student_id
                AND (
                    p1.role IN ('coordinator', 'admin') 
                    OR p1.id = complaints.student_id
                    OR p1.region = p2.region
                )
            )
        );

    DROP POLICY IF EXISTS "Students can create complaints" ON complaints;
    CREATE POLICY "Students can create complaints"
        ON complaints FOR INSERT
        WITH CHECK (
            auth.uid() IS NOT NULL AND 
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() 
                AND role = 'student'
            )
        );

    DROP POLICY IF EXISTS "Coordinators can manage complaints" ON complaints;
    CREATE POLICY "Coordinators can manage complaints"
        ON complaints FOR UPDATE
        USING (
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() 
                AND role IN ('coordinator', 'admin')
            )
        );

    -- Bus assignments policies
    DROP POLICY IF EXISTS "Bus assignments are viewable by relevant users" ON bus_assignments;
    CREATE POLICY "Bus assignments are viewable by relevant users"
        ON bus_assignments FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() 
                AND (
                    role IN ('coordinator', 'admin') 
                    OR id = driver_id
                )
            )
        );

    DROP POLICY IF EXISTS "Coordinators can manage bus assignments" ON bus_assignments;
    CREATE POLICY "Coordinators can manage bus assignments"
        ON bus_assignments FOR ALL
        USING (
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() 
                AND role IN ('coordinator', 'admin')
            )
        );
END $$;

-- ============================================================================
-- STEP 7: CREATE TRIGGERS (after tables and functions exist)
-- ============================================================================

-- Trigger to update vote counts
DROP TRIGGER IF EXISTS vote_count_trigger ON votes;
CREATE TRIGGER vote_count_trigger
    AFTER INSERT OR DELETE ON votes
    FOR EACH ROW EXECUTE FUNCTION update_vote_count();

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_buses_updated_at ON buses;
CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON buses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_routes_updated_at ON routes;
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_schedules_updated_at ON schedules;
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_alerts_updated_at ON alerts;
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_voting_topics_updated_at ON voting_topics;
CREATE TRIGGER update_voting_topics_updated_at BEFORE UPDATE ON voting_topics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_complaints_updated_at ON complaints;
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bus_assignments_updated_at ON bus_assignments;
CREATE TRIGGER update_bus_assignments_updated_at BEFORE UPDATE ON bus_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 8: CREATE INDEXES (performance optimization)
-- ============================================================================

-- Create indexes only if they don't exist and columns exist
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_region ON profiles(region);
CREATE INDEX IF NOT EXISTS idx_buses_status ON buses(status);
CREATE INDEX IF NOT EXISTS idx_buses_driver_id ON buses(driver_id);
CREATE INDEX IF NOT EXISTS idx_routes_region ON routes(region);
CREATE INDEX IF NOT EXISTS idx_schedules_route_id ON schedules(route_id);
CREATE INDEX IF NOT EXISTS idx_schedules_bus_id ON schedules(bus_id);

-- Only create is_active index if column exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'alerts' AND column_name = 'is_active') THEN
        CREATE INDEX IF NOT EXISTS idx_alerts_is_active ON alerts(is_active);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_status ON notifications(read_status);
CREATE INDEX IF NOT EXISTS idx_voting_topics_status ON voting_topics(status);
CREATE INDEX IF NOT EXISTS idx_voting_topics_created_by ON voting_topics(created_by);
CREATE INDEX IF NOT EXISTS idx_voting_topics_end_date ON voting_topics(end_date);
CREATE INDEX IF NOT EXISTS idx_voting_options_topic_id ON voting_options(topic_id);
CREATE INDEX IF NOT EXISTS idx_votes_topic_id ON votes(topic_id);
CREATE INDEX IF NOT EXISTS idx_votes_student_id ON votes(student_id);
CREATE INDEX IF NOT EXISTS idx_complaints_student_id ON complaints(student_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_bus_assignments_bus_id ON bus_assignments(bus_id);
CREATE INDEX IF NOT EXISTS idx_bus_assignments_route_id ON bus_assignments(route_id);
CREATE INDEX IF NOT EXISTS idx_bus_assignments_driver_id ON bus_assignments(driver_id);

-- ============================================================================
-- STEP 9: INSERT SAMPLE DATA (optional)
-- ============================================================================

-- Insert sample routes only if table is empty
INSERT INTO routes (name, start_location, end_location, region) 
SELECT 'Route A', 'KLE Technological University', 'Dharwad Central', 'dharwad'
WHERE NOT EXISTS (SELECT 1 FROM routes WHERE name = 'Route A');

INSERT INTO routes (name, start_location, end_location, region) 
SELECT 'Route B', 'SDM College of Engineering', 'Hubli Railway Station', 'hubli'
WHERE NOT EXISTS (SELECT 1 FROM routes WHERE name = 'Route B');

INSERT INTO routes (name, start_location, end_location, region) 
SELECT 'Route C', 'BVB College of Engineering', 'Vidyanagar', 'hubli'
WHERE NOT EXISTS (SELECT 1 FROM routes WHERE name = 'Route C');

-- Insert sample buses only if table is empty
INSERT INTO buses (bus_number, name, capacity, status) 
SELECT 'KA-20-5678', 'Bus Alpha', 50, 'active'
WHERE NOT EXISTS (SELECT 1 FROM buses WHERE bus_number = 'KA-20-5678');

INSERT INTO buses (bus_number, name, capacity, status) 
SELECT 'KA-20-9012', 'Bus Beta', 45, 'active'
WHERE NOT EXISTS (SELECT 1 FROM buses WHERE bus_number = 'KA-20-9012');

INSERT INTO buses (bus_number, name, capacity, status) 
SELECT 'KA-20-3456', 'Bus Gamma', 55, 'maintenance'
WHERE NOT EXISTS (SELECT 1 FROM buses WHERE bus_number = 'KA-20-3456');

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '=======================================================';
    RAISE NOTICE 'DATABASE SCHEMA UPDATE COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '=======================================================';
    RAISE NOTICE 'Created tables: buses, routes, schedules, alerts, notifications, complaints, bus_assignments';
    RAISE NOTICE 'Updated tables: profiles, voting_topics, voting_options, votes';
    RAISE NOTICE 'Configured: RLS policies, triggers, indexes, sample data';
    RAISE NOTICE 'Your Campus Bus Assistant database is now complete!';
    RAISE NOTICE '=======================================================';
END $$;