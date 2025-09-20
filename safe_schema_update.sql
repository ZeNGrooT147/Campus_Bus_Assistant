-- Campus Bus Assistant - Safe Database Schema Update
-- This script safely updates existing tables and creates new ones
-- Use CREATE TABLE IF NOT EXISTS and ALTER TABLE ADD COLUMN IF NOT EXISTS

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- BUSES TABLE (Create first - needed for foreign keys)
-- ============================================================================
CREATE TABLE IF NOT EXISTS buses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    bus_number TEXT UNIQUE NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 50,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
    driver_id UUID REFERENCES profiles(id),
    driver_name TEXT,
    route_id UUID,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ============================================================================
-- ROUTES TABLE (Create second - needed for foreign keys)
-- ============================================================================
CREATE TABLE IF NOT EXISTS routes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    start_location TEXT NOT NULL,
    end_location TEXT NOT NULL,
    region TEXT DEFAULT 'Dharwad Region',
    distance_km DECIMAL(6, 2),
    estimated_duration_minutes INTEGER,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ============================================================================
-- SCHEDULES TABLE (Create third - needed for foreign keys)
-- ============================================================================
CREATE TABLE IF NOT EXISTS schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
    departure_time TIME NOT NULL,
    arrival_time TIME,
    days_of_week TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    bus_id UUID REFERENCES buses(id),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ============================================================================
-- ALERTS/ANNOUNCEMENTS TABLE (Create fourth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error', 'announcement')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'drivers', 'coordinators')),
    region TEXT DEFAULT 'Dharwad Region',
    created_by UUID REFERENCES profiles(id),
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ============================================================================
-- NOTIFICATIONS TABLE (Create fifth)
-- ============================================================================
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

-- ============================================================================
-- COMPLAINTS TABLE (Create sixth)
-- ============================================================================
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

-- ============================================================================
-- BUS ASSIGNMENTS TABLE (Create seventh)
-- ============================================================================
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
-- PROFILES TABLE (Safe Updates - after other tables exist)
-- ============================================================================
-- Add missing columns to existing profiles table
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
END $$;

-- ============================================================================
-- VOTING TOPICS TABLE (Safe Updates - after referenced tables exist)
-- ============================================================================
-- Add missing columns to existing voting_topics table
DO $$ 
BEGIN
    -- Add bus_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'voting_topics' AND column_name = 'bus_id') THEN
        ALTER TABLE voting_topics ADD COLUMN bus_id UUID;
        -- Add foreign key constraint separately
        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'buses') THEN
            ALTER TABLE voting_topics ADD CONSTRAINT fk_voting_topics_bus_id 
            FOREIGN KEY (bus_id) REFERENCES buses(id);
        END IF;
    END IF;

    -- Add route_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'voting_topics' AND column_name = 'route_id') THEN
        ALTER TABLE voting_topics ADD COLUMN route_id UUID;
        -- Add foreign key constraint separately
        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'routes') THEN
            ALTER TABLE voting_topics ADD CONSTRAINT fk_voting_topics_route_id 
            FOREIGN KEY (route_id) REFERENCES routes(id);
        END IF;
    END IF;

    -- Add schedule_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'voting_topics' AND column_name = 'schedule_id') THEN
        ALTER TABLE voting_topics ADD COLUMN schedule_id UUID;
        -- Add foreign key constraint separately
        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'schedules') THEN
            ALTER TABLE voting_topics ADD CONSTRAINT fk_voting_topics_schedule_id 
            FOREIGN KEY (schedule_id) REFERENCES schedules(id);
        END IF;
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
END $$;

-- ============================================================================
-- VOTING OPTIONS TABLE (Safe Updates)
-- ============================================================================
-- Add missing columns to existing voting_options table
DO $$ 
BEGIN
    -- Add vote_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'voting_options' AND column_name = 'vote_count') THEN
        ALTER TABLE voting_options ADD COLUMN vote_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- ============================================================================
