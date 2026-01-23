import React, { useState, useEffect, useRef } from 'react';
import {
    Heart, TrendingUp, Briefcase, Sparkles,
    ArrowLeft, Send, Loader2, Key, Settings,
    MessageSquare, Trash2, RefreshCw, User, Bot
} from 'lucide-react';
import { toast } from 'react-toastify';
import { advisorCategories, getCategory, getFramework } from '../data/advisorData';
import {
    hasApiKey, setApiKey, getApiKey,
    gatherUserContext, sendMessage,
    getConversation, saveConversation, clearConversation
} from '../services/aiService';

const iconMap = {
    Heart,
    TrendingUp,
    Briefcase,
    Sparkles
};

const colorMap = {
    emerald: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-600 dark:text-emerald-400',
        hover: 'hover:border-emerald-400',
        gradient: 'from-emerald-500/20 to-emerald-600/10'
    },
    green: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-600 dark:text-green-400',
        hover: 'hover:border-green-400',
        gradient: 'from-green-500/20 to-green-600/10'
    },
    blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-600 dark:text-blue-400',
        hover: 'hover:border-blue-400',
        gradient: 'from-blue-500/20 to-blue-600/10'
    },
    purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-600 dark:text-purple-400',
        hover: 'hover:border-purple-400',
        gradient: 'from-purple-500/20 to-purple-600/10'
    }
};

