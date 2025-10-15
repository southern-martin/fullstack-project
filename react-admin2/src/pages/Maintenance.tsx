import { ClockIcon, EnvelopeIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';

const Maintenance: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        // Set maintenance end time (example: 2 hours from now)
        const endTime = new Date().getTime() + (2 * 60 * 60 * 1000);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="mx-auto max-w-7xl p-6">
            <div className="flex min-h-[600px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                        <WrenchScrewdriverIcon className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                    </div>

                    <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                        Under Maintenance
                    </h1>

                    <p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-400">
                        We're currently performing scheduled maintenance to improve your experience. We'll be back online shortly.
                    </p>

                    {/* Countdown Timer */}
                    <div className="mb-8">
                        <div className="flex justify-center space-x-4">
                            <div className="rounded-lg bg-gray-100 px-4 py-3 dark:bg-gray-800">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {timeLeft.hours.toString().padStart(2, '0')}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Hours</div>
                            </div>
                            <div className="rounded-lg bg-gray-100 px-4 py-3 dark:bg-gray-800">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {timeLeft.minutes.toString().padStart(2, '0')}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Minutes</div>
                            </div>
                            <div className="rounded-lg bg-gray-100 px-4 py-3 dark:bg-gray-800">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {timeLeft.seconds.toString().padStart(2, '0')}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Seconds</div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="mb-2 flex items-center justify-center space-x-2">
                            <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">Maintenance Progress</span>
                        </div>
                        <div className="mx-auto w-full max-w-md rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                                className="h-2 rounded-full bg-yellow-600 transition-all duration-1000"
                                style={{ width: '65%' }}
                            ></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">65% Complete</p>
                    </div>

                    {/* Contact Information */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Need Help?
                        </h3>
                        <p className="mb-4 text-gray-600 dark:text-gray-400">
                            If you have any urgent questions or concerns, please don't hesitate to contact us.
                        </p>
                        <div className="flex flex-col items-center space-y-2 sm:flex-row sm:justify-center sm:space-x-6 sm:space-y-0">
                            <div className="flex items-center space-x-2">
                                <EnvelopeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    support@example.com
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    24/7 Support Available
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* What's Being Updated */}
                    <div className="mt-8 text-left">
                        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            What We're Updating:
                        </h4>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                            <li className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>Database optimization and performance improvements</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>Security updates and patches</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                <span>New feature implementations</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                                <span>System monitoring and logging improvements</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Maintenance;
