import { ArrowRightIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import React from 'react';

const UILinks: React.FC = () => {
    const linkVariants = [
        { name: 'Default', class: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300' },
        { name: 'Primary', class: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300' },
        { name: 'Secondary', class: 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300' },
        { name: 'Success', class: 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300' },
        { name: 'Warning', class: 'text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300' },
        { name: 'Danger', class: 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300' },
    ];

    const linkSizes = [
        { name: 'Small', class: 'text-sm' },
        { name: 'Medium', class: 'text-base' },
        { name: 'Large', class: 'text-lg' },
    ];

    const linkStyles = [
        { name: 'Underline', class: 'underline' },
        { name: 'No Underline', class: 'no-underline' },
        { name: 'Hover Underline', class: 'hover:underline' },
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Link Components</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Various link styles and states</p>
            </div>

            <div className="space-y-8">
                {/* Basic Links */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Basic Links</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Simple Links</h4>
                                <div className="space-y-2">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        This is a <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">simple link</a> in a paragraph.
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Here's another <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">hover link</a> with different styling.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Link Variants */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Link Variants</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-wrap gap-4">
                            {linkVariants.map((variant) => (
                                <a
                                    key={variant.name}
                                    href="#"
                                    className={`${variant.class} hover:underline transition-colors`}
                                >
                                    {variant.name} Link
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Link Sizes */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Link Sizes</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-3">
                            {linkSizes.map((size) => (
                                <div key={size.name}>
                                    <a
                                        href="#"
                                        className={`${size.class} text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors`}
                                    >
                                        {size.name} Link
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Link Styles */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Link Styles</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-3">
                            {linkStyles.map((style) => (
                                <div key={style.name}>
                                    <a
                                        href="#"
                                        className={`text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ${style.class} transition-colors`}
                                    >
                                        {style.name} Link
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Links with Icons */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Links with Icons</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Icon on Left</h4>
                                <div className="space-y-2">
                                    <a href="#" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors">
                                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                        <span>External Link</span>
                                    </a>
                                    <a href="#" className="inline-flex items-center space-x-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:underline transition-colors">
                                        <ArrowRightIcon className="h-4 w-4" />
                                        <span>Continue Reading</span>
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Icon on Right</h4>
                                <div className="space-y-2">
                                    <a href="#" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors">
                                        <span>Learn More</span>
                                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                    </a>
                                    <a href="#" className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 hover:underline transition-colors">
                                        <span>View Details</span>
                                        <ArrowRightIcon className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Button-style Links */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Button-style Links</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="#"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Primary Link
                            </a>
                            <a
                                href="#"
                                className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Secondary Link
                            </a>
                            <a
                                href="#"
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                            >
                                Success Link
                            </a>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Navigation Links</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Breadcrumb Links</h4>
                                <nav className="flex items-center space-x-2 text-sm">
                                    <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                                        Home
                                    </a>
                                    <span className="text-gray-400">/</span>
                                    <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                                        Products
                                    </a>
                                    <span className="text-gray-400">/</span>
                                    <span className="text-gray-900 dark:text-white">Current Page</span>
                                </nav>
                            </div>

                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tab Links</h4>
                                <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
                                    <a
                                        href="#"
                                        className="px-4 py-2 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium"
                                    >
                                        Active Tab
                                    </a>
                                    <a
                                        href="#"
                                        className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                                    >
                                        Inactive Tab
                                    </a>
                                    <a
                                        href="#"
                                        className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                                    >
                                        Another Tab
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Link States */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Link States</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-3">
                            <div>
                                <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors">
                                    Normal Link
                                </a>
                            </div>
                            <div>
                                <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">
                                    Focused Link
                                </a>
                            </div>
                            <div>
                                <a href="#" className="text-gray-400 dark:text-gray-600 cursor-not-allowed">
                                    Disabled Link
                                </a>
                            </div>
                            <div>
                                <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors visited:text-purple-600 dark:visited:text-purple-400">
                                    Visited Link
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Link Examples */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Link Examples</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Article Preview</h4>
                                <p className="text-gray-600 dark:text-gray-400 mb-3">
                                    This is a preview of an article. You can read more about this topic by clicking the link below.
                                </p>
                                <a
                                    href="#"
                                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                                >
                                    <span>Read full article</span>
                                    <ArrowRightIcon className="h-4 w-4" />
                                </a>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Download Section</h4>
                                <p className="text-gray-600 dark:text-gray-400 mb-3">
                                    Download our latest resources and documentation.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <a
                                        href="#"
                                        className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        <span>Download PDF</span>
                                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                    >
                                        <span>Download ZIP</span>
                                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UILinks;
