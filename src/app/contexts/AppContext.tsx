import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

export type IncomeType =
  | "hourly"
  | "per_km"
  | "daily"
  | "monthly";
export type ExpenseCategory =
  | "food"
  | "transport"
  | "housing"
  | "entertainment"
  | "health"
  | "other";

export interface UserData {
  name: string;
  incomeType: IncomeType;
  rate: number;
  userCode: string;
  partnerCode?: string;
  avatar?: {
    type: 'color' | 'gender';
    value: string;
  };
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  isPaid: boolean;
  date: string;
  isFixed: boolean;
  category?: ExpenseCategory;
}

export interface Income {
  id: string;
  amount: number;
  date: string;
  description: string;
}

export interface Goal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  color: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  isRecurring: boolean;
}

export interface WorkDay {
  date: string;
  value: number;
  note: string;
  type: 'work' | 'vacation' | 'dayOff';
  incomeType?: IncomeType; // Typ dochodu dla tego konkretnego dnia
  rate?: number; // Stawka dla tego konkretnego dnia
}

export interface MonthlyArchive {
  month: string; // Format: "2026-04"
  data: {
    expenses: Expense[];
    incomes: Income[];
    goals: Goal[];
    bills: Bill[];
    workDays: WorkDay[];
  };
}

interface AppData {
  own: {
    expenses: Expense[];
    incomes: Income[];
    goals: Goal[];
    bills: Bill[];
    workDays: WorkDay[];
    archive: MonthlyArchive[];
  };
  partner: {
    expenses: Expense[];
    incomes: Income[];
    goals: Goal[];
    bills: Bill[];
    workDays: WorkDay[];
    archive: MonthlyArchive[];
  };
}

