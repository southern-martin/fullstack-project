/**
 * Seller Module Translation Labels
 * 
 * This file contains all static UI labels used in the Sellers module.
 * Labels are organized by category for better maintainability.
 * 
 * Usage with useSellerLabels hook:
 * const { L } = useSellerLabels();
 * <h1>{L.page.title}</h1>
 */

export interface SellerLabels {
  // Page Header
  page: {
    title: string;
    subtitle: string;
  };

  // Table Headers
  table: {
    businessName: string;
    email: string;
    businessType: string;
    status: string;
    verificationStatus: string;
    rating: string;
    totalSales: string;
    created: string;
    actions: string;
    emptyMessage: string;
  };

  // Buttons & Actions
  buttons: {
    createSeller: string;
    exportCsv: string;
    refresh: string;
    cancel: string;
    delete: string;
    save: string;
    verify: string;
    approve: string;
    reject: string;
    suspend: string;
    reactivate: string;
  };

  // Search & Filters
  search: {
    placeholder: string;
  };

  filters: {
    status: string;
    verificationStatus: string;
    businessType: string;
  };

  // Status Values
  status: {
    pending: string;
    active: string;
    suspended: string;
    rejected: string;
  };

  verificationStatus: {
    unverified: string;
    pending: string;
    verified: string;
    rejected: string;
  };

  businessType: {
    individual: string;
    soleProprietor: string;
    llc: string;
    corporation: string;
    partnership: string;
  };

  // Dropdown Actions
  actions: {
    viewDetails: string;
    editProfile: string;
    editBanking: string;
    viewAnalytics: string;
    verify: string;
    approve: string;
    reject: string;
    suspend: string;
    reactivate: string;
    delete: string;
  };

  // Modal Titles
  modals: {
    createSeller: string;
    editProfile: string;
    editBanking: string;
    deleteSeller: string;
    approveSeller: string;
    rejectSeller: string;
    suspendSeller: string;
    sellerDetails: string;
    analytics: string;
  };

  // Toast Messages
  messages: {
    createSuccess: string;
    createError: string;
    updateSuccess: string;
    updateError: string;
    deleteSuccess: string;
    deleteError: string;
    verifySuccess: string;
    verifyError: string;
    approveSuccess: string;
    approveError: string;
    rejectSuccess: string;
    rejectError: string;
    suspendSuccess: string;
    suspendError: string;
    reactivateSuccess: string;
    reactivateError: string;
  };

  // Seller Details View
  details: {
    businessInfo: string;
    profileInfo: string;
    bankingInfo: string;
    performanceMetrics: string;
    compliance: string;
    businessName: string;
    businessType: string;
    businessEmail: string;
    businessPhone: string;
    taxId: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    website: string;
    description: string;
    rating: string;
    totalSales: string;
    totalRevenue: string;
    totalProducts: string;
    successfulOrders: string;
    cancelledOrders: string;
    documentsUploaded: string;
    backgroundCheck: string;
    agreementSigned: string;
    verifiedAt: string;
    verificationNotes: string;
    rejectionReason: string;
    bankAccountNumber: string;
    bankRoutingNumber: string;
    bankAccountName: string;
    paymentTerms: string;
    created: string;
    lastUpdated: string;
  };

  // Form Fields
  form: {
    userId: string;
    businessName: string;
    businessType: string;
    businessEmail: string;
    businessPhone: string;
    taxId: string;
    businessAddress: string;
    businessCity: string;
    businessState: string;
    businessCountry: string;
    businessPostalCode: string;
    logoUrl: string;
    description: string;
    website: string;
    bankAccountNumber: string;
    bankRoutingNumber: string;
    bankAccountName: string;
    paymentTerms: string;
    verificationNotes: string;
    rejectionReason: string;
  };

  // Form Placeholders
  placeholders: {
    businessName: string;
    businessEmail: string;
    businessPhone: string;
    taxId: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    website: string;
    description: string;
    verificationNotes: string;
    rejectionReason: string;
  };

  // Analytics
  analytics: {
    overview: string;
    salesTrend: string;
    topProducts: string;
    revenue: string;
    averageOrderValue: string;
    conversionRate: string;
    reviewCount: string;
    activeProducts: string;
  };
}

/**
 * Default English labels for the Seller module
 */
