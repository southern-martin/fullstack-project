import { DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';
import React from 'react';

const BlankPage: React.FC = () => {
    return (
        <div className="mx-auto max-w-7xl p-6">
            <div className="flex min-h-[600px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                    </div>

                    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Blank Page
                    </h1>

                    <p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-400">
                        This is a blank page template. You can use this as a starting point for your custom pages.
                    </p>

                    <div className="space-y-4">
                        <button className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Get Started
                        </button>

                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>Start building your page content here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlankPage;