-- VOTES TABLE (Safe Updates)
-- ============================================================================
-- Add missing columns to existing votes table
DO $$ 
BEGIN
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
-- COMPLAINTS TABLE (Create if not exists)
-- ============================================================================
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

-- ============================================================================
-- BUS ASSIGNMENTS TABLE (Create if not exists)
-- ============================================================================
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
-- FUNCTIONS AND TRIGGERS (Safe Creation)
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

-- Trigger to update vote counts (safe creation)
DROP TRIGGER IF EXISTS vote_count_trigger ON votes;
CREATE TRIGGER vote_count_trigger
    AFTER INSERT OR DELETE ON votes
    FOR EACH ROW EXECUTE FUNCTION update_vote_count();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (After all tables are created)
-- ============================================================================
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_assignments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES (After tables exist)
-- ============================================================================

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

-- Alerts policies
DROP POLICY IF EXISTS "Alerts are viewable by everyone" ON alerts;
CREATE POLICY "Alerts are viewable by everyone"
    ON alerts FOR SELECT
    USING (is_active = true);

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

-- Updated voting topics policies
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

-- Updated votes policies
DROP POLICY IF EXISTS "Students can vote" ON votes;
CREATE POLICY "Students can vote"
    ON votes FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'student'
        ) AND
        NOT EXISTS (
            SELECT 1 FROM votes
            WHERE topic_id = NEW.topic_id
            AND student_id = auth.uid()
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

-- Create triggers for updated_at (after tables exist)
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
-- PERFORMANCE INDEXES (Safe Creation)
-- ============================================================================

-- Create indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_region ON profiles(region);
CREATE INDEX IF NOT EXISTS idx_buses_status ON buses(status);
CREATE INDEX IF NOT EXISTS idx_buses_driver_id ON buses(driver_id);
CREATE INDEX IF NOT EXISTS idx_routes_region ON routes(region);
CREATE INDEX IF NOT EXISTS idx_schedules_route_id ON schedules(route_id);
CREATE INDEX IF NOT EXISTS idx_schedules_bus_id ON schedules(bus_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_active ON alerts(is_active);
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
-- SAMPLE DATA (Optional)
-- ============================================================================

-- Insert sample routes only if table is empty
INSERT INTO routes (name, start_location, end_location, region) 
SELECT 'Route A', 'KLE Technological University', 'Dharwad Central', 'Dharwad Region'
WHERE NOT EXISTS (SELECT 1 FROM routes WHERE name = 'Route A');

INSERT INTO routes (name, start_location, end_location, region) 
SELECT 'Route B', 'SDM College of Engineering', 'Hubli Railway Station', 'Hubli Region'
WHERE NOT EXISTS (SELECT 1 FROM routes WHERE name = 'Route B');

INSERT INTO routes (name, start_location, end_location, region) 
SELECT 'Route C', 'BVB College of Engineering', 'Vidyanagar', 'Hubli Region'
WHERE NOT EXISTS (SELECT 1 FROM routes WHERE name = 'Route C');

-- Insert sample buses only if table is empty
INSERT INTO buses (bus_number, capacity, status) 
SELECT 'KA-20-5678', 50, 'active'
WHERE NOT EXISTS (SELECT 1 FROM buses WHERE bus_number = 'KA-20-5678');

INSERT INTO buses (bus_number, capacity, status) 
SELECT 'KA-20-9012', 45, 'active'
WHERE NOT EXISTS (SELECT 1 FROM buses WHERE bus_number = 'KA-20-9012');

INSERT INTO buses (bus_number, capacity, status) 
SELECT 'KA-20-3456', 55, 'maintenance'
WHERE NOT EXISTS (SELECT 1 FROM buses WHERE bus_number = 'KA-20-3456');

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema update completed successfully!';
    RAISE NOTICE 'All tables and columns have been safely created or updated.';
END $$;