import {
    InformationCircleIcon,
    QuestionMarkCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';

const UIPopovers: React.FC = () => {
    const [activePopover, setActivePopover] = useState<string | null>(null);
    const popoverRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const handleClickOutside = (event: MouseEvent) => {
        for (const key in popoverRefs.current) {
            if (popoverRefs.current[key] && !popoverRefs.current[key]?.contains(event.target as Node)) {
                setActivePopover(null);
            }
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const togglePopover = (id: string) => {
        setActivePopover(activePopover === id ? null : id);
    };

    const PopoverContent = ({
        title,
        content,
        position = 'bottom'
    }: {
        title: string;
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
                    return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
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
                    return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900 dark:border-b-gray-700';
            }
        };

        return (
            <div className={`absolute z-50 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 ${getPositionClasses()}`}>
                <div className={`absolute h-0 w-0 border-4 ${getArrowClasses()}`}></div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{content}</p>
            </div>
        );
    };

    return (
        <div className="mx-auto max-w-7xl p-6">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Popovers</h1>

            {/* Basic Popover */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Basic Popover</h2>
                <div className="flex flex-wrap gap-4">
                    <div className="relative" ref={(el) => { popoverRefs.current['basic'] = el; }}>
                        <button
                            onClick={() => togglePopover('basic')}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Hover me
                        </button>
                        {activePopover === 'basic' && (
                            <PopoverContent
                                title="Basic Popover"
                                content="This is a basic popover with some helpful information."
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Popover Positions */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Popover Positions</h2>
                <div className="flex flex-wrap gap-4">
                    <div className="relative" ref={(el) => { popoverRefs.current['top'] = el; }}>
                        <button
                            onClick={() => togglePopover('top')}
                            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                            Top
                        </button>
                        {activePopover === 'top' && (
                            <PopoverContent
                                title="Top Popover"
                                content="This popover appears above the trigger element."
                                position="top"
                            />
                        )}
                    </div>

                    <div className="relative" ref={(el) => { popoverRefs.current['bottom'] = el; }}>
                        <button
                            onClick={() => togglePopover('bottom')}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Bottom
                        </button>
                        {activePopover === 'bottom' && (
                            <PopoverContent
                                title="Bottom Popover"
                                content="This popover appears below the trigger element."
                                position="bottom"
                            />
                        )}
                    </div>

                    <div className="relative" ref={(el) => { popoverRefs.current['left'] = el; }}>
                        <button
                            onClick={() => togglePopover('left')}
                            className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                        >
                            Left
                        </button>
                        {activePopover === 'left' && (
                            <PopoverContent
                                title="Left Popover"
                                content="This popover appears to the left of the trigger element."
                                position="left"
                            />
                        )}
                    </div>

                    <div className="relative" ref={(el) => { popoverRefs.current['right'] = el; }}>
                        <button
                            onClick={() => togglePopover('right')}
                            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        >
                            Right
                        </button>
                        {activePopover === 'right' && (
                            <PopoverContent
                                title="Right Popover"
                                content="This popover appears to the right of the trigger element."
                                position="right"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Icon Popovers */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Icon Popovers</h2>
                <div className="flex flex-wrap gap-4">
                    <div className="relative" ref={(el) => { popoverRefs.current['info'] = el; }}>
                        <button
                            onClick={() => togglePopover('info')}
                            className="rounded-full p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        >
                            <InformationCircleIcon className="h-6 w-6" />
                        </button>
                        {activePopover === 'info' && (
                            <PopoverContent
                                title="Information"
                                content="This is an informational popover triggered by an icon button."
                            />
                        )}
                    </div>

                    <div className="relative" ref={(el) => { popoverRefs.current['help'] = el; }}>
                        <button
                            onClick={() => togglePopover('help')}
                            className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                            <QuestionMarkCircleIcon className="h-6 w-6" />
                        </button>
                        {activePopover === 'help' && (
                            <PopoverContent
                                title="Help"
                                content="This is a help popover that provides additional context or assistance."
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Rich Content Popover */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Rich Content Popover</h2>
                <div className="relative" ref={(el) => { popoverRefs.current['rich'] = el; }}>
                    <button
                        onClick={() => togglePopover('rich')}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                    >
                        Rich Content
                    </button>
                    {activePopover === 'rich' && (
                        <div className="absolute top-full left-1/2 z-50 w-80 transform -translate-x-1/2 mt-2 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                            <div className="absolute bottom-full left-1/2 h-0 w-0 transform -translate-x-1/2 border-4 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Rich Content</h3>
                                <button
                                    onClick={() => setActivePopover(null)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    This popover contains rich content including multiple elements.
                                </p>
                                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                    <h4 className="mb-1 font-medium text-gray-900 dark:text-white">Feature List</h4>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400">
                                        <li>• Interactive elements</li>
                                        <li>• Custom styling</li>
                                        <li>• Multiple sections</li>
                                    </ul>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                        Cancel
                                    </button>
                                    <button className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700">
                                        Action
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Form Popover */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Form Popover</h2>
                <div className="relative" ref={(el) => { popoverRefs.current['form'] = el; }}>
                    <button
                        onClick={() => togglePopover('form')}
                        className="rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                    >
                        Quick Add
                    </button>
                    {activePopover === 'form' && (
                        <div className="absolute top-full left-1/2 z-50 w-64 transform -translate-x-1/2 mt-2 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                            <div className="absolute bottom-full left-1/2 h-0 w-0 transform -translate-x-1/2 border-4 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Quick Add Item</h3>
                            <form className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Category
                                    </label>
                                    <select className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                                        <option>Select category</option>
                                        <option>Category 1</option>
                                        <option>Category 2</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setActivePopover(null)}
                                        className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded bg-yellow-600 px-3 py-1 text-sm text-white hover:bg-yellow-700"
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Trigger on Hover */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Hover Trigger</h2>
                <div className="relative" ref={(el) => { popoverRefs.current['hover'] = el; }}>
                    <button
                        onMouseEnter={() => setActivePopover('hover')}
                        onMouseLeave={() => setActivePopover(null)}
                        className="rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700"
                    >
                        Hover me
                    </button>
                    {activePopover === 'hover' && (
                        <PopoverContent
                            title="Hover Popover"
                            content="This popover appears when you hover over the button and disappears when you move away."
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UIPopovers;
