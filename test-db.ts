import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const [
    { data: stats, error: statsErr },
    { data: about, error: aboutErr },
    { data: services, error: servicesErr },
    { data: skills, error: skillsErr },
    { data: projects, error: projectsErr },
    { data: platforms, error: platformsErr },
    { data: socials, error: socialsErr },
  ] = await Promise.all([
    supabase.from("Stat").select("*").order("order"),
    supabase.from("About").select("*").limit(1).single(),
    supabase.from("Service").select("*").order("order"),
    supabase.from("SkillGroup").select("*").order("order"),
    supabase.from("Project").select("*").order("createdAt", { ascending: false }).limit(10),
    supabase.from("Platform").select("*").order("order"),
    supabase.from("SocialMedia").select("*").order("order"),
  ]);
  
  console.log("Services:", services?.length, "Error:", servicesErr?.message);
  console.log("Skills:", skills?.length, "Error:", skillsErr?.message);
  console.log("Projects:", projects?.length, "Error:", projectsErr?.message);
  console.log("Socials:", socials?.length, "Error:", socialsErr?.message);
}

test();
