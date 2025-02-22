import { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday,
    startOfDay
} from 'date-fns';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

export default function Calendar({ habitTracks, onDateClick, selectedHabitId }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const isDateCompleted = (date) => {
        return habitTracks.some(track => {
            const trackDate = new Date(track.date);
            return isSameDay(startOfDay(trackDate), startOfDay(date)) && track.completed;
        });
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <HiChevronLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-white">
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    <button
                        onClick={goToNextMonth}
                        className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <HiChevronRight className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                        <div
                            key={day}
                            className="text-center text-sm font-medium text-white/80 py-2"
                        >
                            {day}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-b-2xl shadow-lg p-4">
                <div className="grid grid-cols-7 gap-1">
                    {daysInMonth.map((day) => {
                        const isCurrentDay = isToday(day);
                        const isCompleted = isDateCompleted(day);
                        const isCurrentMonth = isSameMonth(day, currentDate);

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => selectedHabitId && onDateClick(startOfDay(day))}
                                disabled={!selectedHabitId}
                                className={`
                                    relative aspect-square p-2 flex items-center justify-center
                                    text-lg font-semibold rounded-full mx-auto w-10 h-10
                                    transition-all duration-200
                                    ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                                    ${isCompleted ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                                    ${isCurrentDay && !isCompleted ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                                    ${selectedHabitId && !isCompleted ?
                                        'hover:bg-gray-100 hover:scale-110' :
                                        !selectedHabitId ? 'cursor-not-allowed' : ''
                                    }
                                `}
                            >
                                <time dateTime={format(day, 'yyyy-MM-dd')}>
                                    {format(day, 'd')}
                                </time>
                                {isCurrentDay && !isCompleted && (
                                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full ring-2 ring-blue-500"></div>
                    <span>Today</span>
                </div>
            </div>
        </div>
    );
} 