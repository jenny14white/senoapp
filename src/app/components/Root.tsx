import { Outlet } from 'react-router';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { AppProvider } from '../contexts/AppContext';
import { ExtendedAppProvider } from '../contexts/ExtendedAppContext';
import { ViewProvider } from '../contexts/ViewContext';
import { TutorialProvider } from '../contexts/TutorialContext';
import { NotesProvider } from '../contexts/NotesContext';
import { Toaster } from './ui/sonner';
import { ErrorBoundary } from './ErrorBoundary';

export function Root() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <ExtendedAppProvider>
              <ViewProvider>
                <TutorialProvider>
                  <NotesProvider>
                    <Outlet />
                    <Toaster position="top-center" richColors />
                  </NotesProvider>
                </TutorialProvider>
              </ViewProvider>
            </ExtendedAppProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}