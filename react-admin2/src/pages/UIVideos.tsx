import {
    ArrowsPointingInIcon,
    ArrowsPointingOutIcon,
    PauseIcon,
    PlayIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon
} from '@heroicons/react/24/outline';
import React, { useRef, useState } from 'react';

const UIVideos: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (!isFullscreen) {
                if (videoRef.current.requestFullscreen) {
                    videoRef.current.requestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
            setIsFullscreen(!isFullscreen);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const videoSources = [
        {
            id: 1,
            title: 'Sample Video 1',
            description: 'A beautiful landscape video showcasing nature.',
            thumbnail: 'https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=Video+1',
            src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        },
        {
            id: 2,
            title: 'Sample Video 2',
            description: 'An exciting action sequence with dynamic scenes.',
            thumbnail: 'https://via.placeholder.com/400x225/059669/FFFFFF?text=Video+2',
            src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
        },
        {
            id: 3,
            title: 'Sample Video 3',
            description: 'A peaceful documentary about wildlife.',
            thumbnail: 'https://via.placeholder.com/400x225/DC2626/FFFFFF?text=Video+3',
            src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        }
    ];

    return (
        <div className="mx-auto max-w-7xl p-6">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Videos</h1>

            {/* Basic Video Player */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Basic Video Player</h2>
                <div className="relative max-w-2xl">
                    <video
                        ref={videoRef}
                        className="w-full rounded-lg"
                        poster="https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=Video+Poster"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    >
                        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Custom Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={togglePlay}
                                className="text-white hover:text-gray-300 transition-colors"
                            >
                                {isPlaying ? (
                                    <PauseIcon className="h-6 w-6" />
                                ) : (
                                    <PlayIcon className="h-6 w-6" />
                                )}
                            </button>

                            <div className="flex-1 bg-gray-600 rounded-full h-1">
                                <div
                                    className="bg-white h-1 rounded-full transition-all"
                                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                                ></div>
                            </div>

                            <span className="text-white text-sm">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>

                            <button
                                onClick={toggleMute}
                                className="text-white hover:text-gray-300 transition-colors"
                            >
                                {isMuted ? (
                                    <SpeakerXMarkIcon className="h-5 w-5" />
                                ) : (
                                    <SpeakerWaveIcon className="h-5 w-5" />
                                )}
                            </button>

                            <button
                                onClick={toggleFullscreen}
                                className="text-white hover:text-gray-300 transition-colors"
                            >
                                {isFullscreen ? (
                                    <ArrowsPointingInIcon className="h-5 w-5" />
                                ) : (
                                    <ArrowsPointingOutIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Gallery */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Video Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videoSources.map((video) => (
                        <div key={video.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-90">
                                            <PlayIcon className="h-8 w-8 text-gray-900" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                    <h3 className="text-white font-semibold">{video.title}</h3>
                                    <p className="text-white text-sm opacity-90">{video.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Cards */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Video Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videoSources.map((video) => (
                        <div key={video.id} className="rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800">
                            <div className="relative">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition-all">
                                        <PlayIcon className="h-6 w-6 text-gray-900" />
                                    </button>
                                </div>
                                <div className="absolute top-2 right-2">
                                    <span className="rounded bg-black bg-opacity-70 px-2 py-1 text-xs text-white">
                                        5:30
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{video.title}</h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{video.description}</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">2.5K views</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">2 days ago</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video List */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Video List</h2>
                <div className="space-y-4">
                    {videoSources.map((video, index) => (
                        <div key={video.id} className="flex space-x-4 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <div className="relative flex-shrink-0">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="h-20 w-32 rounded object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition-all">
                                        <PlayIcon className="h-4 w-4 text-gray-900" />
                                    </button>
                                </div>
                                <div className="absolute bottom-1 right-1">
                                    <span className="rounded bg-black bg-opacity-70 px-1 py-0.5 text-xs text-white">
                                        5:30
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{video.title}</h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{video.description}</p>
                                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span>2.5K views</span>
                                    <span>•</span>
                                    <span>2 days ago</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Embed */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Video Embed</h2>
                <div className="relative max-w-4xl">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                        <iframe
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            title="Sample Video"
                            className="absolute inset-0 h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* Video Upload */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Video Upload</h2>
                <div className="space-y-4">
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="video-upload" className="cursor-pointer">
                                <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    Upload a video file
                                </span>
                                <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                                    or drag and drop
                                </span>
                            </label>
                            <input
                                id="video-upload"
                                name="video-upload"
                                type="file"
                                accept="video/*"
                                className="sr-only"
                            />
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            MP4, MOV, AVI up to 100MB
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIVideos;
