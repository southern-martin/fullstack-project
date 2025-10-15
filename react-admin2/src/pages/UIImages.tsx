import React, { useState } from 'react';
import { MagnifyingGlassIcon, HeartIcon, ShareIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const UIImages: React.FC = () => {
    const [likedImages, setLikedImages] = useState<Set<number>>(new Set());
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const sampleImages = [
        {
            id: 1,
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            alt: 'Mountain landscape',
            title: 'Mountain Landscape',
            description: 'Beautiful mountain view with clear sky'
        },
        {
            id: 2,
            src: 'https://images.unsplash.com/photo-1464822759844-d150baec5b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            alt: 'Forest path',
            title: 'Forest Path',
            description: 'Peaceful forest trail through tall trees'
        },
        {
            id: 3,
            src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            alt: 'Ocean waves',
            title: 'Ocean Waves',
            description: 'Powerful ocean waves crashing on shore'
        },
        {
            id: 4,
            src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            alt: 'City skyline',
            title: 'City Skyline',
            description: 'Modern city skyline at sunset'
        },
        {
            id: 5,
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            alt: 'Desert dunes',
            title: 'Desert Dunes',
            description: 'Golden sand dunes in the desert'
        },
        {
            id: 6,
            src: 'https://images.unsplash.com/photo-1464822759844-d150baec5b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            alt: 'Lakeside view',
            title: 'Lakeside View',
            description: 'Serene lake surrounded by mountains'
        }
    ];

    const toggleLike = (id: number) => {
        setLikedImages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const imageSizes = [
        { name: 'Thumbnail', class: 'w-16 h-16' },
        { name: 'Small', class: 'w-32 h-32' },
        { name: 'Medium', class: 'w-48 h-48' },
        { name: 'Large', class: 'w-64 h-64' },
        { name: 'Extra Large', class: 'w-80 h-80' },
    ];

    const imageShapes = [
        { name: 'Square', class: 'rounded-none' },
        { name: 'Rounded', class: 'rounded-lg' },
        { name: 'Circle', class: 'rounded-full' },
        { name: 'Rounded Large', class: 'rounded-2xl' },
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Image Components</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Various image display styles and layouts</p>
            </div>

            <div className="space-y-8">
                {/* Basic Images */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Basic Images</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {sampleImages.slice(0, 4).map((image) => (
                                <div key={image.id} className="relative group">
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-32 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                                        <button className="opacity-0 group-hover:opacity-100 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all">
                                            <MagnifyingGlassIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Image Sizes */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Image Sizes</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-wrap items-center gap-6">
                            {imageSizes.map((size) => (
                                <div key={size.name} className="flex flex-col items-center space-y-2">
                                    <img
                                        src={sampleImages[0].src}
                                        alt={sampleImages[0].alt}
                                        className={`${size.class} object-cover rounded-lg shadow-sm`}
                                    />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{size.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Image Shapes */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Image Shapes</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-wrap items-center gap-6">
                            {imageShapes.map((shape) => (
                                <div key={shape.name} className="flex flex-col items-center space-y-2">
                                    <img
                                        src={sampleImages[1].src}
                                        alt={sampleImages[1].alt}
                                        className={`w-24 h-24 object-cover ${shape.class} shadow-sm`}
                                    />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{shape.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Image Gallery */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Image Gallery</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sampleImages.map((image) => (
                                <div key={image.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="relative group">
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                                                <button
                                                    onClick={() => setSelectedImage(image.src)}
                                                    className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => toggleLike(image.id)}
                                                    className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all"
                                                >
                                                    {likedImages.has(image.id) ? (
                                                        <HeartSolidIcon className="h-4 w-4 text-red-500" />
                                                    ) : (
                                                        <HeartIcon className="h-4 w-4" />
                                                    )}
                                                </button>
                                                <button className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all">
                                                    <ShareIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{image.title}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{image.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Image with Overlay */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Image with Overlay</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative group">
                                <img
                                    src={sampleImages[0].src}
                                    alt={sampleImages[0].alt}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h4 className="text-lg font-semibold mb-1">{sampleImages[0].title}</h4>
                                    <p className="text-sm opacity-90">{sampleImages[0].description}</p>
                                </div>
                            </div>

                            <div className="relative group">
                                <img
                                    src={sampleImages[1].src}
                                    alt={sampleImages[1].alt}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/40 transition-all duration-200 rounded-lg" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <h4 className="text-xl font-bold mb-2">{sampleImages[1].title}</h4>
                                        <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Cards */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Image Cards</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {sampleImages.slice(0, 3).map((image) => (
                                <div key={image.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4">
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{image.title}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{image.description}</p>
                                        <div className="flex items-center justify-between">
                                            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                                                Learn More
                                            </button>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => toggleLike(image.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    {likedImages.has(image.id) ? (
                                                        <HeartSolidIcon className="h-4 w-4 text-red-500" />
                                                    ) : (
                                                        <HeartIcon className="h-4 w-4" />
                                                    )}
                                                </button>
                                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                                    <ShareIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Responsive Images */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Responsive Images</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Full Width</h4>
                                <img
                                    src={sampleImages[2].src}
                                    alt={sampleImages[2].alt}
                                    className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg"
                                />
                            </div>
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Aspect Ratio</h4>
                                <div className="aspect-video">
                                    <img
                                        src={sampleImages[3].src}
                                        alt={sampleImages[3].alt}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Loading States */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Image Loading States</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Loading Placeholder</h4>
                                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
                                    <span className="text-gray-400 dark:text-gray-500">Loading...</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Error State</h4>
                                <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                                    <div className="text-center">
                                        <div className="text-gray-400 dark:text-gray-500 mb-2">📷</div>
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">Image not found</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <img
                            src={selectedImage}
                            alt="Selected image"
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UIImages;
