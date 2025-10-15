import {
    FaceSmileIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    PhoneIcon,
    UserIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: string;
    type: 'text' | 'image' | 'file';
    agentName?: string;
    agentAvatar?: string;
}

interface Agent {
    id: string;
    name: string;
    status: 'online' | 'away' | 'busy' | 'offline';
    avatar?: string;
    lastSeen?: string;
}

const SupportChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! How can I help you today?',
            sender: 'agent',
            timestamp: '2024-01-15 10:00:00',
            type: 'text',
            agentName: 'Sarah Johnson',
        },
        {
            id: '2',
            text: 'Hi! I\'m having trouble with my account login. It keeps saying my password is incorrect.',
            sender: 'user',
            timestamp: '2024-01-15 10:01:00',
            type: 'text',
        },
        {
            id: '3',
            text: 'I understand your concern. Let me help you with that. Have you tried resetting your password?',
            sender: 'agent',
            timestamp: '2024-01-15 10:02:00',
            type: 'text',
            agentName: 'Sarah Johnson',
        },
    ]);

    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>({
        id: '1',
        name: 'Sarah Johnson',
        status: 'online',
        lastSeen: 'Active now',
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const agents: Agent[] = [
        {
            id: '1',
            name: 'Sarah Johnson',
            status: 'online',
            lastSeen: 'Active now',
        },
        {
            id: '2',
            name: 'Mike Chen',
            status: 'away',
            lastSeen: '2 minutes ago',
        },
        {
            id: '3',
            name: 'Emily Davis',
            status: 'busy',
            lastSeen: '5 minutes ago',
        },
        {
            id: '4',
            name: 'David Wilson',
            status: 'offline',
            lastSeen: '1 hour ago',
        },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: newMessage,
            sender: 'user',
            timestamp: new Date().toLocaleString(),
            type: 'text',
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsTyping(true);

        // Simulate agent response
        setTimeout(() => {
            const agentResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: generateAgentResponse(newMessage),
                sender: 'agent',
                timestamp: new Date().toLocaleString(),
                type: 'text',
                agentName: selectedAgent?.name,
            };
            setMessages(prev => [...prev, agentResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const generateAgentResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('login') || lowerMessage.includes('password')) {
            return 'I can help you with login issues. Please try resetting your password using the "Forgot Password" link on the login page. If that doesn\'t work, I can escalate this to our technical team.';
        } else if (lowerMessage.includes('billing') || lowerMessage.includes('payment')) {
            return 'For billing and payment questions, I can help you check your account status and payment history. Would you like me to look into your recent transactions?';
        } else if (lowerMessage.includes('feature') || lowerMessage.includes('how to')) {
            return 'I\'d be happy to help you learn about our features! Could you be more specific about what you\'d like to know? I can provide step-by-step instructions.';
        } else if (lowerMessage.includes('bug') || lowerMessage.includes('error')) {
            return 'I\'m sorry to hear you\'re experiencing issues. Could you please describe the error message you\'re seeing? This will help me provide the best solution.';
        } else {
            return 'Thank you for your message. I\'m here to help! Could you provide more details about your question so I can assist you better?';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
                return 'bg-green-500';
            case 'away':
                return 'bg-yellow-500';
            case 'busy':
                return 'bg-red-500';
            case 'offline':
                return 'bg-gray-400';
            default:
                return 'bg-gray-400';
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {/* Agents Sidebar */}
            <div className="w-80 border-r border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Support Team</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Available agents</p>
                </div>

                <div className="space-y-3">
                    {agents.map((agent) => (
                        <div
                            key={agent.id}
                            onClick={() => setSelectedAgent(agent)}
                            className={`cursor-pointer rounded-lg p-3 transition-colors ${selectedAgent?.id === agent.id
                                ? 'bg-blue-100 dark:bg-blue-900/20'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                                        <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(agent.status)}`}></div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                            {agent.name}
                                        </h4>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatTime(agent.lastSeen || '')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {agent.lastSeen}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Quick Actions</h4>
                    <div className="space-y-2">
                        <button className="flex w-full items-center space-x-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
                            <PhoneIcon className="h-4 w-4" />
                            <span>Call Support</span>
                        </button>
                        <button className="flex w-full items-center space-x-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                            <VideoCameraIcon className="h-4 w-4" />
                            <span>Video Call</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex flex-1 flex-col">
                {/* Chat Header */}
                <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                                    <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(selectedAgent?.status || 'offline')}`}></div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {selectedAgent?.name || 'Select an agent'}
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {selectedAgent?.lastSeen || 'Not available'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                                <PhoneIcon className="h-5 w-5" />
                            </button>
                            <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                                <VideoCameraIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs rounded-lg px-4 py-2 ${message.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                        }`}
                                >
                                    {message.sender === 'agent' && message.agentName && (
                                        <div className="mb-1 text-xs font-medium opacity-75">
                                            {message.agentName}
                                        </div>
                                    )}
                                    <p className="text-sm">{message.text}</p>
                                    <div className="mt-1 text-xs opacity-75">
                                        {formatTime(message.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="max-w-xs rounded-lg bg-gray-100 px-4 py-2 text-gray-900 dark:bg-gray-700 dark:text-white">
                                    <div className="flex items-center space-x-1">
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-150"></div>
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-300"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center space-x-3">
                        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                            <PaperClipIcon className="h-5 w-5" />
                        </button>
                        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                            <FaceSmileIcon className="h-5 w-5" />
                        </button>
                        <div className="flex-1">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your message..."
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={newMessage.trim() === ''}
                            className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportChat;
