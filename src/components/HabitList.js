export default function HabitList({ habits, selectedHabitId, onHabitSelect }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 overflow-y-auto max-h-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">📋</span> Your Habits
            </h2>

            {habits.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <div className="text-4xl mb-3">🌱</div>
                    <p className="text-gray-600">
                        No habits added yet. Start your journey by adding your first habit!
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {habits.map((habit) => (
                        <button
                            key={habit.id}
                            onClick={() => onHabitSelect(habit.id)}
                            className={`
                                w-full text-left p-4 rounded-lg transition-all duration-200 
                                border hover:border-blue-400 group
                                ${selectedHabitId === habit.id
                                    ? 'bg-blue-50 border-blue-400 shadow-sm'
                                    : 'bg-white border-gray-200 hover:bg-blue-50/50'
                                }
                            `}
                        >
                            <div className="flex items-center justify-between ">
                                <div className="flex-1 ">
                                    <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors ">
                                        {habit.name}
                                    </div>
                                    {habit.description && (
                                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {habit.description}
                                        </div>
                                    )}
                                </div>
                                <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}