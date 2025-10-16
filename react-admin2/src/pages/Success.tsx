import { ArrowRightIcon, CheckCircleIcon, HomeIcon, ShareIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Link } from 'react-router-dom';

const Success: React.FC = () => {
    return (
        <div className="mx-auto max-w-7xl p-6">
            <div className="flex min-h-[600px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                        <CheckCircleIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>

                    <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                        Success!
                    </h1>

                    <p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-400">
                        Your action has been completed successfully. Thank you for using our service.
                    </p>

                    {/* Success Details */}
                    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            What's Next?
                        </h3>
                        <div className="space-y-3 text-left">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                        <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Confirmation Email Sent
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Check your inbox for a confirmation email with next steps.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                        <ArrowRightIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Continue Your Journey
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Explore more features and get the most out of your account.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                                        <ShareIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Share Your Experience
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Help others discover our platform by sharing your success.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <div className="flex flex-col items-center space-y-3 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
                            <Link
                                to="/"
                                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <HomeIcon className="mr-2 h-4 w-4" />
                                Go to Dashboard
                            </Link>

                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <ShareIcon className="mr-2 h-4 w-4" />
                                Print Confirmation
                            </button>
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>Need help? Contact our support team at support@example.com</p>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mt-8 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                        <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                            Transaction Details
                        </h4>
                        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Reference ID:</span>
                                <span className="font-mono text-gray-900 dark:text-white">#SUC-2024-001</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Date & Time:</span>
                                <span className="text-gray-900 dark:text-white">
                                    {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Status:</span>
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                    Completed
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Processing Time:</span>
                                <span className="text-gray-900 dark:text-white">2.3 seconds</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Success;
