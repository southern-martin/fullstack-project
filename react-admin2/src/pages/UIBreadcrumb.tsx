import React from 'react';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const UIBreadcrumb: React.FC = () => {
    const breadcrumbVariants = [
        {
            name: 'Default',
            items: [
                { name: 'Home', href: '#', current: false },
                { name: 'Products', href: '#', current: false },
                { name: 'Electronics', href: '#', current: false },
                { name: 'Smartphones', href: '#', current: true },
            ]
        },
        {
            name: 'With Icons',
            items: [
                { name: 'Home', href: '#', current: false, icon: HomeIcon },
                { name: 'Dashboard', href: '#', current: false },
                { name: 'Analytics', href: '#', current: false },
                { name: 'Reports', href: '#', current: true },
            ]
        },
        {
            name: 'Long Path',
            items: [
                { name: 'Home', href: '#', current: false },
                { name: 'Admin', href: '#', current: false },
                { name: 'User Management', href: '#', current: false },
                { name: 'User Profiles', href: '#', current: false },
                { name: 'Edit Profile', href: '#', current: true },
            ]
        }
    ];

    const breadcrumbStyles = [
        {
            name: 'Default',
            class: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
            currentClass: 'text-gray-900 dark:text-white'
        },
        {
            name: 'Blue',
            class: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
            currentClass: 'text-blue-900 dark:text-blue-100'
        },
        {
            name: 'Green',
            class: 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300',
            currentClass: 'text-green-900 dark:text-green-100'
        }
    ];

    const breadcrumbSizes = [
        { name: 'Small', class: 'text-sm' },
        { name: 'Medium', class: 'text-base' },
        { name: 'Large', class: 'text-lg' }
    ];

    const breadcrumbSeparators = [
        { name: 'Chevron', icon: ChevronRightIcon },
        { name: 'Slash', separator: '/' },
        { name: 'Arrow', separator: '→' },
        { name: 'Pipe', separator: '|' }
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Breadcrumb Components</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Navigation breadcrumbs for showing current page location</p>
            </div>

            <div className="space-y-8">
                {/* Basic Breadcrumbs */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Basic Breadcrumbs</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            {breadcrumbVariants.map((variant) => (
                                <div key={variant.name}>
                                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{variant.name}</h4>
                                    <nav className="flex" aria-label="Breadcrumb">
                                        <ol className="flex items-center space-x-2">
                                            {variant.items.map((item, index) => {
                                                const isLast = index === variant.items.length - 1;
                                                const Icon = item.icon;
                                                
                                                return (
                                                    <li key={index} className="flex items-center">
                                                        {index > 0 && (
                                                            <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                        )}
                                                        <div className="ml-2">
                                                            {item.current ? (
                                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {Icon && <Icon className="mr-1 inline h-4 w-4" />}
                                                                    {item.name}
                                                                </span>
                                                            ) : (
                                                                <a
                                                                    href={item.href}
                                                                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                                                >
                                                                    {Icon && <Icon className="mr-1 inline h-4 w-4" />}
                                                                    {item.name}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ol>
                                    </nav>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Breadcrumb Styles */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Breadcrumb Styles</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            {breadcrumbStyles.map((style) => (
                                <div key={style.name}>
                                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{style.name}</h4>
                                    <nav className="flex" aria-label="Breadcrumb">
                                        <ol className="flex items-center space-x-2">
                                            <li className="flex items-center">
                                                <a href="#" className={`text-sm ${style.class}`}>
                                                    Home
                                                </a>
                                            </li>
                                            <li className="flex items-center">
                                                <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                <a href="#" className={`ml-2 text-sm ${style.class}`}>
                                                    Products
                                                </a>
                                            </li>
                                            <li className="flex items-center">
                                                <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                <span className={`ml-2 text-sm font-medium ${style.currentClass}`}>
                                                    Current Page
                                                </span>
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Breadcrumb Sizes */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Breadcrumb Sizes</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            {breadcrumbSizes.map((size) => (
                                <div key={size.name}>
                                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{size.name}</h4>
                                    <nav className="flex" aria-label="Breadcrumb">
                                        <ol className="flex items-center space-x-2">
                                            <li className="flex items-center">
                                                <a href="#" className={`${size.class} text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300`}>
                                                    Home
                                                </a>
                                            </li>
                                            <li className="flex items-center">
                                                <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                <a href="#" className={`ml-2 ${size.class} text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300`}>
                                                    Products
                                                </a>
                                            </li>
                                            <li className="flex items-center">
                                                <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                <span className={`ml-2 ${size.class} font-medium text-gray-900 dark:text-white`}>
                                                    Current Page
                                                </span>
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Breadcrumb Separators */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Breadcrumb Separators</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            {breadcrumbSeparators.map((separator) => (
                                <div key={separator.name}>
                                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{separator.name}</h4>
                                    <nav className="flex" aria-label="Breadcrumb">
                                        <ol className="flex items-center space-x-2">
                                            <li className="flex items-center">
                                                <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                                    Home
                                                </a>
                                            </li>
                                            <li className="flex items-center">
                                                {separator.icon ? (
                                                    <separator.icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500">{separator.separator}</span>
                                                )}
                                                <a href="#" className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                                    Products
                                                </a>
                                            </li>
                                            <li className="flex items-center">
                                                {separator.icon ? (
                                                    <separator.icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500">{separator.separator}</span>
                                                )}
                                                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Current Page
                                                </span>
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Breadcrumb with Background */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Breadcrumb with Background</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Light Background</h4>
                                <nav className="flex rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800" aria-label="Breadcrumb">
                                    <ol className="flex items-center space-x-2">
                                        <li className="flex items-center">
                                            <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                                Home
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            <a href="#" className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                                Products
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Current Page
                                            </span>
                                        </li>
                                    </ol>
                                </nav>
                            </div>

                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Colored Background</h4>
                                <nav className="flex rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20" aria-label="Breadcrumb">
                                    <ol className="flex items-center space-x-2">
                                        <li className="flex items-center">
                                            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                                Home
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <ChevronRightIcon className="h-4 w-4 text-blue-400 dark:text-blue-500" />
                                            <a href="#" className="ml-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                                Products
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <ChevronRightIcon className="h-4 w-4 text-blue-400 dark:text-blue-500" />
                                            <span className="ml-2 text-sm font-medium text-blue-900 dark:text-blue-100">
                                                Current Page
                                            </span>
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Breadcrumb Examples */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Breadcrumb Examples</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            {/* E-commerce */}
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">E-commerce</h4>
                                <nav className="flex" aria-label="Breadcrumb">
                                    <ol className="flex items-center space-x-2">
                                        <li className="flex items-center">
                                            <HomeIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            <a href="#" className="ml-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                                Home
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            <a href="#" className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                                Electronics
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            <a href="#" className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                                Smartphones
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                                                iPhone 15 Pro
                                            </span>
                                        </li>
                                    </ol>
                                </nav>
                            </div>

                            {/* Admin Panel */}
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Admin Panel</h4>
                                <nav className="flex" aria-label="Breadcrumb">
                                    <ol className="flex items-center space-x-2">
                                        <li className="flex items-center">
                                            <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                                Dashboard
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            <a href="#" className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                                User Management
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            <a href="#" className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                                Users
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Edit User
                                            </span>
                                        </li>
                                    </ol>
                                </nav>
                            </div>

                            {/* File System */}
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">File System</h4>
                                <nav className="flex" aria-label="Breadcrumb">
                                    <ol className="flex items-center space-x-2">
                                        <li className="flex items-center">
                                            <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                                📁 Root
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            <a href="#" className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                                📁 Documents
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            <a href="#" className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                                📁 Projects
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                                                📄 project.txt
                                            </span>
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIBreadcrumb;
