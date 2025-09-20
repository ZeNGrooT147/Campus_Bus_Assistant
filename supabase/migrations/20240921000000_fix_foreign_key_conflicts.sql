-- Fix Foreign Key Conflicts - Migration
-- Timestamp: 20240921000000
-- Description: Resolves "more than one relationship" error for buses.route_id

-- Step 1: Drop all existing foreign key constraints that might be causing conflicts
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    -- Drop all foreign key constraints on buses table
    FOR constraint_record IN
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = 'buses' 
        AND constraint_type = 'FOREIGN KEY'
    LOOP
        EXECUTE format('ALTER TABLE buses DROP CONSTRAINT IF EXISTS %I', constraint_record.constraint_name);
    END LOOP;

    -- Drop all foreign key constraints on schedules table
    FOR constraint_record IN
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = 'schedules' 
        AND constraint_type = 'FOREIGN KEY'
    LOOP
        EXECUTE format('ALTER TABLE schedules DROP CONSTRAINT IF EXISTS %I', constraint_record.constraint_name);
    END LOOP;

    -- Drop all foreign key constraints on voting_topics table
    FOR constraint_record IN
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = 'voting_topics' 
        AND constraint_type = 'FOREIGN KEY'
    LOOP
        EXECUTE format('ALTER TABLE voting_topics DROP CONSTRAINT IF EXISTS %I', constraint_record.constraint_name);
    END LOOP;

    -- Drop all foreign key constraints on voting_options table
    FOR constraint_record IN
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = 'voting_options' 
        AND constraint_type = 'FOREIGN KEY'
    LOOP
        EXECUTE format('ALTER TABLE voting_options DROP CONSTRAINT IF EXISTS %I', constraint_record.constraint_name);
    END LOOP;

    -- Drop all foreign key constraints on votes table
    FOR constraint_record IN
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = 'votes' 
        AND constraint_type = 'FOREIGN KEY'
    LOOP
        EXECUTE format('ALTER TABLE votes DROP CONSTRAINT IF EXISTS %I', constraint_record.constraint_name);
    END LOOP;
END $$;

-- Step 2: Re-create foreign key constraints with proper names to avoid conflicts
DO $$
BEGIN
    -- Buses table foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'buses' AND constraint_name = 'fk_buses_driver_id') THEN
        ALTER TABLE buses ADD CONSTRAINT fk_buses_driver_id 
        FOREIGN KEY (driver_id) REFERENCES profiles(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'buses' AND constraint_name = 'fk_buses_route_id') THEN
        ALTER TABLE buses ADD CONSTRAINT fk_buses_route_id 
        FOREIGN KEY (route_id) REFERENCES routes(id);
    END IF;

    -- Schedules table foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'schedules' AND constraint_name = 'fk_schedules_route_id') THEN
        ALTER TABLE schedules ADD CONSTRAINT fk_schedules_route_id 
        FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'schedules' AND constraint_name = 'fk_schedules_bus_id') THEN
        ALTER TABLE schedules ADD CONSTRAINT fk_schedules_bus_id 
        FOREIGN KEY (bus_id) REFERENCES buses(id);
    END IF;

    -- Voting topics foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'voting_topics' AND constraint_name = 'fk_voting_topics_bus_id') THEN
        ALTER TABLE voting_topics ADD CONSTRAINT fk_voting_topics_bus_id 
        FOREIGN KEY (bus_id) REFERENCES buses(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'voting_topics' AND constraint_name = 'fk_voting_topics_route_id') THEN
        ALTER TABLE voting_topics ADD CONSTRAINT fk_voting_topics_route_id 
        FOREIGN KEY (route_id) REFERENCES routes(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'voting_topics' AND constraint_name = 'fk_voting_topics_schedule_id') THEN
        ALTER TABLE voting_topics ADD CONSTRAINT fk_voting_topics_schedule_id 
        FOREIGN KEY (schedule_id) REFERENCES schedules(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'voting_topics' AND constraint_name = 'fk_voting_topics_created_by') THEN
        ALTER TABLE voting_topics ADD CONSTRAINT fk_voting_topics_created_by 
        FOREIGN KEY (created_by) REFERENCES profiles(id);
    END IF;

    -- Voting options foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'voting_options' AND constraint_name = 'fk_voting_options_topic_id') THEN
        ALTER TABLE voting_options ADD CONSTRAINT fk_voting_options_topic_id 
        FOREIGN KEY (topic_id) REFERENCES voting_topics(id) ON DELETE CASCADE;
    END IF;

    -- Votes foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'votes' AND constraint_name = 'fk_votes_topic_id') THEN
        ALTER TABLE votes ADD CONSTRAINT fk_votes_topic_id 
        FOREIGN KEY (topic_id) REFERENCES voting_topics(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'votes' AND constraint_name = 'fk_votes_student_id') THEN
        ALTER TABLE votes ADD CONSTRAINT fk_votes_student_id 
        FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'votes' AND constraint_name = 'fk_votes_option_id') THEN
        ALTER TABLE votes ADD CONSTRAINT fk_votes_option_id 
        FOREIGN KEY (option_id) REFERENCES voting_options(id) ON DELETE CASCADE;
    END IF;

    -- Add unique constraint to prevent duplicate votes
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'votes' AND constraint_name = 'unique_vote_per_topic') THEN
        ALTER TABLE votes ADD CONSTRAINT unique_vote_per_topic UNIQUE (topic_id, student_id);
    END IF;

EXCEPTION
    WHEN duplicate_object THEN
        -- Constraint already exists, continue
        NULL;
    WHEN foreign_key_violation THEN
        -- Referenced data doesn't exist, skip this constraint
        NULL;
END $$;