export const sellerLabels: SellerLabels = {
  page: {
    title: 'Sellers',
    subtitle: 'Manage seller accounts and verification',
  },

  table: {
    businessName: 'Business Name',
    email: 'Email',
    businessType: 'Type',
    status: 'Status',
    verificationStatus: 'Verification',
    rating: 'Rating',
    totalSales: 'Total Sales',
    created: 'Created',
    actions: 'Actions',
    emptyMessage: 'No sellers found',
  },

  buttons: {
    createSeller: 'Create Seller',
    exportCsv: 'Export CSV',
    refresh: 'Refresh',
    cancel: 'Cancel',
    delete: 'Delete',
    save: 'Save',
    verify: 'Verify',
    approve: 'Approve',
    reject: 'Reject',
    suspend: 'Suspend',
    reactivate: 'Reactivate',
  },

  search: {
    placeholder: 'Search by business name or email...',
  },

  filters: {
    status: 'Status',
    verificationStatus: 'Verification Status',
    businessType: 'Business Type',
  },

  status: {
    pending: 'Pending',
    active: 'Active',
    suspended: 'Suspended',
    rejected: 'Rejected',
  },

  verificationStatus: {
    unverified: 'Unverified',
    pending: 'Pending',
    verified: 'Verified',
    rejected: 'Rejected',
  },

  businessType: {
    individual: 'Individual',
    soleProprietor: 'Sole Proprietor',
    llc: 'LLC',
    corporation: 'Corporation',
    partnership: 'Partnership',
  },

  actions: {
    viewDetails: 'View Details',
    editProfile: 'Edit Profile',
    editBanking: 'Edit Banking',
    viewAnalytics: 'View Analytics',
    verify: 'Verify',
    approve: 'Approve',
    reject: 'Reject',
    suspend: 'Suspend',
    reactivate: 'Reactivate',
    delete: 'Delete',
  },

  modals: {
    createSeller: 'Create New Seller',
    editProfile: 'Edit Seller Profile',
    editBanking: 'Edit Banking Information',
    deleteSeller: 'Delete Seller',
    approveSeller: 'Approve Seller',
    rejectSeller: 'Reject Seller',
    suspendSeller: 'Suspend Seller',
    sellerDetails: 'Seller Details',
    analytics: 'Seller Analytics',
  },

  messages: {
    createSuccess: 'Seller created successfully',
    createError: 'Failed to create seller',
    updateSuccess: 'Seller updated successfully',
    updateError: 'Failed to update seller',
    deleteSuccess: 'Seller deleted successfully',
    deleteError: 'Failed to delete seller',
    verifySuccess: 'Seller verified successfully',
    verifyError: 'Failed to verify seller',
    approveSuccess: 'Seller approved successfully',
    approveError: 'Failed to approve seller',
    rejectSuccess: 'Seller rejected successfully',
    rejectError: 'Failed to reject seller',
    suspendSuccess: 'Seller suspended successfully',
    suspendError: 'Failed to suspend seller',
    reactivateSuccess: 'Seller reactivated successfully',
    reactivateError: 'Failed to reactivate seller',
  },

  details: {
    businessInfo: 'Business Information',
    profileInfo: 'Profile Information',
    bankingInfo: 'Banking Information',
    performanceMetrics: 'Performance Metrics',
    compliance: 'Compliance',
    businessName: 'Business Name',
    businessType: 'Business Type',
    businessEmail: 'Business Email',
    businessPhone: 'Business Phone',
    taxId: 'Tax ID',
    address: 'Address',
    city: 'City',
    state: 'State',
    country: 'Country',
    postalCode: 'Postal Code',
    website: 'Website',
    description: 'Description',
    rating: 'Rating',
    totalSales: 'Total Sales',
    totalRevenue: 'Total Revenue',
    totalProducts: 'Total Products',
    successfulOrders: 'Successful Orders',
    cancelledOrders: 'Cancelled Orders',
    documentsUploaded: 'Documents Uploaded',
    backgroundCheck: 'Background Check',
    agreementSigned: 'Agreement Signed',
    verifiedAt: 'Verified At',
    verificationNotes: 'Verification Notes',
    rejectionReason: 'Rejection Reason',
    bankAccountNumber: 'Account Number',
    bankRoutingNumber: 'Routing Number',
    bankAccountName: 'Account Name',
    paymentTerms: 'Payment Terms',
    created: 'Created',
    lastUpdated: 'Last Updated',
  },

  form: {
    userId: 'User ID',
    businessName: 'Business Name',
    businessType: 'Business Type',
    businessEmail: 'Business Email',
    businessPhone: 'Business Phone',
    taxId: 'Tax ID',
    businessAddress: 'Business Address',
    businessCity: 'City',
    businessState: 'State',
    businessCountry: 'Country',
    businessPostalCode: 'Postal Code',
    logoUrl: 'Logo URL',
    description: 'Description',
    website: 'Website',
    bankAccountNumber: 'Bank Account Number',
    bankRoutingNumber: 'Bank Routing Number',
    bankAccountName: 'Account Holder Name',
    paymentTerms: 'Payment Terms',
    verificationNotes: 'Verification Notes',
    rejectionReason: 'Rejection Reason',
  },

  placeholders: {
    businessName: 'Enter business name',
    businessEmail: 'business@example.com',
    businessPhone: '+1 (555) 123-4567',
    taxId: 'XX-XXXXXXX',
    address: 'Enter street address',
    city: 'Enter city',
    state: 'Enter state/province',
    country: 'Enter country',
    postalCode: 'Enter postal code',
    website: 'https://www.example.com',
    description: 'Describe your business...',
    verificationNotes: 'Add notes about verification...',
    rejectionReason: 'Explain why this seller is being rejected...',
  },

  analytics: {
    overview: 'Overview',
    salesTrend: 'Sales Trend',
    topProducts: 'Top Products',
    revenue: 'Revenue',
    averageOrderValue: 'Avg Order Value',
    conversionRate: 'Conversion Rate',
    reviewCount: 'Reviews',
    activeProducts: 'Active Products',
  },
};
