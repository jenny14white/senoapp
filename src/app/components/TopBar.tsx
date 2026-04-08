import { useView } from '../contexts/ViewContext';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export function TopBar() {
  const { viewMode, setViewMode, isPartnerConnected } = useView();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're not on the main dashboard
  const showBackButton = location.pathname !== '/' && location.pathname !== '/dashboard';

  return (
    <div className="px-4 pt-4 pb-2 flex items-center gap-3">
      {showBackButton && (
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full backdrop-blur-xl border border-gray-200/20 dark:border-white/10 flex items-center justify-center hover:scale-105 transition-transform"
          style={{ backgroundColor: 'var(--color-card-bg)' }}
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      )}
      
      {isPartnerConnected && (
        <div 
          className="backdrop-blur-xl rounded-2xl p-1 border border-gray-200/20 dark:border-white/10 inline-flex"
          style={{ backgroundColor: 'var(--color-card-bg)' }}
        >
          <button
            onClick={() => setViewMode('own')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              viewMode === 'own'
                ? 'text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            style={viewMode === 'own' ? {
              background: `linear-gradient(to right, var(--color-accent), var(--color-primary))`
            } : {}}
          >
            Moje
          </button>
          <button
            onClick={() => setViewMode('partner')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              viewMode === 'partner'
                ? 'text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            style={viewMode === 'partner' ? {
              background: `linear-gradient(to right, var(--color-accent), var(--color-primary))`
            } : {}}
          >
            Partnera
          </button>
        </div>
      )}
    </div>
  );
}