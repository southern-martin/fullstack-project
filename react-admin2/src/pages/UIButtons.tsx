import {
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    HeartIcon,
    PencilIcon,
    PlusIcon,
    ShareIcon,
    StarIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import {
    HeartIcon as HeartSolidIcon,
    StarIcon as StarSolidIcon,
} from '@heroicons/react/24/solid';
import React, { useState } from 'react';

const UIButtons: React.FC = () => {
    const [liked, setLiked] = useState(false);
    const [starred, setStarred] = useState(false);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Buttons</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Interactive buttons with various styles, sizes, and states</p>
            </div>

            <div className="space-y-8">
                {/* Primary Buttons */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Primary Buttons</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Primary
                        </button>
                        <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                            Success
                        </button>
                        <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                            Danger
                        </button>
                        <button className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                            Warning
                        </button>
                        <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                            Info
                        </button>
                    </div>
                </div>

                {/* Secondary Buttons */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Secondary Buttons</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                            Default
                        </button>
                        <button className="rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-blue-600 dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-blue-900/20">
                            Blue
                        </button>
                        <button className="rounded-lg border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-green-600 dark:bg-gray-700 dark:text-green-400 dark:hover:bg-green-900/20">
                            Green
                        </button>
                        <button className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-600 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-red-900/20">
                            Red
                        </button>
                    </div>
                </div>

                {/* Button Sizes */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Button Sizes</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <button className="rounded-lg bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Extra Small
                        </button>
                        <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Small
                        </button>
                        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Medium
                        </button>
                        <button className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Large
                        </button>
                        <button className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Extra Large
                        </button>
                    </div>
                </div>

                {/* Buttons with Icons */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Buttons with Icons</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <PlusIcon className="h-4 w-4" />
                            <span>Add Item</span>
                        </button>
                        <button className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                            <PencilIcon className="h-4 w-4" />
                            <span>Edit</span>
                        </button>
                        <button className="flex items-center space-x-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-600 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-red-900/20">
                            <TrashIcon className="h-4 w-4" />
                            <span>Delete</span>
                        </button>
                        <button className="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            <span>Download</span>
                        </button>
                        <button className="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                            <ArrowUpTrayIcon className="h-4 w-4" />
                            <span>Upload</span>
                        </button>
                    </div>
                </div>

                {/* Icon Only Buttons */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Icon Only Buttons</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <button className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <PlusIcon className="h-5 w-5" />
                        </button>
                        <button className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                            <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="rounded-lg border border-red-300 bg-white p-2 text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-600 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-red-900/20">
                            <TrashIcon className="h-5 w-5" />
                        </button>
                        <button className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                            <ArrowDownTrayIcon className="h-5 w-5" />
                        </button>
                        <button className="rounded-lg bg-purple-600 p-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                            <ArrowUpTrayIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Button States */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Button States</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Normal
                        </button>
                        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ring-2 ring-blue-500">
                            Focused
                        </button>
                        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-700">
                            Active
                        </button>
                        <button className="rounded-lg bg-gray-400 px-4 py-2 text-sm font-medium text-white cursor-not-allowed" disabled>
                            Disabled
                        </button>
                        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 opacity-50 cursor-not-allowed" disabled>
                            Disabled (Styled)
                        </button>
                    </div>
                </div>

                {/* Interactive Buttons */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Interactive Buttons</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={() => setLiked(!liked)}
                            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${liked
                                    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                                    : 'border border-red-300 bg-white text-red-700 hover:bg-red-50 focus:ring-red-500 dark:border-red-600 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-red-900/20'
                                }`}
                        >
                            {liked ? (
                                <HeartSolidIcon className="h-4 w-4" />
                            ) : (
                                <HeartIcon className="h-4 w-4" />
                            )}
                            <span>{liked ? 'Liked' : 'Like'}</span>
                        </button>

                        <button
                            onClick={() => setStarred(!starred)}
                            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${starred
                                    ? 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500'
                                    : 'border border-yellow-300 bg-white text-yellow-700 hover:bg-yellow-50 focus:ring-yellow-500 dark:border-yellow-600 dark:bg-gray-700 dark:text-yellow-400 dark:hover:bg-yellow-900/20'
                                }`}
                        >
                            {starred ? (
                                <StarSolidIcon className="h-4 w-4" />
                            ) : (
                                <StarIcon className="h-4 w-4" />
                            )}
                            <span>{starred ? 'Starred' : 'Star'}</span>
                        </button>

                        <button className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                            <ShareIcon className="h-4 w-4" />
                            <span>Share</span>
                        </button>
                    </div>
                </div>

                {/* Button Groups */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Button Groups</h3>
                    <div className="space-y-4">
                        <div className="flex">
                            <button className="rounded-l-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                                Left
                            </button>
                            <button className="border-t border-b border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                                Middle
                            </button>
                            <button className="rounded-r-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                                Right
                            </button>
                        </div>

                        <div className="flex">
                            <button className="rounded-l-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                Save
                            </button>
                            <button className="border-l border-blue-700 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                Save & Continue
                            </button>
                            <button className="rounded-r-lg border-l border-blue-700 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                Save & Exit
                            </button>
                        </div>
                    </div>
                </div>

                {/* Floating Action Buttons */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Floating Action Buttons</h3>
                    <div className="relative h-32 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <button className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <PlusIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Usage Examples */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Usage Examples</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Primary Button</h4>
                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                <code className="text-sm text-gray-800 dark:text-gray-200">
                                    {`<button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">`}
                                </code>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Secondary Button</h4>
                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                <code className="text-sm text-gray-800 dark:text-gray-200">
                                    {`<button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">`}
                                </code>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Button with Icon</h4>
                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                <code className="text-sm text-gray-800 dark:text-gray-200">
                                    {`<button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">`}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIButtons;
