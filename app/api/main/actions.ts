'use server';

import { createClient } from '@/utils/supabase/server';

export async function getPreferences() {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
        throw new Error('User is not logged in');
    }

    const user_id = authData.user.id;
    const { data, error } = await supabase
        .from('user_preferences')
        .select('topic_preferences')
        .eq('user_id', user_id)
        .single();

    if (error) {
        console.error('Error fetching user preferences:', error);
        return null;
    }

    return data?.topic_preferences || [];
}
