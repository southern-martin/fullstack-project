import {
    ChartBarIcon,
    CodeBracketIcon,
    CpuChipIcon,
    DocumentTextIcon,
    LightBulbIcon,
    PaperAirplaneIcon,
    SparklesIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
    id: number;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isLoading?: boolean;
}

interface QuickAction {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    prompt: string;
}

const AIAssistant: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            type: 'assistant',
            content: 'Hello! I\'m your AI Assistant. I can help you with data analysis, code generation, business insights, and more. How can I assist you today?',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const quickActions: QuickAction[] = [
        {
            id: 'analyze-data',
            title: 'Analyze Data',
            description: 'Get insights from your dashboard data',
            icon: ChartBarIcon,
            prompt: 'Can you analyze the sales trends from the dashboard and provide insights?',
        },
        {
            id: 'generate-code',
            title: 'Generate Code',
            description: 'Create React components or functions',
            icon: CodeBracketIcon,
            prompt: 'Help me create a React component for user management',
        },
        {
            id: 'business-insights',
            title: 'Business Insights',
            description: 'Get strategic business recommendations',
            icon: LightBulbIcon,
            prompt: 'What are some ways to improve customer retention based on our data?',
        },
        {
            id: 'documentation',
            title: 'Documentation',
            description: 'Help with technical documentation',
            icon: DocumentTextIcon,
            prompt: 'Help me write documentation for our API endpoints',
        },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        if (!content.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now(),
            type: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const assistantMessage: Message = {
                id: Date.now() + 1,
                type: 'assistant',
                content: generateAIResponse(content),
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);
        }, 1500);
    };

    const generateAIResponse = (userInput: string): string => {
        const input = userInput.toLowerCase();

        if (input.includes('analyze') || input.includes('data') || input.includes('trend')) {
            return `Based on your dashboard data, I can see some interesting patterns:

📊 **Sales Analysis:**
- Monthly sales show a peak in July (20 units) and a dip in March (3 units)
- Overall trend is positive with 11.01% growth in customer base
- Revenue trend indicates strong performance in Q4

💡 **Recommendations:**
1. Focus marketing efforts during low-performing months (March, May)
2. Leverage the July success pattern for future campaigns
3. Consider seasonal adjustments to inventory

Would you like me to dive deeper into any specific metric?`;
        }

        if (input.includes('code') || input.includes('component') || input.includes('react')) {
            return `I'd be happy to help you create React components! Here's a basic user management component structure:

\`\`\`tsx
import React, { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      {/* Component implementation */}
    </div>
  );
};

export default UserManagement;
\`\`\`

Would you like me to expand on this or create a specific component?`;
        }

        if (input.includes('business') || input.includes('insight') || input.includes('recommendation')) {
            return `Here are some strategic business insights based on your current data:

🎯 **Growth Opportunities:**
- Customer base is growing at 11.01% - excellent momentum
- Focus on customer retention strategies to maintain this growth
- Consider upselling to existing customers

📈 **Performance Metrics:**
- Monthly sales variance suggests seasonal patterns
- Revenue trends show strong Q4 performance
- Customer acquisition cost optimization needed

🚀 **Action Items:**
1. Implement customer feedback system
2. Develop loyalty program
3. Optimize conversion funnel
4. Expand into new market segments

Would you like me to elaborate on any of these recommendations?`;
        }

        if (input.includes('documentation') || input.includes('api') || input.includes('help')) {
            return `I can help you create comprehensive documentation! Here's a template for API documentation:

## API Endpoints

### Authentication
- **POST** \`/api/auth/login\` - User login
- **POST** \`/api/auth/register\` - User registration
- **POST** \`/api/auth/logout\` - User logout

### Users
- **GET** \`/api/users\` - Get all users
- **POST** \`/api/users\` - Create new user
- **PUT** \`/api/users/:id\` - Update user
- **DELETE** \`/api/users/:id\` - Delete user

### Example Request:
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin"
}
\`\`\`

Would you like me to create documentation for specific endpoints?`;
        }

        return `I understand you're asking about "${userInput}". I'm here to help with:

🤖 **Data Analysis** - Dashboard insights and trends
💻 **Code Generation** - React components and functions  
📊 **Business Intelligence** - Strategic recommendations
📝 **Documentation** - Technical writing and API docs
🔧 **General Assistance** - Any other questions you have

Could you be more specific about what you'd like help with?`;
    };

    const handleQuickAction = (action: QuickAction) => {
        handleSendMessage(action.prompt);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        AI Assistant
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Get intelligent insights, code generation, and business recommendations.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 dark:bg-green-900/20">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-xs font-medium text-green-700 dark:text-green-400">
                            AI Online
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Chat Interface */}
                <div className="lg:col-span-3">
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] h-[600px] flex flex-col">
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                <CpuChipIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    AI Assistant
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Powered by advanced AI
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {message.type === 'assistant' && (
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20 flex-shrink-0">
                                            <CpuChipIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[80%] rounded-lg px-4 py-2 ${message.type === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                            }`}
                                    >
                                        <div className="text-sm whitespace-pre-wrap">
                                            {message.content}
                                        </div>
                                        <div className={`text-xs mt-1 ${message.type === 'user'
                                            ? 'text-blue-100'
                                            : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {formatTime(message.timestamp)}
                                        </div>
                                    </div>

                                    {message.type === 'user' && (
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                            <UserIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3 justify-start">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20 flex-shrink-0">
                                        <CpuChipIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex space-x-1">
                                                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">AI is thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                                    placeholder="Ask me anything..."
                                    className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={() => handleSendMessage(inputValue)}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <PaperAirplaneIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Sidebar */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                        <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
                            Quick Actions
                        </h3>

                        <div className="space-y-3">
                            {quickActions.map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => handleQuickAction(action)}
                                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 transition-colors group"
                                    disabled={isLoading}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                                            <action.icon className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">
                                                {action.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {action.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* AI Status */}
                        <div className="mt-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <div className="flex items-center gap-2">
                                <SparklesIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <span className="text-xs font-medium text-green-700 dark:text-green-400">
                                    AI Assistant Ready
                                </span>
                            </div>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                Ask questions, get insights, or request code generation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
