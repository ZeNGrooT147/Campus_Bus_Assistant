-- Campus Bus Assistant - Complete Database Schema
-- This migration creates all necessary tables and relationships

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE (from Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    telegram_id TEXT,
    profile_photo_url TEXT,
    usn TEXT UNIQUE,
    region TEXT DEFAULT 'dharwad',
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'driver', 'coordinator', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ROUTES TABLE 
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

-- BUSES TABLE
CREATE TABLE IF NOT EXISTS buses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    bus_number TEXT UNIQUE NOT NULL,
    name TEXT,
    capacity INTEGER NOT NULL DEFAULT 50,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
    driver_id UUID REFERENCES profiles(id),
    driver_name TEXT,
    route_id UUID REFERENCES routes(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- SCHEDULES TABLE
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

-- ALERTS TABLE
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

-- NOTIFICATIONS TABLE
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

-- COMPLAINTS TABLE
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

-- VOTING TOPICS TABLE
CREATE TABLE IF NOT EXISTS voting_topics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    end_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'approved', 'rejected', 'expired')),
    created_by UUID REFERENCES profiles(id),
    bus_id UUID REFERENCES buses(id),
    route_id UUID REFERENCES routes(id),
    schedule_id UUID REFERENCES schedules(id),
    rejection_reason TEXT,
    approval_notes TEXT,
    vote_threshold INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- VOTING OPTIONS TABLE
CREATE TABLE IF NOT EXISTS voting_options (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    topic_id UUID REFERENCES voting_topics(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- VOTES TABLE
CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    topic_id UUID REFERENCES voting_topics(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    option_id UUID REFERENCES voting_options(id) ON DELETE CASCADE,
    vote_weight DECIMAL(3, 2) DEFAULT 1.0,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(topic_id, student_id)
);

-- BUS ASSIGNMENTS TABLE
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

-- FUNCTIONS
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

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS
DROP TRIGGER IF EXISTS vote_count_trigger ON votes;
CREATE TRIGGER vote_count_trigger
    AFTER INSERT OR DELETE ON votes
    FOR EACH ROW EXECUTE FUNCTION update_vote_count();

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

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_region ON profiles(region);
CREATE INDEX IF NOT EXISTS idx_buses_status ON buses(status);
CREATE INDEX IF NOT EXISTS idx_buses_driver_id ON buses(driver_id);
CREATE INDEX IF NOT EXISTS idx_routes_region ON routes(region);
CREATE INDEX IF NOT EXISTS idx_schedules_route_id ON schedules(route_id);
CREATE INDEX IF NOT EXISTS idx_schedules_bus_id ON schedules(bus_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_active ON alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_voting_topics_status ON voting_topics(status);
CREATE INDEX IF NOT EXISTS idx_votes_topic_id ON votes(topic_id);

-- SAMPLE DATA
INSERT INTO routes (name, start_location, end_location, region) VALUES
('Route A', 'KLE Technological University', 'Dharwad Central', 'dharwad'),
('Route B', 'SDM College of Engineering', 'Hubli Railway Station', 'hubli'),
('Route C', 'BVB College of Engineering', 'Vidyanagar', 'hubli')
ON CONFLICT DO NOTHING;

INSERT INTO buses (bus_number, name, capacity, status) VALUES
('KA-20-5678', 'Bus Alpha', 50, 'active'),
('KA-20-9012', 'Bus Beta', 45, 'active'),
('KA-20-3456', 'Bus Gamma', 55, 'maintenance')
ON CONFLICT DO NOTHING;