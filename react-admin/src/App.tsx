import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './app/providers/AuthProvider';
import { LanguageProvider } from './app/providers/LanguageProvider';
import { QueryProvider } from './app/providers/QueryProvider';
import { ThemeProvider } from './app/providers/ThemeProvider';
import AppRoutes from './app/routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <AppRoutes />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    icon: '✅',
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    icon: '❌',
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryProvider>
    </BrowserRouter>
  );
}

export default App;