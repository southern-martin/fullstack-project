import {
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon,
    PlusIcon,
    TrashIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface Event {
    id: number;
    title: string;
    description: string;
    start: Date;
    end: Date;
    location?: string;
    attendees?: string[];
    color: string;
    type: 'meeting' | 'task' | 'reminder' | 'event';
}

interface CalendarEvent {
    id: number;
    title: string;
    description: string;
    start: Date;
    end: Date;
    location?: string;
    attendees?: string[];
    color: string;
    type: 'meeting' | 'task' | 'reminder' | 'event';
}

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [view, setView] = useState<'month' | 'week' | 'day'>('month');
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [events, setEvents] = useState<Event[]>([
        {
            id: 1,
            title: 'Team Meeting',
            description: 'Weekly team standup meeting',
            start: new Date(2024, 0, 15, 10, 0),
            end: new Date(2024, 0, 15, 11, 0),
            location: 'Conference Room A',
            attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
            color: 'bg-blue-500',
            type: 'meeting',
        },
        {
            id: 2,
            title: 'Project Deadline',
            description: 'Submit final project deliverables',
            start: new Date(2024, 0, 20, 17, 0),
            end: new Date(2024, 0, 20, 18, 0),
            location: 'Office',
            color: 'bg-red-500',
            type: 'task',
        },
        {
            id: 3,
            title: 'Client Presentation',
            description: 'Present quarterly results to client',
            start: new Date(2024, 0, 25, 14, 0),
            end: new Date(2024, 0, 25, 15, 30),
            location: 'Client Office',
            attendees: ['Sarah Wilson', 'Tom Brown'],
            color: 'bg-green-500',
            type: 'event',
        },
        {
            id: 4,
            title: 'Code Review',
            description: 'Review pull requests and provide feedback',
            start: new Date(2024, 0, 18, 16, 0),
            end: new Date(2024, 0, 18, 17, 0),
            location: 'Development Room',
            attendees: ['Alex Chen', 'Lisa Davis'],
            color: 'bg-purple-500',
            type: 'meeting',
        },
    ]);

    const [newEvent, setNewEvent] = useState<Partial<Event>>({
        title: '',
        description: '',
        start: new Date(),
        end: new Date(),
        location: '',
        attendees: [],
        color: 'bg-blue-500',
        type: 'meeting',
    });

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.toDateString() === date.toDateString();
        });
    };

    const getEventsForMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        return events.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.getFullYear() === year && eventDate.getMonth() === month;
        });
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setNewEvent(prev => ({
            ...prev,
            start: date,
            end: new Date(date.getTime() + 60 * 60 * 1000), // 1 hour later
        }));
        setShowEventModal(true);
    };

    const handleEventClick = (event: Event) => {
        setEditingEvent(event);
        setShowEventModal(true);
    };

    const handleSaveEvent = () => {
        if (editingEvent) {
            // Update existing event
            setEvents(prev => prev.map(event =>
                event.id === editingEvent.id
                    ? { ...event, ...newEvent } as Event
                    : event
            ));
        } else {
            // Create new event
            const event: Event = {
                id: Date.now(),
                ...newEvent,
                start: newEvent.start || new Date(),
                end: newEvent.end || new Date(),
                title: newEvent.title || 'New Event',
                description: newEvent.description || '',
                color: newEvent.color || 'bg-blue-500',
                type: newEvent.type || 'meeting',
            } as Event;
            setEvents(prev => [...prev, event]);
        }

        setShowEventModal(false);
        setEditingEvent(null);
        setNewEvent({
            title: '',
            description: '',
            start: new Date(),
            end: new Date(),
            location: '',
            attendees: [],
            color: 'bg-blue-500',
            type: 'meeting',
        });
    };

    const handleDeleteEvent = (eventId: number) => {
        setEvents(prev => prev.filter(event => event.id !== eventId));
        setShowEventModal(false);
        setEditingEvent(null);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString();
    };

    const getEventTypeIcon = (type: string) => {
        switch (type) {
            case 'meeting':
                return <UserIcon className="w-3 h-3" />;
            case 'task':
                return <CalendarIcon className="w-3 h-3" />;
            case 'reminder':
                return <ClockIcon className="w-3 h-3" />;
            case 'event':
                return <CalendarIcon className="w-3 h-3" />;
            default:
                return <CalendarIcon className="w-3 h-3" />;
        }
    };

    const days = getDaysInMonth(currentDate);
    const monthEvents = getEventsForMonth();

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        Calendar
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Manage your events, meetings, and tasks.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowEventModal(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-xs font-medium text-white shadow-theme-xs hover:bg-primary-600 transition-all duration-200"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Event
                    </button>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Navigation */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigateMonth('prev')}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            <ChevronLeftIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>

                        <button
                            onClick={() => navigateMonth('next')}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            <ChevronRightIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-2">
                        {(['month', 'week', 'day'] as const).map((viewType) => (
                            <button
                                key={viewType}
                                onClick={() => setView(viewType)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${view === viewType
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                {/* Day Headers */}
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                    {dayNames.map((day) => (
                        <div
                            key={day}
                            className="p-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                    {days.map((day, index) => {
                        const isCurrentMonth = day !== null;
                        const isToday = day && day.toDateString() === new Date().toDateString();
                        const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();
                        const dayEvents = day ? getEventsForDate(day) : [];

                        return (
                            <div
                                key={index}
                                className={`min-h-[120px] border-r border-b border-gray-200 p-2 dark:border-gray-700 ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                                    } ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''} ${isSelected ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                                    } hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors`}
                                onClick={() => day && handleDateClick(day)}
                            >
                                {day && (
                                    <>
                                        <div
                                            className={`text-sm font-medium mb-1 ${isCurrentMonth
                                                    ? isToday
                                                        ? 'text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-900 dark:text-white'
                                                    : 'text-gray-400 dark:text-gray-500'
                                                }`}
                                        >
                                            {day.getDate()}
                                        </div>

                                        {/* Events */}
                                        <div className="space-y-1">
                                            {dayEvents.slice(0, 3).map((event) => (
                                                <div
                                                    key={event.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEventClick(event);
                                                    }}
                                                    className={`${event.color} text-white text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1`}
                                                >
                                                    {getEventTypeIcon(event.type)}
                                                    <span className="truncate">{event.title}</span>
                                                </div>
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    +{dayEvents.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Event Modal */}
            {showEventModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {editingEvent ? 'Edit Event' : 'Add Event'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowEventModal(false);
                                    setEditingEvent(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={editingEvent?.title || newEvent.title || ''}
                                    onChange={(e) => {
                                        if (editingEvent) {
                                            setEditingEvent({ ...editingEvent, title: e.target.value });
                                        } else {
                                            setNewEvent({ ...newEvent, title: e.target.value });
                                        }
                                    }}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Event title"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    value={editingEvent?.description || newEvent.description || ''}
                                    onChange={(e) => {
                                        if (editingEvent) {
                                            setEditingEvent({ ...editingEvent, description: e.target.value });
                                        } else {
                                            setNewEvent({ ...newEvent, description: e.target.value });
                                        }
                                    }}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Event description"
                                />
                            </div>

                            {/* Start Time */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Start Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={editingEvent?.start ? editingEvent.start.toISOString().slice(0, 16) : newEvent.start?.toISOString().slice(0, 16) || ''}
                                    onChange={(e) => {
                                        const date = new Date(e.target.value);
                                        if (editingEvent) {
                                            setEditingEvent({ ...editingEvent, start: date });
                                        } else {
                                            setNewEvent({ ...newEvent, start: date });
                                        }
                                    }}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    End Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={editingEvent?.end ? editingEvent.end.toISOString().slice(0, 16) : newEvent.end?.toISOString().slice(0, 16) || ''}
                                    onChange={(e) => {
                                        const date = new Date(e.target.value);
                                        if (editingEvent) {
                                            setEditingEvent({ ...editingEvent, end: date });
                                        } else {
                                            setNewEvent({ ...newEvent, end: date });
                                        }
                                    }}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={editingEvent?.location || newEvent.location || ''}
                                    onChange={(e) => {
                                        if (editingEvent) {
                                            setEditingEvent({ ...editingEvent, location: e.target.value });
                                        } else {
                                            setNewEvent({ ...newEvent, location: e.target.value });
                                        }
                                    }}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Event location"
                                />
                            </div>

                            {/* Event Type */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Event Type
                                </label>
                                <select
                                    value={editingEvent?.type || newEvent.type || 'meeting'}
                                    onChange={(e) => {
                                        if (editingEvent) {
                                            setEditingEvent({ ...editingEvent, type: e.target.value as any });
                                        } else {
                                            setNewEvent({ ...newEvent, type: e.target.value as any });
                                        }
                                    }}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="meeting">Meeting</option>
                                    <option value="task">Task</option>
                                    <option value="reminder">Reminder</option>
                                    <option value="event">Event</option>
                                </select>
                            </div>

                            {/* Color */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Color
                                </label>
                                <div className="flex gap-2">
                                    {['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => {
                                                if (editingEvent) {
                                                    setEditingEvent({ ...editingEvent, color });
                                                } else {
                                                    setNewEvent({ ...newEvent, color });
                                                }
                                            }}
                                            className={`h-8 w-8 rounded-full ${color} ${(editingEvent?.color || newEvent.color) === color
                                                    ? 'ring-2 ring-gray-400'
                                                    : ''
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex items-center gap-3">
                            <button
                                onClick={handleSaveEvent}
                                className="flex-1 rounded-lg bg-primary-500 px-4 py-2 text-xs font-medium text-white hover:bg-primary-600 transition-colors"
                            >
                                {editingEvent ? 'Update Event' : 'Create Event'}
                            </button>
                            {editingEvent && (
                                <button
                                    onClick={() => handleDeleteEvent(editingEvent.id)}
                                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
