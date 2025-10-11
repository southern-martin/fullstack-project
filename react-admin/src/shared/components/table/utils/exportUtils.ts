import { TableColumn } from '../types';

export interface ExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  customFields?: string[];
  dateFormat?: string;
  numberFormat?: string;
}

export interface ExportData {
  [key: string]: any;
}

// CSV Export
export const exportToCSV = (
  data: ExportData[],
  columns: TableColumn[],
  options: ExportOptions = {}
): void => {
  const {
    filename = 'export.csv',
    includeHeaders = true,
    customFields,
    dateFormat = 'YYYY-MM-DD',
  } = options;

  // Filter columns if custom fields specified
  const exportColumns = customFields
    ? columns.filter(col => customFields.includes(String(col.key)))
    : columns;

  // Create CSV content
  let csvContent = '';

  // Add headers
  if (includeHeaders) {
    const headers = exportColumns.map(col => `"${col.label}"`).join(',');
    csvContent += headers + '\n';
  }

  // Add data rows
  data.forEach(row => {
    const values = exportColumns.map(col => {
      const value = row[String(col.key)];
      return formatValueForCSV(value, dateFormat);
    });
    csvContent += values.join(',') + '\n';
  });

  // Download file
  downloadFile(csvContent, filename, 'text/csv');
};

// Excel Export (using CSV format for simplicity)
export const exportToExcel = (
  data: ExportData[],
  columns: TableColumn[],
  options: ExportOptions = {}
): void => {
  const {
    filename = 'export.xlsx',
    includeHeaders = true,
    customFields,
    dateFormat = 'YYYY-MM-DD',
  } = options;

  // For now, we'll use CSV format with .xlsx extension
  // In a real implementation, you'd use a library like xlsx
  exportToCSV(data, columns, {
    ...options,
    filename: filename.replace('.xlsx', '.csv'),
  });
};

// PDF Export (basic implementation)
export const exportToPDF = (
  data: ExportData[],
  columns: TableColumn[],
  options: ExportOptions = {}
): void => {
  const {
    filename = 'export.pdf',
    includeHeaders = true,
    customFields,
    dateFormat = 'YYYY-MM-DD',
  } = options;

  // Filter columns if custom fields specified
  const exportColumns = customFields
    ? columns.filter(col => customFields.includes(String(col.key)))
    : columns;

  // Create HTML table for PDF
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
      </style>
    </head>
    <body>
      <h1>Data Export</h1>
      <table>
  `;

  // Add headers
  if (includeHeaders) {
    htmlContent += '<thead><tr>';
    exportColumns.forEach(col => {
      htmlContent += `<th>${col.label}</th>`;
    });
    htmlContent += '</tr></thead>';
  }

  // Add data rows
  htmlContent += '<tbody>';
  data.forEach(row => {
    htmlContent += '<tr>';
    exportColumns.forEach(col => {
      const value = row[String(col.key)];
      htmlContent += `<td>${formatValueForHTML(value, dateFormat)}</td>`;
    });
    htmlContent += '</tr>';
  });
  htmlContent += '</tbody></table></body></html>';

  // For now, we'll open in new window for printing
  // In a real implementation, you'd use a library like jsPDF or html2pdf
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(htmlContent);
    newWindow.document.close();
    newWindow.print();
  }
};

// Utility function to format values for CSV
const formatValueForCSV = (value: any, dateFormat: string): string => {
  if (value === null || value === undefined) {
    return '""';
  }

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return `"${value
        .map(item =>
          typeof item === 'object'
            ? item.name || item.label || JSON.stringify(item)
            : String(item)
        )
        .join(', ')}"`;
    }
    return `"${value.name || value.label || JSON.stringify(value)}"`;
  }

  if (value instanceof Date) {
    return `"${formatDate(value, dateFormat)}"`;
  }

  if (
    typeof value === 'string' &&
    (value.includes(',') || value.includes('"') || value.includes('\n'))
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return `"${String(value)}"`;
};

// Utility function to format values for HTML
const formatValueForHTML = (value: any, dateFormat: string): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value
        .map(item =>
          typeof item === 'object'
            ? item.name || item.label || JSON.stringify(item)
            : String(item)
        )
        .join(', ');
    }
    return value.name || value.label || JSON.stringify(value);
  }

  if (value instanceof Date) {
    return formatDate(value, dateFormat);
  }

  return String(value);
};

// Utility function to format dates
const formatDate = (date: Date, format: string): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    default:
      return date.toLocaleDateString();
  }
};

// Utility function to download file
const downloadFile = (
  content: string,
  filename: string,
  mimeType: string
): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

// Export all formats
export const exportData = (
  data: ExportData[],
  columns: TableColumn[],
  format: 'csv' | 'excel' | 'pdf',
  options: ExportOptions = {}
): void => {
  switch (format) {
    case 'csv':
      exportToCSV(data, columns, options);
      break;
    case 'excel':
      exportToExcel(data, columns, options);
      break;
    case 'pdf':
      exportToPDF(data, columns, options);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};
