

export async function updateUserPreferences(userId, newPreferences) {
    const { error } = await supabase
        .from('user_preferences')
        .update({ topic_preferences: newPreferences })
        .eq('user_id', userId);

    if (error) {
        throw new Error(error.message);
    }

    return { success: true };
}
export async function getNewsletters() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('newsletters')
        .select('id, category, content, timestamp, podcast_url')
        .order('timestamp', { ascending: false });

    if (error) {
        console.error('Error fetching newsletters:', error);
        return [];
    }

    return data;
}
