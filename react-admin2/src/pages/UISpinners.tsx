import React, { useState } from 'react';

const UISpinners: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLoading = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 3000);
    };

    return (
        <div className="mx-auto max-w-7xl p-6">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Spinners</h1>

            {/* Basic Spinners */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Basic Spinners</h2>
                <div className="flex flex-wrap items-center gap-8">
                    {/* Simple Spinner */}
                    <div className="flex flex-col items-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Simple</span>
                    </div>

                    {/* Dots Spinner */}
                    <div className="flex flex-col items-center">
                        <div className="flex space-x-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
                        </div>
                        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Dots</span>
                    </div>

                    {/* Pulse Spinner */}
                    <div className="flex flex-col items-center">
                        <div className="h-8 w-8 animate-pulse rounded-full bg-blue-600"></div>
                        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Pulse</span>
                    </div>

                    {/* Ping Spinner */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="h-8 w-8 animate-ping rounded-full bg-blue-600 opacity-75"></div>
                            <div className="absolute top-0 left-0 h-8 w-8 rounded-full bg-blue-600"></div>
                        </div>
                        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Ping</span>
                    </div>
                </div>
            </div>

            {/* Spinner Sizes */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Spinner Sizes</h2>
                <div className="flex flex-wrap items-center gap-8">
                    <div className="flex flex-col items-center">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Small</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Medium</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Large</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Extra Large</span>
                    </div>
                </div>
            </div>

            {/* Spinner Colors */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Spinner Colors</h2>
                <div className="flex flex-wrap items-center gap-8">
                    {[
                        { color: 'border-t-blue-600', name: 'Blue' },
                        { color: 'border-t-green-600', name: 'Green' },
                        { color: 'border-t-red-600', name: 'Red' },
                        { color: 'border-t-yellow-600', name: 'Yellow' },
                        { color: 'border-t-purple-600', name: 'Purple' },
                        { color: 'border-t-pink-600', name: 'Pink' },
                        { color: 'border-t-indigo-600', name: 'Indigo' },
                        { color: 'border-t-gray-600', name: 'Gray' }
                    ].map((spinner, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className={`h-8 w-8 animate-spin rounded-full border-2 border-gray-300 ${spinner.color}`}></div>
                            <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">{spinner.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Spinners */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Custom Spinners</h2>
                <div className="flex flex-wrap items-center gap-8">
                    {/* Bars Spinner */}
                    <div className="flex flex-col items-center">
                        <div className="flex space-x-1">
                            <div className="h-6 w-1 animate-pulse bg-blue-600 [animation-delay:-0.4s]"></div>
                            <div className="h-6 w-1 animate-pulse bg-blue-600 [animation-delay:-0.3s]"></div>
                            <div className="h-6 w-1 animate-pulse bg-blue-600 [animation-delay:-0.2s]"></div>
                            <div className="h-6 w-1 animate-pulse bg-blue-600 [animation-delay:-0.1s]"></div>
                            <div className="h-6 w-1 animate-pulse bg-blue-600"></div>
                        </div>
                        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Bars</span>
                    </div>

                    {/* Squares Spinner */}
                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-2 gap-1">
                            <div className="h-3 w-3 animate-pulse bg-blue-600 [animation-delay:-0.3s]"></div>
                            <div className="h-3 w-3 animate-pulse bg-blue-600 [animation-delay:-0.2s]"></div>
                            <div className="h-3 w-3 animate-pulse bg-blue-600 [animation-delay:-0.1s]"></div>
                            <div className="h-3 w-3 animate-pulse bg-blue-600"></div>
                        </div>
                        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Squares</span>
                    </div>

                    {/* Circle Dots Spinner */}
                    <div className="flex flex-col items-center">
                        <div className="relative h-8 w-8">
                            <div className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 animate-spin rounded-full bg-blue-600 [animation-duration:1s]"></div>
                            <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 animate-spin rounded-full bg-blue-600 [animation-duration:1s] [animation-delay:-0.5s]"></div>
                        </div>
                        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Circle Dots</span>
                    </div>

                    {/* Wave Spinner */}
                    <div className="flex flex-col items-center">
                        <div className="flex space-x-1">
                            <div className="h-6 w-1 animate-bounce bg-blue-600 [animation-delay:-0.4s]"></div>
                            <div className="h-6 w-1 animate-bounce bg-blue-600 [animation-delay:-0.3s]"></div>
                            <div className="h-6 w-1 animate-bounce bg-blue-600 [animation-delay:-0.2s]"></div>
                            <div className="h-6 w-1 animate-bounce bg-blue-600 [animation-delay:-0.1s]"></div>
                            <div className="h-6 w-1 animate-bounce bg-blue-600"></div>
                        </div>
                        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Wave</span>
                    </div>
                </div>
            </div>

            {/* Spinner with Text */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Spinner with Text</h2>
                <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                        <span className="text-gray-700 dark:text-gray-300">Loading...</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-green-600"></div>
                        <span className="text-gray-700 dark:text-gray-300">Processing your request...</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-purple-600"></div>
                        <span className="text-gray-700 dark:text-gray-300">Saving changes...</span>
                    </div>
                </div>
            </div>

            {/* Button with Spinner */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Button with Spinner</h2>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={handleLoading}
                        disabled={isLoading}
                        className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading && (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        )}
                        <span>{isLoading ? 'Loading...' : 'Click to Load'}</span>
                    </button>

                    <button
                        onClick={handleLoading}
                        disabled={isLoading}
                        className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        {isLoading && (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent"></div>
                        )}
                        <span>{isLoading ? 'Processing...' : 'Secondary Button'}</span>
                    </button>
                </div>
            </div>

            {/* Overlay Spinner */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Overlay Spinner</h2>
                <div className="relative">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content Area</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            This is a content area that can be overlaid with a spinner.
                        </p>
                        <div className="mt-4 flex space-x-2">
                            <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
                                Action 1
                            </button>
                            <button className="rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                                Action 2
                            </button>
                        </div>
                    </div>

                    {/* Overlay Spinner */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75">
                        <div className="flex flex-col items-center space-y-2">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page Loader */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Page Loader</h2>
                <div className="relative h-32 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Loading Page</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Please wait while we load your content...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UISpinners;
