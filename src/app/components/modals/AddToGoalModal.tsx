import { X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { useView } from '../../contexts/ViewContext';

interface AddToGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: string;
}

export function AddToGoalModal({ isOpen, onClose, goalId }: AddToGoalModalProps) {
  const [amount, setAmount] = useState('');
  const { appData, updateGoal } = useApp();
  const { viewMode } = useView();

  const isOwn = viewMode === 'own';
  const goal = appData[isOwn ? 'own' : 'partner'].goals.find(g => g.id === goalId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0 || !goal) return;

    updateGoal(
      goalId,
      {
        currentAmount: goal.currentAmount + parseFloat(amount),
      },
      isOwn
    );

    setAmount('');
    onClose();
  };

  if (!goal) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white dark:bg-[#17122A] rounded-3xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Wpłać środki
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {goal.name}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Aktualnie</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {goal.currentAmount.toLocaleString('pl-PL')} zł
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Cel</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {goal.targetAmount.toLocaleString('pl-PL')} zł
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kwota wpłaty (zł)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9fa659] dark:focus:ring-[#9A7490]"
                    autoFocus
                  />
                </div>

                {amount && parseFloat(amount) > 0 && (
                  <div className="bg-[#efeeb6]/50 dark:bg-[#9A7490]/20 rounded-xl p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Nowa kwota
                    </p>
                    <p className="text-2xl font-bold text-[#797641] dark:text-[#9A7490]">
                      {(goal.currentAmount + parseFloat(amount)).toLocaleString('pl-PL')} zł
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      z {goal.targetAmount.toLocaleString('pl-PL')} zł
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] text-white font-medium hover:shadow-lg transition-all"
                  >
                    Wpłać
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}