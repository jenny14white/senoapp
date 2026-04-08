import { Plus, Check, X, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useView } from '../contexts/ViewContext';
import { AddExpenseModal } from '../components/modals/AddExpenseModal';
import { EditExpenseModal } from '../components/modals/EditExpenseModal';

export function Expenses() {
  const { appData, updateExpense, deleteExpense } = useApp();
  const { viewMode } = useView();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [selectedYear] = useState(2026);
  const [selectedMonth] = useState(3); // Kwiecień (0-indexed)

  const isOwn = viewMode === 'own';
  const expenses = appData[isOwn ? 'own' : 'partner'].expenses;

  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === selectedMonth && expenseDate.getFullYear() === selectedYear;
  });

  const totalExpenses = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const paidExpenses = monthlyExpenses.filter(e => e.isPaid).reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Wydatki
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kwiecień 2026
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
          style={{ background: 'linear-gradient(to right, var(--color-accent), var(--color-primary))' }}
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="backdrop-blur-xl rounded-3xl p-6 border border-gray-200/20 dark:border-white/10"
        style={{ backgroundColor: 'var(--color-card-bg)' }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Łącznie</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalExpenses.toLocaleString('pl-PL')} zł
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Zapłacone</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {paidExpenses.toLocaleString('pl-PL')} zł
            </p>
          </div>
        </div>
      </motion.div>

      {/* Expenses List */}
      <div className="space-y-3">
        {monthlyExpenses.length === 0 ? (
          <div 
            className="backdrop-blur-xl rounded-2xl p-8 border border-gray-200/20 dark:border-white/10 text-center"
            style={{ backgroundColor: 'var(--color-card-bg-solid)' }}
          >
            <p className="text-gray-500 dark:text-gray-400">
              Brak wydatków w tym miesiącu
            </p>
          </div>
        ) : (
          monthlyExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="backdrop-blur-xl rounded-2xl p-4 border border-gray-200/20 dark:border-white/10"
              style={{ backgroundColor: 'var(--color-card-bg-solid)' }}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => updateExpense(expense.id, { isPaid: !expense.isPaid }, isOwn)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    expense.isPaid
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  {expense.isPaid ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {expense.name}
                    </p>
                    {expense.isFixed && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#efeeb6]/50 dark:bg-[#9A7490]/30 text-[#4b4c2c] dark:text-[#9A7490]">
                        Stały
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(expense.date).toLocaleDateString('pl-PL')}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    {expense.amount.toLocaleString('pl-PL')} zł
                  </p>
                  <div className="flex gap-1 mt-1">
                    <button
                      onClick={() => setEditingExpenseId(expense.id)}
                      className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => deleteExpense(expense.id, isOwn)}
                      className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AddExpenseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      <EditExpenseModal
        isOpen={editingExpenseId !== null}
        onClose={() => setEditingExpenseId(null)}
        expenseId={editingExpenseId}
      />
    </div>
  );
}