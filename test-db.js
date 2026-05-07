const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
console.log("URL:", url, "KEY:", key ? key.substring(0, 10) + "..." : null);

const supabase = createClient(url, key);
async function test() {
  const { data, error } = await supabase.from('Project').select('*');
  console.log("Projects length:", data ? data.length : "null", "Error:", error);
}
test();
