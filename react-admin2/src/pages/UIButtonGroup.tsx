import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, PlayIcon, PauseIcon, StopIcon } from '@heroicons/react/24/outline';

const UIButtonGroup: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState('option1');
    const [selectedSize, setSelectedSize] = useState('medium');
    const [selectedColor, setSelectedColor] = useState('blue');

    const buttonSizes = [
        { name: 'Small', class: 'px-3 py-1.5 text-sm' },
        { name: 'Medium', class: 'px-4 py-2 text-base' },
        { name: 'Large', class: 'px-6 py-3 text-lg' },
    ];

    const buttonColors = [
        { name: 'Blue', class: 'bg-blue-600 hover:bg-blue-700 text-white' },
        { name: 'Green', class: 'bg-green-600 hover:bg-green-700 text-white' },
        { name: 'Red', class: 'bg-red-600 hover:bg-red-700 text-white' },
        { name: 'Gray', class: 'bg-gray-600 hover:bg-gray-700 text-white' },
    ];

    const getButtonClass = (size: string, color: string) => {
        const sizeClass = buttonSizes.find(s => s.name.toLowerCase() === size.toLowerCase())?.class || buttonSizes[1].class;
        const colorClass = buttonColors.find(c => c.name.toLowerCase() === color.toLowerCase())?.class || buttonColors[0].class;
        return `${sizeClass} ${colorClass} font-medium rounded-l-md border-r border-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`;
    };

    const getFirstButtonClass = (size: string, color: string) => {
        const sizeClass = buttonSizes.find(s => s.name.toLowerCase() === size.toLowerCase())?.class || buttonSizes[1].class;
        const colorClass = buttonColors.find(c => c.name.toLowerCase() === color.toLowerCase())?.class || buttonColors[0].class;
        return `${sizeClass} ${colorClass} font-medium rounded-l-md border-r border-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`;
    };

    const getMiddleButtonClass = (size: string, color: string) => {
        const sizeClass = buttonSizes.find(s => s.name.toLowerCase() === size.toLowerCase())?.class || buttonSizes[1].class;
        const colorClass = buttonColors.find(c => c.name.toLowerCase() === color.toLowerCase())?.class || buttonColors[0].class;
        return `${sizeClass} ${colorClass} font-medium border-r border-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`;
    };

    const getLastButtonClass = (size: string, color: string) => {
        const sizeClass = buttonSizes.find(s => s.name.toLowerCase() === size.toLowerCase())?.class || buttonSizes[1].class;
        const colorClass = buttonColors.find(c => c.name.toLowerCase() === color.toLowerCase())?.class || buttonColors[0].class;
        return `${sizeClass} ${colorClass} font-medium rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`;
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Button Group Components</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Grouped buttons for related actions and options</p>
            </div>

            <div className="space-y-8">
                {/* Basic Button Groups */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Basic Button Groups</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-6">
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Horizontal Group</h4>
                                <div className="flex">
                                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-l-md border-r border-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                        Left
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 text-white font-medium border-r border-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                        Middle
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                        Right
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Vertical Group</h4>
                                <div className="flex flex-col w-fit">
                                    <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-t-md border-b border-green-700 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                                        Top
                                    </button>
                                    <button className="px-4 py-2 bg-green-600 text-white font-medium border-b border-green-700 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                                        Middle
                                    </button>
                                    <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-b-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                                        Bottom
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Button Group Sizes */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Button Group Sizes</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            {buttonSizes.map((size) => (
                                <div key={size.name}>
                                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{size.name}</h4>
                                    <div className="flex">
                                        <button className={`${size.class} bg-purple-600 text-white font-medium rounded-l-md border-r border-purple-700 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors`}>
                                            Option 1
                                        </button>
                                        <button className={`${size.class} bg-purple-600 text-white font-medium border-r border-purple-700 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors`}>
                                            Option 2
                                        </button>
                                        <button className={`${size.class} bg-purple-600 text-white font-medium rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors`}>
                                            Option 3
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Button Group Colors */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Button Group Colors</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            {buttonColors.map((color) => (
                                <div key={color.name}>
                                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{color.name}</h4>
                                    <div className="flex">
                                        <button className={`px-4 py-2 ${color.class} font-medium rounded-l-md border-r border-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}>
                                            First
                                        </button>
                                        <button className={`px-4 py-2 ${color.class} font-medium border-r border-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}>
                                            Second
                                        </button>
                                        <button className={`px-4 py-2 ${color.class} font-medium rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}>
                                            Third
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Toggle Button Groups */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Toggle Button Groups</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-6">
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Single Selection</h4>
                                <div className="flex">
                                    {['option1', 'option2', 'option3'].map((option, index) => (
                                        <button
                                            key={option}
                                            onClick={() => setSelectedOption(option)}
                                            className={`px-4 py-2 font-medium border ${
                                                selectedOption === option
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                                            } ${
                                                index === 0 ? 'rounded-l-md border-r-0' :
                                                index === 2 ? 'rounded-r-md border-l-0' :
                                                'border-r-0 border-l-0'
                                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                                        >
                                            Option {index + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Multiple Selection</h4>
                                <div className="flex">
                                    {['Bold', 'Italic', 'Underline'].map((style, index) => (
                                        <button
                                            key={style}
                                            className={`px-4 py-2 font-medium border ${
                                                index === 0 ? 'rounded-l-md border-r-0' :
                                                index === 2 ? 'rounded-r-md border-l-0' :
                                                'border-r-0 border-l-0'
                                            } bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Icon Button Groups */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Icon Button Groups</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-6">
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Media Controls</h4>
                                <div className="flex">
                                    <button className="p-2 bg-indigo-600 text-white rounded-l-md border-r border-indigo-700 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </button>
                                    <button className="p-2 bg-indigo-600 text-white border-r border-indigo-700 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                        <PlayIcon className="h-5 w-5" />
                                    </button>
                                    <button className="p-2 bg-indigo-600 text-white border-r border-indigo-700 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                        <PauseIcon className="h-5 w-5" />
                                    </button>
                                    <button className="p-2 bg-indigo-600 text-white border-r border-indigo-700 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                        <StopIcon className="h-5 w-5" />
                                    </button>
                                    <button className="p-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Navigation</h4>
                                <div className="flex">
                                    <button className="p-2 bg-gray-600 text-white rounded-l-md border-r border-gray-700 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                                        <ChevronUpIcon className="h-5 w-5" />
                                    </button>
                                    <button className="p-2 bg-gray-600 text-white border-r border-gray-700 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </button>
                                    <button className="p-2 bg-gray-600 text-white border-r border-gray-700 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </button>
                                    <button className="p-2 bg-gray-600 text-white rounded-r-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                                        <ChevronDownIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Segmented Control */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Segmented Control</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-6">
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">View Options</h4>
                                <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                    {['Grid', 'List', 'Card'].map((view, index) => (
                                        <button
                                            key={view}
                                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                                index === 0
                                                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                                                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                            }`}
                                        >
                                            {view}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Sort Options</h4>
                                <div className="inline-flex bg-blue-100 dark:bg-blue-900/20 rounded-lg p-1">
                                    {['Newest', 'Popular', 'Trending'].map((sort, index) => (
                                        <button
                                            key={sort}
                                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                                index === 1
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                                            }`}
                                        >
                                            {sort}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Button Group with Dropdown */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Button Group with Dropdown</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex">
                            <button className="px-4 py-2 bg-orange-600 text-white font-medium rounded-l-md border-r border-orange-700 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
                                Action
                            </button>
                            <button className="px-4 py-2 bg-orange-600 text-white font-medium border-r border-orange-700 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
                                Another Action
                            </button>
                            <div className="relative">
                                <button className="px-4 py-2 bg-orange-600 text-white font-medium rounded-r-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors flex items-center">
                                    <span>More</span>
                                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Responsive Button Groups */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Responsive Button Groups</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Stacked</h4>
                                <div className="flex flex-col sm:flex-row">
                                    <button className="px-4 py-2 bg-teal-600 text-white font-medium sm:rounded-l-md sm:rounded-r-none rounded-md border-b sm:border-b-0 sm:border-r border-teal-700 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
                                        Mobile First
                                    </button>
                                    <button className="px-4 py-2 bg-teal-600 text-white font-medium sm:border-r border-b sm:border-b-0 border-teal-700 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
                                        Responsive
                                    </button>
                                    <button className="px-4 py-2 bg-teal-600 text-white font-medium sm:rounded-r-md sm:rounded-l-none rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
                                        Design
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIButtonGroup;
