import React from 'react';

const TestTailwind: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Tailwind CSS Test</h1>
                <p className="text-gray-600 mb-4">If you can see this styled properly, Tailwind is working!</p>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Test Button
                </button>
            </div>
        </div>
    );
};

export default TestTailwind;