interface AppContextType {
  userData: UserData;
  appData: AppData;
  updateUserData: (data: Partial<UserData>) => void;
  addExpense: (
    expense: Omit<Expense, "id">,
    isOwn: boolean,
  ) => void;
  updateExpense: (
    id: string,
    updates: Partial<Expense>,
    isOwn: boolean,
  ) => void;
  deleteExpense: (id: string, isOwn: boolean) => void;
  addIncome: (
    income: Omit<Income, "id">,
    isOwn: boolean,
  ) => void;
  updateIncome: (
    id: string,
    updates: Partial<Income>,
    isOwn: boolean,
  ) => void;
  deleteIncome: (id: string, isOwn: boolean) => void;
  syncWorkIncome: (isOwn: boolean) => void;
  addGoal: (goal: Omit<Goal, "id">, isOwn: boolean) => void;
  updateGoal: (
    id: string,
    updates: Partial<Goal>,
    isOwn: boolean,
  ) => void;
  deleteGoal: (id: string, isOwn: boolean) => void;
  addBill: (bill: Omit<Bill, "id">, isOwn: boolean) => void;
  updateBill: (
    id: string,
    updates: Partial<Bill>,
    isOwn: boolean,
  ) => void;
  deleteBill: (id: string, isOwn: boolean) => void;
  updateWorkDay: (workDay: WorkDay, isOwn: boolean) => void;
  deleteWorkDay: (date: string, isOwn: boolean) => void;
  getMonthlyIncome: (isOwn: boolean) => number;
  getMonthlyExpenses: (isOwn: boolean) => number;
  getMonthlyBalance: (isOwn: boolean) => number;
  connectPartner: (code: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(
  undefined,
);

const generateCode = () => {
  return Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();
};

const getEmptyAppData = (): AppData => ({
  own: {
    expenses: [],
    incomes: [],
    goals: [],
    bills: [],
    workDays: [],
    archive: [],
  },
  partner: {
    expenses: [],
    incomes: [],
    goals: [],
    bills: [],
    workDays: [],
    archive: [],
  },
});

const defaultUserData: UserData = {
  name: "",
  incomeType: "monthly",
  rate: 0,
  userCode: generateCode(),
};

const defaultAppData: AppData = getEmptyAppData();

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem("finapp-user");
    return saved ? JSON.parse(saved) : defaultUserData;
  });

  const [appData, setAppData] = useState<AppData>(() => {
    const saved = localStorage.getItem("finapp-data");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old data to new structure with archive
      return {
        own: {
          ...parsed.own,
          archive: parsed.own?.archive || [],
        },
        partner: {
          ...parsed.partner,
          archive: parsed.partner?.archive || [],
        },
      };
    }
    return defaultAppData;
  });

  useEffect(() => {
    localStorage.setItem(
      "finapp-user",
      JSON.stringify(userData),
    );
  }, [userData]);

  useEffect(() => {
    localStorage.setItem(
      "finapp-data",
      JSON.stringify(appData),
    );
  }, [appData]);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const addExpense = (
    expense: Omit<Expense, "id">,
    isOwn: boolean,
  ) => {
    const key = isOwn ? "own" : "partner";
    setAppData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        expenses: [
          ...prev[key].expenses,
          { ...expense, id: Date.now().toString() },
        ],
      },
    }));
  };

  const updateExpense = (
    id: string,
    updates: Partial<Expense>,
    isOwn: boolean,
  ) => {
    const key = isOwn ? "own" : "partner";
    setAppData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        expenses: prev[key].expenses.map((e) =>
          e.id === id ? { ...e, ...updates } : e,
        ),
      },
    }));
  };

  const deleteExpense = (id: string, isOwn: boolean) => {
    const key = isOwn ? "own" : "partner";
    setAppData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        expenses: prev[key].expenses.filter((e) => e.id !== id),
      },
    }));
  };

  const addIncome = (
    income: Omit<Income, "id">,
    isOwn: boolean,
  ) => {
    const key = isOwn ? "own" : "partner";
    setAppData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        incomes: [
          ...prev[key].incomes,
          { ...income, id: Date.now().toString() },
        ],
      },
    }));
  };

  const updateIncome = (
    id: string,
    updates: Partial<Income>,
    isOwn: boolean,
  ) => {
    const key = isOwn ? "own" : "partner";
    setAppData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        incomes: prev[key].incomes.map((i) =>
          i.id === id ? { ...i, ...updates } : i,
        ),
      },
    }));
  };

  const deleteIncome = (id: string, isOwn: boolean) => {
    const key = isOwn ? "own" : "partner";
    setAppData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        incomes: prev[key].incomes.filter((i) => i.id !== id),
      },
    }));
  };

  const syncWorkIncome = (isOwn: boolean) => {
    // Funkcja teraz nie dodaje "Work Income" do historii,
    // ponieważ historia dochodów automatycznie pokazuje dane z kalendarza pracy.
    // Wystarczy toast powiadomienie w Dashboard.
    return;
  };

  const addGoal = (goal: Omit<Goal, "id">, isOwn: boolean) => {
    const key = isOwn ? "own" : "partner";
    setAppData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        goals: [
          ...prev[key].goals,
          { ...goal, id: Date.now().toString() },
        ],
      },
    }));
  };

  const updateGoal = (
    id: string,
    updates: Partial<Goal>,
    isOwn: boolean,
  ) => {
    const key = isOwn ? "own" : "partner";
    setAppData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        goals: prev[key].goals.map((g) =>
          g.id === id ? { ...g, ...updates } : g,
        ),
      },
    }));
  };

  const deleteGoal = (id: string, isOwn: boolean) => {
    const key = isOwn ? "own" : "partner";
    setAppData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        goals: prev[key].goals.filter((g) => g.id !== id),
      },
    }));
  };

  const addBill = (bill: Omit<Bill, "id">, isOwn: boolean) => {
    const key = isOwn ? "own" : "partner";
    setAppData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        bills: [
          ...prev[key].bills,
          { ...bill, id: Date.now().toString() },
        ],
      },
    }));
  };

  const updateBill = (
    id: string,
    updates: Partial<Bill>,
    isOwn: boolean,
  ) => {
    const key = isOwn ? "own" : "partner";
    setAppData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        bills: prev[key].bills.map((b) =>
          b.id === id ? { ...b, ...updates } : b,
        ),
      },
    }));
  };

  const deleteBill = (id: string, isOwn: boolean) => {
    const key = isOwn ? "own" : "partner";
    setAppData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        bills: prev[key].bills.filter((b) => b.id !== id),
      },
    }));
  };

  const updateWorkDay = (workDay: WorkDay, isOwn: boolean) => {
    const key = isOwn ? "own" : "partner";
    setAppData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        workDays: [
          ...prev[key].workDays.filter(
            (w) => w.date !== workDay.date,
          ),
          workDay,
        ],
      },
    }));
  };

  const deleteWorkDay = (date: string, isOwn: boolean) => {
    const key = isOwn ? "own" : "partner";
    setAppData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        workDays: prev[key].workDays.filter(
          (w) => w.date !== date,
        ),
      },
    }));
  };

  const getMonthlyIncome = (isOwn: boolean) => {
    const key = isOwn ? "own" : "partner";
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return appData[key].incomes
      .filter((income) => {
        const incomeDate = new Date(income.date);
        return (
          incomeDate.getMonth() === currentMonth &&
          incomeDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, income) => sum + income.amount, 0);
  };

  const getMonthlyExpenses = (isOwn: boolean) => {
    const key = isOwn ? "own" : "partner";
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return appData[key].expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getMonthlyBalance = (isOwn: boolean) => {
    return getMonthlyIncome(isOwn) - getMonthlyExpenses(isOwn);
  };

  const connectPartner = (code: string) => {
    updateUserData({ partnerCode: code });
  };

  return (
    <AppContext.Provider
      value={{
        userData,
        appData,
        updateUserData,
        addExpense,
        updateExpense,
        deleteExpense,
        addIncome,
        updateIncome,
        deleteIncome,
        syncWorkIncome,
        addGoal,
        updateGoal,
        deleteGoal,
        addBill,
        updateBill,
        deleteBill,
        updateWorkDay,
        deleteWorkDay,
        getMonthlyIncome,
        getMonthlyExpenses,
        getMonthlyBalance,
        connectPartner,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    // In development, log the error but don't crash
    if (process.env.NODE_ENV === 'development') {
      console.warn('useApp called outside AppProvider, returning default values');
    }
    // Return safe defaults instead of throwing
    return {
      userData: defaultUserData,
      appData: defaultAppData,
      updateUserData: () => {},
      addExpense: () => {},
      updateExpense: () => {},
      deleteExpense: () => {},
      addIncome: () => {},
      updateIncome: () => {},
      deleteIncome: () => {},
      syncWorkIncome: () => {},
      addGoal: () => {},
      updateGoal: () => {},
      deleteGoal: () => {},
      addBill: () => {},
      updateBill: () => {},
      deleteBill: () => {},
      updateWorkDay: () => {},
      deleteWorkDay: () => {},
      getMonthlyIncome: () => 0,
      getMonthlyExpenses: () => 0,
      getMonthlyBalance: () => 0,
      connectPartner: () => {},
    };
  }
  return context;
}