export const getSupabaseConfig = () => {
    return {
        url: process.env.VITE_SUPABASE_URL || '',
        key: process.env.VITE_SUPABASE_KEY || ''
    };
};
