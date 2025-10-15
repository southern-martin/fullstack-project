import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';

const UICarousel: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSlide2, setCurrentSlide2] = useState(0);

    const slides = [
        {
            id: 1,
            title: 'Beautiful Landscape',
            description: 'Discover amazing places around the world',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            color: 'from-blue-500 to-purple-600'
        },
        {
            id: 2,
            title: 'Mountain Adventure',
            description: 'Experience the thrill of mountain climbing',
            image: 'https://images.unsplash.com/photo-1464822759844-d150baec5b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            color: 'from-green-500 to-blue-600'
        },
        {
            id: 3,
            title: 'Ocean Waves',
            description: 'Feel the power of the ocean',
            image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            color: 'from-cyan-500 to-blue-600'
        },
        {
            id: 4,
            title: 'Forest Path',
            description: 'Walk through peaceful forest trails',
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            color: 'from-emerald-500 to-green-600'
        }
    ];

    const productSlides = [
        {
            id: 1,
            name: 'Premium Headphones',
            price: '$299',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            rating: 4.8
        },
        {
            id: 2,
            name: 'Smart Watch',
            price: '$199',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            rating: 4.6
        },
        {
            id: 3,
            name: 'Wireless Speaker',
            price: '$149',
            image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            rating: 4.7
        },
        {
            id: 4,
            name: 'Gaming Mouse',
            price: '$79',
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            rating: 4.9
        }
    ];

    // Auto-play functionality
    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isPlaying, slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const nextSlide2 = () => {
        setCurrentSlide2((prev) => (prev + 1) % productSlides.length);
    };

    const prevSlide2 = () => {
        setCurrentSlide2((prev) => (prev - 1 + productSlides.length) % productSlides.length);
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Carousel Components</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Image and content carousels with navigation controls</p>
            </div>

            <div className="space-y-8">
                {/* Basic Image Carousel */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Basic Image Carousel</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="relative max-w-4xl mx-auto">
                            <div className="relative overflow-hidden rounded-lg">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                >
                                    {slides.map((slide) => (
                                        <div key={slide.id} className="w-full flex-shrink-0">
                                            <div className={`relative h-64 sm:h-80 lg:h-96 bg-gradient-to-r ${slide.color} flex items-center justify-center`}>
                                                <div className="text-center text-white p-8">
                                                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">{slide.title}</h3>
                                                    <p className="text-lg opacity-90">{slide.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
                            >
                                <ChevronLeftIcon className="h-6 w-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
                            >
                                <ChevronRightIcon className="h-6 w-6" />
                            </button>

                            {/* Dots Indicator */}
                            <div className="flex justify-center mt-4 space-x-2">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide
                                                ? 'bg-blue-600'
                                                : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Auto-play Carousel */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Auto-play Carousel</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {isPlaying ? (
                                        <>
                                            <PauseIcon className="h-4 w-4" />
                                            <span>Pause</span>
                                        </>
                                    ) : (
                                        <>
                                            <PlayIcon className="h-4 w-4" />
                                            <span>Play</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Slide {currentSlide + 1} of {slides.length}
                            </div>
                        </div>

                        <div className="relative max-w-4xl mx-auto">
                            <div className="relative overflow-hidden rounded-lg">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                >
                                    {slides.map((slide) => (
                                        <div key={slide.id} className="w-full flex-shrink-0">
                                            <div className="relative h-64 sm:h-80">
                                                <img
                                                    src={slide.image}
                                                    alt={slide.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 flex items-end">
                                                    <div className="text-white p-6">
                                                        <h3 className="text-xl sm:text-2xl font-bold mb-2">{slide.title}</h3>
                                                        <p className="text-sm opacity-90">{slide.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dots Indicator */}
                            <div className="flex justify-center mt-4 space-x-2">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide
                                                ? 'bg-blue-600'
                                                : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Carousel */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Product Carousel</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="relative max-w-4xl mx-auto">
                            <div className="relative overflow-hidden rounded-lg">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${currentSlide2 * 25}%)` }}
                                >
                                    {productSlides.map((product) => (
                                        <div key={product.id} className="w-1/4 flex-shrink-0 px-2">
                                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                                <div className="aspect-square">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{product.name}</h4>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{product.price}</span>
                                                        <div className="flex items-center">
                                                            <span className="text-yellow-400">★</span>
                                                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{product.rating}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevSlide2}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={nextSlide2}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card Carousel */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Card Carousel</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {slides.slice(0, 3).map((slide, index) => (
                                <div key={slide.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="h-48">
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{slide.title}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">{slide.description}</p>
                                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Thumbnail Carousel */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Thumbnail Carousel</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="max-w-2xl mx-auto">
                            {/* Main Image */}
                            <div className="relative mb-4">
                                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                    <img
                                        src={slides[currentSlide].image}
                                        alt={slides[currentSlide].title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Thumbnail Navigation */}
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {slides.map((slide, index) => (
                                    <button
                                        key={slide.id}
                                        onClick={() => goToSlide(index)}
                                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${index === currentSlide
                                                ? 'border-blue-600'
                                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                            }`}
                                    >
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UICarousel;
