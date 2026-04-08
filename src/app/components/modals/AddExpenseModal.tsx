import { X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, ExpenseCategory } from '../../contexts/AppContext';
import { useView } from '../../contexts/ViewContext';
import { toast } from 'sonner';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories: { value: ExpenseCategory; label: string }[] = [
  { value: 'food', label: 'Jedzenie' },
  { value: 'transport', label: 'Transport' },
  { value: 'housing', label: 'Mieszkanie' },
  { value: 'entertainment', label: 'Rozrywka' },
  { value: 'health', label: 'Zdrowie' },
  { value: 'other', label: 'Inne' },
];

export function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isFixed, setIsFixed] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [showRecurringDialog, setShowRecurringDialog] = useState(false);
  const { addExpense } = useApp();
  const { viewMode } = useView();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || parseFloat(amount) <= 0) {
      toast.error('Wypełnij wszystkie pola poprawnie');
      return;
    }

    if (isFixed) {
      setShowRecurringDialog(true);
    } else {
      saveExpense(false);
    }
  };

  const saveExpense = (addToFutureMonths: boolean) => {
    addExpense(
      {
        name,
        amount: parseFloat(amount),
        isPaid: false,
        date: new Date().toISOString().split('T')[0],
        isFixed,
        category,
      },
      viewMode === 'own'
    );

    if (addToFutureMonths) {
      // In real app, would add to future months
      toast.success('Wydatek dodany jako cykliczny');
    } else {
      toast.success('Wydatek dodany');
    }

    resetForm();
    setShowRecurringDialog(false);
    onClose();
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setIsFixed(false);
    setCategory('other');
  };

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
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Dodaj wydatek
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nazwa
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="np. Czynsz, Zakupy..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9fa659] dark:focus:ring-[#9A7490]"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kwota (zł)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9fa659] dark:focus:ring-[#9A7490]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFixed"
                    checked={isFixed}
                    onChange={(e) => setIsFixed(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#9fa659] dark:text-[#9A7490] focus:ring-[#9fa659] dark:focus:ring-[#9A7490]"
                  />
                  <label htmlFor="isFixed" className="text-sm text-gray-700 dark:text-gray-300">
                    Wydatek stały
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9fa659] dark:focus:ring-[#9A7490]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

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
                    Dodaj
                  </button>
                </div>
              </form>

              {showRecurringDialog && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Czy chcesz dodać ten wydatek jako cykliczny?
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => saveExpense(true)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] text-white font-medium hover:shadow-lg transition-all"
                    >
                      Tak
                    </button>
                    <button
                      type="button"
                      onClick={() => saveExpense(false)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Nie
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}