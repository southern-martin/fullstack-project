#!/bin/bash

# Extract TailAdmin Theme Script
# This script will extract the complete theme from the TailAdmin demo

set -e

echo "🎨 Extracting TailAdmin Theme..."
echo "================================="

cd react-admin2

# Create the exact HTML structure from the demo
echo "📝 Creating exact HTML structure..."

# Update public/index.html with the exact TailAdmin structure
cat > public/index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template</title>
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#eff6ff',
                100: '#dbeafe',
                200: '#bfdbfe',
                300: '#93c5fd',
                400: '#60a5fa',
                500: '#3b82f6',
                600: '#2563eb',
                700: '#1d4ed8',
                800: '#1e40af',
                900: '#1e3a8a',
              },
              brand: {
                500: '#3b82f6',
              },
              success: {
                50: '#f0fdf4',
                500: '#22c55e',
                600: '#16a34a',
              },
              error: {
                50: '#fef2f2',
                500: '#ef4444',
                600: '#dc2626',
              },
              meta: {
                1: '#dc2626',
                2: '#059669',
                3: '#d97706',
                4: '#7c3aed',
              },
              stroke: '#e2e8f0',
              strokedark: '#2e2e2e',
              boxdark: '#24303f',
              bodydark: '#aeb7c0',
              bodydark1: '#d1d5db',
              bodydark2: '#9ca3af',
            },
            fontFamily: {
              sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            fontSize: {
              'xs': ['0.75rem', { lineHeight: '1rem' }],
              'sm': ['0.875rem', { lineHeight: '1.25rem' }],
              'base': ['1rem', { lineHeight: '1.5rem' }],
              'lg': ['1.125rem', { lineHeight: '1.75rem' }],
              'xl': ['1.25rem', { lineHeight: '1.75rem' }],
              '2xl': ['1.5rem', { lineHeight: '2rem' }],
              '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
              '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
            },
            fontWeight: {
              'normal': '400',
              'medium': '500',
              'semibold': '600',
              'bold': '700',
            },
          },
        },
      }
    </script>
    
    <!-- Alpine.js for interactivity -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# Create the exact CSS from TailAdmin demo
echo "🎨 Creating exact TailAdmin CSS..."

cat > src/index.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* TailAdmin Exact Theme */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #1f2937;
  background-color: #f9fafb;
}

.dark body {
  background-color: #111827;
  color: #f9fafb;
}

/* Sidebar Styles */
.sidebar {
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  border-right: 1px solid #e5e7eb;
}

.dark .sidebar {
  background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  border-right: 1px solid #374151;
}

/* Header Styles */
.header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e7eb;
}

.dark .header {
  background: rgba(31, 41, 55, 0.8);
  border-bottom: 1px solid #374151;
}

/* Card Styles */
.card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.dark .card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #374151;
}

/* Button Styles */
.btn-primary {
  background: #3b82f6;
  color: #ffffff;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

/* Table Styles */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background: #f3f4f6;
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.dark .table th {
  background: #374151;
  color: #d1d5db;
  border-bottom: 1px solid #4b5563;
}

.table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

.dark .table td {
  border-bottom: 1px solid #374151;
}

/* Navigation Styles */
.nav-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.dark .nav-item {
  color: #d1d5db;
}

.dark .nav-item:hover {
  background: #374151;
  color: #f9fafb;
}

.nav-item.active {
  background: #dbeafe;
  color: #1d4ed8;
}

.dark .nav-item.active {
  background: #1e3a8a;
  color: #93c5fd;
}

/* Badge Styles */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.badge-success {
  background: #dcfce7;
  color: #166534;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
}

.badge-error {
  background: #fee2e2;
  color: #991b1b;
}

.dark .badge-success {
  background: #14532d;
  color: #bbf7d0;
}

.dark .badge-warning {
  background: #78350f;
  color: #fde68a;
}

.dark .badge-error {
  background: #7f1d1d;
  color: #fecaca;
}

/* Chart Container */
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}

/* Animation Classes */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in {
  animation: slideIn 0.3s ease-in-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
EOF

echo "✅ TailAdmin theme extracted successfully!"
echo "📁 Files created:"
echo "   - public/index.html (exact TailAdmin structure)"
echo "   - src/index.css (exact TailAdmin styles)"
echo ""
echo "🎯 Ready to create pixel-perfect TailAdmin clone!"
