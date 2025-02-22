import { useMemo } from 'react';
import {
    format,
    differenceInDays,
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    isWithinInterval,
    parseISO,
    startOfDay,
} from 'date-fns';
import { HiFire, HiCalendar, HiChartBar, HiSparkles } from 'react-icons/hi2';

export default function HabitInsights({ habit, habitTracks }) {
    const stats = useMemo(() => {
        const completedTracks = habitTracks.filter(track => track.completed);
        const totalDays = differenceInDays(new Date(), parseISO(habit.created_at)) + 1;
        const successRate = totalDays > 0 ? (completedTracks.length / totalDays) * 100 : 0;

        // Calculate current streak
        let currentStreak = 0;
        const today = startOfDay(new Date());
        let checkDate = today;

        while (true) {
            const dateStr = format(checkDate, 'yyyy-MM-dd');
            const completed = habitTracks.some(
                track => track.date === dateStr && track.completed
            );

            if (!completed) break;
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }

        // Calculate longest streak
        let longestStreak = 0;
        let currentCount = 0;
        const sortedTracks = [...habitTracks]
            .sort((a, b) => a.date.localeCompare(b.date))
            .filter(track => track.completed);

        for (let i = 0; i < sortedTracks.length; i++) {
            if (i === 0) {
                currentCount = 1;
            } else {
                const prevDate = parseISO(sortedTracks[i - 1].date);
                const currentDate = parseISO(sortedTracks[i].date);
                const dayDiff = differenceInDays(currentDate, prevDate);

                if (dayDiff === 1) {
                    currentCount++;
                } else {
                    currentCount = 1;
                }
            }
            longestStreak = Math.max(longestStreak, currentCount);
        }

        // Calculate monthly progress
        const currentMonth = new Date();
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

        const monthlyCompletions = habitTracks.filter(track => {
            const trackDate = parseISO(track.date);
            return track.completed && isWithinInterval(trackDate, { start: monthStart, end: monthEnd });
        }).length;

        const monthlySuccessRate = (monthlyCompletions / daysInMonth.length) * 100;

        return {
            totalDays,
            completedDays: completedTracks.length,
            successRate,
            currentStreak,
            longestStreak,
            monthlySuccessRate,
        };
    }, [habit.created_at, habitTracks]);

    const getTip = (stats) => {
        if (stats.currentStreak === 0) {
            return "Start fresh today! Remember, every journey begins with a single step.";
        }
        if (stats.currentStreak < stats.longestStreak) {
            return `You're doing great! Keep going to beat your record of ${stats.longestStreak} days.`;
        }
        if (stats.successRate < 30) {
            return "Try setting a specific time each day for this habit to make it more consistent.";
        }
        if (stats.monthlySuccessRate > 80) {
            return "Outstanding work! You're showing incredible consistency this month.";
        }
        return "Keep up the good work! Consistency is key to forming lasting habits.";
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <HiChartBar className="mr-2 text-blue-600" />
                Habit Insights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-orange-300 hover:bg-orange-300 rounded-lg p-4">
                    <div className="text-sm text-orange-800 font-medium flex items-center">
                        🔥 Longest Streak
                    </div>
                    <div className="text-2xl font-bold text-orange-700 mt-1">
                        {stats.currentStreak} days
                    </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-green-600 font-medium flex items-center">
                        {/* <HiTrendingUp className="mr-2" /> */}
                        Success Rate
                    </div>
                    <div className="text-2xl font-bold text-green-700 mt-1">
                        {Math.round(stats.successRate)}%
                    </div>
                </div>

                <div className="bg-orange-300 hover:bg-orange-300 rounded-lg p-4">
                    <div className="text-sm text-orange-800 font-medium flex items-center">
                        🔥 Longest Streak
                    </div>
                    <div className="text-2xl font-bold text-orange-700 mt-1">
                        {stats.longestStreak} days
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                <div className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                    <HiChartBar className="mr-2 text-blue-600" />
                    Monthly Progress
                </div>
                <div className="w-full bg-white rounded-full h-2.5">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
                        style={{ width: `${Math.min(100, Math.round(stats.monthlySuccessRate))}%` }}
                    ></div>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                    {Math.round(stats.monthlySuccessRate)}% completed this month
                </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-start">
                    <div className="text-yellow-500 text-xl mr-3">💡</div>
                    <div>
                        <div className="font-medium text-yellow-800 mb-1">Personalized Tip</div>
                        <div className="text-yellow-700 text-sm">{getTip(stats)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
} 