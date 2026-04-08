import { TrendingUp, Receipt, DollarSign, Target, Plus, Calendar, RefreshCw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useView } from '../contexts/ViewContext';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AddIncomeModal } from '../components/modals/AddIncomeModal';
import { toast } from 'sonner';

export function Dashboard() {
  const { userData, getMonthlyIncome, getMonthlyExpenses, getMonthlyBalance, appData, syncWorkIncome } = useApp();
  const { viewMode } = useView();
  const navigate = useNavigate();
  const [showIncomeModal, setShowIncomeModal] = useState(false);

  const isOwn = viewMode === 'own';
  const monthlyIncome = getMonthlyIncome(isOwn);
  const monthlyExpenses = getMonthlyExpenses(isOwn);
  const balance = getMonthlyBalance(isOwn);
  const balancePercentage = monthlyIncome > 0 ? ((balance / monthlyIncome) * 100) : 0;

  const activeGoals = appData[isOwn ? 'own' : 'partner'].goals.length;
  const fixedExpenses = appData[isOwn ? 'own' : 'partner'].expenses.filter(e => e.isFixed).length;

  const handleSyncWork = () => {
    syncWorkIncome(isOwn);
    toast.success('Kalendarz pracy jest zsynchronizowany z historią dochodów! 📅✨');
  };

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Cześć, {userData.name}! 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kwiecień 2026
          </p>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/60 dark:bg-[#17122A]/60 backdrop-blur-xl border border-gray-200/20 dark:border-white/10 flex items-center justify-center">
          <Receipt className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </motion.div>

      {/* Main Income Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-6 shadow-xl relative overflow-hidden"
        style={{
          background: `linear-gradient(to bottom right, var(--color-primary), var(--color-primary-dark))`,
        }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <p className="text-white/90 text-sm font-medium mb-2">Dochód miesiąca</p>
          <h2 className="text-4xl font-bold text-white mb-6">
            {monthlyIncome.toLocaleString('pl-PL')} zł
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowIncomeModal(true)}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-white font-medium transition-all"
            >
              <Plus className="w-5 h-5" />
              Dodaj dochód
            </button>
            <button
              onClick={handleSyncWork}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-white font-medium transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Synchronizuj
            </button>
          </div>
        </div>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 1, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-xl rounded-3xl p-6 border border-gray-200/20 dark:border-white/10"
        style={{ backgroundColor: 'var(--color-card-bg)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saldo miesiąca</p>
          <span className={`text-lg font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {balance >= 0 ? '+' : ''}{balance.toLocaleString('pl-PL')} zł
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Wydatki: {monthlyExpenses.toLocaleString('pl-PL')} zł</span>
            <span className="text-gray-600 dark:text-gray-400">{balancePercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${balance >= 0 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`}
              style={{ width: `${Math.min(Math.abs(balancePercentage), 100)}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4"
      >
        {/* Goals Card */}
        <button
          onClick={() => navigate('/goals')}
          className="backdrop-blur-xl rounded-2xl p-5 border border-gray-200/20 dark:border-white/10 text-left hover:scale-[1.02] transition-transform"
          style={{ backgroundColor: 'var(--color-card-bg-solid)' }}
        >
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: `linear-gradient(to bottom right, var(--color-accent), var(--color-primary))`,
            }}
          >
            <Target className="w-6 h-6 text-white" />
          </div>
          <p className="font-medium text-gray-900 dark:text-gray-100">Cele finansowe</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activeGoals} aktywny cel</p>
        </button>

        {/* Forecasts Card */}
        <button
          onClick={() => navigate('/forecasts')}
          className="backdrop-blur-xl rounded-2xl p-5 border border-gray-200/20 dark:border-white/10 text-left hover:scale-[1.02] transition-transform"
          style={{ backgroundColor: 'var(--color-card-bg-solid)' }}
        >
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: `linear-gradient(to bottom right, var(--color-primary-dark), var(--color-accent))`,
            }}
          >
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <p className="font-medium text-gray-900 dark:text-gray-100">Prognozy</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Planuj budżet</p>
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-3"
      >
        <div 
          className="backdrop-blur-xl rounded-2xl p-4 border border-gray-200/20 dark:border-white/10"
          style={{ backgroundColor: 'var(--color-card-bg-solid)' }}
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Stałe wydatki</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{fixedExpenses}</p>
        </div>
        <div 
          className="backdrop-blur-xl rounded-2xl p-4 border border-gray-200/20 dark:border-white/10"
          style={{ backgroundColor: 'var(--color-card-bg-solid)' }}
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Aktywne cele</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeGoals}</p>
        </div>
      </motion.div>

      <AddIncomeModal
        isOpen={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
      />
    </div>
  );
}