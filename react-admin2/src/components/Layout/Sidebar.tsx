import {
    CalendarIcon,
    ChatBubbleLeftRightIcon,
    ChevronRightIcon,
    CogIcon,
    DocumentTextIcon,
    HomeIcon,
    ShoppingBagIcon,
    TableCellsIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
    sidebarToggle: boolean;
    setSidebarToggle: (toggle: boolean) => void;
}

interface NavigationItem {
    name: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    badge?: string;
    children?: NavigationItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarToggle, setSidebarToggle }) => {
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['E-commerce']);

    const navigation: NavigationItem[] = [
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
            icon: ChatBubbleLeftRightIcon,
            badge: 'New',
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
                { name: 'Form Layouts', href: '/forms/layouts' },
                { name: 'Form Wizards', href: '/forms/wizards' },
                { name: 'Form Validation', href: '/forms/validation' },
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

    const toggleMenu = (menuName: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuName)
                ? prev.filter(name => name !== menuName)
                : [...prev, menuName]
        );
    };

    const isMenuExpanded = (menuName: string) => {
        return expandedMenus.includes(menuName);
    };

    return (
        <aside
            className={`sidebar fixed top-0 left-0 z-9999 flex h-screen w-[290px] flex-col overflow-y-auto border-r border-gray-200 bg-white px-5 transition-all duration-300 xl:static xl:translate-x-0 dark:border-gray-800 dark:bg-black ${sidebarToggle ? 'translate-x-0 xl:w-[90px]' : '-translate-x-full'
                }`}
        >
            {/* Sidebar Header */}
            <div
                className={`sidebar-header flex items-center gap-2 pt-8 pb-7 ${sidebarToggle ? 'justify-center' : 'justify-between'
                    }`}
            >
                <Link to="/">
                    <span className={`logo ${sidebarToggle ? 'hidden' : ''}`}>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">T</span>
                            </div>
                            {!sidebarToggle && (
                                <div>
                                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">TailAdmin</h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
                                </div>
                            )}
                        </div>
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav>
                    <div>
                        <h3 className="mb-3 text-xs uppercase leading-[16px] text-gray-400">
                            <span className="menu-group-title">MENU</span>
                        </h3>

                        <ul className="flex flex-col gap-3 mb-6">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                const hasChildren = item.children && item.children.length > 0;
                                const isExpanded = isMenuExpanded(item.name);

                                return (
                                    <li key={item.name}>
                                        {hasChildren ? (
                                            <div>
                                                <button
                                                    onClick={() => toggleMenu(item.name)}
                                                    className={`group relative flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-meta-4 ${active ? 'bg-gray-100 dark:bg-meta-4' : ''
                                                        }`}
                                                >
                                                    {Icon && <Icon className="w-5 h-5" />}
                                                    {!sidebarToggle && <span className="menu-item-text">{item.name}</span>}
                                                    {!sidebarToggle && item.badge && (
                                                        <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                    {!sidebarToggle && (
                                                        <ChevronRightIcon className={`w-4 h-4 ml-auto chevron-rotate ${isExpanded ? 'expanded' : ''}`} />
                                                    )}
                                                </button>
                                                {!sidebarToggle && isExpanded && (
                                                    <ul className="ml-5 mt-1 space-y-1 transition-all duration-200 ease-in-out">
                                                        {item.children?.map((child) => {
                                                            const childActive = isActive(child.href);
                                                            const hasNestedChildren = child.children && child.children.length > 0;
                                                            const isNestedExpanded = isMenuExpanded(child.name);

                                                            return (
                                                                <li key={child.name}>
                                                                    {hasNestedChildren ? (
                                                                        <div>
                                                                            <button
                                                                                onClick={() => toggleMenu(child.name)}
                                                                                className={`group relative flex w-full items-center gap-2.5 rounded-sm px-3 py-1.5 text-xs font-medium duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-meta-4 ${childActive ? 'bg-gray-100 dark:bg-meta-4' : ''
                                                                                    }`}
                                                                            >
                                                                                <span className="menu-item-text">{child.name}</span>
                                                                                {child.badge && (
                                                                                    <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                                                                        {child.badge}
                                                                                    </span>
                                                                                )}
                                                                                <ChevronRightIcon className={`w-3 h-3 ml-auto chevron-rotate ${isNestedExpanded ? 'expanded' : ''}`} />
                                                                            </button>
                                                                            {isNestedExpanded && (
                                                                                <ul className="ml-3 mt-1 space-y-1">
                                                                                    {child.children?.map((nestedChild) => {
                                                                                        const nestedActive = isActive(nestedChild.href);
                                                                                        return (
                                                                                            <li key={nestedChild.name}>
                                                                                                <Link
                                                                                                    to={nestedChild.href}
                                                                                                    className={`group relative flex items-center gap-2.5 rounded-sm px-3 py-1.5 text-xs font-medium duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-meta-4 ${nestedActive ? 'bg-gray-100 dark:bg-meta-4' : ''
                                                                                                        }`}
                                                                                                >
                                                                                                    <span className="menu-item-text">{nestedChild.name}</span>
                                                                                                    {nestedChild.badge && (
                                                                                                        <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                                                                                            {nestedChild.badge}
                                                                                                        </span>
                                                                                                    )}
                                                                                                </Link>
                                                                                            </li>
                                                                                        );
                                                                                    })}
                                                                                </ul>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <Link
                                                                            to={child.href}
                                                                            className={`group relative flex items-center gap-2.5 rounded-sm px-3 py-1.5 text-xs font-medium duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-meta-4 ${childActive ? 'bg-gray-100 dark:bg-meta-4' : ''
                                                                                }`}
                                                                        >
                                                                            <span className="menu-item-text">{child.name}</span>
                                                                            {child.badge && (
                                                                                <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                                                                    {child.badge}
                                                                                </span>
                                                                            )}
                                                                        </Link>
                                                                    )}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                to={item.href}
                                                className={`group relative flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-meta-4 ${active ? 'bg-gray-100 dark:bg-meta-4' : ''
                                                    }`}
                                            >
                                                {Icon && <Icon className="w-5 h-5" />}
                                                {!sidebarToggle && <span className="menu-item-text">{item.name}</span>}
                                                {!sidebarToggle && item.badge && (
                                                    <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        )}
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