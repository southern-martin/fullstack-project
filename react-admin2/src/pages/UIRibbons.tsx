import React from 'react';

const UIRibbons: React.FC = () => {
    return (
        <div className="mx-auto max-w-7xl p-6">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Ribbons</h1>

            {/* Basic Ribbons */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Basic Ribbons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Top Left Ribbon */}
                    <div className="relative">
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Card with Top Left Ribbon</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                This card has a ribbon in the top left corner.
                            </p>
                        </div>
                        <div className="absolute -top-1 -left-1">
                            <div className="bg-red-500 text-white px-3 py-1 text-xs font-medium rounded-r-md shadow-sm">
                                New
                            </div>
                        </div>
                    </div>

                    {/* Top Right Ribbon */}
                    <div className="relative">
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Card with Top Right Ribbon</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                This card has a ribbon in the top right corner.
                            </p>
                        </div>
                        <div className="absolute -top-1 -right-1">
                            <div className="bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-l-md shadow-sm">
                                Sale
                            </div>
                        </div>
                    </div>

                    {/* Bottom Left Ribbon */}
                    <div className="relative">
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Card with Bottom Left Ribbon</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                This card has a ribbon in the bottom left corner.
                            </p>
                        </div>
                        <div className="absolute -bottom-1 -left-1">
                            <div className="bg-green-500 text-white px-3 py-1 text-xs font-medium rounded-r-md shadow-sm">
                                Featured
                            </div>
                        </div>
                    </div>

                    {/* Bottom Right Ribbon */}
                    <div className="relative">
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Card with Bottom Right Ribbon</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                This card has a ribbon in the bottom right corner.
                            </p>
                        </div>
                        <div className="absolute -bottom-1 -right-1">
                            <div className="bg-purple-500 text-white px-3 py-1 text-xs font-medium rounded-l-md shadow-sm">
                                Popular
                            </div>
                        </div>
                    </div>

                    {/* Top Center Ribbon */}
                    <div className="relative">
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Card with Top Center Ribbon</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                This card has a ribbon in the top center.
                            </p>
                        </div>
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                            <div className="bg-yellow-500 text-white px-3 py-1 text-xs font-medium rounded-md shadow-sm">
                                Hot
                            </div>
                        </div>
                    </div>

                    {/* Bottom Center Ribbon */}
                    <div className="relative">
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Card with Bottom Center Ribbon</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                This card has a ribbon in the bottom center.
                            </p>
                        </div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                            <div className="bg-pink-500 text-white px-3 py-1 text-xs font-medium rounded-md shadow-sm">
                                Limited
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ribbon Colors */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Ribbon Colors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { color: 'bg-red-500', text: 'Red' },
                        { color: 'bg-blue-500', text: 'Blue' },
                        { color: 'bg-green-500', text: 'Green' },
                        { color: 'bg-yellow-500', text: 'Yellow' },
                        { color: 'bg-purple-500', text: 'Purple' },
                        { color: 'bg-pink-500', text: 'Pink' },
                        { color: 'bg-indigo-500', text: 'Indigo' },
                        { color: 'bg-gray-500', text: 'Gray' }
                    ].map((ribbon, index) => (
                        <div key={index} className="relative">
                            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{ribbon.text} Ribbon</h3>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    {ribbon.text} colored ribbon example.
                                </p>
                            </div>
                            <div className="absolute -top-1 -right-1">
                                <div className={`${ribbon.color} text-white px-3 py-1 text-xs font-medium rounded-l-md shadow-sm`}>
                                    {ribbon.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ribbon Sizes */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Ribbon Sizes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Small Ribbon */}
                    <div className="relative">
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Small Ribbon</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                This card has a small ribbon.
                            </p>
                        </div>
                        <div className="absolute -top-1 -right-1">
                            <div className="bg-red-500 text-white px-2 py-0.5 text-xs font-medium rounded-l-md shadow-sm">
                                Small
                            </div>
                        </div>
                    </div>

                    {/* Medium Ribbon */}
                    <div className="relative">
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Medium Ribbon</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                This card has a medium ribbon.
                            </p>
                        </div>
                        <div className="absolute -top-1 -right-1">
                            <div className="bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-l-md shadow-sm">
                                Medium
                            </div>
                        </div>
                    </div>

                    {/* Large Ribbon */}
                    <div className="relative">
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Large Ribbon</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                This card has a large ribbon.
                            </p>
                        </div>
                        <div className="absolute -top-1 -right-1">
                            <div className="bg-green-500 text-white px-4 py-2 text-base font-medium rounded-l-md shadow-sm">
                                Large
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Cards with Ribbons */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Product Cards with Ribbons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Product 1 */}
                    <div className="relative group">
                        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800">
                            <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">Product 1</span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Premium Product</h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">High quality product with great features.</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">$99.99</span>
                                    <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -top-1 -left-1">
                            <div className="bg-red-500 text-white px-3 py-1 text-xs font-medium rounded-r-md shadow-sm">
                                -20%
                            </div>
                        </div>
                    </div>

                    {/* Product 2 */}
                    <div className="relative group">
                        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800">
                            <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">Product 2</span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Best Seller</h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Our most popular product this month.</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">$149.99</span>
                                    <button className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -top-1 -right-1">
                            <div className="bg-yellow-500 text-white px-3 py-1 text-xs font-medium rounded-l-md shadow-sm">
                                Best Seller
                            </div>
                        </div>
                    </div>

                    {/* Product 3 */}
                    <div className="relative group">
                        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800">
                            <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">Product 3</span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Limited Edition</h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Exclusive product with limited availability.</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">$199.99</span>
                                    <button className="rounded bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -left-1">
                            <div className="bg-purple-500 text-white px-3 py-1 text-xs font-medium rounded-r-md shadow-sm">
                                Limited
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Ribbon Shapes */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Custom Ribbon Shapes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Diagonal Ribbon */}
                    <div className="relative">
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Diagonal Ribbon</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                This card has a diagonal ribbon effect.
                            </p>
                        </div>
                        <div className="absolute -top-1 -right-1">
                            <div className="bg-red-500 text-white px-4 py-1 text-xs font-medium shadow-sm transform rotate-12">
                                Diagonal
                            </div>
                        </div>
                    </div>

                    {/* Curved Ribbon */}
                    <div className="relative">
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Curved Ribbon</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                This card has a curved ribbon effect.
                            </p>
                        </div>
                        <div className="absolute -top-1 -right-1">
                            <div className="bg-blue-500 text-white px-4 py-1 text-xs font-medium rounded-full shadow-sm">
                                Curved
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIRibbons;
