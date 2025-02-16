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

export async function updatePreferences(preferences) {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
        throw new Error('User is not logged in');
    }

    const user_id = authData.user.id;

    // Upsert user preferences (insert if not exists, update if exists)
    const { error } = await supabase
        .from('user_preferences')
        .upsert({ user_id, topic_preferences: preferences }, { onConflict: ['user_id'] });

    if (error) {
        console.error('Error updating preferences:', error);
        return { success: false, message: error.message };
    }

    return { success: true };
}
