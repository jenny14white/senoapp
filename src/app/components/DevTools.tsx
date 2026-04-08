import { useState } from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);

  const clearAllData = () => {
    if (confirm('Czy na pewno chcesz usunąć wszystkie dane? Ta operacja jest nieodwracalna.')) {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const clearAppData = () => {
    if (confirm('Czy na pewno chcesz usunąć dane aplikacji (zachowując konto użytkownika)?')) {
      localStorage.removeItem('finapp-data');
      localStorage.removeItem('finapp-user');
      window.location.reload();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-gray-900 dark:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
        title="Developer Tools"
      >
        <Settings className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 z-50 border border-gray-200 dark:border-gray-700 min-w-[250px]"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Developer Tools
            </h3>
            <div className="space-y-2">
              <button
                onClick={clearAppData}
                className="w-full flex items-center gap-2 px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-700 dark:text-orange-400 rounded-lg transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Reset App Data
              </button>
              <button
                onClick={clearAllData}
                className="w-full flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-400 rounded-lg transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
