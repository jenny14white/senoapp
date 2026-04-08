import { Plus, Calendar, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useView } from '../contexts/ViewContext';
import { AddBillModal } from '../components/modals/AddBillModal';

export function Bills() {
  const { appData, updateBill, addExpense } = useApp();
  const { viewMode } = useView();
  const [showAddModal, setShowAddModal] = useState(false);

  const isOwn = viewMode === 'own';
  const bills = appData[isOwn ? 'own' : 'partner'].bills;

  const today = new Date().toISOString().split('T')[0];

  const overdueBills = bills.filter(b => !b.isPaid && b.dueDate < today);
  const todayBills = bills.filter(b => !b.isPaid && b.dueDate === today);
  const upcomingBills = bills.filter(b => !b.isPaid && b.dueDate > today);

  // Podsumowanie stałych wydatków miesięcznych
  const recurringBills = bills.filter(b => b.isRecurring);
  const monthlyRecurringTotal = recurringBills.reduce((sum, b) => sum + b.amount, 0);

  const markAsPaid = (bill: typeof bills[0]) => {
    updateBill(bill.id, { isPaid: true }, isOwn);
    
    // Dodaj do wydatków
    addExpense(
      {
        name: bill.name,
        amount: bill.amount,
        isPaid: true,
        date: new Date().toISOString().split('T')[0],
        isFixed: bill.isRecurring,
      },
      isOwn
    );
  };

  const renderBill = (bill: typeof bills[0], index: number) => (
    <motion.div
      key={bill.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/60 dark:bg-[#17122A]/60 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/20 dark:border-white/10"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {bill.name}
            </p>
            {bill.isRecurring && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                Cykliczny
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Termin: {new Date(bill.dueDate).toLocaleDateString('pl-PL')}
          </p>
        </div>

        <div className="text-right">
          <p className="font-bold text-gray-900 dark:text-gray-100 mb-1">
            {bill.amount.toLocaleString('pl-PL')} zł
          </p>
          <button
            onClick={() => markAsPaid(bill)}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] text-white text-xs font-medium hover:shadow-lg transition-all"
          >
            Zapłać
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Rachunki
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Przypomnienia o płatnościach
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Monthly Recurring Summary */}
      {recurringBills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/90 text-sm mb-1">Stałe wydatki miesięczne</p>
              <h2 className="text-3xl font-bold text-white">
                {monthlyRecurringTotal.toLocaleString('pl-PL')} zł
              </h2>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            {recurringBills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between py-2 border-t border-white/10"
              >
                <span className="text-white/80 text-sm">{bill.name}</span>
                <span className="text-white font-medium text-sm">
                  {bill.amount.toLocaleString('pl-PL')} zł
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Overdue Bills */}
      {overdueBills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h2 className="font-semibold text-red-600 dark:text-red-400">
              Zaległe ({overdueBills.length})
            </h2>
          </div>
          <div className="space-y-3">
            {overdueBills.map((bill, index) => renderBill(bill, index))}
          </div>
        </div>
      )}

      {/* Today Bills */}
      {todayBills.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Dzisiaj ({todayBills.length})
          </h2>
          <div className="space-y-3">
            {todayBills.map((bill, index) => renderBill(bill, index))}
          </div>
        </div>
      )}

      {/* Upcoming Bills */}
      {upcomingBills.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Nadchodzące ({upcomingBills.length})
          </h2>
          <div className="space-y-3">
            {upcomingBills.map((bill, index) => renderBill(bill, index))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {bills.length === 0 && (
        <div className="bg-white/60 dark:bg-[#17122A]/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/20 dark:border-white/10 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            Brak zaplanowanych płatności
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 text-[#797641] dark:text-[#9A7490] font-medium"
          >
            Dodaj pierwszy rachunek
          </button>
        </div>
      )}

      <AddBillModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}