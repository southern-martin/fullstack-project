import { AlertCircle, CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { authService } from '../features/auth/services/authService';
import { carrierService } from '../features/carriers/services/carrierService';
import { customerService } from '../features/customers/services/customerService';
import { pricingService } from '../features/pricing/services/pricingService';
import { translationService } from '../features/translations/services/translationService';
import { userService } from '../features/users/services/userService';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface ServiceStatus {
    name: string;
    port: number;
    status: 'healthy' | 'unhealthy' | 'checking';
    lastChecked: Date;
    responseTime?: number;
}

const MicroservicesStatus: React.FC = () => {
    const [services, setServices] = useState<ServiceStatus[]>([
        { name: 'Auth Service', port: 3001, status: 'checking', lastChecked: new Date() },
        { name: 'User Service', port: 3003, status: 'checking', lastChecked: new Date() },
        { name: 'Customer Service', port: 3004, status: 'checking', lastChecked: new Date() },
        { name: 'Carrier Service', port: 3005, status: 'checking', lastChecked: new Date() },
        { name: 'Pricing Service', port: 3006, status: 'checking', lastChecked: new Date() },
        { name: 'Translation Service', port: 3007, status: 'checking', lastChecked: new Date() },
    ]);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const checkServiceHealth = async (serviceName: string, healthCheckFn: () => Promise<boolean>) => {
        const startTime = Date.now();
        try {
            const isHealthy = await healthCheckFn();
            const responseTime = Date.now() - startTime;

            setServices(prev => prev.map(service =>
                service.name === serviceName
                    ? {
                        ...service,
                        status: isHealthy ? 'healthy' : 'unhealthy',
                        lastChecked: new Date(),
                        responseTime
                    }
                    : service
            ));
        } catch (error) {
            const responseTime = Date.now() - startTime;
            setServices(prev => prev.map(service =>
                service.name === serviceName
                    ? {
                        ...service,
                        status: 'unhealthy',
                        lastChecked: new Date(),
                        responseTime
                    }
                    : service
            ));
        }
    };

    const checkAllServices = async () => {
        setIsRefreshing(true);

        const healthChecks = [
            { name: 'Auth Service', fn: () => authService.healthCheck() },
            { name: 'User Service', fn: () => userService.healthCheck() },
            { name: 'Customer Service', fn: () => customerService.healthCheck() },
            { name: 'Carrier Service', fn: () => carrierService.healthCheck() },
            { name: 'Pricing Service', fn: () => pricingService.healthCheck() },
            { name: 'Translation Service', fn: () => translationService.healthCheck() },
        ];

        await Promise.all(
            healthChecks.map(({ name, fn }) => checkServiceHealth(name, fn))
        );

        setIsRefreshing(false);
    };

    useEffect(() => {
        checkAllServices();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'unhealthy':
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'healthy':
                return <Badge variant="default" className="bg-green-500">Healthy</Badge>;
            case 'unhealthy':
                return <Badge variant="destructive">Unhealthy</Badge>;
            default:
                return <Badge variant="secondary">Checking...</Badge>;
        }
    };

    const healthyCount = services.filter(s => s.status === 'healthy').length;
    const totalCount = services.length;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-row items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Microservices Status</h2>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={checkAllServices}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>
            <div className="p-6">
                <div className="mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Status:</span>
                        <Badge variant={healthyCount === totalCount ? "default" : "destructive"}>
                            {healthyCount}/{totalCount} Services Healthy
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service) => (
                        <div key={service.name} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-700 dark:border-gray-600">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {getStatusIcon(service.status)}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{service.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Port {service.port}</p>
                                    </div>
                                </div>
                                {getStatusBadge(service.status)}
                            </div>

                            {service.responseTime && (
                                <div className="mt-2 text-xs text-gray-500">
                                    Response: {service.responseTime}ms
                                </div>
                            )}

                            <div className="mt-2 text-xs text-gray-500">
                                Last checked: {service.lastChecked.toLocaleTimeString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MicroservicesStatus;







