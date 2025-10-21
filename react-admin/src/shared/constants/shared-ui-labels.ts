/**
 * Shared UI Components - Centralized Label Constants
 * 
 * This file contains all static UI text labels for shared components
 * like ServerSorting, ServerPagination, etc.
 * 
 * These labels are generic and reusable across all feature modules.
 * 
 * Labels will be translated using the MD5-based Translation Service.
 * 
 * @see docs/translation/STATIC-LABEL-TRANSLATION-IMPLEMENTATION-PLAN.md
 */

export interface SharedUILabels {
  // Sorting component labels
  sorting: {
    sortBy: string;
    sortByPlaceholder: string;
    sortAscending: string;
    sortDescending: string;
  };

  // Pagination component labels
  pagination: {
    showing: string;
    to: string;
    of: string;
    results: string;
    perPage: string;
    show: string;
    loading: string;
    previous: string;
    next: string;
    goToPage: string;
  };

  // Common actions
  actions: {
    close: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
    refresh: string;
    export: string;
  };

  // Common states
  states: {
    loading: string;
    saving: string;
    error: string;
    success: string;
    noData: string;
  };
}

/**
 * Default English labels
 * These serve as the base text that will be translated
 */
export const SHARED_UI_LABELS: SharedUILabels = {
  sorting: {
    sortBy: 'Sort by:',
    sortByPlaceholder: 'Sort by...',
    sortAscending: 'Sort ascending',
    sortDescending: 'Sort descending',
  },

  pagination: {
    showing: 'Showing',
    to: 'to',
    of: 'of',
    results: 'results',
    perPage: 'per page',
    show: 'Show:',
    loading: 'Loading...',
    previous: 'Previous page',
    next: 'Next page',
    goToPage: 'Go to page',
  },

  actions: {
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    refresh: 'Refresh',
    export: 'Export',
  },

  states: {
    loading: 'Loading...',
    saving: 'Saving...',
    error: 'Error',
    success: 'Success',
    noData: 'No data available',
  },
};

/**
 * Get all label texts as a flat array for batch translation
 * This is used by the translation hook to fetch all translations at once
 */
export const getAllLabelTexts = (labels: SharedUILabels): string[] => {
  const texts: string[] = [];

  // Helper to recursively extract all string values
  const extractStrings = (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        texts.push(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        extractStrings(obj[key]);
      }
    }
  };

  extractStrings(labels);
  return texts;
};

/**
 * Get label count for documentation and debugging
 */
export const getLabelCount = (labels: SharedUILabels): number => {
  return getAllLabelTexts(labels).length;
};
