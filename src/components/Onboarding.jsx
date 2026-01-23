import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    ChevronLeft,
    Heart,
    TrendingUp,
    BookOpen,
    Briefcase,
    Sparkles,
    Brain,
    Bot,
    LineChart,
    ArrowRight,
    Sun
} from 'lucide-react';
import CrucifixIcon from './icons/CrucifixIcon';

const slides = [
    {
        title: "Welcome to You Got This!",
        subtitle: "An Optimal Life",
        description: "Your holistic performance platform designed to optimize every dimension of your life.",
        icon: Sun, // Changed from Sparkles
        color: "emerald",
        gradient: "from-emerald-500 to-teal-500"
    },
    {
        title: "The Five Holistic Hubs",
        subtitle: "Comprehensive Optimization",
        description: "Track your progress across Health, Wealth, Intellectual, Career, and Spiritual domains.",
        hubs: [
            { icon: Heart, label: "Health", color: "emerald" },
            { icon: TrendingUp, label: "Wealth", color: "green" },
            { icon: BookOpen, label: "Intellectual", color: "blue" },
            { icon: Briefcase, label: "Career", color: "indigo" },
            { icon: CrucifixIcon, label: "Spiritual", color: "purple" } // Safelist: text-purple-500 bg-purple-500/10 border-purple-500/20
        ],

        gradient: "from-blue-500 to-sky-500" // Changed from indigo
    },
    {
        title: "AI Framework Coaching",
        subtitle: "Personalized Guidance",
        description: "Access specialized AI advisors using world-class frameworks like TCM, Stoicism, and FIRE.",
        icon: Bot,
        color: "blue",
        gradient: "from-blue-600 to-cyan-500" // Changed from blue-400
    },
    {
        title: "Data-Driven Insights",
        subtitle: "Visualize Your Growth",
        description: "Turn your daily actions into clear, actionable performance data and long-term trends.",
        icon: LineChart,
        color: "emerald",
        gradient: "from-teal-500 to-emerald-400"
    }
];

export default function Onboarding() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            navigate('/profile?onboarding=true');
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const skipIntro = () => {
        navigate('/profile?onboarding=true');
    };

    const slide = slides[currentSlide];
    const Icon = slide.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-dark-900 transition-colors">
            <div className="w-full max-w-2xl px-6 py-12 text-center">
                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mb-12">
                    {slides.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-emerald-500' : 'w-2 bg-gray-200 dark:bg-dark-700'
                                }`}
                        />
                    ))}
                </div>

                <div className="animate-fade-in">
                    {/* Visual Area */}
                    <div className={`mb-8 flex justify-center`}>
                        {slide.hubs ? (
                            <div className="grid grid-cols-3 gap-6">
                                {slide.hubs.map((hub, idx) => (
                                    <div key={idx} className="flex flex-col items-center animate-bounce-subtle" style={{ animationDelay: `${idx * 150}ms` }}>
                                        <div className={`p-4 rounded-2xl bg-${hub.color}-500/10 border border-${hub.color}-500/20 mb-2`}>
                                            <hub.icon className={`w-8 h-8 text-${hub.color}-500`} />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{hub.label}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`relative w-32 h-32 rounded-3xl bg-gradient-to-br ${slide.gradient} flex items-center justify-center shadow-lg shadow-emerald-500/20`}>
                                <Icon className="w-16 h-16 text-white" />
                                <div className="absolute inset-0 rounded-3xl animate-pulse bg-white/20" />
                            </div>
                        )}
                    </div>

                    <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-2 tracking-tight">
                        {slide.title}
                    </h1>
                    <h2 className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${slide.gradient} mb-6`}>
                        {slide.subtitle}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
                        {slide.description}
                    </p>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex items-center justify-between max-w-xs mx-auto">
                    <button
                        onClick={prevSlide}
                        className={`p-3 rounded-full border border-gray-200 dark:border-dark-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors ${currentSlide === 0 ? 'invisible' : ''
                            }`}
                    >
                        <ChevronLeft />
                    </button>

                    <button
                        onClick={nextSlide}
                        className={`flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r ${slide.gradient} text-white font-bold shadow-lg transform hover:scale-105 transition-all`}
                    >
                        {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                <button
                    onClick={skipIntro}
                    className="mt-8 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    Skip Intro
                </button>
            </div>
        </div>
    );
}
