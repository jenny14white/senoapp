import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

export type IncomeType = 'hourly' | 'per_km' | 'daily' | 'monthly';
export type ExpenseCategory = 'food' | 'transport' | 'housing' | 'entertainment' | 'health' | 'other';

export interface UserData {
  name: string;
  incomeType: IncomeType;
  rate: number;
  userCode: string;
  partnerCode?: string;
  partnerUid?: string;
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
  incomeType?: IncomeType;
  rate?: number;
}

export interface MonthlyArchive {
  month: string;
  data: {
    expenses: Expense[];
    incomes: Income[];
    goals: Goal[];
    bills: Bill[];
    workDays: WorkDay[];
  };
}

interface DataSide {
  expenses: Expense[];
  incomes: Income[];
  goals: Goal[];
  bills: Bill[];
  workDays: WorkDay[];
  archive: MonthlyArchive[];
}

interface AppData {
  own: DataSide;
  partner: DataSide;
}

interface AppContextType {
  userData: UserData;
  appData: AppData;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>, isOwn: boolean) => Promise<void>;
  updateExpense: (id: string, updates: Partial<Expense>, isOwn: boolean) => Promise<void>;
  deleteExpense: (id: string, isOwn: boolean) => Promise<void>;
  addIncome: (income: Omit<Income, 'id'>, isOwn: boolean) => Promise<void>;
  updateIncome: (id: string, updates: Partial<Income>, isOwn: boolean) => Promise<void>;
  deleteIncome: (id: string, isOwn: boolean) => Promise<void>;
  syncWorkIncome: (isOwn: boolean) => void;
  addGoal: (goal: Omit<Goal, 'id'>, isOwn: boolean) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>, isOwn: boolean) => Promise<void>;
  deleteGoal: (id: string, isOwn: boolean) => Promise<void>;
  addBill: (bill: Omit<Bill, 'id'>, isOwn: boolean) => Promise<void>;
  updateBill: (id: string, updates: Partial<Bill>, isOwn: boolean) => Promise<void>;
  deleteBill: (id: string, isOwn: boolean) => Promise<void>;
  updateWorkDay: (workDay: WorkDay, isOwn: boolean) => Promise<void>;
  deleteWorkDay: (date: string, isOwn: boolean) => Promise<void>;
  getMonthlyIncome: (isOwn: boolean) => number;
  getMonthlyExpenses: (isOwn: boolean) => number;
  getMonthlyBalance: (isOwn: boolean) => number;
  connectPartner: (code: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

const getEmptyUserData = (): UserData => ({
  name: '',
  incomeType: 'monthly',
  rate: 0,
  userCode: generateCode(),
});

const getEmptyDataSide = (): DataSide => ({
  expenses: [],
  incomes: [],
  goals: [],
  bills: [],
  workDays: [],
  archive: [],
});

const writeUserCodeMapping = async (uid: string, userCode: string) => {
  await setDoc(
    doc(db, 'userCodes', userCode),
    {
      uid,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userData, setUserDataState] = useState<UserData>(getEmptyUserData);
  const [ownData, setOwnData] = useState<DataSide>(getEmptyDataSide);
  const [partnerData, setPartnerData] = useState<DataSide>(getEmptyDataSide);

  useEffect(() => {
    if (!user?.id) {
      setUserDataState(getEmptyUserData());
      setOwnData(getEmptyDataSide());
      setPartnerData(getEmptyDataSide());
      return;
    }

    const userRef = doc(db, 'users', user.id);
    const appDataRef = doc(db, 'userAppData', user.id);

    const unsubscribeUser = onSnapshot(userRef, async (snapshot) => {
      if (!snapshot.exists()) {
        const seed = {
          ...getEmptyUserData(),
          email: user.email,
          name: user.name || user.email.split('@')[0],
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        };
        await setDoc(userRef, seed, { merge: true });
        await writeUserCodeMapping(user.id, seed.userCode);
        return;
      }

      const next = snapshot.data() as UserData;
      setUserDataState((prev) => ({ ...prev, ...next }));

      if (next.userCode) {
        await writeUserCodeMapping(user.id, next.userCode);
      }
    });

    const unsubscribeAppData = onSnapshot(appDataRef, async (snapshot) => {
      if (!snapshot.exists()) {
        await setDoc(
          appDataRef,
          {
            data: getEmptyDataSide(),
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          },
          { merge: true },
        );
        return;
      }

      const remote = snapshot.data().data;
      setOwnData({ ...getEmptyDataSide(), ...remote });
    });

    return () => {
      unsubscribeUser();
      unsubscribeAppData();
    };
  }, [user?.id, user?.email, user?.name]);

  useEffect(() => {
    if (!userData.partnerUid) {
      setPartnerData(getEmptyDataSide());
      return;
    }

    const partnerRef = doc(db, 'userAppData', userData.partnerUid);
    const unsubscribe = onSnapshot(partnerRef, (snapshot) => {
      if (!snapshot.exists()) {
        setPartnerData(getEmptyDataSide());
        return;
      }
      setPartnerData({ ...getEmptyDataSide(), ...snapshot.data().data });
    });

    return () => unsubscribe();
  }, [userData.partnerUid]);

  const appData = useMemo(() => ({ own: ownData, partner: partnerData }), [ownData, partnerData]);

  const getTargetUid = (isOwn: boolean) => (isOwn ? user?.id : userData.partnerUid);

  const saveDataSide = async (uid: string, nextData: DataSide) => {
    await setDoc(
      doc(db, 'userAppData', uid),
      {
        data: nextData,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const mutateData = async (isOwn: boolean, mutator: (current: DataSide) => DataSide) => {
    const uid = getTargetUid(isOwn);
    if (!uid) {
      throw new Error('Brak połączonego konta partnera');
    }

    const source = isOwn ? ownData : partnerData;
    const next = mutator(source);

    if (isOwn) {
      setOwnData(next);
    } else {
      setPartnerData(next);
    }

    await saveDataSide(uid, next);
  };

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user?.id) return;

    setUserDataState((prev) => ({ ...prev, ...data }));

    if (data.userCode) {
      await writeUserCodeMapping(user.id, data.userCode);
    }

    await setDoc(
      doc(db, 'users', user.id),
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const addExpense = async (expense: Omit<Expense, 'id'>, isOwn: boolean) => {
    await mutateData(isOwn, (current) => ({
      ...current,
      expenses: [...current.expenses, { ...expense, id: crypto.randomUUID() }],
    }));
  };

  const updateExpense = async (id: string, updates: Partial<Expense>, isOwn: boolean) => {
    await mutateData(isOwn, (current) => ({
      ...current,
      expenses: current.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  };

  const deleteExpense = async (id: string, isOwn: boolean) => {
    await mutateData(isOwn, (current) => ({
      ...current,
      expenses: current.expenses.filter((e) => e.id !== id),
    }));
  };

  const addIncome = async (income: Omit<Income, 'id'>, isOwn: boolean) => {
    await mutateData(isOwn, (current) => ({
      ...current,
      incomes: [...current.incomes, { ...income, id: crypto.randomUUID() }],
    }));
  };

  const updateIncome = async (id: string, updates: Partial<Income>, isOwn: boolean) => {
    await mutateData(isOwn, (current) => ({
      ...current,
      incomes: current.incomes.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
  };

  const deleteIncome = async (id: string, isOwn: boolean) => {
    await mutateData(isOwn, (current) => ({
      ...current,
      incomes: current.incomes.filter((i) => i.id !== id),
    }));
  };

  const syncWorkIncome = () => {
    return;
  };

  const addGoal = async (goal: Omit<Goal, 'id'>, isOwn: boolean) => {
    await mutateData(isOwn, (current) => ({
      ...current,
      goals: [...current.goals, { ...goal, id: crypto.randomUUID() }],
    }));
  };

  const updateGoal = async (id: string, updates: Partial<Goal>, isOwn: boolean) => {
    await mutateData(isOwn, (current) => ({
      ...current,
      goals: current.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  };

  const deleteGoal = async (id: string, isOwn: boolean) => {
    await mutateData(isOwn, (current) => ({
      ...current,
      goals: current.goals.filter((g) => g.id !== id),
    }));
  };

  const addBill = async (bill: Omit<Bill, 'id'>, isOwn: boolean) => {
    await mutateData(isOwn, (current) => ({
      ...current,
      bills: [...current.bills, { ...bill, id: crypto.randomUUID() }],
    }));
  };

  const updateBill = async (id: string, updates: Partial<Bill>, isOwn: boolean) => {
    await mutateData(isOwn, (current) => ({
      ...current,
      bills: current.bills.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  };

  const deleteBill = async (id: string, isOwn: boolean) => {
    await mutateData(isOwn, (current) => ({
      ...current,
      bills: current.bills.filter((b) => b.id !== id),
    }));
  };

  const updateWorkDay = async (workDay: WorkDay, isOwn: boolean) => {
    await mutateData(isOwn, (current) => ({
      ...current,
      workDays: [...current.workDays.filter((w) => w.date !== workDay.date), workDay],
    }));
  };

  const deleteWorkDay = async (date: string, isOwn: boolean) => {
    await mutateData(isOwn, (current) => ({
      ...current,
      workDays: current.workDays.filter((w) => w.date !== date),
    }));
  };

  const getMonthlyIncome = (isOwn: boolean) => {
    const side = isOwn ? appData.own : appData.partner;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return side.incomes
      .filter((income) => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
      })
      .reduce((sum, income) => sum + income.amount, 0);
  };

  const getMonthlyExpenses = (isOwn: boolean) => {
    const side = isOwn ? appData.own : appData.partner;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return side.expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getMonthlyBalance = (isOwn: boolean) => getMonthlyIncome(isOwn) - getMonthlyExpenses(isOwn);

  const connectPartner = async (code: string) => {
    if (!user?.id) {
      throw new Error('Musisz być zalogowany, aby połączyć partnera');
    }

    const normalized = code.trim().toUpperCase();

    if (normalized === userData.userCode) {
      throw new Error('Nie możesz połączyć się ze sobą');
    }

    const partnerCodeRef = doc(db, 'userCodes', normalized);
    const partnerCodeSnap = await getDoc(partnerCodeRef);

    if (!partnerCodeSnap.exists() || !partnerCodeSnap.data().uid) {
      throw new Error('Nie znaleziono użytkownika z tym kodem');
    }

    const partnerUid = partnerCodeSnap.data().uid as string;

    if (partnerUid === user.id) {
      throw new Error('Nie możesz połączyć się ze sobą');
    }

    const batch = writeBatch(db);

    batch.set(
      doc(db, 'users', user.id),
      {
        partnerCode: normalized,
        partnerUid,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    batch.set(
      doc(db, 'users', partnerUid),
      {
        partnerCode: userData.userCode,
        partnerUid: user.id,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    await batch.commit();

    setUserDataState((prev) => ({ ...prev, partnerCode: normalized, partnerUid }));
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
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
