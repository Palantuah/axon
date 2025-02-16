'use client';

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getPreferences, updatePreferences, getNewsletters } from '../api/main/actions';

export default function DashBoard() {
    const supabase = createClient();
    const [preferences, setPreferences] = useState([]);
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newsletters, setNewsletters] = useState([]);

    // Available topic preferences
    const availablePreferences = ['Technology', 'Music', 'Space', 'Health', 'Finance', 'Gaming'];

    useEffect(() => {
        async function fetchData() {
            const user = await supabase.auth.getUser();
            if (!user?.data?.user) {
                redirect('/login');
            }

            // Fetch preferences
            const data = await getPreferences();
            setPreferences(data || []);
            setSelectedPreferences(data || []);

            // Fetch newsletters
            const newslettersData = await getNewsletters();
            setNewsletters(newslettersData || []);

            setLoading(false);
        }

        fetchData();
    }, []);

    const handlePreferenceChange = (topic) => {
        setSelectedPreferences((prev) =>
            prev.includes(topic) ? prev.filter((pref) => pref !== topic) : [...prev, topic],
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const result = await updatePreferences(selectedPreferences);
        if (result.success) {
            setPreferences(selectedPreferences);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome to Your Dashboard</h1>

                {/* Preferences Form */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700">Select Your Preferences</h2>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        {availablePreferences.map((topic) => (
                            <label key={topic} className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={selectedPreferences.includes(topic)}
                                    onChange={() => handlePreferenceChange(topic)}
                                    className="h-5 w-5 text-blue-600"
                                />
                                <span className="text-gray-700">{topic}</span>
                            </label>
                        ))}
                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </form>
                </div>

                {/* Display Selected Preferences */}
                <div className="p-6 bg-white rounded-lg shadow-md mt-6">
                    <h2 className="text-xl font-semibold text-gray-700">Your Selected Preferences</h2>
                    <ul className="mt-4 space-y-2">
                        {preferences.length > 0 ? (
                            preferences.map((pref, index) => (
                                <li key={index} className="text-gray-600">
                                    {pref}
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-400">No preferences selected</li>
                        )}
                    </ul>
                </div>

                {/* Newsletters Section */}
                <div className="p-6 bg-white rounded-lg shadow-md mt-6">
                    <h2 className="text-xl font-semibold text-gray-700">Latest Newsletters</h2>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newsletters.length > 0 ? (
                            newsletters.map((newsletter) => (
                                <div key={newsletter.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <h3 className="font-semibold text-gray-800">{newsletter.category}</h3>
                                    <p className="text-gray-600 mt-2">{newsletter.content}</p>
                                    {newsletter.podcast_url && (
                                        <audio controls className="mt-4 w-full">
                                            <source src={newsletter.podcast_url} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No newsletters available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
