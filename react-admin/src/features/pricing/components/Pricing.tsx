import React, { useState, useEffect, useCallback } from 'react';
import { usePricingLabels } from '../hooks/usePricingLabels';
import { pricingApiClient } from '../services/pricingApiClient';
import { toast } from 'react-hot-toast';

interface PricingRule {
  id: number;
  carrierId: number;
  carrierName?: string;
  zone: string;
  baseRate: number;
  perKgRate: number;
  minWeight: number;
  maxWeight: number;
  effectiveDate: string;
  expiryDate?: string;
  status: string;
}

interface PricingResponse {
  pricingRules?: PricingRule[];
  items?: PricingRule[];
  total: number;
}

const Pricing: React.FC = () => {
  const { L, isLoading: labelsLoading } = usePricingLabels();
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const loadPricingRules = useCallback(async () => {
    try {
      setLoading(true);
      const response: PricingResponse = await pricingApiClient.getPricingRules({
        page,
        limit,
        search: searchTerm || undefined,
      });
      
      // Handle different response formats
      const rules = response.pricingRules || response.items || [];
      setPricingRules(rules);
      setTotal(response.total || 0);
    } catch (error: any) {
      console.error('Error loading pricing rules:', error);
      if (!labelsLoading) {
        toast.error(L.messages.loadError);
      }
      setPricingRules([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, labelsLoading, L.messages.loadError]);

  useEffect(() => {
    loadPricingRules();
  }, [loadPricingRules]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this pricing rule?')) {
      return;
    }

    try {
      await pricingApiClient.deletePricingRule(id);
      toast.success(L.messages.deleteSuccess);
      loadPricingRules();
    } catch (error) {
      console.error('Error deleting pricing rule:', error);
      toast.error(L.messages.deleteError);
    }
  };

  const handleRefresh = () => {
    loadPricingRules();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${Number(amount).toFixed(2)}`;
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    let badgeClass = 'badge badge-secondary';
    let statusText = L.status.inactive;

    if (statusLower === 'active') {
      badgeClass = 'badge badge-success';
      statusText = L.status.active;
    } else if (statusLower === 'expired') {
      badgeClass = 'badge badge-warning';
      statusText = L.status.expired;
    }

    return <span className={badgeClass}>{statusText}</span>;
  };

  if (labelsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-module p-6">
      {/* Page Header */}
      <div className="page-header mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{L.page.title}</h1>
        <p className="text-gray-600 mt-2">{L.page.subtitle}</p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar flex justify-between items-center mb-4">
        <div className="search-box flex-1 max-w-md">
          <input
            type="text"
            className="form-control w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={L.search.placeholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        
        <div className="action-buttons flex gap-2 ml-4">
          <button
            className="btn btn-outline-secondary flex items-center gap-2"
            onClick={handleRefresh}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise"></i>
            {L.buttons.refresh}
          </button>
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={() => toast('Create form coming soon')}
          >
            <i className="bi bi-plus-lg"></i>
            {L.buttons.create}
          </button>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="pricing-table bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {L.table.carrier}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {L.table.zone}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {L.table.baseRate}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {L.table.perKgRate}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {L.table.minWeight} / {L.table.maxWeight}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {L.table.effectiveDate}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {L.table.status}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {L.table.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pricingRules.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <i className="bi bi-inbox text-4xl text-gray-300"></i>
                          <p>{L.table.emptyMessage}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    pricingRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {rule.carrierName || `Carrier #${rule.carrierId}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{rule.zone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {formatCurrency(rule.baseRate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(rule.perKgRate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {rule.minWeight} - {rule.maxWeight} kg
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(rule.effectiveDate)}
                          </div>
                          {rule.expiryDate && (
                            <div className="text-xs text-gray-500">
                              Until: {formatDate(rule.expiryDate)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(rule.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => toast('View details coming soon')}
                              title={L.buttons.view}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              className="text-yellow-600 hover:text-yellow-900"
                              onClick={() => toast('Edit form coming soon')}
                              title={L.buttons.edit}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDelete(rule.id)}
                              title={L.buttons.delete}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > limit && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm">
                    Page {page} of {Math.ceil(total / limit)}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setPage(Math.min(Math.ceil(total / limit), page + 1))}
                    disabled={page >= Math.ceil(total / limit)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Pricing;