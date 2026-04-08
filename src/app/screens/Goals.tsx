import { Plus, TrendingUp, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useView } from '../contexts/ViewContext';
import { AddGoalModal } from '../components/modals/AddGoalModal';
import { AddToGoalModal } from '../components/modals/AddToGoalModal';

export function Goals() {
  const { appData, deleteGoal } = useApp();
  const { viewMode } = useView();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const isOwn = viewMode === 'own';
  const goals = appData[isOwn ? 'own' : 'partner'].goals;

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Cele finansowe
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {goals.length} {goals.length === 1 ? 'aktywny cel' : 'aktywne cele'}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-gray-200/20 dark:border-white/10"
        style={{ backgroundColor: 'var(--color-card-bg-solid)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(to bottom right, var(--color-accent), var(--color-primary))' }}
          >
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Oszczędności łącznie</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalSaved.toLocaleString('pl-PL')} zł
            </h2>
          </div>
        </div>
        <div 
          className="rounded-xl p-3"
          style={{ backgroundColor: 'var(--color-card-bg)' }}
        >
          <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
            <span>Postęp globalny</span>
            <span>{totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="rounded-full h-2 transition-all"
              style={{ 
                width: `${totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0}%`,
                background: 'linear-gradient(to right, var(--color-accent), var(--color-primary))'
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div 
            className="backdrop-blur-xl rounded-2xl p-8 border border-gray-200/20 dark:border-white/10 text-center"
            style={{ backgroundColor: 'var(--color-card-bg-solid)' }}
          >
            <p className="text-gray-500 dark:text-gray-400">
              Brak celów finansowych
            </p>
          </div>
        ) : (
          goals.map((goal, index) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const remaining = goal.targetAmount - goal.currentAmount;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="backdrop-blur-xl rounded-2xl p-5 border border-gray-200/20 dark:border-white/10"
                style={{ backgroundColor: 'var(--color-card-bg-solid)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {goal.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Pozostało: {remaining.toLocaleString('pl-PL')} zł
                    </p>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id, isOwn)}
                    className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      {goal.currentAmount.toLocaleString('pl-PL')} zł / {goal.targetAmount.toLocaleString('pl-PL')} zł
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(progress, 100)}%`,
                        background: goal.color || 'linear-gradient(to right, #8b5cf6, #a855f7)',
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setSelectedGoalId(goal.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] text-white font-medium hover:shadow-lg transition-all"
                >
                  Wpłać środki
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      <AddGoalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <AddToGoalModal
        isOpen={!!selectedGoalId}
        onClose={() => setSelectedGoalId(null)}
        goalId={selectedGoalId || ''}
      />
    </div>
  );
}