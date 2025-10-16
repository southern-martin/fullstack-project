import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';

const UITooltips: React.FC = () => {
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const tooltipRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const handleClickOutside = (event: MouseEvent) => {
        for (const key in tooltipRefs.current) {
            if (tooltipRefs.current[key] && !tooltipRefs.current[key]?.contains(event.target as Node)) {
                setActiveTooltip(null);
            }
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleTooltip = (id: string) => {
        setActiveTooltip(activeTooltip === id ? null : id);
    };

    const TooltipContent = ({
        content,
        position = 'top'
    }: {
        content: string;
        position?: 'top' | 'bottom' | 'left' | 'right';
    }) => {
        const getPositionClasses = () => {
            switch (position) {
                case 'top':
                    return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
                case 'bottom':
                    return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
                case 'left':
                    return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
                case 'right':
                    return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
                default:
                    return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
            }
        };

        const getArrowClasses = () => {
            switch (position) {
                case 'top':
                    return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900 dark:border-t-gray-700';
                case 'bottom':
                    return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900 dark:border-b-gray-700';
                case 'left':
                    return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900 dark:border-l-gray-700';
                case 'right':
                    return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900 dark:border-r-gray-700';
                default:
                    return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900 dark:border-t-gray-700';
            }
        };

        return (
            <div className={`absolute z-50 rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg dark:bg-gray-700 ${getPositionClasses()}`}>
                <div className={`absolute h-0 w-0 border-2 ${getArrowClasses()}`}></div>
                {content}
            </div>
        );
    };

    return (
        <div className="mx-auto max-w-7xl p-6">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Tooltips</h1>

            {/* Basic Tooltips */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Basic Tooltips</h2>
                <div className="flex flex-wrap gap-4">
                    <div className="relative" ref={(el) => { tooltipRefs.current['basic'] = el; }}>
                        <button
                            onMouseEnter={() => setActiveTooltip('basic')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Hover me
                        </button>
                        {activeTooltip === 'basic' && (
                            <TooltipContent content="This is a basic tooltip" />
                        )}
                    </div>
                </div>
            </div>

            {/* Tooltip Positions */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Tooltip Positions</h2>
                <div className="flex flex-wrap gap-4">
                    <div className="relative" ref={(el) => { tooltipRefs.current['top'] = el; }}>
                        <button
                            onMouseEnter={() => setActiveTooltip('top')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                            Top
                        </button>
                        {activeTooltip === 'top' && (
                            <TooltipContent content="Tooltip appears above" position="top" />
                        )}
                    </div>

                    <div className="relative" ref={(el) => { tooltipRefs.current['bottom'] = el; }}>
                        <button
                            onMouseEnter={() => setActiveTooltip('bottom')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Bottom
                        </button>
                        {activeTooltip === 'bottom' && (
                            <TooltipContent content="Tooltip appears below" position="bottom" />
                        )}
                    </div>

                    <div className="relative" ref={(el) => { tooltipRefs.current['left'] = el; }}>
                        <button
                            onMouseEnter={() => setActiveTooltip('left')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                        >
                            Left
                        </button>
                        {activeTooltip === 'left' && (
                            <TooltipContent content="Tooltip appears on the left" position="left" />
                        )}
                    </div>

                    <div className="relative" ref={(el) => { tooltipRefs.current['right'] = el; }}>
                        <button
                            onMouseEnter={() => setActiveTooltip('right')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        >
                            Right
                        </button>
                        {activeTooltip === 'right' && (
                            <TooltipContent content="Tooltip appears on the right" position="right" />
                        )}
                    </div>
                </div>
            </div>

            {/* Icon Tooltips */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Icon Tooltips</h2>
                <div className="flex flex-wrap gap-4">
                    <div className="relative" ref={(el) => { tooltipRefs.current['info'] = el; }}>
                        <button
                            onMouseEnter={() => setActiveTooltip('info')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="rounded-full p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        >
                            <InformationCircleIcon className="h-6 w-6" />
                        </button>
                        {activeTooltip === 'info' && (
                            <TooltipContent content="Information tooltip" />
                        )}
                    </div>

                    <div className="relative" ref={(el) => { tooltipRefs.current['help'] = el; }}>
                        <button
                            onMouseEnter={() => setActiveTooltip('help')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                            <QuestionMarkCircleIcon className="h-6 w-6" />
                        </button>
                        {activeTooltip === 'help' && (
                            <TooltipContent content="Help tooltip" />
                        )}
                    </div>

                    <div className="relative" ref={(el) => { tooltipRefs.current['warning'] = el; }}>
                        <button
                            onMouseEnter={() => setActiveTooltip('warning')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="rounded-full p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                        >
                            <ExclamationTriangleIcon className="h-6 w-6" />
                        </button>
                        {activeTooltip === 'warning' && (
                            <TooltipContent content="Warning tooltip" />
                        )}
                    </div>

                    <div className="relative" ref={(el) => { tooltipRefs.current['success'] = el; }}>
                        <button
                            onMouseEnter={() => setActiveTooltip('success')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="rounded-full p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20"
                        >
                            <CheckCircleIcon className="h-6 w-6" />
                        </button>
                        {activeTooltip === 'success' && (
                            <TooltipContent content="Success tooltip" />
                        )}
                    </div>
                </div>
            </div>

            {/* Form Field Tooltips */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Form Field Tooltips</h2>
                <div className="space-y-4">
                    <div className="relative" ref={(el) => { tooltipRefs.current['email'] = el; }}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email Address
                        </label>
                        <div className="mt-1 flex">
                            <input
                                type="email"
                                className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter your email"
                            />
                            <button
                                onMouseEnter={() => setActiveTooltip('email')}
                                onMouseLeave={() => setActiveTooltip(null)}
                                className="rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                            >
                                <InformationCircleIcon className="h-5 w-5" />
                            </button>
                        </div>
                        {activeTooltip === 'email' && (
                            <TooltipContent content="We'll never share your email with anyone else" position="top" />
                        )}
                    </div>

                    <div className="relative" ref={(el) => { tooltipRefs.current['password'] = el; }}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <div className="mt-1 flex">
                            <input
                                type="password"
                                className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter your password"
                            />
                            <button
                                onMouseEnter={() => setActiveTooltip('password')}
                                onMouseLeave={() => setActiveTooltip(null)}
                                className="rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                            >
                                <QuestionMarkCircleIcon className="h-5 w-5" />
                            </button>
                        </div>
                        {activeTooltip === 'password' && (
                            <TooltipContent content="Password must be at least 8 characters long" position="top" />
                        )}
                    </div>
                </div>
            </div>

            {/* Long Tooltips */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Long Tooltips</h2>
                <div className="flex flex-wrap gap-4">
                    <div className="relative" ref={(el) => { tooltipRefs.current['long'] = el; }}>
                        <button
                            onMouseEnter={() => setActiveTooltip('long')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                        >
                            Long Tooltip
                        </button>
                        {activeTooltip === 'long' && (
                            <div className="absolute bottom-full left-1/2 z-50 w-64 transform -translate-x-1/2 mb-2 rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg dark:bg-gray-700">
                                <div className="absolute top-full left-1/2 h-0 w-0 transform -translate-x-1/2 border-2 border-l-transparent border-r-transparent border-t-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                                This is a longer tooltip that contains more detailed information about the element you're hovering over. It can span multiple lines and provide comprehensive context.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tooltip with HTML Content */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Rich Content Tooltips</h2>
                <div className="flex flex-wrap gap-4">
                    <div className="relative" ref={(el) => { tooltipRefs.current['rich'] = el; }}>
                        <button
                            onMouseEnter={() => setActiveTooltip('rich')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700"
                        >
                            Rich Content
                        </button>
                        {activeTooltip === 'rich' && (
                            <div className="absolute bottom-full left-1/2 z-50 w-72 transform -translate-x-1/2 mb-2 rounded-lg bg-gray-900 p-4 text-sm text-white shadow-lg dark:bg-gray-700">
                                <div className="absolute top-full left-1/2 h-0 w-0 transform -translate-x-1/2 border-2 border-l-transparent border-r-transparent border-t-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Rich Tooltip</h4>
                                    <p>This tooltip contains rich content including:</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>Multiple paragraphs</li>
                                        <li>Lists and formatting</li>
                                        <li>Custom styling</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Disabled Tooltips */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Disabled Elements with Tooltips</h2>
                <div className="flex flex-wrap gap-4">
                    <div className="relative" ref={(el) => { tooltipRefs.current['disabled'] = el; }}>
                        <button
                            disabled
                            onMouseEnter={() => setActiveTooltip('disabled')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="rounded-lg bg-gray-400 px-4 py-2 text-white cursor-not-allowed"
                        >
                            Disabled Button
                        </button>
                        {activeTooltip === 'disabled' && (
                            <TooltipContent content="This button is disabled" />
                        )}
                    </div>
                </div>
            </div>

            {/* Tooltip Colors */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Tooltip Colors</h2>
                <div className="flex flex-wrap gap-4">
                    {[
                        { color: 'bg-blue-600', name: 'Blue' },
                        { color: 'bg-green-600', name: 'Green' },
                        { color: 'bg-red-600', name: 'Red' },
                        { color: 'bg-yellow-600', name: 'Yellow' },
                        { color: 'bg-purple-600', name: 'Purple' },
                        { color: 'bg-pink-600', name: 'Pink' }
                    ].map((tooltip, index) => (
                        <div key={index} className="relative" ref={(el) => { tooltipRefs.current[`color-${index}`] = el; }}>
                            <button
                                onMouseEnter={() => setActiveTooltip(`color-${index}`)}
                                onMouseLeave={() => setActiveTooltip(null)}
                                className={`rounded-lg px-4 py-2 text-white hover:opacity-90 ${tooltip.color}`}
                            >
                                {tooltip.name}
                            </button>
                            {activeTooltip === `color-${index}` && (
                                <div className={`absolute bottom-full left-1/2 z-50 transform -translate-x-1/2 mb-2 rounded-lg px-3 py-2 text-sm text-white shadow-lg ${tooltip.color}`}>
                                    <div className={`absolute top-full left-1/2 h-0 w-0 transform -translate-x-1/2 border-2 border-l-transparent border-r-transparent border-t-transparent ${tooltip.color.replace('bg-', 'border-t-')}`}></div>
                                    {tooltip.name} tooltip
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UITooltips;
