const { createClient } = require('@supabase/supabase-js');

function createSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const supabase = createSupabaseClient();

async function checkSupabaseHealth() {
  if (!supabase) {
    return {
      configured: false,
      healthy: false,
      reason: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) are not configured',
    };
  }

  const { error } = await supabase.from('users').select('id', { head: true, count: 'exact' });

  if (error) {
    return { configured: true, healthy: false, reason: error.message };
  }

  return { configured: true, healthy: true };
}

module.exports = {
  supabase,
  checkSupabaseHealth,
};
