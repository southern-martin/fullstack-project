import React, { useEffect, useState } from 'react';

const UIProgressBars: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const [indeterminateProgress, setIndeterminateProgress] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => (prev >= 100 ? 0 : prev + 10));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimatedProgress(prev => (prev >= 100 ? 0 : prev + 5));
        }, 200);

        return () => clearInterval(interval);
    }, []);

    const progressVariants = [
        { value: 25, color: 'bg-red-500', label: 'Low' },
        { value: 50, color: 'bg-yellow-500', label: 'Medium' },
        { value: 75, color: 'bg-blue-500', label: 'High' },
        { value: 100, color: 'bg-green-500', label: 'Complete' }
    ];

    const skillProgress = [
        { name: 'HTML/CSS', value: 90, color: 'bg-blue-500' },
        { name: 'JavaScript', value: 80, color: 'bg-yellow-500' },
        { name: 'React', value: 85, color: 'bg-cyan-500' },
        { name: 'Node.js', value: 70, color: 'bg-green-500' },
        { name: 'Python', value: 60, color: 'bg-purple-500' }
    ];

    return (
        <div className="mx-auto max-w-7xl p-6">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Progress Bars</h1>

            {/* Basic Progress Bars */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Basic Progress Bars</h2>
                <div className="space-y-4">
                    {progressVariants.map((variant, index) => (
                        <div key={index}>
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="text-gray-700 dark:text-gray-300">{variant.label}</span>
                                <span className="text-gray-500 dark:text-gray-400">{variant.value}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                    className={`h-2 rounded-full ${variant.color} transition-all duration-500 ease-out`}
                                    style={{ width: `${variant.value}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Animated Progress Bar */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Animated Progress Bar</h2>
                <div className="space-y-4">
                    <div>
                        <div className="mb-2 flex justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300">Loading...</span>
                            <span className="text-gray-500 dark:text-gray-400">{animatedProgress}%</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                                style={{ width: `${animatedProgress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Indeterminate Progress Bar */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Indeterminate Progress Bar</h2>
                <div className="space-y-4">
                    <div>
                        <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">Processing...</div>
                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className="h-2 w-1/3 animate-pulse rounded-full bg-blue-500"></div>
                        </div>
                    </div>
                    <div>
                        <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">Loading data...</div>
                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <div className="h-2 w-1/4 animate-bounce rounded-full bg-green-500"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar Sizes */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Different Sizes</h2>
                <div className="space-y-4">
                    <div>
                        <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">Small (4px)</div>
                        <div className="h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className="h-1 w-3/4 rounded-full bg-blue-500"></div>
                        </div>
                    </div>
                    <div>
                        <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">Medium (8px)</div>
                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className="h-2 w-3/4 rounded-full bg-green-500"></div>
                        </div>
                    </div>
                    <div>
                        <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">Large (12px)</div>
                        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className="h-3 w-3/4 rounded-full bg-purple-500"></div>
                        </div>
                    </div>
                    <div>
                        <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">Extra Large (16px)</div>
                        <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className="h-4 w-3/4 rounded-full bg-red-500"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skill Progress Bars */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Skill Progress Bars</h2>
                <div className="space-y-4">
                    {skillProgress.map((skill, index) => (
                        <div key={index}>
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                                <span className="text-gray-500 dark:text-gray-400">{skill.value}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                    className={`h-2 rounded-full ${skill.color} transition-all duration-1000 ease-out`}
                                    style={{ width: `${skill.value}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Circular Progress */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Circular Progress</h2>
                <div className="flex flex-wrap gap-8">
                    {[25, 50, 75, 100].map((value, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="relative h-20 w-20">
                                <svg className="h-20 w-20 transform -rotate-90" viewBox="0 0 36 36">
                                    <path
                                        className="text-gray-200 dark:text-gray-700"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        fill="none"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                        className="text-blue-500"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeDasharray={`${value}, 100`}
                                        fill="none"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{value}%</span>
                                </div>
                            </div>
                            <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">Progress {index + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress with Steps */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Progress with Steps</h2>
                <div className="space-y-6">
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Order Progress</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Step 3 of 4</span>
                        </div>
                        <div className="flex items-center">
                            {[1, 2, 3, 4].map((step, index) => (
                                <React.Fragment key={step}>
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${step <= 3
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                        }`}>
                                        {step <= 3 ? '✓' : step}
                                    </div>
                                    {index < 3 && (
                                        <div className={`h-1 w-16 ${step < 3
                                                ? 'bg-blue-600'
                                                : 'bg-gray-200 dark:bg-gray-700'
                                            }`}></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Ordered</span>
                            <span>Processing</span>
                            <span>Shipped</span>
                            <span>Delivered</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress with Labels */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Progress with Labels</h2>
                <div className="space-y-4">
                    <div>
                        <div className="mb-2 flex justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300">Storage Usage</span>
                            <span className="text-gray-500 dark:text-gray-400">7.2 GB of 10 GB</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className="h-3 w-3/4 rounded-full bg-gradient-to-r from-green-500 to-yellow-500"></div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">72% used</div>
                    </div>

                    <div>
                        <div className="mb-2 flex justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300">Bandwidth</span>
                            <span className="text-gray-500 dark:text-gray-400">450 MB of 1 GB</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className="h-3 w-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">45% used</div>
                    </div>
                </div>
            </div>

            {/* Interactive Progress Bar */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Interactive Progress Bar</h2>
                <div className="space-y-4">
                    <div>
                        <div className="mb-2 flex justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300">Current Progress</span>
                            <span className="text-gray-500 dark:text-gray-400">{progress}%</span>
                        </div>
                        <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                                className="h-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setProgress(Math.max(0, progress - 10))}
                            className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            -10%
                        </button>
                        <button
                            onClick={() => setProgress(Math.min(100, progress + 10))}
                            className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            +10%
                        </button>
                        <button
                            onClick={() => setProgress(0)}
                            className="rounded bg-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-300 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIProgressBars;
