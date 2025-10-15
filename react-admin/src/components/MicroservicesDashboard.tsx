import { Calculator, DollarSign, Globe, Package, RefreshCw, Truck, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { carrierService } from '../features/carriers/services/carrierService';
import { customerService } from '../features/customers/services/customerService';
import { pricingService } from '../features/pricing/services/pricingService';
import { translationService } from '../features/translations/services/translationService';
import { userService } from '../features/users/services/userService';
import MicroservicesStatus from './MicroservicesStatus';
import { Button } from './ui/button';

interface ServiceStats {
    users: { count: number };
    customers: { count: number };
    carriers: { count: number };
    pricingRules: { count: number };
    priceCalculations: { count: number };
    languages: { count: number };
    translations: { count: number };
}

const MicroservicesDashboard: React.FC = () => {
    const [stats, setStats] = useState<ServiceStats>({
        users: { count: 0 },
        customers: { count: 0 },
        carriers: { count: 0 },
        pricingRules: { count: 0 },
        priceCalculations: { count: 0 },
        languages: { count: 0 },
        translations: { count: 0 },
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAllStats = async () => {
        try {
            const [
                usersCount,
                customersCount,
                carriersCount,
                pricingRulesCount,
                priceCalculationsCount,
                languagesCount,
                translationsCount,
            ] = await Promise.allSettled([
                userService.getUserCount(),
                customerService.getCustomerCount(),
                carrierService.getCarrierCount(),
                pricingService.getPricingRuleCount(),
                pricingService.getPriceCalculationCount(),
                translationService.getLanguageCount(),
                translationService.getTranslationCount(),
            ]);

            setStats({
                users: usersCount.status === 'fulfilled' ? usersCount.value : { count: 0 },
                customers: customersCount.status === 'fulfilled' ? customersCount.value : { count: 0 },
                carriers: carriersCount.status === 'fulfilled' ? carriersCount.value : { count: 0 },
                pricingRules: pricingRulesCount.status === 'fulfilled' ? pricingRulesCount.value : { count: 0 },
                priceCalculations: priceCalculationsCount.status === 'fulfilled' ? priceCalculationsCount.value : { count: 0 },
                languages: languagesCount.status === 'fulfilled' ? languagesCount.value : { count: 0 },
                translations: translationsCount.status === 'fulfilled' ? translationsCount.value : { count: 0 },
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchAllStats();
    };

    useEffect(() => {
        fetchAllStats();
    }, []);

    const statCards = [
        {
            title: 'Users',
            value: stats.users.count,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Customers',
            value: stats.customers.count,
            icon: Package,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Carriers',
            value: stats.carriers.count,
            icon: Truck,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
        {
            title: 'Pricing Rules',
            value: stats.pricingRules.count,
            icon: Calculator,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            title: 'Price Calculations',
            value: stats.priceCalculations.count,
            icon: DollarSign,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-100',
        },
        {
            title: 'Languages',
            value: stats.languages.count,
            icon: Globe,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-100',
        },
        {
            title: 'Translations',
            value: stats.translations.count,
            icon: Globe,
            color: 'text-cyan-600',
            bgColor: 'bg-cyan-100',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Microservices Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of all microservices and their data
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh All
                </Button>
            </div>

            {/* Service Status */}
            <MicroservicesStatus />

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{stat.title}</h3>
                                        <p className="text-sm text-gray-500">Total {stat.title.toLowerCase()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                {isLoading ? '...' : (stat.value || 0).toLocaleString()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors duration-200">
                            <Users className="h-6 w-6 mb-2 text-blue-600" />
                            <span className="text-gray-700">Manage Users</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-green-50 hover:border-green-200 transition-colors duration-200">
                            <Package className="h-6 w-6 mb-2 text-green-600" />
                            <span className="text-gray-700">Manage Customers</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-purple-50 hover:border-purple-200 transition-colors duration-200">
                            <Truck className="h-6 w-6 mb-2 text-purple-600" />
                            <span className="text-gray-700">Manage Carriers</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-orange-50 hover:border-orange-200 transition-colors duration-200">
                            <Calculator className="h-6 w-6 mb-2 text-orange-600" />
                            <span className="text-gray-700">Manage Pricing</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-teal-50 hover:border-teal-200 transition-colors duration-200">
                            <Globe className="h-6 w-6 mb-2 text-teal-600" />
                            <span className="text-gray-700">Manage Translations</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition-colors duration-200">
                            <DollarSign className="h-6 w-6 mb-2 text-indigo-600" />
                            <span className="text-gray-700">Calculate Price</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MicroservicesDashboard;







