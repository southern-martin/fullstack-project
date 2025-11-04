import React from 'react';
import { useSellerLabels } from '../hooks/useSellerLabels';
import type { Seller } from '../config';

interface SellerDetailsProps {
  seller: Seller;
  onClose: () => void;
}

export const SellerDetails: React.FC<SellerDetailsProps> = ({ seller, onClose }) => {
  const { L } = useSellerLabels();

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {L.modals.sellerDetails}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <strong className="text-gray-900 dark:text-gray-100">{L.details.businessName}:</strong>
          <span className="ml-2 text-gray-700 dark:text-gray-300">{seller.businessName}</span>
        </div>
        
        <div>
          <strong className="text-gray-900 dark:text-gray-100">{L.details.businessType}:</strong>
          <span className="ml-2 text-gray-700 dark:text-gray-300">{seller.businessType}</span>
        </div>
        
        <div>
          <strong className="text-gray-900 dark:text-gray-100">{L.details.businessEmail}:</strong>
          <span className="ml-2 text-gray-700 dark:text-gray-300">{seller.businessEmail}</span>
        </div>
        
        <div>
          <strong className="text-gray-900 dark:text-gray-100">{L.details.phone}:</strong>
          <span className="ml-2 text-gray-700 dark:text-gray-300">{seller.phone}</span>
        </div>
        
        <div>
          <strong className="text-gray-900 dark:text-gray-100">{L.details.address}:</strong>
          <span className="ml-2 text-gray-700 dark:text-gray-300">{seller.address}</span>
        </div>
        
        <div>
          <strong className="text-gray-900 dark:text-gray-100">{L.details.status}:</strong>
          <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
            seller.isActive 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {seller.isActive ? L.status.active : L.status.suspended}
          </span>
        </div>
      </div>
    </div>
  );
};
