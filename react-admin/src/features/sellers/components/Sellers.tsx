import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useSellerLabels } from '../hooks/useSellerLabels';
import { sellerApiClient } from '../services/sellerApiClient';
import type { Seller } from '../config/seller.types';

/**
 * Sellers List Component
 * 
 * Main page for viewing and managing sellers.
 * Provides CRUD operations and verification workflows.
 */
const Sellers: React.FC = () => {
  const { L, isLoading: labelsLoading } = useSellerLabels();
  
  // State
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Load sellers
  const loadSellers = async () => {
    try {
      setLoading(true);
      const response = await sellerApiClient.getSellers({
        page: currentPage,
        limit: pageSize,
      });
      
      // Backend returns { sellers, total } not { items, total }
      setSellers(response.sellers || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Failed to load sellers:', error);
      toast.error('Failed to load sellers');
      setSellers([]); // Set empty array on error
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  React.useEffect(() => {
    loadSellers();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  if (labelsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {L.page.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {L.page.subtitle}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => toast('Create seller feature coming soon')}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          {L.buttons.createSeller}
        </Button>
      </div>

      {/* Sellers Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {L.table.businessName}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {L.table.businessType}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {L.table.status}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {L.table.verificationStatus}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {L.table.rating}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {L.table.totalSales}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {L.table.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : sellers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {L.table.emptyMessage}
                  </td>
                </tr>
              ) : (
                sellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {seller.businessName}
                      </div>
                      {seller.businessEmail && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {seller.businessEmail}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {L.businessType[seller.businessType as keyof typeof L.businessType]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        seller.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        seller.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        seller.status === 'suspended' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {L.status[seller.status as keyof typeof L.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        seller.verificationStatus === 'verified' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        seller.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        seller.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {L.verificationStatus[seller.verificationStatus as keyof typeof L.verificationStatus]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ⭐ {seller.rating != null ? Number(seller.rating).toFixed(1) : '0.0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {seller.totalSales != null ? Number(seller.totalSales).toLocaleString() : '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toast(`View seller #${seller.id}`)}
                      >
                        {L.actions.viewDetails}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        {total > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, total)} of {total} sellers
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage * pageSize >= total}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Sellers;
