import {
    ArchiveBoxIcon,
    CloudArrowUpIcon,
    DocumentIcon,
    DocumentTextIcon,
    EyeIcon,
    FolderIcon,
    MusicalNoteIcon,
    PencilIcon,
    PhotoIcon,
    ShareIcon,
    TrashIcon,
    VideoCameraIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface FileItem {
    id: string;
    name: string;
    type: 'folder' | 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
    size: number;
    modified: string;
    path: string;
    isSelected?: boolean;
}

const FileManager: React.FC = () => {
    const [currentPath, setCurrentPath] = useState('/');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'name' | 'size' | 'modified'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const mockFiles: FileItem[] = [
        {
            id: '1',
            name: 'Documents',
            type: 'folder',
            size: 0,
            modified: '2024-01-15 10:30:00',
            path: '/Documents',
        },
        {
            id: '2',
            name: 'Images',
            type: 'folder',
            size: 0,
            modified: '2024-01-14 15:45:00',
            path: '/Images',
        },
        {
            id: '3',
            name: 'Videos',
            type: 'folder',
            size: 0,
            modified: '2024-01-13 09:20:00',
            path: '/Videos',
        },
        {
            id: '4',
            name: 'project-proposal.pdf',
            type: 'document',
            size: 2048576, // 2MB
            modified: '2024-01-15 08:45:00',
            path: '/project-proposal.pdf',
        },
        {
            id: '5',
            name: 'team-photo.jpg',
            type: 'image',
            size: 1048576, // 1MB
            modified: '2024-01-14 16:30:00',
            path: '/team-photo.jpg',
        },
        {
            id: '6',
            name: 'presentation.mp4',
            type: 'video',
            size: 52428800, // 50MB
            modified: '2024-01-13 11:20:00',
            path: '/presentation.mp4',
        },
        {
            id: '7',
            name: 'background-music.mp3',
            type: 'audio',
            size: 8388608, // 8MB
            modified: '2024-01-12 13:45:00',
            path: '/background-music.mp3',
        },
        {
            id: '8',
            name: 'archive.zip',
            type: 'archive',
            size: 15728640, // 15MB
            modified: '2024-01-11 14:15:00',
            path: '/archive.zip',
        },
    ];

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'folder':
                return <FolderIcon className="h-8 w-8 text-blue-500" />;
            case 'image':
                return <PhotoIcon className="h-8 w-8 text-green-500" />;
            case 'video':
                return <VideoCameraIcon className="h-8 w-8 text-purple-500" />;
            case 'audio':
                return <MusicalNoteIcon className="h-8 w-8 text-yellow-500" />;
            case 'document':
                return <DocumentTextIcon className="h-8 w-8 text-red-500" />;
            case 'archive':
                return <ArchiveBoxIcon className="h-8 w-8 text-orange-500" />;
            default:
                return <DocumentIcon className="h-8 w-8 text-gray-500" />;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const sortedFiles = [...mockFiles].sort((a, b) => {
        // Folders first
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;

        let comparison = 0;
        switch (sortBy) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'size':
                comparison = a.size - b.size;
                break;
            case 'modified':
                comparison = new Date(a.modified).getTime() - new Date(b.modified).getTime();
                break;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const handleFileSelect = (fileId: string) => {
        setSelectedFiles(prev =>
            prev.includes(fileId)
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        );
    };

    const handleSelectAll = () => {
        if (selectedFiles.length === mockFiles.length) {
            setSelectedFiles([]);
        } else {
            setSelectedFiles(mockFiles.map(file => file.id));
        }
    };

    const handleSort = (field: 'name' | 'size' | 'modified') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">File Manager</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage your files and folders</p>
                </div>

                <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        <CloudArrowUpIcon className="h-4 w-4" />
                        <span>Upload</span>
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
                        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1 text-sm ${viewMode === 'grid'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1 text-sm ${viewMode === 'list'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                            >
                                List
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => handleSort(e.target.value as 'name' | 'size' | 'modified')}
                            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="name">Name</option>
                            <option value="size">Size</option>
                            <option value="modified">Modified</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {selectedFiles.length > 0 && (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedFiles.length} selected
                            </span>
                            <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* File Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {sortedFiles.map((file) => (
                        <div
                            key={file.id}
                            className={`group relative cursor-pointer rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedFiles.includes(file.id)
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                            onClick={() => handleFileSelect(file.id)}
                        >
                            <div className="flex flex-col items-center text-center">
                                {getFileIcon(file.type)}
                                <span className="mt-2 text-xs font-medium text-gray-900 dark:text-white line-clamp-2">
                                    {file.name}
                                </span>
                                {file.type !== 'folder' && (
                                    <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {formatFileSize(file.size)}
                                    </span>
                                )}
                            </div>

                            {/* Action buttons on hover */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                                <div className="flex space-x-2">
                                    <button className="rounded-full bg-white p-2 text-gray-700 hover:bg-gray-100">
                                        <EyeIcon className="h-4 w-4" />
                                    </button>
                                    <button className="rounded-full bg-white p-2 text-gray-700 hover:bg-gray-100">
                                        <ShareIcon className="h-4 w-4" />
                                    </button>
                                    <button className="rounded-full bg-white p-2 text-gray-700 hover:bg-gray-100">
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedFiles.length === mockFiles.length}
                                            onChange={handleSelectAll}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th
                                        scope="col"
                                        className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                        onClick={() => handleSort('name')}
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                        onClick={() => handleSort('size')}
                                    >
                                        Size
                                    </th>
                                    <th
                                        scope="col"
                                        className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                        onClick={() => handleSort('modified')}
                                    >
                                        Modified
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {sortedFiles.map((file) => (
                                    <tr
                                        key={file.id}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedFiles.includes(file.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                            }`}
                                        onClick={() => handleFileSelect(file.id)}
                                    >
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedFiles.includes(file.id)}
                                                onChange={() => handleFileSelect(file.id)}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    {getFileIcon(file.type)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {file.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {file.type === 'folder' ? '-' : formatFileSize(file.size)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(file.modified)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                                    <EyeIcon className="h-4 w-4" />
                                                </button>
                                                <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                    <ShareIcon className="h-4 w-4" />
                                                </button>
                                                <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileManager;
