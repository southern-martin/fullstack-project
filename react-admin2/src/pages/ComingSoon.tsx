import React, { useState, useEffect } from 'react';
import { EnvelopeIcon, BellIcon } from '@heroicons/react/24/outline';

const ComingSoon: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Set launch date (30 days from now)
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = launchDate.getTime() - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [launchDate]);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                <div className="text-center">
                    {/* Logo/Brand */}
                    <div className="mb-8">
                        <div className="mx-auto h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">T</span>
                        </div>
                        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">TailAdmin</h1>
                    </div>

                    {/* Main Message */}
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Something Amazing is Coming
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        We're working hard to bring you an incredible experience. Stay tuned for our upcoming launch!
                    </p>

                    {/* Countdown Timer */}
                    <div className="mb-12">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Launching In:
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {timeLeft.days}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Days</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {timeLeft.hours}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Hours</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {timeLeft.minutes}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {timeLeft.seconds}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Seconds</div>
                            </div>
                        </div>
                    </div>

                    {/* Email Subscription */}
                    <div className="mb-12">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Get Notified When We Launch
                        </h3>
                        {!isSubscribed ? (
                            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
                                    >
                                        <EnvelopeIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="max-w-md mx-auto">
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <div className="flex items-center justify-center">
                                        <BellIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                                        <span className="text-green-800 dark:text-green-400 font-medium">
                                            Thank you! We'll notify you when we launch.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Features Preview */}
                    <div className="mb-12">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            What to Expect
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Optimized for speed and performance
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Secure & Reliable</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Enterprise-grade security and reliability
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                    <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">User Friendly</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Intuitive and easy to use interface
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Follow Our Progress
                        </h3>
                        <div className="flex justify-center space-x-4">
                            <a href="#" className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                </svg>
                            </a>
                            <a href="#" className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                                </svg>
                            </a>
                            <a href="#" className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>&copy; 2024 TailAdmin. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
