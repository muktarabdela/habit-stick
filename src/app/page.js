'use client';

import { useState, useEffect } from 'react';
import { Profile, supabase } from '@/lib/supabase';
import Calendar from '@/components/Calendar';
import HabitList from '@/components/HabitList';
import HabitInsights from '@/components/HabitInsights';
import HabitCreationModal from '@/components/HabitCreationModal';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { format, startOfDay } from 'date-fns';
import SuccessModal from '@/components/SuccessModal';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect immediately if no user
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Only run these effects if user is authenticated
  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchHabitSuggestion();
    }
  }, [user]);

  const [habitSuggestion, setHabitSuggestion] = useState([]);
  const [habits, setHabits] = useState([]);
  const [selectedHabitId, setSelectedHabitId] = useState();
  const [habitTracks, setHabitTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    type: 'habit-created',
    title: '',
    message: '',
  });

  useEffect(() => {
    if (selectedHabitId) {
      fetchHabitTracks(selectedHabitId);
    } else {
      setHabitTracks([]);
    }
  }, [selectedHabitId]);

  // Auto-select first habit when habits are loaded
  useEffect(() => {
    if (habits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(habits[0].id);
    }
  }, [habits, selectedHabitId]);

  // useEffect(() => {
  //   if (user) {
  //     fetchProfile();
  //   }
  // }, [user]);

  // Get the currently selected habit
  const selectedHabit = habits.find(habit => habit.id === selectedHabitId);

  const fetchHabits = async () => {
    try {
      if (!user) return; // Add this check
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setHabits(data || []);
    } catch (error) {
      console.error('Error fetching habits:', error);
      alert('Failed to fetch habits. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHabitSuggestion = async () => {
    try {
      const { data, error } = await supabase
        .from('habit_suggestions')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setHabitSuggestion(data || []);
    } catch (error) {
      console.error('Error fetching habit suggestions:', error);
      alert('Failed to fetch habit suggestions. Please try again.');
    }
  };

  const fetchHabitTracks = async (habitId) => {
    try {
      if (!user) return; // Add this check
      const { data, error } = await supabase
        .from('habit_track')
        .select('*')
        .eq('habit_id', habitId)
        .eq('user_id', user.id);

      if (error) throw error;
      setHabitTracks(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching habit tracks:', error);
      alert('Failed to fetch habit tracking data. Please try again.');
      return [];
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleHabitAdded = async () => {
    await fetchHabits();
    setSuccessModal({
      isOpen: true,
      type: 'habit-created',
      title: '🎉 New Habit Created!',
      message: 'Your journey to building a new habit starts now. Take it one day at a time!',
    });
  };

  const handleDateClick = async (date) => {
    if (!selectedHabitId) return;

    const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
    const existingTrack = habitTracks.find(
      track => track.date === dateStr && track.habit_id === selectedHabitId
    );

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to track habits');

      let completed = true;
      if (existingTrack) {
        completed = !existingTrack.completed;
        const { error } = await supabase
          .from('habit_track')
          .update({ completed })
          .eq('id', existingTrack.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('habit_track')
          .insert([{
            habit_id: selectedHabitId,
            date: dateStr,
            completed: true,
            user_id: user.id
          }]);

        if (error) throw error;
      }

      // Refresh the habit tracks and get the updated data
      const tracks = await fetchHabitTracks(selectedHabitId);

      let currentStreak = 0;
      const today = startOfDay(new Date());
      let checkDate = today;

      while (true) {
        const dateToCheck = format(checkDate, 'yyyy-MM-dd');
        const completed = (tracks || []).some(
          track => track.date === dateToCheck && track.completed
        );

        if (!completed) break;
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }

      // Show appropriate success modal
      if (completed) {
        if (currentStreak > 0) {
          setSuccessModal({
            isOpen: true,
            type: 'streak',
            title: '🔥 Streak Alert!',
            message: "You're on fire! Keep up the momentum!",
            streakCount: currentStreak,
          });
        } else {
          setSuccessModal({
            isOpen: true,
            type: 'habit-completed',
            title: '🎯 Goal Achieved!',
            message: 'Great job completing your habit today!',
          });
        }
      }
    } catch (error) {
      console.error('Error updating habit track:', error);
      alert(error.message || 'Failed to update habit tracking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-8 p-4 sm:p-8 text-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold">Habit Stick</h1>
                  <p className="text-white/90 mt-1 sm:mt-2 text-base sm:text-lg">
                    Welcome back, {profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'there'}! 👋
                  </p>
                </div>
                <button
                  onClick={() => setIsHabitModalOpen(true)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                >
                  <span className="text-lg sm:text-xl">+</span>
                  Create Habit
                </button>
              </div>
            </div>

            {selectedHabit ? (
              <div className="mt-2 sm:mt-4">
                <div className="text-white/80 text-xs sm:text-sm font-medium">Currently Tracking</div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-1 sm:mt-2 gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold">{selectedHabit.name}</h2>
                    {selectedHabit.description && (
                      <p className="text-white/80 mt-0.5 sm:mt-1 text-sm sm:text-base">{selectedHabit.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm bg-white/20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full whitespace-nowrap mt-2 sm:mt-4">
                      {habitTracks.filter(track => track.completed).length} days completed
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-2 sm:mt-4 text-white/80 text-sm sm:text-base">
                {habits.length === 0 ? (
                  <p>Start by creating your first habit!</p>
                ) : (
                  <p>Select a habit to start tracking</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:gap-8 md:grid-cols-[minmax(200px,300px),1fr]">
          <div className="order-1 md:order-none">
            <HabitList
              habits={habits}
              selectedHabitId={selectedHabitId}
              onHabitSelect={setSelectedHabitId}
            />
          </div>

          <div className="space-y-4 sm:space-y-8">
            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm">
              <Calendar
                habitTracks={habitTracks}
                onDateClick={handleDateClick}
                selectedHabitId={selectedHabitId}
              />
            </div>

            {selectedHabit && (
              <HabitInsights
                habit={selectedHabit}
                habitTracks={habitTracks}
              />
            )}
          </div>
        </div>
      </div>

      <HabitCreationModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        onHabitAdded={handleHabitAdded}
        habitSuggestion={habitSuggestion}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal(prev => ({ ...prev, isOpen: false }))}
        title={successModal.title}
        message={successModal.message}
        type={successModal.type}
        streakCount={successModal.streakCount}
      />
    </main>
  );
}
