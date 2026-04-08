import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

export type ExpenseCategory = 'food' | 'transport' | 'housing' | 'entertainment' | 'health' | 'other';

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegacyMonthlyArchive {
  month: string;
  income: number;
  expenses: number;
  balance: number;
  data: unknown;
}

export interface FamilyMember {
  code: string;
  name: string;
  connectedAt: string;
  permissions: {
    viewExpenses: boolean;
    viewIncome: boolean;
    viewGoals: boolean;
    viewBills: boolean;
    fullAccess: boolean;
  };
}

export interface Tutorial {
  dashboard: boolean;
  expenses: boolean;
  work: boolean;
  goals: boolean;
}

interface ExtendedAppContextType {
  expenseCategories: { value: ExpenseCategory; label: string }[];
  notes: Note[];
  monthlyArchive: LegacyMonthlyArchive[];
  familyMembers: FamilyMember[];
  tutorials: Tutorial;
  addNote: (content: string) => Promise<void>;
  updateNote: (id: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addFamilyMember: (code: string, name: string, permissions: FamilyMember['permissions']) => Promise<void>;
  removeFamilyMember: (code: string) => Promise<void>;
  updateFamilyPermissions: (code: string, permissions: Partial<FamilyMember['permissions']>) => Promise<void>;
  completeTutorial: (screen: keyof Tutorial) => Promise<void>;
  archiveCurrentMonth: () => Promise<void>;
  getArchiveByMonth: (month: string) => LegacyMonthlyArchive | undefined;
  exportToCSV: () => string;
  exportToPDF: () => void;
}

interface ExtendedData {
  notes: Note[];
  monthlyArchive: LegacyMonthlyArchive[];
  familyMembers: FamilyMember[];
  tutorials: Tutorial;
}

const ExtendedAppContext = createContext<ExtendedAppContextType | undefined>(undefined);

const emptyExtendedData: ExtendedData = {
  notes: [],
  monthlyArchive: [],
  familyMembers: [],
  tutorials: {
    dashboard: false,
    expenses: false,
    work: false,
    goals: false,
  },
};

export function ExtendedAppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<ExtendedData>(emptyExtendedData);

  const expenseCategories = [
    { value: 'food' as ExpenseCategory, label: 'Jedzenie' },
    { value: 'transport' as ExpenseCategory, label: 'Transport' },
    { value: 'housing' as ExpenseCategory, label: 'Mieszkanie' },
    { value: 'entertainment' as ExpenseCategory, label: 'Rozrywka' },
    { value: 'health' as ExpenseCategory, label: 'Zdrowie' },
    { value: 'other' as ExpenseCategory, label: 'Inne' },
  ];

  useEffect(() => {
    if (!user?.id) {
      setData(emptyExtendedData);
      return;
    }

    const ref = doc(db, 'userExtendedData', user.id);
    const unsubscribe = onSnapshot(ref, async (snapshot) => {
      if (!snapshot.exists()) {
        await setDoc(
          ref,
          {
            ...emptyExtendedData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
        return;
      }

      const remote = snapshot.data();
      setData({
        notes: remote.notes || [],
        monthlyArchive: remote.monthlyArchive || [],
        familyMembers: remote.familyMembers || [],
        tutorials: remote.tutorials || emptyExtendedData.tutorials,
      });
    });

    return () => unsubscribe();
  }, [user?.id]);

  const save = async (next: ExtendedData) => {
    if (!user?.id) return;

    setData(next);
    await setDoc(
      doc(db, 'userExtendedData', user.id),
      {
        ...next,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const addNote = async (content: string) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: crypto.randomUUID(),
      content,
      createdAt: now,
      updatedAt: now,
    };
    await save({ ...data, notes: [newNote, ...data.notes] });
  };

  const updateNote = async (id: string, content: string) => {
    await save({
      ...data,
      notes: data.notes.map((note) => (note.id === id ? { ...note, content, updatedAt: new Date().toISOString() } : note)),
    });
  };

  const deleteNote = async (id: string) => {
    await save({ ...data, notes: data.notes.filter((note) => note.id !== id) });
  };

  const addFamilyMember = async (code: string, name: string, permissions: FamilyMember['permissions']) => {
    const newMember: FamilyMember = {
      code,
      name,
      connectedAt: new Date().toISOString(),
      permissions,
    };
    await save({ ...data, familyMembers: [...data.familyMembers, newMember] });
  };

  const removeFamilyMember = async (code: string) => {
    await save({ ...data, familyMembers: data.familyMembers.filter((member) => member.code !== code) });
  };

  const updateFamilyPermissions = async (code: string, permissions: Partial<FamilyMember['permissions']>) => {
    await save({
      ...data,
      familyMembers: data.familyMembers.map((member) =>
        member.code === code ? { ...member, permissions: { ...member.permissions, ...permissions } } : member,
      ),
    });
  };

  const completeTutorial = async (screen: keyof Tutorial) => {
    await save({
      ...data,
      tutorials: { ...data.tutorials, [screen]: true },
    });
  };

  const archiveCurrentMonth = async () => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const archive: LegacyMonthlyArchive = {
      month,
      income: 0,
      expenses: 0,
      balance: 0,
      data: {},
    };

    const existing = data.monthlyArchive.filter((a) => a.month !== month);
    await save({ ...data, monthlyArchive: [...existing, archive] });
  };

  const getArchiveByMonth = (month: string) => {
    return data.monthlyArchive.find((a) => a.month === month);
  };

  const exportToCSV = () => {
    return 'Data,Opis,Kwota\n2026-04-01,Przykład,100.00\n';
  };

  const exportToPDF = () => {
    console.log('Eksportowanie do PDF...');
  };

  return (
    <ExtendedAppContext.Provider
      value={{
        expenseCategories,
        notes: data.notes,
        monthlyArchive: data.monthlyArchive,
        familyMembers: data.familyMembers,
        tutorials: data.tutorials,
        addNote,
        updateNote,
        deleteNote,
        addFamilyMember,
        removeFamilyMember,
        updateFamilyPermissions,
        completeTutorial,
        archiveCurrentMonth,
        getArchiveByMonth,
        exportToCSV,
        exportToPDF,
      }}
    >
      {children}
    </ExtendedAppContext.Provider>
  );
}

export function useExtendedApp() {
  const context = useContext(ExtendedAppContext);
  if (!context) {
    throw new Error('useExtendedApp must be used within ExtendedAppProvider');
  }
  return context;
}