// API Key Setup Modal
const ApiKeyModal = ({ onSubmit, onClose }) => {
    const [key, setKey] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (key.trim()) {
            onSubmit(key.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <Key className="w-6 h-6 text-amber-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">API Key Required</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Enter your OpenRouter API key to enable the AI advisor. Get one free at{' '}
                    <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        openrouter.ai/keys
                    </a>
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="sk-or-v1-..."
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-4"
                    />
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!key.trim()}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save Key
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Category Selection Screen
const CategorySelector = ({ onSelect }) => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">AI Advisor</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
                Choose a topic for personalized guidance from your AI advisor,
                powered by your complete wellness profile.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
                {advisorCategories.map((category) => {
                    const IconComponent = iconMap[category.icon];
                    const colors = colorMap[category.color];

                    return (
                        <button
                            key={category.id}
                            onClick={() => onSelect(category.id)}
                            className={`p-6 rounded-2xl border ${colors.border} ${colors.bg} ${colors.hover} transition-all duration-300 hover:scale-[1.02] text-left group`}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient}`}>
                                    <IconComponent className={`w-6 h-6 ${colors.text}`} />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{category.name}</h2>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{category.description}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// Framework Selection Screen
const FrameworkSelector = ({ categoryId, onSelect, onBack }) => {
    const category = getCategory(categoryId);
    const colors = colorMap[category.color];
    const IconComponent = iconMap[category.icon];

    return (
        <div className="min-h-[60vh] p-6">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to categories
            </button>

            <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient}`}>
                    <IconComponent className={`w-8 h-8 ${colors.text}`} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{category.name} Advisor</h1>
                    <p className="text-gray-600 dark:text-gray-400">Choose your advisor's perspective</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.frameworks.map((framework) => (
                    <button
                        key={framework.id}
                        onClick={() => onSelect(framework.id)}
                        className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 text-left group hover:shadow-md"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{framework.icon}</span>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {framework.name}
                            </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{framework.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

// Chat Message Component
const ChatMessage = ({ message, isUser }) => {
    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl ${isUser
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
            </div>
        </div>
    );
};

// Chat Interface
const ChatInterface = ({ categoryId, frameworkId, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userContext, setUserContext] = useState(null);
    const messagesEndRef = useRef(null);

    const category = getCategory(categoryId);
    const framework = getFramework(categoryId, frameworkId);
    const colors = colorMap[category.color];

    // Load conversation and context on mount
    useEffect(() => {
        const loadData = async () => {
            // Load saved conversation
            const saved = getConversation(categoryId, frameworkId);
            if (saved.messages.length > 0) {
                setMessages(saved.messages);
            }

            // Gather user context
            const context = await gatherUserContext();
            setUserContext(context);
        };
        loadData();
    }, [categoryId, frameworkId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Save conversation on message changes
    useEffect(() => {
        if (messages.length > 0) {
            saveConversation(categoryId, frameworkId, messages);
        }
    }, [messages, categoryId, frameworkId]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendMessage(
                input.trim(),
                framework.systemPrompt,
                messages,
                userContext
            );

            const aiMessage = { role: 'assistant', content: response };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            toast.error(error.message || 'Failed to get response');
            // Remove the user message on error
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        if (window.confirm('Clear this conversation? This cannot be undone.')) {
            clearConversation(categoryId, frameworkId);
            setMessages([]);
            toast.success('Conversation cleared');
        }
    };

    const handleRefreshContext = async () => {
        toast.info('Refreshing your profile data...');
        const context = await gatherUserContext();
        setUserContext(context);
        toast.success('Profile data refreshed');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{framework.icon}</span>
                        <div>
                            <h2 className="font-semibold text-gray-900 dark:text-white">{framework.name}</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{category.name} Advisor</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefreshContext}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Refresh profile data"
                    >
                        <RefreshCw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button
                        onClick={handleClearChat}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Clear conversation"
                    >
                        <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">{framework.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Start a conversation
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm">
                            Ask me anything about {category.name.toLowerCase()}.
                            I have access to your wellness profile to provide personalized advice.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {getSuggestedPrompts(categoryId, frameworkId).map((prompt, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(prompt)}
                                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <ChatMessage key={i} message={msg} isUser={msg.role === 'user'} />
                ))}

                {isLoading && (
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-sm p-4">
                            <Loader2 className="w-5 h-5 animate-spin text-gray-500 dark:text-gray-400" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Suggested prompts based on category/framework
const getSuggestedPrompts = (categoryId, frameworkId) => {
    const prompts = {
        health: {
            tcm: ['How can I balance my qi?', 'What foods support my constitution?', 'Seasonal wellness tips'],
            biohacker: ['Optimize my sleep', 'Supplement stack review', 'Performance tips'],
            allopathic: ['Review my health metrics', 'Preventive care advice', 'Lifestyle recommendations'],
            ayurvedic: ['What is my dosha?', 'Morning routine advice', 'Diet for balance'],
            functional: ['Root cause analysis', 'Gut health tips', 'Inflammation reduction']
        },
        wealth: {
            fire: ['Calculate my FIRE number', 'Savings rate review', 'Investment strategy'],
            conservative: ['Portfolio review', 'Risk assessment', 'Emergency fund advice'],
            abundance: ['Income growth ideas', 'Skill investment', 'Multiple income streams'],
            minimalist: ['Optimize my spending', 'True cost analysis', 'Simplify finances']
        },
        professional: {
            executive: ['Leadership development', 'Career strategy', 'Executive presence'],
            productivity: ['Optimize my day', 'Focus strategies', 'System recommendations'],
            entrepreneur: ['Validate my idea', 'Growth strategies', 'Resource prioritization'],
            worklife: ['Set better boundaries', 'Prevent burnout', 'Work-life integration']
        },
        spiritual: {
            mindfulness: ['Meditation guidance', 'Present moment practice', 'Dealing with stress'],
            stoic: ['Apply stoic principles', 'Evening reflection', 'Handle adversity'],
            eastern: ['Energy awareness', 'Living in flow', 'Spiritual growth'],
            secular: ['Find meaning', 'Values exploration', 'Purpose discovery']
        }
    };

    return prompts[categoryId]?.[frameworkId] || ['How can you help me?', 'Tell me about yourself', 'Where should I start?'];
};

// Main AdvisorHub Component
const AdvisorHub = () => {
    const [view, setView] = useState('categories'); // categories | frameworks | chat
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedFramework, setSelectedFramework] = useState(null);
    const [showApiKeyModal, setShowApiKeyModal] = useState(!hasApiKey());

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setView('frameworks');
    };

    const handleFrameworkSelect = (frameworkId) => {
        if (!hasApiKey()) {
            setShowApiKeyModal(true);
            return;
        }
        setSelectedFramework(frameworkId);
        setView('chat');
    };

    const handleBackToCategories = () => {
        setSelectedCategory(null);
        setView('categories');
    };

    const handleBackToFrameworks = () => {
        setSelectedFramework(null);
        setView('frameworks');
    };

    const handleApiKeySubmit = (key) => {
        setApiKey(key);
        setShowApiKeyModal(false);
        toast.success('API key saved');
        if (selectedCategory && selectedFramework) {
            setView('chat');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-900 transition-colors">
            {showApiKeyModal && (
                <ApiKeyModal
                    onSubmit={handleApiKeySubmit}
                    onClose={() => setShowApiKeyModal(false)}
                />
            )}

            {/* Settings button for API key */}
            <button
                onClick={() => setShowApiKeyModal(true)}
                className="fixed top-4 right-4 p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors z-40 shadow-sm border border-gray-200 dark:border-gray-700"
                title="API Settings"
            >
                <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            {view === 'categories' && (
                <CategorySelector onSelect={handleCategorySelect} />
            )}

            {view === 'frameworks' && selectedCategory && (
                <FrameworkSelector
                    categoryId={selectedCategory}
                    onSelect={handleFrameworkSelect}
                    onBack={handleBackToCategories}
                />
            )}

            {view === 'chat' && selectedCategory && selectedFramework && (
                <ChatInterface
                    categoryId={selectedCategory}
                    frameworkId={selectedFramework}
                    onBack={handleBackToFrameworks}
                />
            )}
        </div>
    );
};

export default AdvisorHub;
