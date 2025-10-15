import { ArrowLeftIcon, ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Link } from 'react-router-dom';

const Error503: React.FC = () => {
    return (
        <div className="mx-auto max-w-7xl p-6">
            <div className="flex min-h-[600px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <ExclamationTriangleIcon className="h-12 w-12 text-red-600 dark:text-red-400" />
                    </div>

                    <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">
                        503
                    </h1>

                    <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                        Service Unavailable
                    </h2>

                    <p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-400">
                        We're currently experiencing technical difficulties. Our team is working to resolve this issue. Please try again later.
                    </p>

                    <div className="space-y-4">
                        <div className="flex flex-col items-center space-y-3 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
                            <Link
                                to="/"
                                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <HomeIcon className="mr-2 h-4 w-4" />
                                Go Home
                            </Link>

                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                                Try Again
                            </button>
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>If the problem persists, please contact our support team.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error503;
