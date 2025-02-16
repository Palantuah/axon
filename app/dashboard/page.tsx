import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getPreferences } from '../api/main/actions';

export default async function DashBoard() {
    const supabase = await createClient();

    const { data } = await supabase.auth.getUser();
    if (!data?.user) {
        redirect('/login');
    }
    // need to pull data on preferences
    const preferences = await getPreferences();
    console.log(preferences);
    // Sample data for user podcasts
    const podcasts = [
        { title: 'Tech Talks', description: 'Latest in technology' },
        { title: 'Music Vibes', description: 'The best new tracks' },
        { title: 'Space Explorers', description: 'Conversations about space' },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome, {data.user.email}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700">Your Podcasts</h2>
                        <ul className="mt-4 space-y-4">
                            {podcasts.map((podcast, index) => (
                                <li key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <h3 className="font-semibold text-gray-800">{podcast.title}</h3>
                                    <p className="text-sm text-gray-600">{podcast.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700">Account Settings</h2>
                        <ul className="mt-4 space-y-4">
                            <li className="text-gray-600">Change Email</li>
                            <li className="text-gray-600">Update Password</li>
                            <li className="text-gray-600">Delete Account</li>
                        </ul>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700">Other User Data</h2>
                        <ul className="mt-4 space-y-4">
                            <li className="text-gray-600">
                                Account created: {new Date(data.user.created_at).toLocaleDateString()}
                            </li>
                            <li className="text-gray-600">
                                Last login: {new Date(data.user.last_sign_in_at).toLocaleDateString()}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
