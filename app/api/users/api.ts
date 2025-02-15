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
