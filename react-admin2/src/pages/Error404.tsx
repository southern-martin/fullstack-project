import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const Error404: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    {/* 404 Illustration */}
                    <div className="mx-auto h-64 w-64 mb-8">
                        <svg
                            className="w-full h-full text-gray-400 dark:text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.709A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709"
                            />
                        </svg>
                    </div>

                    {/* Error Message */}
                    <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                        Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <HomeIcon className="h-5 w-5 mr-2" />
                            Go Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-2" />
                            Go Back
                        </button>
                    </div>

                    {/* Helpful Links */}
                    <div className="mt-12">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                            Maybe you're looking for:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
                            <Link
                                to="/"
                                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="text-sm font-medium text-gray-900 dark:text-white">Dashboard</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Main dashboard</div>
                            </Link>
                            <Link
                                to="/products"
                                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="text-sm font-medium text-gray-900 dark:text-white">Products</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Product management</div>
                            </Link>
                            <Link
                                to="/profile"
                                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="text-sm font-medium text-gray-900 dark:text-white">Profile</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">User profile</div>
                            </Link>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mt-8 max-w-md mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for pages..."
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error404;
