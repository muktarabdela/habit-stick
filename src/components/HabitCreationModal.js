import { useState } from 'react';
import { Dialog, Tab } from '@headlessui/react';
import { supabase } from '@/lib/supabase';

export default function HabitCreationModal({ isOpen, onClose, onHabitAdded, habitSuggestion }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const createHabit = async (habitName, habitDescription) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('You must be logged in to create habits');

            const { error } = await supabase.from('habits').insert([
                {
                    name: habitName.trim(),
                    description: habitDescription.trim() || null,
                    user_id: user.id,
                },
            ]);

            if (error) throw error;

            setName('');
            setDescription('');
            onHabitAdded();
            onClose();
        } catch (error) {
            console.error('Error adding habit:', error);
            alert('Failed to add habit. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        await createHabit(name, description);
        setIsSubmitting(false);
    };

    const adoptSuggestion = async (suggestion) => {
        setIsSubmitting(true);
        await createHabit(suggestion.title, suggestion.description);
        setIsSubmitting(false);
    };

    const handleTabChange = (index) => {
        setSelectedTab(index);
        if (index === 0) {
            setName('');
            setDescription('');
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30 overflow-y-auto" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4 max-h-min">
                <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white rounded-2xl shadow-xl">
                    <div className="p-6 border-b">
                        <Dialog.Title className="text-2xl font-bold text-gray-900">
                            Create New Habit
                        </Dialog.Title>
                    </div>

                    <Tab.Group selectedIndex={selectedTab} onChange={handleTabChange}>
                        <Tab.List className="flex space-x-1 border-b px-6">
                            <Tab className={({ selected }) =>
                                `px-4 py-2.5 text-sm font-medium leading-5 text-gray-700 border-b-2 
                                ${selected
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent hover:border-gray-300'
                                }`
                            }>
                                Create Custom Habit
                            </Tab>
                            <Tab className={({ selected }) =>
                                `px-4 py-2.5 text-sm font-medium leading-5 text-gray-700 border-b-2 
                                ${selected
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent hover:border-gray-300'
                                }`
                            }>
                                Browse Suggestions
                            </Tab>
                        </Tab.List>

                        <Tab.Panels className="p-6">
                            <Tab.Panel>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Habit Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-lg border text-gray-700 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            placeholder="What habit would you like to track?"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-lg border text-gray-700 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            placeholder="Add some details about your habit..."
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !name.trim()}
                                            className={`
                                                px-4 py-2 text-sm font-medium text-white rounded-lg
                                                ${isSubmitting || !name.trim()
                                                    ? 'bg-blue-400 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                }
                                            `}
                                        >
                                            {isSubmitting ? 'Creating...' : 'Create Habit'}
                                        </button>
                                    </div>
                                </form>
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="grid gap-4 max-h-[30em] overflow-y-auto">
                                    {habitSuggestion.map((suggestion, index) => (
                                        <div
                                            key={suggestion.id}
                                            className="p-4 border rounded-lg hover:border-blue-300 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {suggestion.title}
                                                    </h3>
                                                    <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full mt-1">
                                                        {suggestion.category}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => adoptSuggestion(suggestion)}
                                                    disabled={isSubmitting}
                                                    className={`
                                                        px-3 py-1 text-sm font-medium rounded-lg
                                                        ${isSubmitting
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                                        }
                                                    `}
                                                >
                                                    {isSubmitting ? 'Adding...' : 'Use This'}
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {suggestion.description}
                                            </p>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-sm text-gray-600 italic">
                                                    {suggestion.identity_example}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
} 