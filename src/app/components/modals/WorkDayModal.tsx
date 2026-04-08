import { X, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, IncomeType } from '../../contexts/AppContext';
import { useView } from '../../contexts/ViewContext';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

interface WorkDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
}

export function WorkDayModal({ isOpen, onClose, date }: WorkDayModalProps) {
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState('work');
  const [incomeType, setIncomeType] = useState<IncomeType>('hourly');
  const [rate, setRate] = useState('');
  const { appData, updateWorkDay, deleteWorkDay, userData } = useApp();
  const { viewMode } = useView();

  const isOwn = viewMode === 'own';
  const workDay = appData[isOwn ? 'own' : 'partner']?.workDays?.find(w => w.date === date);

  useEffect(() => {
    if (workDay) {
      setValue(workDay.value?.toString() || '');
      setNote(workDay.note || '');
      setIncomeType(workDay.incomeType || userData?.incomeType || 'hourly');
      setRate(workDay.rate?.toString() || userData?.rate?.toString() || '');
      
      // Auto-detect tab based on type
      setActiveTab(workDay.type || 'work');
    } else {
      setValue('');
      setNote('');
      setRate(userData?.rate?.toString() || '');
      setActiveTab('work');
      setIncomeType(userData?.incomeType || 'hourly');
    }
  }, [workDay, date, userData]);

  const getIncomeTypeLabel = (type: IncomeType) => {
    switch (type) {
      case 'hourly': return 'Liczba godzin';
      case 'per_km': return 'Liczba kilometrów';
      case 'daily': return 'Liczba dni';
      case 'monthly': return 'Liczba miesięcy';
      default: return 'Wartość';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'work') {
      if (!value || parseFloat(value) <= 0) return;
      updateWorkDay(
        {
          date,
          value: parseFloat(value),
          note,
          type: 'work',
          incomeType: incomeType,
          rate: rate ? parseFloat(rate) : undefined,
        },
        isOwn
      );
    } else if (activeTab === 'vacation') {
      updateWorkDay(
        {
          date,
          value: 0,
          note: `Urlop${note ? ` - ${note}` : ''}`,
          type: 'vacation',
        },
        isOwn
      );
    } else if (activeTab === 'dayoff') {
      updateWorkDay(
        {
          date,
          value: 0,
          note: `Wolne${note ? ` - ${note}` : ''}`,
          type: 'dayOff',
        },
        isOwn
      );
    }

    onClose();
  };

  const handleDelete = () => {
    deleteWorkDay(date, isOwn);
    onClose();
  };

  const earnings = value ? parseFloat(value) * (rate ? parseFloat(rate) : userData?.rate || 0) : 0;

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
              className="bg-white dark:bg-[#17122A] rounded-3xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Dzień pracy
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(date).toLocaleDateString('pl-PL', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="work">Praca</TabsTrigger>
                  <TabsTrigger value="vacation">Urlop</TabsTrigger>
                  <TabsTrigger value="dayoff">Dzień wolny</TabsTrigger>
                </TabsList>

                <TabsContent value="work" className="mt-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Typ rozliczenia
                      </label>
                      <select
                        value={incomeType}
                        onChange={(e) => setIncomeType(e.target.value as IncomeType)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#9fa659] dark:focus:ring-[#9A7490]"
                      >
                        <option value="hourly">Godzinowe</option>
                        <option value="per_km">Kilometrowe</option>
                        <option value="daily">Dzienne</option>
                        <option value="monthly">Miesięczne</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Stawka (zł)
                      </label>
                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9fa659] dark:focus:ring-[#9A7490]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {getIncomeTypeLabel(incomeType)}
                      </label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="0"
                        step="0.01"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9fa659] dark:focus:ring-[#9A7490]"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notatka (opcjonalnie)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Dodaj notatkę..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9fa659] dark:focus:ring-[#9A7490] resize-none"
                      />
                    </div>

                    {value && parseFloat(value) > 0 && (
                      <div className="bg-[#efeeb6]/50 dark:bg-[#9A7490]/20 rounded-xl p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Szacowane zarobki
                        </p>
                        <p className="text-2xl font-bold text-[#797641] dark:text-[#9A7490]">
                          {earnings.toLocaleString('pl-PL')} zł
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          ({parseFloat(value)} × {rate ? parseFloat(rate) : userData?.rate || 0} zł)
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
                      {workDay && (
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="py-3 px-4 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Usuń
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] text-white font-medium hover:shadow-lg transition-all"
                      >
                        Zapisz
                      </button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="vacation" className="mt-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Oznaczasz ten dzień jako urlop
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notatka (opcjonalnie)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="np. Urlop wypoczynkowy..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        Anuluj
                      </button>
                      {workDay && (
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="py-3 px-4 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Usuń
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:shadow-lg transition-all"
                      >
                        Zapisz
                      </button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="dayoff" className="mt-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Oznaczasz ten dzień jako wolny
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notatka (opcjonalnie)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="np. Weekend, święto..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        Anuluj
                      </button>
                      {workDay && (
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="py-3 px-4 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Usuń
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium hover:shadow-lg transition-all"
                      >
                        Zapisz
                      </button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}