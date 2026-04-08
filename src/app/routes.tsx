import { createBrowserRouter } from 'react-router-dom';
import { Root } from './components/Root';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Dashboard } from './screens/Dashboard';
import { Expenses } from './screens/Expenses';
import { Work } from './screens/Work';
import { Goals } from './screens/Goals';
import { Profile } from './screens/Profile';
import { Bills } from './screens/Bills';
import { Forecasts } from './screens/Forecasts';
import { Family } from './screens/Family';
import { Notes } from './screens/Notes';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { ForgotPassword } from './screens/ForgotPassword';

function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Coś poszło nie tak</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Wystąpił nieoczekiwany błąd.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
        >
          Powrót do strony głównej
        </button>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <ErrorFallback />,
    children: [
      {
        path: '/login',
        Component: Login,
      },
      {
        path: '/register',
        Component: Register,
      },
      {
        path: '/forgot-password',
        Component: ForgotPassword,
      },
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, Component: Dashboard },
          { path: 'dashboard', Component: Dashboard },
          { path: 'expenses', Component: Expenses },
          { path: 'work', Component: Work },
          { path: 'goals', Component: Goals },
          { path: 'profile', Component: Profile },
          { path: 'bills', Component: Forecasts },
          { path: 'forecasts', Component: Forecasts },
          { path: 'family', Component: Family },
          { path: 'notes', Component: Notes },
        ],
      },
    ],
  },
]);