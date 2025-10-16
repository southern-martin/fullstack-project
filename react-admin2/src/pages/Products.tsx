import {
    ArrowDownTrayIcon,
    EyeIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive';
    image: string;
    description: string;
    createdAt: string;
}

const Products: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const products: Product[] = [
        {
            id: 1,
            name: 'Macbook Pro 13"',
            category: 'Laptop',
            price: 2399.00,
            stock: 15,
            status: 'active',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Apple MacBook Pro 13-inch with M2 chip',
            createdAt: '2024-01-15',
        },
        {
            id: 2,
            name: 'Apple Watch Ultra',
            category: 'Watch',
            price: 879.00,
            stock: 8,
            status: 'active',
            image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Apple Watch Ultra with titanium case',
            createdAt: '2024-01-14',
        },
        {
            id: 3,
            name: 'iPhone 15 Pro Max',
            category: 'SmartPhone',
            price: 1869.00,
            stock: 22,
            status: 'active',
            image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'iPhone 15 Pro Max with A17 Pro chip',
            createdAt: '2024-01-13',
        },
        {
            id: 4,
            name: 'iPad Pro 3rd Gen',
            category: 'Electronics',
            price: 1699.00,
            stock: 0,
            status: 'inactive',
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'iPad Pro 3rd generation with M2 chip',
            createdAt: '2024-01-12',
        },
        {
            id: 5,
            name: 'Airpods Pro 2nd Gen',
            category: 'Accessories',
            price: 240.00,
            stock: 45,
            status: 'active',
            image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'AirPods Pro 2nd generation with USB-C',
            createdAt: '2024-01-11',
        },
        {
            id: 6,
            name: 'Samsung Galaxy S24 Ultra',
            category: 'SmartPhone',
            price: 1299.00,
            stock: 18,
            status: 'active',
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Samsung Galaxy S24 Ultra with S Pen',
            createdAt: '2024-01-10',
        },
        {
            id: 7,
            name: 'Dell XPS 15',
            category: 'Laptop',
            price: 1899.00,
            stock: 12,
            status: 'active',
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Dell XPS 15 with Intel i7 processor',
            createdAt: '2024-01-09',
        },
        {
            id: 8,
            name: 'Sony WH-1000XM5',
            category: 'Accessories',
            price: 399.00,
            stock: 25,
            status: 'active',
            image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Sony WH-1000XM5 noise-canceling headphones',
            createdAt: '2024-01-08',
        },
    ];

    const categories = ['all', 'Laptop', 'Watch', 'SmartPhone', 'Electronics', 'Accessories'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddProduct = () => {
        console.log('Add Product clicked');
    };

    const handleExportProducts = () => {
        console.log('Export Products clicked');
    };

    const handleViewProduct = (id: number) => {
        console.log('View Product:', id);
    };

    const handleEditProduct = (id: number) => {
        console.log('Edit Product:', id);
    };

    const handleDeleteProduct = (id: number) => {
        console.log('Delete Product:', id);
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        Products
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Manage your product inventory and catalog.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportProducts}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={handleAddProduct}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-xs font-medium text-white shadow-theme-xs hover:bg-primary-600 transition-all duration-200"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Search */}
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:w-80"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All Categories' : category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                            <FunnelIcon className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Price Range
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                    <span className="text-xs text-gray-500">to</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Stock Status
                                </label>
                                <select className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                                    <option value="all">All Stock</option>
                                    <option value="in-stock">In Stock</option>
                                    <option value="low-stock">Low Stock</option>
                                    <option value="out-of-stock">Out of Stock</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Status
                                </label>
                                <select className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Products Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                            Product List ({filteredProducts.length} products)
                        </h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[200px] px-4 py-3 text-xs font-medium text-black dark:text-white xl:pl-6">
                                    Product
                                </th>
                                <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Category
                                </th>
                                <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Price
                                </th>
                                <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Stock
                                </th>
                                <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Status
                                </th>
                                <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="border-b border-stroke dark:border-strokedark">
                                    <td className="px-4 py-3 xl:pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-black dark:text-white">{product.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{product.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-xs text-black dark:text-white">{product.category}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-xs font-medium text-black dark:text-white">${product.price.toFixed(2)}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-xs text-black dark:text-white">{product.stock}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full bg-opacity-10 px-2 py-1 text-xs font-medium ${product.status === 'active'
                                            ? 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-500'
                                            : 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-500'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleViewProduct(product.id)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                title="View"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditProduct(product.id)}
                                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                                title="Edit"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                title="Delete"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Products;