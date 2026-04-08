import { ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useView } from '../contexts/ViewContext';
import { useTutorial } from '../contexts/TutorialContext';
import { WorkDayModal } from '../components/modals/WorkDayModal';
import { getHolidayForDate } from '../lib/polishHolidays';

const MONTHS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

const DAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

export function Work() {
  const { appData, userData, deleteIncome } = useApp();
  const { viewMode } = useView();
  const { startTutorial, isTutorialCompleted } = useTutorial();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hoveredHoliday, setHoveredHoliday] = useState<string | null>(null);

  useEffect(() => {
    // Start tutorial on first visit
    if (!isTutorialCompleted('work')) {
      const timer = setTimeout(() => {
        startTutorial('work');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const isOwn = viewMode === 'own';
  const workDays = appData[isOwn ? 'own' : 'partner'].workDays || [];
  const manualIncomes = appData[isOwn ? 'own' : 'partner'].incomes || [];

  // Konwertuj dni pracy na format dochodów
  const workDayIncomes = workDays
    .filter(w => w.type === 'work' && w.value && w.rate)
    .map(w => {
      const incomeTypeLabels: Record<string, string> = {
        hourly: 'Godzinowe',
        per_km: 'Kilometrowe',
        daily: 'Dzienne',
        monthly: 'Miesięczne',
      };
      const label = incomeTypeLabels[w.incomeType || 'hourly'] || 'Praca';
      
      return {
        id: `work-${w.date}`,
        description: w.note 
          ? `${label} - ${w.note}` 
          : `${label} (${w.value} ${w.incomeType === 'hourly' ? 'godz' : w.incomeType === 'per_km' ? 'km' : w.incomeType === 'daily' ? 'dni' : 'msc'})`,
        amount: (w.value || 0) * (w.rate || 0),
        date: w.date,
        isFromCalendar: true,
      };
    });

  // Połącz manualne dochody z dochodami z kalendarza
  const allIncomes = [
    ...manualIncomes.map(i => ({ ...i, isFromCalendar: false })),
    ...workDayIncomes,
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getWorkDayData = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return workDays.find(w => w.date === dateStr);
  };

  const calculateEarnings = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthWorkDays = workDays.filter(w => {
      const date = new Date(w.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && w.type === 'work';
    });

    // Grupuj po typie dochodu
    const byType = {
      hourly: { value: 0, count: 0 },
      per_km: { value: 0, count: 0 },
      daily: { value: 0, count: 0 },
      monthly: { value: 0, count: 0 }
    };

    let totalEarnings = 0;
    let monthlyTotal = 0;

    monthWorkDays.forEach(w => {
      const dayIncomeType = w.incomeType || userData?.incomeType || 'hourly';
      const dayRate = w.rate || userData?.rate || 0;
      
      byType[dayIncomeType].value += w.value || 0;
      byType[dayIncomeType].count += 1;
      
      // Dla typu 'monthly', stawka to kwota za cały miesiąc (nie mnożymy)
      if (dayIncomeType === 'monthly') {
        monthlyTotal += dayRate; // Sumujemy wszystkie monthly stawki
      } else {
        // Dla innych typów: godziny * stawka, km * stawka, dni * stawka
        totalEarnings += (w.value || 0) * dayRate;
      }
    });
    
    // Dodaj monthly total do całkowitych zarobków
    totalEarnings += monthlyTotal;
    
    return { byType, totalEarnings, days: monthWorkDays.length };
  };

  const { byType, totalEarnings, days: workedDays } = calculateEarnings();

  // Oblicz dodatkowe statystyki z kalendarza
  const calculateCalendarStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthWorkDays = workDays.filter(w => {
      const workDate = new Date(w.date);
      return workDate.getMonth() === currentMonth && workDate.getFullYear() === currentYear;
    });

    const vacationDays = monthWorkDays.filter(w => w.type === 'vacation').length;
    const dayOffDays = monthWorkDays.filter(w => w.type === 'dayOff').length;

    return { vacationDays, dayOffDays };
  };

  const { vacationDays, dayOffDays } = calculateCalendarStats();

  const getSummaryLabels = () => {
    const labels: string[] = [];
    if (byType.hourly.value > 0) labels.push(`${byType.hourly.value}h`);
    if (byType.per_km.value > 0) labels.push(`${byType.per_km.value}km`);
    if (byType.daily.value > 0) labels.push(`${byType.daily.value} dni`);
    if (byType.monthly.value > 0) labels.push(`${byType.monthly.value} mies.`);
    return labels.length > 0 ? labels.join(' + ') : '0 jednostek';
  };

  const days = getDaysInMonth(currentDate);

  const handleDayClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Kalendarz pracy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            className="w-10 h-10 rounded-xl backdrop-blur-xl border border-gray-200/20 dark:border-white/10 flex items-center justify-center hover:opacity-80 transition-all"
            style={{ backgroundColor: 'var(--color-card-bg)' }}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            className="w-10 h-10 rounded-xl backdrop-blur-xl border border-gray-200/20 dark:border-white/10 flex items-center justify-center hover:opacity-80 transition-all"
            style={{ backgroundColor: 'var(--color-card-bg)' }}
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Summary */}
      <motion.div
        id="monthly-earnings"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl p-6 shadow-xl border border-gray-200/20 dark:border-white/10"
        style={{ background: `linear-gradient(to bottom right, var(--color-primary), var(--color-primary-dark))` }}
      >
        <p className="text-white/90 text-sm mb-2 font-medium">Zarobki w tym miesiącu</p>
        <h2 className="text-3xl font-bold text-white mb-4">
          {totalEarnings.toLocaleString('pl-PL')} zł
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-white/80 mb-1">Przepracowano</p>
            <p className="font-semibold text-lg text-white">{getSummaryLabels()}</p>
          </div>
          <div>
            <p className="text-white/80 mb-1">Dni pracy</p>
            <p className="font-semibold text-lg text-white">{workedDays}</p>
          </div>
          <div>
            <p className="text-white/80 mb-1">Dni urlopu</p>
            <p className="font-semibold text-lg text-white">{vacationDays}</p>
          </div>
          <div>
            <p className="text-white/80 mb-1">Dni wolne</p>
            <p className="font-semibold text-lg text-white">{dayOffDays}</p>
          </div>
        </div>
      </motion.div>

      {/* Calendar */}
      <motion.div
        id="work-calendar"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl rounded-3xl p-6 border border-gray-200/20 dark:border-white/10"
        style={{ backgroundColor: 'var(--color-card-bg)' }}
      >
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} />;
            }

            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const workDay = getWorkDayData(day);
            const holiday = getHolidayForDate(dateStr);
            const hasWork = workDay?.type === 'work';
            const isVacation = workDay?.type === 'vacation';
            const isDayOff = workDay?.type === 'dayOff';
            
            const getWorkDayLabel = () => {
              if (!workDay || !hasWork) return '';
              const dayType = workDay.incomeType || userData?.incomeType || 'hourly';
              switch (dayType) {
                case 'hourly': return `${workDay.value}h`;
                case 'per_km': return `${workDay.value}km`;
                case 'daily': return `${workDay.value}d`;
                case 'monthly': return `${workDay.value}m`;
                default: return `${workDay.value}`;
              }
            };

            return (
              <motion.button
                key={day}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => holiday && setHoveredHoliday(dateStr)}
                onMouseLeave={() => setHoveredHoliday(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                  isVacation
                    ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg'
                    : isDayOff
                    ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white shadow-lg'
                    : hasWork
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                style={hasWork && !isVacation && !isDayOff ? {
                  background: `linear-gradient(to bottom right, var(--color-accent), var(--color-primary))`
                } : {}}
              >
                <span className="text-sm font-medium">{day}</span>
                {hasWork && (
                  <span className="text-[10px] mt-0.5 opacity-90">
                    {getWorkDayLabel()}
                  </span>
                )}
                {isVacation && (
                  <span className="text-[10px] mt-0.5 opacity-90">Urlop</span>
                )}
                {isDayOff && (
                  <span className="text-[10px] mt-0.5 opacity-90">Wolne</span>
                )}
                {holiday && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-sm" />
                )}
                
                {/* Holiday tooltip */}
                {hoveredHoliday === dateStr && holiday && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-xl"
                  >
                    {holiday.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Manual Incomes List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-xl rounded-3xl p-6 border border-gray-200/20 dark:border-white/10"
        style={{ backgroundColor: 'var(--color-card-bg)' }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Historia dochodów
        </h3>
        {allIncomes.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
            Brak dodanych dochodów
          </p>
        ) : (
          <div className="space-y-3">
            {allIncomes.map((income) => (
              <motion.div
                key={income.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-200/30 dark:border-white/10"
                style={{ backgroundColor: 'var(--color-card-bg-solid)' }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {income.description}
                    </p>
                    {income.isFromCalendar && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        Kalendarz
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {new Date(income.date).toLocaleDateString('pl-PL', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    +{income.amount.toLocaleString('pl-PL')} zł
                  </span>
                  {!income.isFromCalendar && (
                    <button
                      onClick={() => deleteIncome(income.id, isOwn)}
                      className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <WorkDayModal
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        date={selectedDate || ''}
      />
    </div>
  );
}