import { TrendingUp, TrendingDown, DollarSign, Calendar, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useView } from '../contexts/ViewContext';

export function Forecasts() {
  const { appData, getMonthlyIncome, getMonthlyExpenses, userData } = useApp();
  const { viewMode } = useView();

  const isOwn = viewMode === 'own';
  const monthlyIncome = getMonthlyIncome(isOwn);
  const monthlyExpenses = getMonthlyExpenses(isOwn);
  const balance = monthlyIncome - monthlyExpenses;

  const expenses = appData[isOwn ? 'own' : 'partner'].expenses;
  const fixedExpenses = expenses.filter(e => e.isFixed);
  const variableExpenses = expenses.filter(e => !e.isFixed);
  
  const fixedExpensesTotal = fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
  const variableExpensesTotal = variableExpenses.reduce((sum, e) => sum + e.amount, 0);

  const savingsRate = monthlyIncome > 0 ? ((balance / monthlyIncome) * 100) : 0;
  const fixedExpensesPercent = monthlyIncome > 0 ? ((fixedExpensesTotal / monthlyIncome) * 100) : 0;
  
  // Prognoza stałych wydatków na następne 3 miesiące (tylko stałe wydatki)
  const months = ['Maj 2026', 'Czerwiec 2026', 'Lipiec 2026'];
  const fixedExpensesForecast = months.map((month) => ({
    month,
    amount: fixedExpensesTotal,
  }));

  // Kategorie wydatków dla wykresu
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Inne';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryColors = [
    'from-red-500 to-orange-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-purple-500 to-pink-500',
    'from-yellow-500 to-amber-500',
    'from-indigo-500 to-violet-500',
  ];

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Prognozy finansowe
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Analiza i planowanie budżetu
        </p>
      </div>

      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl p-6 shadow-xl"
        style={{
          background: `linear-gradient(to bottom right, var(--color-accent), var(--color-primary))`,
        }}
      >
        <p className="text-white/90 text-sm mb-2">Aktualny miesięczny balans</p>
        <h2 className="text-4xl font-bold text-white mb-4">
          {balance >= 0 ? '+' : ''}{balance.toLocaleString('pl-PL')} zł
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-white" />
              <p className="text-xs text-white/80">Dochód</p>
            </div>
            <p className="text-lg font-semibold text-white">
              {monthlyIncome.toLocaleString('pl-PL')} zł
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-white" />
              <p className="text-xs text-white/80">Wydatki</p>
            </div>
            <p className="text-lg font-semibold text-white">
              {monthlyExpenses.toLocaleString('pl-PL')} zł
            </p>
          </div>
        </div>
      </motion.div>

      {/* Savings Rate */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/60 dark:bg-[#17122A]/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/20 dark:border-white/10"
      >
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Wskaźnik oszczędności
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Procent oszczędności</span>
              <span className={`font-bold ${savingsRate >= 20 ? 'text-green-600 dark:text-green-400' : savingsRate >= 10 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                {savingsRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  savingsRate >= 20
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : savingsRate >= 10
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                    : 'bg-gradient-to-r from-red-400 to-red-600'
                }`}
                style={{ width: `${Math.min(savingsRate, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {savingsRate >= 20 ? '✓ Doskonale!' : savingsRate >= 10 ? '⚠ Dobrze' : '⚠ Wymaga poprawy'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Fixed Expenses Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/60 dark:bg-[#17122A]/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/20 dark:border-white/10"
      >
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Stałe wydatki miesięczne
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Łączna kwota</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {fixedExpensesTotal.toLocaleString('pl-PL')} zł
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Procent z dochodu</span>
            <span className={`text-lg font-bold ${fixedExpensesPercent < 50 ? 'text-green-600 dark:text-green-400' : fixedExpensesPercent < 70 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
              {fixedExpensesPercent.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                fixedExpensesPercent < 50
                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                  : fixedExpensesPercent < 70
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                  : 'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${Math.min(fixedExpensesPercent, 100)}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Liczba stałych</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {fixedExpenses.length}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Liczba zmiennych</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {variableExpenses.length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expenses Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/60 dark:bg-[#17122A]/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/20 dark:border-white/10"
      >
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Podział wydatków
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4">
            <p className="text-white/80 text-xs mb-1">Stałe wydatki</p>
            <p className="text-2xl font-bold text-white">
              {fixedExpensesTotal.toLocaleString('pl-PL')} zł
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4">
            <p className="text-white/80 text-xs mb-1">Zmienne wydatki</p>
            <p className="text-2xl font-bold text-white">
              {variableExpensesTotal.toLocaleString('pl-PL')} zł
            </p>
          </div>
        </div>
        {Object.keys(expensesByCategory).length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
              Kategorie wydatków:
            </p>
            {Object.entries(expensesByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount], index) => {
                const percentage = monthlyExpenses > 0 ? (amount / monthlyExpenses) * 100 : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{category}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {amount.toLocaleString('pl-PL')} zł ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${categoryColors[index % categoryColors.length]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </motion.div>

      {/* Forecast Fixed Expenses - Next 3 months */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/60 dark:bg-[#17122A]/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/20 dark:border-white/10"
      >
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Prognoza stałych wydatków (3 mies.)
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Na podstawie aktualnych stałych wydatków
        </p>
        <div className="space-y-2">
          {fixedExpensesForecast.map((item, index) => (
            <div
              key={item.month}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-100 dark:bg-gray-800"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.month}
              </span>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">
                -{item.amount.toLocaleString('pl-PL')} zł
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl">
          <div className="flex items-center justify-between text-white">
            <span className="font-medium">Łączne stałe wydatki (3 mies.)</span>
            <span className="text-xl font-bold">
              -{(fixedExpensesTotal * 3).toLocaleString('pl-PL')} zł
            </span>
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/60 dark:bg-[#17122A]/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/20 dark:border-white/10"
      >
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Rekomendacje
        </h3>
        <div className="space-y-3">
          {savingsRate < 20 && (
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-[#9fa659] dark:bg-[#9A7490] rounded-full mt-1.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Rozważ zwiększenie oszczędności do minimum 20% miesięcznego dochodu
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <div className="w-2 h-2 bg-[#9fa659] dark:bg-[#9A7490] rounded-full mt-1.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Twoje stałe wydatki wynoszą {fixedExpensesTotal.toLocaleString('pl-PL')} zł miesięcznie
            </p>
          </div>
          {monthlyExpenses > monthlyIncome && (
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5" />
              <p className="text-sm text-red-700 dark:text-red-300">
                Twoje wydatki przekraczają dochody - rozważ optymalizację budżetu
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}