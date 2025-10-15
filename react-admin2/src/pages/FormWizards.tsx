import {
    BuildingOfficeIcon,
    CalendarIcon,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EnvelopeIcon,
    MapPinIcon,
    PhoneIcon,
    ShieldCheckIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface WizardStep {
    id: number;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    completed: boolean;
}

const FormWizards: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Personal Information
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',

        // Step 2: Address Information
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',

        // Step 3: Professional Information
        company: '',
        position: '',
        department: '',
        experience: '',
        skills: '',

        // Step 4: Preferences
        newsletter: false,
        notifications: false,
        marketing: false,
        terms: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const steps: WizardStep[] = [
        {
            id: 1,
            title: 'Personal Information',
            description: 'Basic personal details',
            icon: UserIcon,
            completed: currentStep > 1,
        },
        {
            id: 2,
            title: 'Address Information',
            description: 'Location and contact details',
            icon: MapPinIcon,
            completed: currentStep > 2,
        },
        {
            id: 3,
            title: 'Professional Information',
            description: 'Work and experience details',
            icon: BuildingOfficeIcon,
            completed: currentStep > 3,
        },
        {
            id: 4,
            title: 'Preferences',
            description: 'Settings and preferences',
            icon: ShieldCheckIcon,
            completed: currentStep > 4,
        },
    ];

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        switch (step) {
            case 1:
                if (!formData.firstName.trim()) {
                    newErrors.firstName = 'First name is required';
                }
                if (!formData.lastName.trim()) {
                    newErrors.lastName = 'Last name is required';
                }
                if (!formData.email.trim()) {
                    newErrors.email = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                    newErrors.email = 'Please enter a valid email';
                }
                break;
            case 2:
                if (!formData.street.trim()) {
                    newErrors.street = 'Street address is required';
                }
                if (!formData.city.trim()) {
                    newErrors.city = 'City is required';
                }
                if (!formData.state.trim()) {
                    newErrors.state = 'State is required';
                }
                if (!formData.zipCode.trim()) {
                    newErrors.zipCode = 'ZIP code is required';
                }
                break;
            case 3:
                if (!formData.company.trim()) {
                    newErrors.company = 'Company is required';
                }
                if (!formData.position.trim()) {
                    newErrors.position = 'Position is required';
                }
                break;
            case 4:
                if (!formData.terms) {
                    newErrors.terms = 'You must accept the terms and conditions';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = () => {
        if (validateStep(currentStep)) {
            console.log('Form submitted:', formData);
            alert('Form submitted successfully!');
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                        className={`w-full rounded-lg border pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.firstName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                                            }`}
                                        placeholder="Enter first name"
                                    />
                                </div>
                                {errors.firstName && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.firstName}</p>
                                )}
                            </div>

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
                                        className={`w-full rounded-lg border pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.lastName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                                            }`}
                                        placeholder="Enter last name"
                                    />
                                </div>
                                {errors.lastName && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

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
                                    className={`w-full rounded-lg border pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                                        }`}
                                    placeholder="Enter email"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Phone
                                </label>
                                <div className="relative">
                                    <PhoneIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>

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
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
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
                                    className={`w-full rounded-lg border pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.street ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                                        }`}
                                    placeholder="Enter street address"
                                />
                            </div>
                            {errors.street && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.street}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.city ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                                        }`}
                                    placeholder="Enter city"
                                />
                                {errors.city && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.city}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    State *
                                </label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                    className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.state ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                                        }`}
                                    placeholder="Enter state"
                                />
                                {errors.state && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.state}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    ZIP Code *
                                </label>
                                <input
                                    type="text"
                                    value={formData.zipCode}
                                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                    className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.zipCode ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                                        }`}
                                    placeholder="Enter ZIP code"
                                />
                                {errors.zipCode && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.zipCode}</p>
                                )}
                            </div>
                        </div>

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
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Company *
                                </label>
                                <div className="relative">
                                    <BuildingOfficeIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                        className={`w-full rounded-lg border pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.company ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                                            }`}
                                        placeholder="Enter company name"
                                    />
                                </div>
                                {errors.company && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.company}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Position *
                                </label>
                                <input
                                    type="text"
                                    value={formData.position}
                                    onChange={(e) => handleInputChange('position', e.target.value)}
                                    className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.position ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                                        }`}
                                    placeholder="Enter position"
                                />
                                {errors.position && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.position}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => handleInputChange('department', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter department"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Years of Experience
                                </label>
                                <input
                                    type="number"
                                    value={formData.experience}
                                    onChange={(e) => handleInputChange('experience', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter years of experience"
                                    min="0"
                                    max="50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Skills
                            </label>
                            <textarea
                                value={formData.skills}
                                onChange={(e) => handleInputChange('skills', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter your skills (comma-separated)"
                            />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div>
                            <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Communication Preferences</h4>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.newsletter}
                                        onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-xs text-gray-700 dark:text-gray-300">Subscribe to newsletter</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.notifications}
                                        onChange={(e) => handleInputChange('notifications', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-xs text-gray-700 dark:text-gray-300">Receive notifications</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.marketing}
                                        onChange={(e) => handleInputChange('marketing', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-xs text-gray-700 dark:text-gray-300">Marketing communications</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.terms}
                                    onChange={(e) => handleInputChange('terms', e.target.checked)}
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
                            {errors.terms && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.terms}</p>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        Form Wizards
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Multi-step form wizards for complex data collection.
                    </p>
                </div>
            </div>

            {/* Wizard Container */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = step.id === currentStep;
                            const isCompleted = step.completed;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${isCompleted
                                                    ? 'border-green-500 bg-green-500 text-white'
                                                    : isActive
                                                        ? 'border-blue-500 bg-blue-500 text-white'
                                                        : 'border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-700'
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <CheckIcon className="h-5 w-5" />
                                            ) : (
                                                <Icon className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div className="mt-2 text-center">
                                            <p className={`text-xs font-medium ${isActive || isCompleted
                                                    ? 'text-gray-900 dark:text-white'
                                                    : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>

                                    {index < steps.length - 1 && (
                                        <div className={`mx-4 h-0.5 w-16 ${step.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                            }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Step Content */}
                <div className="mb-8">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {steps[currentStep - 1].title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            {steps[currentStep - 1].description}
                        </p>
                    </div>

                    {renderStepContent()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 text-xs font-medium transition-colors ${currentStep === 1
                                ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                            }`}
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                        <span>Previous</span>
                    </button>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Step {currentStep} of {steps.length}
                    </div>

                    {currentStep === steps.length ? (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="flex items-center space-x-2 rounded-lg bg-primary-500 px-4 py-2.5 text-xs font-medium text-white hover:bg-primary-600 transition-colors"
                        >
                            <span>Submit</span>
                            <CheckIcon className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center space-x-2 rounded-lg bg-primary-500 px-4 py-2.5 text-xs font-medium text-white hover:bg-primary-600 transition-colors"
                        >
                            <span>Next</span>
                            <ChevronRightIcon className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormWizards;
