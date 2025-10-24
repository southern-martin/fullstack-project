import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import MicroservicesDashboard from '../../components/MicroservicesDashboard';
import PriceCalculator from '../../components/PriceCalculator';
import Analytics from '../../features/analytics/components/Analytics';
import LoginForm from '../../features/auth/components/LoginForm';
import Carriers from '../../features/carriers/components/Carriers';
import Customers from '../../features/customers/components/Customers';
import Dashboard from '../../features/dashboard/components/Dashboard';
import { Roles, RoleDetails, RoleCreate, RoleEdit } from '../../features/roles';
import Settings from '../../features/settings/components/Settings';
import Translations from '../../features/translations/components/Translations';
import Users from '../../features/users/components/Users';
import Layout from '../../shared/components/layout/Layout';
import { useAuthContext } from '../providers/AuthProvider';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuthContext();

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />}
            />

            {/* Protected Routes with Layout */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="roles" element={<Roles />} />
                <Route path="roles/create" element={<RoleCreate />} />
                <Route path="roles/:id" element={<RoleDetails />} />
                <Route path="roles/:id/edit" element={<RoleEdit />} />
                <Route path="customers" element={<Customers />} />
                <Route path="carriers" element={<Carriers />} />
                <Route path="microservices" element={<MicroservicesDashboard />} />
                <Route path="pricing" element={<PriceCalculator />} />
                <Route path="translations" element={<Translations />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;






