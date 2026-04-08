// Polish holidays for 2024-2027
export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  type: 'national' | 'religious';
}

// Helper function to calculate Easter date (using Meeus/Jones/Butcher algorithm)
function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getPolishHolidays(year: number): Holiday[] {
  const easter = getEasterDate(year);
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);
  
  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);

  const holidays: Holiday[] = [
    // Fixed holidays
    { date: `${year}-01-01`, name: 'Nowy Rok', type: 'national' },
    { date: `${year}-01-06`, name: 'Trzech Króli', type: 'religious' },
    { date: `${year}-05-01`, name: 'Święto Pracy', type: 'national' },
    { date: `${year}-05-03`, name: 'Święto Konstytucji 3 Maja', type: 'national' },
    { date: `${year}-08-15`, name: 'Wniebowzięcie Najświętszej Maryi Panny', type: 'religious' },
    { date: `${year}-11-01`, name: 'Wszystkich Świętych', type: 'religious' },
    { date: `${year}-11-11`, name: 'Święto Niepodległości', type: 'national' },
    { date: `${year}-12-25`, name: 'Boże Narodzenie (pierwszy dzień)', type: 'religious' },
    { date: `${year}-12-26`, name: 'Boże Narodzenie (drugi dzień)', type: 'religious' },
    
    // Movable holidays (based on Easter)
    { date: formatDate(easter), name: 'Wielkanoc', type: 'religious' },
    { date: formatDate(easterMonday), name: 'Poniedziałek Wielkanocny', type: 'religious' },
    { date: formatDate(corpusChristi), name: 'Boże Ciało', type: 'religious' },
  ];

  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}

// Get holiday for a specific date
export function getHolidayForDate(date: Date | string): Holiday | null {
  const dateStr = typeof date === 'string' ? date : formatDate(date);
  const year = new Date(dateStr).getFullYear();
  const holidays = getPolishHolidays(year);
  return holidays.find((h) => h.date === dateStr) || null;
}

// Check if a date is a holiday
export function isHoliday(date: Date | string): boolean {
  return getHolidayForDate(date) !== null;
}

// Get all holidays for multiple years
export function getHolidaysForYears(startYear: number, endYear: number): Holiday[] {
  const allHolidays: Holiday[] = [];
  for (let year = startYear; year <= endYear; year++) {
    allHolidays.push(...getPolishHolidays(year));
  }
  return allHolidays;
}
