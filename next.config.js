/** @type {import('next').NextConfig} */
const nextConfig = {
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
  },
};

module.exports = nextConfig;
