import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Target, TrendingUp, Heart, ArrowRight, Brain, Sun, Moon, Wallet, BookOpen } from 'lucide-react';
import { setGuestMode } from '../services/serviceProvider';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    const handleGuestStart = () => {
        setGuestMode(true);
        navigate('/onboarding'); // Updated to onboarding
    };

    const features = [
        {
            icon: <Heart className="w-8 h-8" />,
            title: 'Mind & Body',
            description: 'Track fitness, nutrition, and mindfulness to nurture your complete well-being.',
        },
        {
            icon: <Wallet className="w-8 h-8" />,
            title: 'Financial Freedom',
            description: 'Set savings goals, track habits, and build your path to financial independence.',
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: 'Career Growth',
            description: 'Log milestones, track achievements, and accelerate your professional journey.',
        },
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: 'Intellectual Growth',
            description: 'Set learning goals, track progress, and expand your knowledge continuously.',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <header className="px-6 py-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                                <Sun className="w-8 h-8 text-white animate-throb" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-white">You Got This!</span>
                                <span className="hidden sm:inline text-sm text-slate-400 ml-2">An Optimal Life</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-slate-400 hover:text-white transition-colors"
                                aria-label="Toggle theme"
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <Link
                                to="/login"
                                className="px-6 py-2 text-sm font-medium text-emerald-400 border border-emerald-400 rounded-full hover:bg-emerald-400 hover:text-white transition-all duration-300"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="px-6 py-20 md:py-32">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                            Design Your
                            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent"> Optimal Life</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                            Track your holistic wellness journey. Fitness, mindfulness, finances, career, and intellectual growth — all in one beautiful dashboard.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={handleGuestStart}
                                className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 flex items-center space-x-2"
                            >
                                <span>Start Your Journey</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <Link
                                to="/login"
                                className="px-8 py-4 text-slate-300 font-medium hover:text-white transition-colors"
                            >
                                Already have an account?
                            </Link>
                        </div>

                        <p className="mt-6 text-sm text-slate-400">
                            ✨ No account required • Works offline • Your data stays on your device
                        </p>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="px-6 py-20">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-white text-center mb-12">
                            Everything you need to thrive
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 transition-all duration-300"
                                >
                                    <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl w-fit mb-4 text-emerald-400 group-hover:text-teal-400 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-slate-400 text-sm">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-6 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="p-8 md:p-12 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-3xl border border-emerald-500/20 backdrop-blur-sm">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Ready to live your optimal life?
                            </h2>
                            <p className="text-slate-300 mb-8">
                                No credit card required. Start tracking your wellness journey today.
                            </p>
                            <button
                                onClick={handleGuestStart}
                                className="px-10 py-4 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-colors"
                            >
                                You Got This! — Start Free
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="px-6 py-8 border-t border-white/10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-2 text-slate-400">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-sm">You Got This! © 2024</span>
                        </div>
                        <p className="text-sm text-slate-500">
                            Built with ❤️ for your optimal life
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
