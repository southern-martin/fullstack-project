import {
    ArrowLeftIcon,
    PhotoIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductForm {
    name: string;
    description: string;
    category: string;
    price: string;
    stock: string;
    status: 'active' | 'inactive';
    images: File[];
}

const AddProduct: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ProductForm>({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        status: 'active',
        images: [],
    });
    const [errors, setErrors] = useState<Partial<ProductForm>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        'Laptop',
        'Watch',
        'SmartPhone',
        'Electronics',
        'Accessories',
        'Gaming',
        'Home & Garden',
        'Sports',
        'Books',
        'Clothing',
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name as keyof ProductForm]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files],
        }));
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ProductForm> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Product description is required';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Valid price is required';
        }

        if (!formData.stock || parseInt(formData.stock) < 0) {
            newErrors.stock = 'Valid stock quantity is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Product created:', formData);
            navigate('/products');
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/products')}
                        className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        <ArrowLeftIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <div>
                        <h2 className="text-lg font-semibold text-black dark:text-white">
                            Add New Product
                        </h2>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Create a new product for your inventory.
                        </p>
                    </div>
                </div>
            </div>

            {/* Product Form */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                        <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
                            Product Information
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Name */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.name
                                            ? 'border-red-500 dark:border-red-500'
                                            : 'border-gray-200 dark:border-gray-600'
                                        }`}
                                    placeholder="Enter product name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.description
                                            ? 'border-red-500 dark:border-red-500'
                                            : 'border-gray-200 dark:border-gray-600'
                                        }`}
                                    placeholder="Enter product description"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.description}</p>
                                )}
                            </div>

                            {/* Category and Price */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.category
                                                ? 'border-red-500 dark:border-red-500'
                                                : 'border-gray-200 dark:border-gray-600'
                                            }`}
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.category}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Price *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.price
                                                ? 'border-red-500 dark:border-red-500'
                                                : 'border-gray-200 dark:border-gray-600'
                                            }`}
                                        placeholder="0.00"
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.price}</p>
                                    )}
                                </div>
                            </div>

                            {/* Stock and Status */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        min="0"
                                        className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.stock
                                                ? 'border-red-500 dark:border-red-500'
                                                : 'border-gray-200 dark:border-gray-600'
                                            }`}
                                        placeholder="0"
                                    />
                                    {errors.stock && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.stock}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center gap-3 pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-2.5 text-xs font-medium text-white shadow-theme-xs hover:bg-primary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Product'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/products')}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-xs font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                        <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
                            Product Images
                        </h3>

                        {/* Image Upload Area */}
                        <div className="mb-4">
                            <label className="block">
                                <div className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600">
                                    <div className="text-center">
                                        <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                                        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                            Click to upload images
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            PNG, JPG up to 10MB
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                            </label>
                        </div>

                        {/* Uploaded Images */}
                        {formData.images.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Uploaded Images ({formData.images.length})
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Preview ${index + 1}`}
                                                className="h-20 w-full rounded-lg object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                            >
                                                <XMarkIcon className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
