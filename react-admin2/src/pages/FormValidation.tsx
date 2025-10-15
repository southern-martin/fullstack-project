import {
    CalendarIcon,
    CheckIcon,
    EnvelopeIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    EyeSlashIcon,
    LockClosedIcon,
    MapPinIcon,
    PhoneIcon,
    UserIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

const FormValidation: React.FC = () => {
    const [formData, setFormData] = useState({
        // Basic Info
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',

        // Address
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',

        // Additional
        dateOfBirth: '',
        website: '',
        bio: '',

        // Preferences
        newsletter: false,
        terms: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field, formData[field as keyof typeof formData]);
    };

    const validateField = (field: string, value: any) => {
        const newErrors: Record<string, string> = { ...errors };

        switch (field) {
            case 'firstName':
                if (!value || value.trim().length < 2) {
                    newErrors.firstName = 'First name must be at least 2 characters';
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    newErrors.firstName = 'First name can only contain letters and spaces';
                } else {
                    delete newErrors.firstName;
                }
                break;

            case 'lastName':
                if (!value || value.trim().length < 2) {
                    newErrors.lastName = 'Last name must be at least 2 characters';
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    newErrors.lastName = 'Last name can only contain letters and spaces';
                } else {
                    delete newErrors.lastName;
                }
                break;

            case 'email':
                if (!value) {
                    newErrors.email = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newErrors.email = 'Please enter a valid email address';
                } else {
                    delete newErrors.email;
                }
                break;

            case 'phone':
                if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    newErrors.phone = 'Please enter a valid phone number';
                } else {
                    delete newErrors.phone;
                }
                break;

            case 'password':
                if (!value) {
                    newErrors.password = 'Password is required';
                } else if (value.length < 8) {
                    newErrors.password = 'Password must be at least 8 characters';
                } else if (!/(?=.*[a-z])/.test(value)) {
                    newErrors.password = 'Password must contain at least one lowercase letter';
                } else if (!/(?=.*[A-Z])/.test(value)) {
                    newErrors.password = 'Password must contain at least one uppercase letter';
                } else if (!/(?=.*\d)/.test(value)) {
                    newErrors.password = 'Password must contain at least one number';
                } else if (!/(?=.*[@$!%*?&])/.test(value)) {
                    newErrors.password = 'Password must contain at least one special character';
                } else {
                    delete newErrors.password;
                }
                break;

            case 'confirmPassword':
                if (!value) {
                    newErrors.confirmPassword = 'Please confirm your password';
                } else if (value !== formData.password) {
                    newErrors.confirmPassword = 'Passwords do not match';
                } else {
                    delete newErrors.confirmPassword;
                }
                break;

            case 'street':
                if (!value || value.trim().length < 5) {
                    newErrors.street = 'Street address must be at least 5 characters';
                } else {
                    delete newErrors.street;
                }
                break;

            case 'city':
                if (!value || value.trim().length < 2) {
                    newErrors.city = 'City must be at least 2 characters';
                } else {
                    delete newErrors.city;
                }
                break;

            case 'state':
                if (!value) {
                    newErrors.state = 'State is required';
                } else {
                    delete newErrors.state;
                }
                break;

            case 'zipCode':
                if (!value) {
                    newErrors.zipCode = 'ZIP code is required';
                } else if (!/^\d{5}(-\d{4})?$/.test(value)) {
                    newErrors.zipCode = 'Please enter a valid ZIP code';
                } else {
                    delete newErrors.zipCode;
                }
                break;

            case 'website':
                if (value && !/^https?:\/\/.+\..+/.test(value)) {
                    newErrors.website = 'Please enter a valid website URL';
                } else {
                    delete newErrors.website;
                }
                break;

            case 'terms':
                if (!value) {
                    newErrors.terms = 'You must accept the terms and conditions';
                } else {
                    delete newErrors.terms;
                }
                break;
        }

        setErrors(newErrors);
    };

    const validateForm = (): boolean => {
        const fieldsToValidate = [
            'firstName', 'lastName', 'email', 'password', 'confirmPassword',
            'street', 'city', 'state', 'zipCode', 'terms'
        ];

        fieldsToValidate.forEach(field => {
            validateField(field, formData[field as keyof typeof formData]);
            setTouched(prev => ({ ...prev, [field]: true }));
        });

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form submitted:', formData);
            alert('Form submitted successfully!');
        } else {
            console.log('Form has validation errors:', errors);
        }
    };

    const getFieldStatus = (field: string) => {
        if (!touched[field]) return 'default';
        if (errors[field]) return 'error';
        if (formData[field as keyof typeof formData]) return 'success';
        return 'default';
    };

    const getStatusIcon = (field: string) => {
        const status = getFieldStatus(field);

        switch (status) {
            case 'success':
                return <CheckIcon className="h-4 w-4 text-green-500" />;
            case 'error':
                return <XMarkIcon className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (field: string) => {
        const status = getFieldStatus(field);

        switch (status) {
            case 'success':
                return 'border-green-500 focus:ring-green-500';
            case 'error':
                return 'border-red-500 focus:ring-red-500';
            default:
                return 'border-gray-200 focus:ring-blue-500 dark:border-gray-600';
        }
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        Form Validation
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Comprehensive form validation with real-time feedback and error handling.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Basic Information
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* First Name */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                First Name *
                            </label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    onBlur={() => handleBlur('firstName')}
                                    className={`w-full rounded-lg border pl-10 pr-10 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${getStatusColor('firstName')}`}
                                    placeholder="Enter first name"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {getStatusIcon('firstName')}
                                </div>
                            </div>
                            {errors.firstName && touched.firstName && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <ExclamationTriangleIcon className="h-3 w-3" />
                                    {errors.firstName}
                                </p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Last Name *
                            </label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    onBlur={() => handleBlur('lastName')}
                                    className={`w-full rounded-lg border pl-10 pr-10 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${getStatusColor('lastName')}`}
                                    placeholder="Enter last name"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {getStatusIcon('lastName')}
                                </div>
                            </div>
                            {errors.lastName && touched.lastName && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <ExclamationTriangleIcon className="h-3 w-3" />
                                    {errors.lastName}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Email *
                            </label>
                            <div className="relative">
                                <EnvelopeIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                    className={`w-full rounded-lg border pl-10 pr-10 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${getStatusColor('email')}`}
                                    placeholder="Enter email address"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {getStatusIcon('email')}
                                </div>
                            </div>
                            {errors.email && touched.email && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <ExclamationTriangleIcon className="h-3 w-3" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Phone Number
                            </label>
                            <div className="relative">
                                <PhoneIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    onBlur={() => handleBlur('phone')}
                                    className={`w-full rounded-lg border pl-10 pr-10 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${getStatusColor('phone')}`}
                                    placeholder="Enter phone number"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {getStatusIcon('phone')}
                                </div>
                            </div>
                            {errors.phone && touched.phone && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <ExclamationTriangleIcon className="h-3 w-3" />
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Password *
                            </label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    className={`w-full rounded-lg border pl-10 pr-20 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${getStatusColor('password')}`}
                                    placeholder="Enter password"
                                />
                                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                                    {getStatusIcon('password')}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && touched.password && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <ExclamationTriangleIcon className="h-3 w-3" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    onBlur={() => handleBlur('confirmPassword')}
                                    className={`w-full rounded-lg border pl-10 pr-20 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${getStatusColor('confirmPassword')}`}
                                    placeholder="Confirm password"
                                />
                                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                                    {getStatusIcon('confirmPassword')}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showConfirmPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && touched.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <ExclamationTriangleIcon className="h-3 w-3" />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Address Information
                    </h3>

                    <div className="space-y-4">
                        {/* Street Address */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Street Address *
                            </label>
                            <div className="relative">
                                <MapPinIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.street}
                                    onChange={(e) => handleInputChange('street', e.target.value)}
                                    onBlur={() => handleBlur('street')}
                                    className={`w-full rounded-lg border pl-10 pr-10 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${getStatusColor('street')}`}
                                    placeholder="Enter street address"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {getStatusIcon('street')}
                                </div>
                            </div>
                            {errors.street && touched.street && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <ExclamationTriangleIcon className="h-3 w-3" />
                                    {errors.street}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* City */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    City *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        onBlur={() => handleBlur('city')}
                                        className={`w-full rounded-lg border px-3 pr-10 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${getStatusColor('city')}`}
                                        placeholder="Enter city"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {getStatusIcon('city')}
                                    </div>
                                </div>
                                {errors.city && touched.city && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                        <ExclamationTriangleIcon className="h-3 w-3" />
                                        {errors.city}
                                    </p>
                                )}
                            </div>

                            {/* State */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    State *
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.state}
                                        onChange={(e) => handleInputChange('state', e.target.value)}
                                        onBlur={() => handleBlur('state')}
                                        className={`w-full rounded-lg border px-3 pr-10 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${getStatusColor('state')}`}
                                    >
                                        <option value="">Select state</option>
                                        <option value="AL">Alabama</option>
                                        <option value="CA">California</option>
                                        <option value="FL">Florida</option>
                                        <option value="NY">New York</option>
                                        <option value="TX">Texas</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {getStatusIcon('state')}
                                    </div>
                                </div>
                                {errors.state && touched.state && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                        <ExclamationTriangleIcon className="h-3 w-3" />
                                        {errors.state}
                                    </p>
                                )}
                            </div>

                            {/* ZIP Code */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    ZIP Code *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.zipCode}
                                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                        onBlur={() => handleBlur('zipCode')}
                                        className={`w-full rounded-lg border px-3 pr-10 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${getStatusColor('zipCode')}`}
                                        placeholder="Enter ZIP code"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {getStatusIcon('zipCode')}
                                    </div>
                                </div>
                                {errors.zipCode && touched.zipCode && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                        <ExclamationTriangleIcon className="h-3 w-3" />
                                        {errors.zipCode}
                                    </p>
                                )}
                            </div>

                            {/* Country */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Country
                                </label>
                                <select
                                    value={formData.country}
                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Select country</option>
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="DE">Germany</option>
                                    <option value="FR">France</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Additional Information
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Date of Birth */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Date of Birth
                            </label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Website */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Website
                            </label>
                            <div className="relative">
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => handleInputChange('website', e.target.value)}
                                    onBlur={() => handleBlur('website')}
                                    className={`w-full rounded-lg border px-3 pr-10 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${getStatusColor('website')}`}
                                    placeholder="https://example.com"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {getStatusIcon('website')}
                                </div>
                            </div>
                            {errors.website && touched.website && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <ExclamationTriangleIcon className="h-3 w-3" />
                                    {errors.website}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="mt-6">
                        <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            rows={4}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                </div>

                {/* Preferences */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Preferences
                    </h3>

                    <div className="space-y-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.newsletter}
                                onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs text-gray-700 dark:text-gray-300">
                                Subscribe to newsletter
                            </span>
                        </label>

                        <div>
                            <label className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.terms}
                                    onChange={(e) => handleInputChange('terms', e.target.checked)}
                                    onBlur={() => handleBlur('terms')}
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-xs text-gray-700 dark:text-gray-300">
                                    I agree to the{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                        Terms and Conditions
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                        Privacy Policy
                                    </a>
                                    *
                                </span>
                            </label>
                            {errors.terms && touched.terms && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <ExclamationTriangleIcon className="h-3 w-3" />
                                    {errors.terms}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="rounded-lg bg-primary-500 px-6 py-2.5 text-xs font-medium text-white hover:bg-primary-600 transition-colors"
                    >
                        Submit Form
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormValidation;
