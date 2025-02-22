export default function OnboardingModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 max-w-md w-full text-white shadow-xl">
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">Welcome to Habit Stick! 🎉</h2>
                        <p className="text-white/90">Your journey to better habits starts now!</p>
                    </div>

                    <div className="space-y-4 text-sm text-left">
                        <div className="flex items-start gap-3">
                            <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                                <span>📅</span>
                            </div>
                            <div>
                                <h3 className="font-semibold">Track Daily</h3>
                                <p className="text-white/80">Mark your progress each day to build streaks</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                                <span>📈</span>
                            </div>
                            <div>
                                <h3 className="font-semibold">View Insights</h3>
                                <p className="text-white/80">Monitor your progress with detailed statistics</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                                <span>🎯</span>
                            </div>
                            <div>
                                <h3 className="font-semibold">Stay Motivated</h3>
                                <p className="text-white/80">Earn achievements and maintain your streak</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3 px-6 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
                    >
                        Let's Get Started! 🚀
                    </button>
                </div>
            </div>
        </div>
    );
} 