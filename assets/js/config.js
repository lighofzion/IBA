export const getSupabaseConfig = () => {
    // Use hardcoded values for development, Vercel env vars for production
    const isProd = window.location.hostname !== 'localhost';

    if (isProd) {
        return {
            url: import.meta.env.VITE_SUPABASE_URL || '',
            key: import.meta.env.VITE_SUPABASE_KEY || ''
        };
    }

    // Development fallback
    return {
        url: 'https://lqugerdmxqpvigfchfgz.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdWdlcmRteHFwdmlnZmNoZmd6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTcwOTY1OCwiZXhwIjoyMDUxMjg1NjU4fQ.rYe9asgVqtbiJmPJwb30THyM913FYwrMAnGHm_4AEDY'
    };
};
