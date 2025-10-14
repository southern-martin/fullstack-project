import {
    CalendarIcon,
    ChartBarIcon,
    ChatBubbleLeftRightIcon,
    CogIcon,
    DocumentTextIcon,
    HomeIcon,
    ShoppingBagIcon,
    TableCellsIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const location = useLocation();

    const navigation = [
        {
            name: 'Dashboard',
            href: '/',
            icon: HomeIcon,
            children: [
                { name: 'eCommerce', href: '/ecommerce' },
                { name: 'Analytics', href: '/analytics' },
                { name: 'Marketing', href: '/marketing' },
                { name: 'CRM', href: '/crm' },
                { name: 'Stocks', href: '/stocks' },
                { name: 'SaaS', href: '/saas', badge: 'New' },
                { name: 'Logistics', href: '/logistics', badge: 'New' },
            ]
        },
        {
            name: 'AI Assistant',
            href: '/ai-assistant',
            icon: ChartBarIcon,
            badge: 'New',
            children: [
                { name: 'Text Generator', href: '/ai/text' },
                { name: 'Image Generator', href: '/ai/image' },
                { name: 'Code Generator', href: '/ai/code' },
                { name: 'Video Generator', href: '/ai/video' },
            ]
        },
        {
            name: 'E-commerce',
            href: '/ecommerce',
            icon: ShoppingBagIcon,
            badge: 'New',
            children: [
                { name: 'Products', href: '/products' },
                { name: 'Add Product', href: '/products/add' },
                { name: 'Billing', href: '/billing' },
                { name: 'Invoices', href: '/invoices' },
                { name: 'Single Invoice', href: '/invoices/single' },
                { name: 'Create Invoice', href: '/invoices/create' },
                { name: 'Transactions', href: '/transactions' },
                { name: 'Single Transaction', href: '/transactions/single' },
            ]
        },
        { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
        { name: 'User Profile', href: '/profile', icon: UserIcon },
        {
            name: 'Task',
            href: '/tasks',
            icon: DocumentTextIcon,
            children: [
                { name: 'List', href: '/tasks/list' },
                { name: 'Kanban', href: '/tasks/kanban' },
            ]
        },
        {
            name: 'Forms',
            href: '/forms',
            icon: DocumentTextIcon,
            children: [
                { name: 'Form Elements', href: '/forms/elements' },
                { name: 'Form Layout', href: '/forms/layout' },
            ]
        },
        {
            name: 'Tables',
            href: '/tables',
            icon: TableCellsIcon,
            children: [
                { name: 'Basic Tables', href: '/tables/basic' },
                { name: 'Data Tables', href: '/tables/data' },
            ]
        },
        {
            name: 'Pages',
            href: '/pages',
            icon: DocumentTextIcon,
            children: [
                { name: 'File Manager', href: '/pages/files' },
                { name: 'Pricing Tables', href: '/pages/pricing' },
                { name: 'FAQ', href: '/pages/faq' },
                { name: 'API Keys', href: '/pages/api-keys', badge: 'New' },
                { name: 'Integrations', href: '/pages/integrations', badge: 'New' },
                { name: 'Blank Page', href: '/pages/blank' },
                { name: '404 Error', href: '/pages/404' },
                { name: '500 Error', href: '/pages/500' },
                { name: '503 Error', href: '/pages/503' },
                { name: 'Coming Soon', href: '/pages/coming-soon' },
                { name: 'Maintenance', href: '/pages/maintenance' },
                { name: 'Success', href: '/pages/success' },
            ]
        },
        {
            name: 'Support',
            href: '/support',
            icon: ChatBubbleLeftRightIcon,
            children: [
                { name: 'Chat', href: '/support/chat' },
                { name: 'Support Ticket', href: '/support/tickets', badge: 'New' },
                { name: 'Ticket List', href: '/support/tickets/list' },
                { name: 'Ticket Reply', href: '/support/tickets/reply' },
                { name: 'Email', href: '/support/email' },
                { name: 'Inbox', href: '/support/email/inbox' },
                { name: 'Details', href: '/support/email/details' },
            ]
        },
        {
            name: 'others',
            href: '/others',
            icon: CogIcon,
            children: [
                {
                    name: 'Charts',
                    href: '/charts',
                    children: [
                        { name: 'Line Chart', href: '/charts/line' },
                        { name: 'Bar Chart', href: '/charts/bar' },
                        { name: 'Pie Chart', href: '/charts/pie' },
                    ]
                },
                {
                    name: 'UI Elements',
                    href: '/ui-elements',
                    children: [
                        { name: 'Alerts', href: '/ui/alerts' },
                        { name: 'Avatars', href: '/ui/avatars' },
                        { name: 'Badge', href: '/ui/badge' },
                        { name: 'Breadcrumb', href: '/ui/breadcrumb' },
                        { name: 'Buttons', href: '/ui/buttons' },
                        { name: 'Buttons Group', href: '/ui/button-group' },
                        { name: 'Cards', href: '/ui/cards' },
                        { name: 'Carousel', href: '/ui/carousel' },
                        { name: 'Dropdowns', href: '/ui/dropdowns' },
                        { name: 'Images', href: '/ui/images' },
                        { name: 'Links', href: '/ui/links' },
                        { name: 'List', href: '/ui/list' },
                        { name: 'Modals', href: '/ui/modals' },
                        { name: 'Notifications', href: '/ui/notifications' },
                        { name: 'Pagination', href: '/ui/pagination' },
                        { name: 'Popovers', href: '/ui/popovers' },
                        { name: 'Progress Bars', href: '/ui/progress' },
                        { name: 'Ribbons', href: '/ui/ribbons' },
                        { name: 'Spinners', href: '/ui/spinners' },
                        { name: 'Tabs', href: '/ui/tabs' },
                        { name: 'Tooltips', href: '/ui/tooltips' },
                        { name: 'Videos', href: '/ui/videos' },
                    ]
                },
                {
                    name: 'Authentication',
                    href: '/auth',
                    children: [
                        { name: 'Sign In', href: '/auth/signin' },
                        { name: 'Sign Up', href: '/auth/signup' },
                        { name: 'Reset Password', href: '/auth/reset' },
                        { name: 'Two Step Verification', href: '/auth/2fa' },
                    ]
                },
            ]
        },
    ];

    const isActive = (href: string) => {
        if (href === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(href);
    };

    return (
        <aside className="sidebar fixed left-0 top-0 z-9999 flex h-screen w-[290px] flex-col overflow-y-hidden border-r border-gray-200 bg-white px-5 dark:border-gray-800 dark:bg-gray-900 lg:static lg:translate-x-0">
            {/* Sidebar Header */}
            <div className="flex items-center gap-2 pt-8 sidebar-header pb-7 justify-between">
                <a href="/">
                    <span className="logo">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">T</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">TailAdmin</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
                            </div>
                        </div>
                    </span>
                </a>
            </div>

            {/* Navigation */}
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav>
                    <div>
                        <h3 className="mb-4 text-xs uppercase leading-[20px] text-gray-400">
                            <span className="menu-group-title">MENU</span>
                        </h3>

                        <ul className="flex flex-col gap-4 mb-6">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <li key={item.name}>
                                        <Link
                                            to={item.href}
                                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-meta-4 ${active ? 'bg-gray-100 dark:bg-meta-4' : ''
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="menu-item-text">{item.name}</span>
                                            {item.badge && (
                                                <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;