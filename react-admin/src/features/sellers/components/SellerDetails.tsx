import React from 'react';
import { useSellerLabels } from '../hooks/useSellerLabels';
import type { Seller } from '../config/seller.types';

interface SellerDetailsProps {
  seller: Seller;
  onClose: () => void;
}

/**
 * Seller Details Component
 * 
 * Displays complete seller information in a read-only view.
 */
const SellerDetails: React.FC<SellerDetailsProps> = ({ seller }) => {
  const { L } = useSellerLabels();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        {title}
      </h3>
      {children}
    </div>
  );

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex py-2">
      <dt className="w-1/3 text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="w-2/3 text-sm text-gray-900 dark:text-white">{value || '-'}</dd>
    </div>
  );

  return (
    <div className="max-h-[70vh] overflow-y-auto px-1">
      {/* Business Information */}
      <DetailSection title={L.details?.businessInfo || 'Business Information'}>
        <dl className="divide-y divide-gray-100 dark:divide-gray-800">
          <DetailRow label={L.form?.businessName || 'Business Name'} value={seller.businessName} />
          <DetailRow 
            label={L.form?.businessType || 'Business Type'} 
            value={L.businessType?.[seller.businessType as keyof typeof L.businessType] || seller.businessType}
          />
          <DetailRow label={L.form?.taxId || 'Tax ID'} value={seller.taxId} />
          <DetailRow label={L.form?.businessEmail || 'Business Email'} value={seller.businessEmail} />
          <DetailRow label={L.form?.businessPhone || 'Business Phone'} value={seller.businessPhone} />
          <DetailRow label={L.form?.website || 'Website'} value={
            seller.website ? (
              <a href={seller.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                {seller.website}
              </a>
            ) : '-'
          } />
        </dl>
      </DetailSection>

      {/* Business Address */}
      <DetailSection title="Business Address">
        <dl className="divide-y divide-gray-100 dark:divide-gray-800">
          <DetailRow label={L.details?.address || 'Street Address'} value={seller.businessAddress} />
          <DetailRow label={L.details?.city || 'City'} value={seller.businessCity} />
          <DetailRow label={L.details?.state || 'State/Province'} value={seller.businessState} />
          <DetailRow label={L.details?.country || 'Country'} value={seller.businessCountry} />
          <DetailRow label={L.details?.postalCode || 'Postal Code'} value={seller.businessPostalCode} />
        </dl>
      </DetailSection>

      {/* Status Information */}
      <DetailSection title="Status Information">
        <dl className="divide-y divide-gray-100 dark:divide-gray-800">
          <DetailRow 
            label="Status" 
            value={
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                seller.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                seller.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                seller.status === 'suspended' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {L.status?.[seller.status as keyof typeof L.status] || seller.status}
              </span>
            }
          />
          <DetailRow 
            label="Verification Status" 
            value={
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                seller.verificationStatus === 'verified' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                seller.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                seller.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {L.verificationStatus?.[seller.verificationStatus as keyof typeof L.verificationStatus] || seller.verificationStatus}
              </span>
            }
          />
          <DetailRow label={L.details?.verifiedAt || 'Verified At'} value={formatDate(seller.verifiedAt)} />
          <DetailRow label={L.details?.verificationNotes || 'Verification Notes'} value={seller.verificationNotes} />
          {seller.verificationStatus === 'rejected' && (
            <>
              <DetailRow label="Rejected At" value={formatDate(seller.rejectedAt)} />
              <DetailRow label={L.details?.rejectionReason || 'Rejection Reason'} value={seller.rejectionReason} />
            </>
          )}
        </dl>
      </DetailSection>

      {/* Performance Metrics */}
      <DetailSection title={L.details?.performanceMetrics || 'Performance Metrics'}>
        <dl className="divide-y divide-gray-100 dark:divide-gray-800">
          <DetailRow 
            label={L.details?.rating || 'Rating'} 
            value={
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">⭐</span>
                <span>{seller.rating != null ? Number(seller.rating).toFixed(1) : '0.0'}</span>
              </div>
            }
          />
          <DetailRow 
            label={L.details?.totalSales || 'Total Sales'} 
            value={seller.totalSales != null ? Number(seller.totalSales).toLocaleString() : '0'}
          />
          <DetailRow 
            label={L.details?.totalRevenue || 'Total Revenue'} 
            value={seller.totalRevenue != null ? `$${Number(seller.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}
          />
          <DetailRow 
            label={L.details?.totalProducts || 'Total Products'} 
            value={seller.totalProducts || 0}
          />
          <DetailRow 
            label={L.details?.successfulOrders || 'Successful Orders'} 
            value={seller.successfulOrders || 0}
          />
          <DetailRow 
            label={L.details?.cancelledOrders || 'Cancelled Orders'} 
            value={seller.cancelledOrders || 0}
          />
        </dl>
      </DetailSection>

      {/* Compliance Information */}
      <DetailSection title={L.details?.compliance || 'Compliance'}>
        <dl className="divide-y divide-gray-100 dark:divide-gray-800">
          <DetailRow 
            label={L.details?.documentsUploaded || 'Documents Uploaded'} 
            value={
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                seller.documentsUploaded 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {seller.documentsUploaded ? 'Yes' : 'No'}
              </span>
            }
          />
          <DetailRow 
            label={L.details?.backgroundCheck || 'Background Check'} 
            value={
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                seller.backgroundCheckCompleted 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {seller.backgroundCheckCompleted ? 'Completed' : 'Pending'}
              </span>
            }
          />
          <DetailRow 
            label={L.details?.agreementSigned || 'Agreement Signed'} 
            value={
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                seller.agreementSigned 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {seller.agreementSigned ? 'Yes' : 'No'}
              </span>
            }
          />
          {seller.agreementSigned && (
            <DetailRow label="Agreement Signed At" value={formatDate(seller.agreementSignedAt)} />
          )}
        </dl>
      </DetailSection>

      {/* Description */}
      {seller.description && (
        <DetailSection title={L.details?.description || 'Description'}>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {seller.description}
          </p>
        </DetailSection>
      )}

      {/* Timestamps */}
      <DetailSection title="Timestamps">
        <dl className="divide-y divide-gray-100 dark:divide-gray-800">
          <DetailRow label={L.details?.created || 'Created At'} value={formatDate(seller.createdAt)} />
          <DetailRow label={L.details?.lastUpdated || 'Updated At'} value={formatDate(seller.updatedAt)} />
        </dl>
      </DetailSection>
    </div>
  );
};

export default SellerDetails;
