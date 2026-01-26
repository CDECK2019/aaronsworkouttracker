import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, SkipForward, Bot, User, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { getApiKey, hasApiKey } from '../services/aiService';
import { getDataService } from '../services/serviceProvider';
import {
    ONBOARDING_SYSTEM_PROMPT,
    INITIAL_MESSAGE,
    mapGoalsToProfile,
    parseAIResponse
} from '../data/onboardingPrompts';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Use a model with broad availability on OpenRouter
const MODEL = 'openai/gpt-4o-mini';

export default function AIOnboarding() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [extractedGoals, setExtractedGoals] = useState({});
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const goalCategories = [
        { key: 'fitness', label: 'Fitness', icon: '💪' },
        { key: 'nutrition', label: 'Nutrition', icon: '🥗' },
        { key: 'financial', label: 'Financial', icon: '💰' },
        { key: 'career', label: 'Career', icon: '💼' },
        { key: 'intellectual', label: 'Learning', icon: '📚' },
        { key: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
    ];

    const completedGoals = goalCategories.filter(cat => extractedGoals[cat.key]);

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setError(null);

        try {
            const apiKey = getApiKey();
            if (!apiKey) {
                throw new Error('API key not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.');
            }

            console.log('Using API key:', apiKey.substring(0, 10) + '...');
            console.log('Using model:', MODEL);

            // Build conversation history for API
            const apiMessages = [
                { role: 'system', content: ONBOARDING_SYSTEM_PROMPT },
                ...messages.map(m => ({ role: m.role, content: m.content })),
                { role: 'user', content: inputValue }
            ];

            const response = await fetch(OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'You Got This - Onboarding'
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: apiMessages,
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error('API Error Response:', errorBody);
                throw new Error(`API error: ${response.status} - ${errorBody.substring(0, 100)}`);
            }

            const data = await response.json();
            const aiResponseText = data.choices[0]?.message?.content || '';

            // Parse the structured response
            const parsed = parseAIResponse(aiResponseText);

            // Update extracted goals
            const newGoals = { ...extractedGoals };
            if (parsed.extractedGoals) {
                Object.entries(parsed.extractedGoals).forEach(([key, value]) => {
                    if (value) {
                        newGoals[key] = value;
                    }
                });
            }
            setExtractedGoals(newGoals);

            // Add AI message
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: parsed.message || aiResponseText
            }]);

            // Check if profile is complete
            if (parsed.profileComplete && Object.keys(newGoals).length >= 2) {
                // Give user a moment to read, then save and redirect
                setTimeout(() => {
                    handleComplete(newGoals);
                }, 2000);
            }

        } catch (err) {
            console.error('Onboarding AI error:', err);
            setError(err.message);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I apologize, but I'm having trouble connecting right now. You can skip to set up your profile manually, or try again in a moment."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleComplete = async (goals = extractedGoals) => {
        try {
            const service = getDataService();
            const profileData = mapGoalsToProfile(goals);

            // Save holistic goals
            if (Object.keys(profileData.holisticGoals).length > 0) {
                const existingGoals = await service.getHolisticGoals() || {};
                await service.saveHolisticGoals({
                    ...existingGoals,
                    ...profileData.holisticGoals
                });
            }

            // Save selected workout program
            if (profileData.fitnessProgram) {
                await service.saveActiveProgram({ programId: profileData.fitnessProgram });
            }

            // Mark onboarding as complete
            localStorage.setItem('ai_onboarding_complete', 'true');

            // Navigate to dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error('Error saving onboarding data:', err);
            navigate('/profile?onboarding=true');
        }
    };

    const handleSkip = () => {
        localStorage.setItem('ai_onboarding_complete', 'skipped');
        navigate('/profile?onboarding=true');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800">
            {/* Header */}
            <div className="flex-shrink-0 px-6 py-4 bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-dark-700">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 dark:text-white">AI Life Advisor</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Let's design your optimal life</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSkip}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <SkipForward size={16} />
                        Skip
                    </button>
                </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex-shrink-0 px-6 py-3 bg-white/50 dark:bg-dark-800/50 border-b border-gray-100 dark:border-dark-700">
                <div className="max-w-3xl mx-auto">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {goalCategories.map(cat => (
                            <div
                                key={cat.key}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${extractedGoals[cat.key]
                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                    : 'bg-gray-100 dark:bg-dark-700 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-dark-600'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                                {extractedGoals[cat.key] && <CheckCircle2 size={12} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="max-w-3xl mx-auto space-y-4">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user'
                                ? 'bg-blue-500'
                                : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                                }`}>
                                {msg.role === 'user'
                                    ? <User size={16} className="text-white" />
                                    : <Sparkles size={16} className="text-white" />
                                }
                            </div>
                            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.role === 'user'
                                ? 'bg-blue-500 text-white rounded-tr-sm'
                                : 'bg-white dark:bg-dark-700 text-gray-800 dark:text-gray-100 rounded-tl-sm shadow-sm border border-gray-100 dark:border-dark-600'
                                }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                <Sparkles size={16} className="text-white" />
                            </div>
                            <div className="bg-white dark:bg-dark-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-dark-600">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex-shrink-0 px-6 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-900/30">
                    <p className="text-center text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* Input Area */}
            <div className="flex-shrink-0 px-6 py-4 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700">
                <div className="max-w-3xl mx-auto">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Share your goals and aspirations..."
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            disabled={isLoading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!inputValue.trim() || isLoading}
                            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                        >
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </div>

                    {/* Quick completion button if enough goals */}
                    {completedGoals.length >= 2 && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => handleComplete()}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                            >
                                <CheckCircle2 size={16} />
                                I'm ready to get started!
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
