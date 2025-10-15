import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface PricingPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    period: string;
    features: string[];
    limitations: string[];
    isPopular?: boolean;
    buttonText: string;
    buttonVariant: 'primary' | 'secondary';
}

const PricingTables: React.FC = () => {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    const pricingPlans: PricingPlan[] = [
        {
            id: 'starter',
            name: 'Starter',
            description: 'Perfect for individuals and small teams getting started',
            price: billingPeriod === 'monthly' ? 9 : 90,
            period: billingPeriod === 'monthly' ? 'month' : 'year',
            features: [
                'Up to 5 projects',
                '10GB storage',
                'Basic support',
                'Email notifications',
                'Mobile app access',
            ],
            limitations: [
                'No advanced analytics',
                'Limited integrations',
                'Basic templates only',
            ],
            buttonText: 'Get Started',
            buttonVariant: 'secondary',
        },
        {
            id: 'professional',
            name: 'Professional',
            description: 'Ideal for growing businesses and professional teams',
            price: billingPeriod === 'monthly' ? 29 : 290,
            period: billingPeriod === 'monthly' ? 'month' : 'year',
            features: [
                'Unlimited projects',
                '100GB storage',
                'Priority support',
                'Advanced analytics',
                'All integrations',
                'Custom templates',
                'Team collaboration',
                'API access',
            ],
            limitations: [
                'No white-labeling',
                'Limited custom domains',
            ],
            isPopular: true,
            buttonText: 'Start Free Trial',
            buttonVariant: 'primary',
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            description: 'For large organizations with advanced requirements',
            price: billingPeriod === 'monthly' ? 99 : 990,
            period: billingPeriod === 'monthly' ? 'month' : 'year',
            features: [
                'Everything in Professional',
                'Unlimited storage',
                '24/7 phone support',
                'White-labeling',
                'Custom domains',
                'Advanced security',
                'SSO integration',
                'Dedicated account manager',
                'Custom integrations',
                'SLA guarantee',
            ],
            limitations: [],
            buttonText: 'Contact Sales',
            buttonVariant: 'secondary',
        },
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getSavings = (monthlyPrice: number, yearlyPrice: number) => {
        const monthlyTotal = monthlyPrice * 12;
        const savings = monthlyTotal - yearlyPrice;
        const percentage = Math.round((savings / monthlyTotal) * 100);
        return { savings, percentage };
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Choose Your Plan</h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Select the perfect plan for your needs. All plans include our core features.
                </p>

                {/* Billing Toggle */}
                <div className="mt-8 flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                        <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700"
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                        <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            Yearly
                        </span>
                        {billingPeriod === 'yearly' && (
                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                Save 17%
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {pricingPlans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative rounded-2xl border p-8 ${plan.isPopular
                                ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/10'
                                : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                            }`}
                    >
                        {plan.isPopular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <span className="rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
                                    Most Popular
                                </span>
                            </div>
                        )}

                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {plan.name}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {plan.description}
                            </p>

                            <div className="mt-6">
                                <div className="flex items-baseline justify-center">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                        {formatPrice(plan.price)}
                                    </span>
                                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                                        /{plan.period}
                                    </span>
                                </div>

                                {billingPeriod === 'yearly' && plan.id !== 'enterprise' && (
                                    <div className="mt-2">
                                        <span className="text-sm text-green-600 dark:text-green-400">
                                            Save {getSavings(plan.price * 10, plan.price).percentage}% annually
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${plan.buttonVariant === 'primary'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>

                        <div className="mt-8">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">What's included:</h4>
                            <ul className="mt-4 space-y-3">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
                                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {plan.limitations.length > 0 && (
                                <>
                                    <h4 className="mt-6 text-sm font-medium text-gray-900 dark:text-white">Limitations:</h4>
                                    <ul className="mt-4 space-y-3">
                                        {plan.limitations.map((limitation, index) => (
                                            <li key={index} className="flex items-start">
                                                <XMarkIcon className="h-5 w-5 flex-shrink-0 text-red-500" />
                                                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                                                    {limitation}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Additional Information */}
            <div className="mt-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Need a custom solution?
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Contact our sales team to discuss enterprise pricing and custom features.
                </p>
                <button className="mt-4 rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                    Contact Sales
                </button>
            </div>

            {/* FAQ Section */}
            <div className="mt-16">
                <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white">
                    Frequently Asked Questions
                </h3>
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Can I change my plan anytime?
                        </h4>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Is there a free trial?
                        </h4>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Yes, we offer a 14-day free trial for all paid plans. No credit card required.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            What payment methods do you accept?
                        </h4>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            We accept all major credit cards, PayPal, and bank transfers for annual plans.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Do you offer refunds?
                        </h4>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Yes, we offer a 30-day money-back guarantee for all plans.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingTables;
