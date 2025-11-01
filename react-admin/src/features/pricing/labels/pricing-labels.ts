/**
 * Pricing Module Translation Labels
 * 
 * This file contains all static UI labels used in the Pricing module.
 * Labels are organized by category for better maintainability.
 * 
 * Usage with usePricingLabels hook:
 * const { L } = usePricingLabels();
 * <h1>{L.page.title}</h1>
 */

export interface PricingLabels {
  // Page Header
  page: {
    title: string;
    subtitle: string;
  };

  // Table Headers & Display
  table: {
    carrier: string;
    zone: string;
    baseRate: string;
    perKgRate: string;
    minWeight: string;
    maxWeight: string;
    effectiveDate: string;
    expiryDate: string;
    status: string;
    actions: string;
    emptyMessage: string;
  };

  // Buttons & Actions
  buttons: {
    create: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    calculate: string;
    bulkUpdate: string;
    refresh: string;
    exportCsv: string;
  };

  // Toast Messages
  messages: {
    createSuccess: string;
    createError: string;
    updateSuccess: string;
    updateError: string;
    deleteSuccess: string;
    deleteError: string;
    calculateSuccess: string;
    calculateError: string;
    loadError: string;
  };

  // Search & Filters
  search: {
    placeholder: string;
  };

  // Status Values
  status: {
    active: string;
    inactive: string;
    expired: string;
  };

  // Form Fields
  form: {
    carrier: string;
    zone: string;
    baseRate: string;
    perKgRate: string;
    minWeight: string;
    maxWeight: string;
    effectiveDate: string;
    expiryDate: string;
    status: string;
  };

  // Placeholders
  placeholders: {
    selectCarrier: string;
    enterZone: string;
    enterBaseRate: string;
    enterPerKgRate: string;
    enterMinWeight: string;
    enterMaxWeight: string;
  };
}

/**
 * Default English labels for the Pricing module
 */
export const pricingLabels: PricingLabels = {
  page: {
    title: 'Pricing Management',
    subtitle: 'Manage carrier pricing zones and rates',
  },
  
  table: {
    carrier: 'Carrier',
    zone: 'Zone',
    baseRate: 'Base Rate',
    perKgRate: 'Per Kg Rate',
    minWeight: 'Min Weight (kg)',
    maxWeight: 'Max Weight (kg)',
    effectiveDate: 'Effective Date',
    expiryDate: 'Expiry Date',
    status: 'Status',
    actions: 'Actions',
    emptyMessage: 'No pricing rules available',
  },
  
  buttons: {
    create: 'Add Pricing Rule',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    calculate: 'Calculate',
    bulkUpdate: 'Bulk Update',
    refresh: 'Refresh',
    exportCsv: 'Export CSV',
  },
  
  messages: {
    createSuccess: 'Pricing rule created successfully',
    createError: 'Failed to create pricing rule',
    updateSuccess: 'Pricing rule updated successfully',
    updateError: 'Failed to update pricing rule',
    deleteSuccess: 'Pricing rule deleted successfully',
    deleteError: 'Failed to delete pricing rule',
    calculateSuccess: 'Price calculated successfully',
    calculateError: 'Failed to calculate price',
    loadError: 'Failed to load pricing rules',
  },
  
  search: {
    placeholder: 'Search by carrier, zone...',
  },
  
  status: {
    active: 'Active',
    inactive: 'Inactive',
    expired: 'Expired',
  },
  
  form: {
    carrier: 'Carrier',
    zone: 'Zone',
    baseRate: 'Base Rate ($)',
    perKgRate: 'Rate per Kg ($)',
    minWeight: 'Minimum Weight (kg)',
    maxWeight: 'Maximum Weight (kg)',
    effectiveDate: 'Effective Date',
    expiryDate: 'Expiry Date',
    status: 'Status',
  },
  
  placeholders: {
    selectCarrier: 'Select a carrier',
    enterZone: 'Enter zone (e.g., Zone A)',
    enterBaseRate: 'Enter base rate',
    enterPerKgRate: 'Enter per kg rate',
    enterMinWeight: 'Enter minimum weight',
    enterMaxWeight: 'Enter maximum weight',
  },
};
