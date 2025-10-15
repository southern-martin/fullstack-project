import {
    CalendarIcon,
    ClockIcon,
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
    GlobeAltIcon,
    PhoneIcon,
    StarIcon,
    TagIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

const FormElements: React.FC = () => {
    const [formData, setFormData] = useState({
        // Basic Inputs
        textInput: '',
        emailInput: '',
        passwordInput: '',
        numberInput: '',
        telInput: '',
        urlInput: '',
        searchInput: '',

        // Text Areas
        textarea: '',
        textareaWithLimit: '',

        // Selects
        select: '',
        multiSelect: [] as string[],

        // Checkboxes and Radios
        checkbox: false,
        checkboxGroup: [] as string[],
        radioGroup: '',

        // Date and Time
        dateInput: '',
        timeInput: '',
        datetimeInput: '',

        // File Upload
        fileInput: null as File | null,

        // Range
        rangeInput: 50,

        // Toggle
        toggle: false,

        // Rating
        rating: 0,

        // Tags
        tags: [] as string[],
        tagInput: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleCheckboxGroupChange = (value: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            checkboxGroup: checked
                ? [...prev.checkboxGroup, value]
                : prev.checkboxGroup.filter(item => item !== value)
        }));
    };

    const handleMultiSelectChange = (value: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            multiSelect: checked
                ? [...prev.multiSelect, value]
                : prev.multiSelect.filter(item => item !== value)
        }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, fileInput: file }));
    };

    const addTag = () => {
        if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, prev.tagInput.trim()],
                tagInput: ''
            }));
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        const newErrors: Record<string, string> = {};

        if (!formData.textInput.trim()) {
            newErrors.textInput = 'Text input is required';
        }

        if (!formData.emailInput.trim()) {
            newErrors.emailInput = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.emailInput)) {
            newErrors.emailInput = 'Please enter a valid email';
        }

        if (!formData.passwordInput.trim()) {
            newErrors.passwordInput = 'Password is required';
        }

        if (!formData.select) {
            newErrors.select = 'Please select an option';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log('Form submitted:', formData);
            alert('Form submitted successfully!');
        }
    };

    const selectOptions = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
        { value: 'option4', label: 'Option 4' },
    ];

    const checkboxOptions = [
        { value: 'checkbox1', label: 'Checkbox Option 1' },
        { value: 'checkbox2', label: 'Checkbox Option 2' },
        { value: 'checkbox3', label: 'Checkbox Option 3' },
    ];

    const radioOptions = [
        { value: 'radio1', label: 'Radio Option 1' },
        { value: 'radio2', label: 'Radio Option 2' },
        { value: 'radio3', label: 'Radio Option 3' },
    ];

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        Form Elements
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Comprehensive collection of form input elements and components.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Inputs */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Basic Inputs
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Text Input */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Text Input *
                            </label>
                            <input
                                type="text"
                                value={formData.textInput}
                                onChange={(e) => handleInputChange('textInput', e.target.value)}
                                className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.textInput ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                                    }`}
                                placeholder="Enter text"
                            />
                            {errors.textInput && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.textInput}</p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Email Input *
                            </label>
                            <div className="relative">
                                <EnvelopeIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.emailInput}
                                    onChange={(e) => handleInputChange('emailInput', e.target.value)}
                                    className={`w-full rounded-lg border pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.emailInput ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                                        }`}
                                    placeholder="Enter email"
                                />
                            </div>
                            {errors.emailInput && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.emailInput}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Password Input *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.passwordInput}
                                    onChange={(e) => handleInputChange('passwordInput', e.target.value)}
                                    className={`w-full rounded-lg border pr-10 pl-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.passwordInput ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                                        }`}
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.passwordInput && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.passwordInput}</p>
                            )}
                        </div>

                        {/* Number Input */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Number Input
                            </label>
                            <input
                                type="number"
                                value={formData.numberInput}
                                onChange={(e) => handleInputChange('numberInput', e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter number"
                                min="0"
                                max="100"
                            />
                        </div>

                        {/* Phone Input */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Phone Input
                            </label>
                            <div className="relative">
                                <PhoneIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    value={formData.telInput}
                                    onChange={(e) => handleInputChange('telInput', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>

                        {/* URL Input */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                URL Input
                            </label>
                            <div className="relative">
                                <GlobeAltIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="url"
                                    value={formData.urlInput}
                                    onChange={(e) => handleInputChange('urlInput', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter URL"
                                />
                            </div>
                        </div>

                        {/* Search Input */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Search Input
                            </label>
                            <input
                                type="search"
                                value={formData.searchInput}
                                onChange={(e) => handleInputChange('searchInput', e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Search..."
                            />
                        </div>
                    </div>
                </div>

                {/* Text Areas */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Text Areas
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Basic Textarea */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Basic Textarea
                            </label>
                            <textarea
                                value={formData.textarea}
                                onChange={(e) => handleInputChange('textarea', e.target.value)}
                                rows={4}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter your message..."
                            />
                        </div>

                        {/* Textarea with Character Limit */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Textarea with Character Limit
                            </label>
                            <textarea
                                value={formData.textareaWithLimit}
                                onChange={(e) => handleInputChange('textareaWithLimit', e.target.value)}
                                rows={4}
                                maxLength={100}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter your message (max 100 characters)..."
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {formData.textareaWithLimit.length}/100 characters
                            </p>
                        </div>
                    </div>
                </div>

                {/* Selects */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Selects
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Single Select */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Single Select *
                            </label>
                            <select
                                value={formData.select}
                                onChange={(e) => handleInputChange('select', e.target.value)}
                                className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.select ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                                    }`}
                            >
                                <option value="">Select an option</option>
                                {selectOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.select && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.select}</p>
                            )}
                        </div>

                        {/* Multi Select */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Multi Select
                            </label>
                            <div className="space-y-2">
                                {selectOptions.map((option) => (
                                    <label key={option.value} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.multiSelect.includes(option.value)}
                                            onChange={(e) => handleMultiSelectChange(option.value, e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-xs text-gray-700 dark:text-gray-300">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkboxes and Radios */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Checkboxes and Radios
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Single Checkbox */}
                        <div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.checkbox}
                                    onChange={(e) => handleInputChange('checkbox', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Single Checkbox
                                </span>
                            </label>
                        </div>

                        {/* Checkbox Group */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Checkbox Group
                            </label>
                            <div className="space-y-2">
                                {checkboxOptions.map((option) => (
                                    <label key={option.value} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.checkboxGroup.includes(option.value)}
                                            onChange={(e) => handleCheckboxGroupChange(option.value, e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-xs text-gray-700 dark:text-gray-300">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Radio Group */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Radio Group
                            </label>
                            <div className="space-y-2">
                                {radioOptions.map((option) => (
                                    <label key={option.value} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="radioGroup"
                                            value={option.value}
                                            checked={formData.radioGroup === option.value}
                                            onChange={(e) => handleInputChange('radioGroup', e.target.value)}
                                            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-xs text-gray-700 dark:text-gray-300">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Date and Time */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Date and Time
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Date Input */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Date Input
                            </label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    value={formData.dateInput}
                                    onChange={(e) => handleInputChange('dateInput', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Time Input */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Time Input
                            </label>
                            <div className="relative">
                                <ClockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="time"
                                    value={formData.timeInput}
                                    onChange={(e) => handleInputChange('timeInput', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* DateTime Input */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                DateTime Input
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.datetimeInput}
                                onChange={(e) => handleInputChange('datetimeInput', e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* File Upload */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        File Upload
                    </h3>

                    <div>
                        <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                            File Input
                        </label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                            />
                            {formData.fileInput && (
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {formData.fileInput.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Range and Toggle */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Range and Toggle
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Range Input */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Range Input: {formData.rangeInput}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={formData.rangeInput}
                                onChange={(e) => handleInputChange('rangeInput', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                        </div>

                        {/* Toggle */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Toggle Switch
                            </label>
                            <button
                                type="button"
                                onClick={() => handleInputChange('toggle', !formData.toggle)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.toggle ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.toggle ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Rating */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Rating
                    </h3>

                    <div>
                        <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Star Rating
                        </label>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleInputChange('rating', star)}
                                    className="text-2xl transition-colors"
                                >
                                    <StarIcon
                                        className={`h-6 w-6 ${star <= formData.rating
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Tags
                    </h3>

                    <div>
                        <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Tag Input
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                                >
                                    <TagIcon className="h-3 w-3" />
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                                    >
                                        <XMarkIcon className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={formData.tagInput}
                                onChange={(e) => handleInputChange('tagInput', e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter tag and press Enter"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                                Add
                            </button>
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

export default FormElements;
