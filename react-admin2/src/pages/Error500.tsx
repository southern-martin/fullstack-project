import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Error500: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    {/* 500 Illustration */}
                    <div className="mx-auto h-64 w-64 mb-8">
                        <div className="flex items-center justify-center h-full">
                            <ExclamationTriangleIcon className="h-32 w-32 text-red-500" />
                        </div>
                    </div>

                    {/* Error Message */}
                    <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">500</h1>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        Internal Server Error
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                        Something went wrong on our end. We're working to fix this issue. Please try again later or contact support if the problem persists.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Try Again
                        </button>
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <HomeIcon className="h-5 w-5 mr-2" />
                            Go Home
                        </Link>
                    </div>

                    {/* Error Details */}
                    <div className="mt-12 max-w-md mx-auto">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                                    Error Details
                                </h3>
                            </div>
                            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                <p>Error Code: 500</p>
                                <p>Timestamp: {new Date().toLocaleString()}</p>
                                <p>Request ID: {Math.random().toString(36).substr(2, 9)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Support Information */}
                    <div className="mt-8">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                            Need Help?
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>If this error continues to occur, please:</p>
                            <ul className="list-disc list-inside space-y-1 max-w-sm mx-auto">
                                <li>Check your internet connection</li>
                                <li>Clear your browser cache</li>
                                <li>Contact our support team</li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div className="mt-6">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error500;
