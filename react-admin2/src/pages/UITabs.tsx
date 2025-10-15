import React, { useState } from 'react';

const UITabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState('tab1');
    const [activeTab2, setActiveTab2] = useState('tab1');
    const [activeTab3, setActiveTab3] = useState('tab1');
    const [activeTab4, setActiveTab4] = useState('tab1');

    const tabs = [
        { id: 'tab1', label: 'Overview', content: 'This is the overview tab content. It contains general information about the topic.' },
        { id: 'tab2', label: 'Details', content: 'This is the details tab content. It provides more specific information and data.' },
        { id: 'tab3', label: 'Settings', content: 'This is the settings tab content. It allows you to configure various options.' },
        { id: 'tab4', label: 'Help', content: 'This is the help tab content. It provides assistance and documentation.' }
    ];

    const TabContent = ({ content }: { content: string }) => (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-700 dark:text-gray-300">{content}</p>
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl p-6">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Tabs</h1>

            {/* Basic Tabs */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Basic Tabs</h2>
                <div>
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-4">
                        <TabContent content={tabs.find(tab => tab.id === activeTab)?.content || ''} />
                    </div>
                </div>
            </div>

            {/* Pills Tabs */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Pills Tabs</h2>
                <div>
                    <div className="flex space-x-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab2(tab.id)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeTab2 === tab.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4">
                        <TabContent content={tabs.find(tab => tab.id === activeTab2)?.content || ''} />
                    </div>
                </div>
            </div>

            {/* Underline Tabs */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Underline Tabs</h2>
                <div>
                    <div className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab3(tab.id)}
                                className={`relative py-2 text-sm font-medium transition-colors ${activeTab3 === tab.id
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tab.label}
                                {activeTab3 === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4">
                        <TabContent content={tabs.find(tab => tab.id === activeTab3)?.content || ''} />
                    </div>
                </div>
            </div>

            {/* Vertical Tabs */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Vertical Tabs</h2>
                <div className="flex">
                    <div className="w-48 border-r border-gray-200 dark:border-gray-700">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab4(tab.id)}
                                    className={`w-full rounded-l-md px-3 py-2 text-left text-sm font-medium transition-colors ${activeTab4 === tab.id
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-1 pl-6">
                        <TabContent content={tabs.find(tab => tab.id === activeTab4)?.content || ''} />
                    </div>
                </div>
            </div>

            {/* Tabs with Icons */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Tabs with Icons</h2>
                <div>
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                            <button className="flex items-center space-x-2 whitespace-nowrap border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                </svg>
                                <span>Dashboard</span>
                            </button>
                            <button className="flex items-center space-x-2 whitespace-nowrap border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Profile</span>
                            </button>
                            <button className="flex items-center space-x-2 whitespace-nowrap border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Settings</span>
                            </button>
                        </nav>
                    </div>
                    <div className="mt-4">
                        <TabContent content="This tab has icons alongside the text labels for better visual identification." />
                    </div>
                </div>
            </div>

            {/* Tabs with Badges */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Tabs with Badges</h2>
                <div>
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                            <button className="flex items-center space-x-2 whitespace-nowrap border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                                <span>Messages</span>
                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                    3
                                </span>
                            </button>
                            <button className="flex items-center space-x-2 whitespace-nowrap border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                <span>Notifications</span>
                                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                    12
                                </span>
                            </button>
                            <button className="flex items-center space-x-2 whitespace-nowrap border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                <span>Tasks</span>
                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                    5
                                </span>
                            </button>
                        </nav>
                    </div>
                    <div className="mt-4">
                        <TabContent content="These tabs include badges to show counts or status indicators." />
                    </div>
                </div>
            </div>

            {/* Disabled Tabs */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Disabled Tabs</h2>
                <div>
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                            <button className="whitespace-nowrap border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                                Active Tab
                            </button>
                            <button className="whitespace-nowrap border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                Available Tab
                            </button>
                            <button
                                disabled
                                className="whitespace-nowrap border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-400 cursor-not-allowed dark:text-gray-600"
                            >
                                Disabled Tab
                            </button>
                        </nav>
                    </div>
                    <div className="mt-4">
                        <TabContent content="Some tabs can be disabled to prevent user interaction when certain conditions are not met." />
                    </div>
                </div>
            </div>

            {/* Responsive Tabs */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Responsive Tabs</h2>
                <div>
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex flex-wrap space-x-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className="whitespace-nowrap border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 sm:border-blue-500 sm:text-blue-600 dark:sm:text-blue-400"
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-4">
                        <TabContent content="These tabs are responsive and will adapt to different screen sizes. On smaller screens, they may wrap or use a different layout." />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UITabs;
