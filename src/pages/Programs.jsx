import React from 'react';
import { ProgramSelector } from '../components';

export default function Programs() {
    const handleStartProgram = (program, day) => {
        console.log('Starting workout:', program.name, day?.name);
        // Future: Navigate to active workout view or save to user's active program
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProgramSelector onSelectProgram={handleStartProgram} />
            </div>
        </div>
    );
}
