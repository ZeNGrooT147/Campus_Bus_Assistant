-- Campus Bus Assistant - Complete Database Schema
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE (Updated)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT,
    name TEXT, -- Additional name field used in code
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'driver', 'coordinator', 'admin')),
    usn TEXT UNIQUE, -- University Serial Number for students
    phone TEXT,
    region TEXT DEFAULT 'Dharwad Region',
    telegram_id TEXT, -- For Telegram notifications
    profile_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ============================================================================
-- BUSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS buses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    bus_number TEXT UNIQUE NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 50,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
    driver_id UUID REFERENCES profiles(id),
    driver_name TEXT, -- Denormalized for quick access
    route_id UUID,
    latitude DECIMAL(10, 8), -- For GPS tracking
    longitude DECIMAL(11, 8), -- For GPS tracking
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ============================================================================
-- ROUTES TABLE
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
-- SCHEDULES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
    departure_time TIME NOT NULL,
    arrival_time TIME,
    days_of_week TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], -- Array of days
    bus_id UUID REFERENCES buses(id),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ============================================================================
-- ALERTS/ANNOUNCEMENTS TABLE
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
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
    read_status BOOLEAN DEFAULT false,
    related_entity_type TEXT, -- 'vote', 'bus', 'route', etc.
    related_entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ============================================================================
-- VOTING SYSTEM TABLES (Updated)
-- ============================================================================
CREATE TABLE IF NOT EXISTS voting_topics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'rejected', 'approved')),
    created_by UUID REFERENCES profiles(id),
    bus_id UUID REFERENCES buses(id),
    route_id UUID REFERENCES routes(id),
    schedule_id UUID REFERENCES schedules(id),
    rejection_reason TEXT, -- For coordinator rejection
    approval_notes TEXT, -- For coordinator approval
    vote_threshold INTEGER DEFAULT 5, -- Minimum votes required
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS voting_options (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    topic_id UUID REFERENCES voting_topics(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    vote_count INTEGER DEFAULT 0, -- Denormalized for performance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    topic_id UUID REFERENCES voting_topics(id) ON DELETE CASCADE,
    option_id UUID REFERENCES voting_options(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    vote_weight DECIMAL(3, 2) DEFAULT 1.0, -- For weighted voting
    ip_address INET, -- For fraud prevention
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(topic_id, student_id) -- One vote per student per topic
);

-- ============================================================================
-- COMPLAINTS TABLE
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
    assigned_to UUID REFERENCES profiles(id), -- Coordinator handling the complaint
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ============================================================================
-- BUS ASSIGNMENTS TABLE
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
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE voting_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE voting_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_assignments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Buses policies
CREATE POLICY "Buses are viewable by everyone"
    ON buses FOR SELECT
    USING (true);

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
CREATE POLICY "Routes are viewable by everyone"
    ON routes FOR SELECT
    USING (true);

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
CREATE POLICY "Schedules are viewable by everyone"
    ON schedules FOR SELECT
    USING (true);

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
CREATE POLICY "Alerts are viewable by everyone"
    ON alerts FOR SELECT
    USING (is_active = true);

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
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
    ON notifications FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Voting topics policies
DROP POLICY IF EXISTS "Voting topics are viewable by everyone" ON voting_topics;
CREATE POLICY "Voting topics are viewable by everyone"
    ON voting_topics FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create voting topics" ON voting_topics;
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

CREATE POLICY "Coordinators can manage voting topics"
    ON voting_topics FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('coordinator', 'admin')
        )
    );

-- Voting options policies
DROP POLICY IF EXISTS "Voting options are viewable by everyone" ON voting_options;
CREATE POLICY "Voting options are viewable by everyone"
    ON voting_options FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create voting options" ON voting_options;
CREATE POLICY "System can create voting options"
    ON voting_options FOR INSERT
    WITH CHECK (true);

-- Votes policies
DROP POLICY IF EXISTS "Votes are viewable by everyone" ON votes;
CREATE POLICY "Votes are viewable by everyone"
    ON votes FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create votes" ON votes;
DROP POLICY IF EXISTS "Users can only vote once per topic" ON votes;
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

CREATE POLICY "Coordinators can manage bus assignments"
    ON bus_assignments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('coordinator', 'admin')
        )
    );

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Updated handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, name)
    VALUES (
        new.id, 
        new.email, 
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
        COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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

-- Trigger to update vote counts
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

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON buses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voting_topics_updated_at BEFORE UPDATE ON voting_topics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bus_assignments_updated_at BEFORE UPDATE ON bus_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- Existing indexes
CREATE INDEX IF NOT EXISTS idx_voting_topics_status ON voting_topics(status);
CREATE INDEX IF NOT EXISTS idx_votes_topic_id ON votes(topic_id);
CREATE INDEX IF NOT EXISTS idx_votes_student_id ON votes(student_id);
CREATE INDEX IF NOT EXISTS idx_profiles_region ON profiles(region);

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_buses_status ON buses(status);
CREATE INDEX IF NOT EXISTS idx_buses_driver_id ON buses(driver_id);
CREATE INDEX IF NOT EXISTS idx_routes_region ON routes(region);
CREATE INDEX IF NOT EXISTS idx_schedules_route_id ON schedules(route_id);
CREATE INDEX IF NOT EXISTS idx_schedules_bus_id ON schedules(bus_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_active ON alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_status ON notifications(read_status);
CREATE INDEX IF NOT EXISTS idx_voting_topics_created_by ON voting_topics(created_by);
CREATE INDEX IF NOT EXISTS idx_voting_topics_end_date ON voting_topics(end_date);
CREATE INDEX IF NOT EXISTS idx_voting_options_topic_id ON voting_options(topic_id);
CREATE INDEX IF NOT EXISTS idx_complaints_student_id ON complaints(student_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_bus_assignments_bus_id ON bus_assignments(bus_id);
CREATE INDEX IF NOT EXISTS idx_bus_assignments_route_id ON bus_assignments(route_id);
CREATE INDEX IF NOT EXISTS idx_bus_assignments_driver_id ON bus_assignments(driver_id);

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert sample routes
INSERT INTO routes (name, start_location, end_location, region) VALUES
('Route A', 'KLE Technological University', 'Dharwad Central', 'Dharwad Region'),
('Route B', 'SDM College of Engineering', 'Hubli Railway Station', 'Hubli Region'),
('Route C', 'BVB College of Engineering', 'Vidyanagar', 'Hubli Region')
ON CONFLICT DO NOTHING;

-- Insert sample buses
INSERT INTO buses (bus_number, capacity, status) VALUES
('KA-20-5678', 50, 'active'),
('KA-20-9012', 45, 'active'),
('KA-20-3456', 55, 'maintenance')
ON CONFLICT DO NOTHING;