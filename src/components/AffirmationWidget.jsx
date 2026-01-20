import React, { useState } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import { mindfulnessData } from '../data/mindfulnessData';

export default function AffirmationWidget() {
    const [affirmation, setAffirmation] = useState(mindfulnessData.affirmations[0]);

    const getNewAffirmation = () => {
        const random = mindfulnessData.affirmations[Math.floor(Math.random() * mindfulnessData.affirmations.length)];
        setAffirmation(random);
    };

    return (
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Quote className="w-6 h-6 text-white" />
                    </div>
                    <button
                        onClick={getNewAffirmation}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <RefreshCw className="w-5 h-5 text-white/80" />
                    </button>
                </div>

                <blockquote className="text-2xl font-medium leading-relaxed mb-4">
                    "{affirmation}"
                </blockquote>

                <p className="text-emerald-100 text-sm font-medium opacity-80 uppercase tracking-wider">
                    Daily Affirmation
                </p>
            </div>
        </div>
    );
}
