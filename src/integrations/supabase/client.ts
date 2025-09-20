import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { ExtendedDatabase } from "@/types/supabaseTypes";

// Get environment variables with validation
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("Missing required Supabase environment variables");
}

// Define Profile type to match our database schema
export type Profile = {
  id: string;
  name: string;
  role: "student" | "driver" | "coordinator" | "admin";
  email?: string;
  usn?: string;
  phone?: string;
  region?: string;
  profile_photo_url?: string;
  created_at: string;
  updated_at: string;
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<ExtendedDatabase>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
