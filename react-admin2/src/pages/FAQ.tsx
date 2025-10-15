import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
    tags: string[];
}

const FAQ: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const faqData: FAQItem[] = [
        {
            id: '1',
            question: 'How do I get started with the platform?',
            answer: 'Getting started is easy! Simply sign up for an account, choose your plan, and follow our onboarding guide. You can start with our free trial to explore all features before committing to a paid plan.',
            category: 'Getting Started',
            tags: ['onboarding', 'signup', 'trial'],
        },
        {
            id: '2',
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions. All payments are processed securely through our payment partners.',
            category: 'Billing',
            tags: ['payment', 'credit card', 'paypal'],
        },
        {
            id: '3',
            question: 'Can I cancel my subscription anytime?',
            answer: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you won\'t be charged again.',
            category: 'Billing',
            tags: ['cancel', 'subscription', 'billing'],
        },
        {
            id: '4',
            question: 'How do I reset my password?',
            answer: 'Click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a secure link to reset your password. The link will expire after 24 hours for security.',
            category: 'Account',
            tags: ['password', 'security', 'login'],
        },
        {
            id: '5',
            question: 'Is my data secure?',
            answer: 'Absolutely! We use enterprise-grade security measures including SSL encryption, regular security audits, and comply with industry standards like SOC 2 and GDPR. Your data is encrypted both in transit and at rest.',
            category: 'Security',
            tags: ['security', 'encryption', 'privacy'],
        },
        {
            id: '6',
            question: 'Do you offer API access?',
            answer: 'Yes, we provide comprehensive REST APIs for all Professional and Enterprise plans. Our API documentation includes code examples, SDKs, and interactive testing tools to help you integrate quickly.',
            category: 'Technical',
            tags: ['api', 'integration', 'developers'],
        },
        {
            id: '7',
            question: 'What kind of support do you provide?',
            answer: 'We offer multiple support channels: email support for all users, priority support for Professional plans, and 24/7 phone support for Enterprise customers. We also have a comprehensive knowledge base and community forum.',
            category: 'Support',
            tags: ['support', 'help', 'contact'],
        },
        {
            id: '8',
            question: 'Can I export my data?',
            answer: 'Yes, you can export your data in various formats (CSV, JSON, PDF) at any time. Enterprise customers also have access to bulk export tools and can request custom data exports.',
            category: 'Data',
            tags: ['export', 'data', 'backup'],
        },
        {
            id: '9',
            question: 'How often do you release updates?',
            answer: 'We release new features and improvements every two weeks. Major updates are announced in advance, and we maintain backward compatibility to ensure your workflows aren\'t disrupted.',
            category: 'Product',
            tags: ['updates', 'features', 'releases'],
        },
        {
            id: '10',
            question: 'Do you offer custom integrations?',
            answer: 'Yes, our Enterprise plan includes custom integration services. Our team can help you connect with third-party tools, build custom workflows, and ensure seamless data synchronization.',
            category: 'Technical',
            tags: ['integrations', 'custom', 'enterprise'],
        },
        {
            id: '11',
            question: 'What happens to my data if I downgrade?',
            answer: 'Your data remains safe and accessible. However, some features may be limited based on your new plan. We\'ll notify you of any limitations before the change takes effect.',
            category: 'Billing',
            tags: ['downgrade', 'data', 'limitations'],
        },
        {
            id: '12',
            question: 'Can I use the platform offline?',
            answer: 'Our mobile apps support offline functionality for viewing and basic editing. Full offline capabilities are available for Enterprise customers with advanced sync features.',
            category: 'Technical',
            tags: ['offline', 'mobile', 'sync'],
        },
    ];

    const categories = ['all', ...Array.from(new Set(faqData.map(item => item.category)))];

    const filteredFAQs = faqData.filter(item => {
        const matchesSearch =
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const toggleExpanded = (itemId: string) => {
        setExpandedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Find answers to common questions about our platform and services.
                </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 space-y-4">
                <div className="relative max-w-md mx-auto">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            {category === 'all' ? 'All Categories' : category}
                        </button>
                    ))}
                </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
                {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                            <button
                                onClick={() => toggleExpanded(item.id)}
                                className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                            {item.question}
                                        </h3>
                                        <div className="mt-1 flex items-center space-x-2">
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                                {item.category}
                                            </span>
                                            <div className="flex space-x-1">
                                                {item.tags.slice(0, 2).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {item.tags.length > 2 && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        +{item.tags.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                        {expandedItems.includes(item.id) ? (
                                            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                                        ) : (
                                            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                                        )}
                                    </div>
                                </div>
                            </button>

                            {expandedItems.includes(item.id) && (
                                <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {item.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">No FAQs found</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Try adjusting your search terms or category filter.
                        </p>
                    </div>
                )}
            </div>

            {/* Contact Support */}
            <div className="mt-12 rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Still have questions?
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Contact Support
                    </button>
                    <button className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                        View Documentation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
