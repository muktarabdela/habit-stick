import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function HabitForm({ onHabitAdded }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('You must be logged in to create habits');

            const { error } = await supabase.from('habits').insert([
                {
                    name: name.trim(),
                    description: description.trim() || null,
                    user_id: user.id,
                },
            ]);

            if (error) throw error;

            setName('');
            setDescription('');
            onHabitAdded();
        } catch (error) {
            console.error('Error adding habit:', error);
            alert('Failed to add habit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">✨</span> Create New Habit
            </h2>

            <div className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Habit Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 text-gray-700
                        focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        placeholder="What habit would you like to track?"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description (optional)
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 text-gray-700
                        focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        placeholder="Add some details about your habit..."
                        rows={3}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !name.trim()}
                    className={`
                        w-full py-2.5 px-4 rounded-lg text-sm font-medium
                        transition-all duration-200 flex items-center justify-center
                        ${isSubmitting || !name.trim()
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
                        }
                    `}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Habit...
                        </>
                    ) : (
                        <>
                            <span className="mr-2">+</span> Create Habit
                        </>
                    )}
                </button>
            </div>
        </form>
    );
} 