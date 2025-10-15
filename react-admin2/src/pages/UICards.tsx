import {
    ArrowRightIcon,
    CalendarIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    HeartIcon,
    InformationCircleIcon,
    ShareIcon,
    ShoppingCartIcon,
    StarIcon,
    TagIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import {
    HeartIcon as HeartSolidIcon,
    StarIcon as StarSolidIcon,
} from '@heroicons/react/24/solid';
import React, { useState } from 'react';

const UICards: React.FC = () => {
    const [liked, setLiked] = useState(false);
    const [starred, setStarred] = useState(false);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cards</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Flexible content containers with various styles and layouts</p>
            </div>

            <div className="space-y-8">
                {/* Basic Cards */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Basic Cards</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Simple Card</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                This is a basic card with simple content and styling.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Card with Shadow</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                This card has a subtle shadow for depth.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Card with Large Shadow</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                This card has a more prominent shadow.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Product Cards */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Product Cards</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-400">Product Image</span>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">MacBook Pro</h3>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => setLiked(!liked)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            {liked ? (
                                                <HeartSolidIcon className="h-5 w-5 text-red-500" />
                                            ) : (
                                                <HeartIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    Powerful laptop for professionals and creators.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">$2,399</span>
                                    <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                        <ShoppingCartIcon className="h-4 w-4" />
                                        <span>Add to Cart</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-400">Product Image</span>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">iPhone 15</h3>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => setStarred(!starred)}
                                            className="text-gray-400 hover:text-yellow-500"
                                        >
                                            {starred ? (
                                                <StarSolidIcon className="h-5 w-5 text-yellow-500" />
                                            ) : (
                                                <StarIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    Latest iPhone with advanced camera system.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">$999</span>
                                    <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                        <ShoppingCartIcon className="h-4 w-4" />
                                        <span>Add to Cart</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-400">Product Image</span>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AirPods Pro</h3>
                                    <div className="flex items-center space-x-1">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <ShareIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    Wireless earbuds with active noise cancellation.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">$249</span>
                                    <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                        <ShoppingCartIcon className="h-4 w-4" />
                                        <span>Add to Cart</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blog Cards */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Blog Cards</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-semibold">Blog Image</span>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center space-x-2 mb-2">
                                    <TagIcon className="h-4 w-4 text-gray-400" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Technology</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Getting Started with React
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Learn the fundamentals of React development and build your first application.
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                            <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-900 dark:text-white">John Doe</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                                        </div>
                                    </div>
                                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                        <span className="text-sm">Read More</span>
                                        <ArrowRightIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="h-48 bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                                <span className="text-white font-semibold">Blog Image</span>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center space-x-2 mb-2">
                                    <TagIcon className="h-4 w-4 text-gray-400" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Design</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    UI/UX Design Principles
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Essential principles for creating beautiful and functional user interfaces.
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                            <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-900 dark:text-white">Jane Smith</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">1 week ago</p>
                                        </div>
                                    </div>
                                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                        <span className="text-sm">Read More</span>
                                        <ArrowRightIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                                <span className="text-white font-semibold">Blog Image</span>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center space-x-2 mb-2">
                                    <TagIcon className="h-4 w-4 text-gray-400" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Business</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Digital Marketing Trends
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Stay ahead with the latest trends in digital marketing and social media.
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                            <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-900 dark:text-white">Mike Johnson</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
                                        </div>
                                    </div>
                                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                        <span className="text-sm">Read More</span>
                                        <ArrowRightIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Statistics Cards</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                        <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">3,782</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                        <ShoppingCartIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Orders</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">5,359</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                                        <EyeIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Page Views</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">12,847</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                                        <CalendarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Events</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">89</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alert Cards */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Alert Cards</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800 dark:text-green-400">Success</h3>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        Your changes have been saved successfully.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Warning</h3>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                        Please review your information before submitting.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <InformationCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400">Information</h3>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        This is an informational message for your reference.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Cards */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Interactive Cards</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="group rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:shadow-lg hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                Hover Card
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                This card has hover effects and changes appearance on interaction.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Clickable Card
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                This card is clickable and can be used for navigation.
                            </p>
                            <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                Click Me
                            </button>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Card with Actions
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                This card includes multiple action buttons.
                            </p>
                            <div className="flex space-x-2">
                                <button className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                    Primary
                                </button>
                                <button className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                                    Secondary
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UICards;
