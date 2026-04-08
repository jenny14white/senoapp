import React, { createContext, useContext, useState, useEffect } from 'react';

export type ExpenseCategory = 'food' | 'transport' | 'housing' | 'entertainment' | 'health' | 'other';

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegacyMonthlyArchive {
  month: string; // format: YYYY-MM
  income: number;
  expenses: number;
  balance: number;
  data: any; // full snapshot of that month
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
  addNote: (content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  addFamilyMember: (code: string, name: string, permissions: FamilyMember['permissions']) => void;
  removeFamilyMember: (code: string) => void;
  updateFamilyPermissions: (code: string, permissions: Partial<FamilyMember['permissions']>) => void;
  completeTutorial: (screen: keyof Tutorial) => void;
  archiveCurrentMonth: () => void;
  getArchiveByMonth: (month: string) => LegacyMonthlyArchive | undefined;
  exportToCSV: () => string;
  exportToPDF: () => void;
}

const ExtendedAppContext = createContext<ExtendedAppContextType | undefined>(undefined);

export function ExtendedAppProvider({ children }: { children: React.ReactNode }) {
  const expenseCategories = [
    { value: 'food' as ExpenseCategory, label: 'Jedzenie' },
    { value: 'transport' as ExpenseCategory, label: 'Transport' },
    { value: 'housing' as ExpenseCategory, label: 'Mieszkanie' },
    { value: 'entertainment' as ExpenseCategory, label: 'Rozrywka' },
    { value: 'health' as ExpenseCategory, label: 'Zdrowie' },
    { value: 'other' as ExpenseCategory, label: 'Inne' },
  ];

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('finapp-notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [monthlyArchive, setMonthlyArchive] = useState<LegacyMonthlyArchive[]>(() => {
    const saved = localStorage.getItem('finapp-archive');
    return saved ? JSON.parse(saved) : [];
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('finapp-family');
    return saved ? JSON.parse(saved) : [];
  });

  const [tutorials, setTutorials] = useState<Tutorial>(() => {
    const saved = localStorage.getItem('finapp-tutorials');
    return saved ? JSON.parse(saved) : {
      dashboard: false,
      expenses: false,
      work: false,
      goals: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('finapp-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('finapp-archive', JSON.stringify(monthlyArchive));
  }, [monthlyArchive]);

  useEffect(() => {
    localStorage.setItem('finapp-family', JSON.stringify(familyMembers));
  }, [familyMembers]);

  useEffect(() => {
    localStorage.setItem('finapp-tutorials', JSON.stringify(tutorials));
  }, [tutorials]);

  const addNote = (content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, content: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id
        ? { ...note, content, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const addFamilyMember = (code: string, name: string, permissions: FamilyMember['permissions']) => {
    const newMember: FamilyMember = {
      code,
      name,
      connectedAt: new Date().toISOString(),
      permissions,
    };
    setFamilyMembers(prev => [...prev, newMember]);
  };

  const removeFamilyMember = (code: string) => {
    setFamilyMembers(prev => prev.filter(member => member.code !== code));
  };

  const updateFamilyPermissions = (code: string, permissions: Partial<FamilyMember['permissions']>) => {
    setFamilyMembers(prev => prev.map(member =>
      member.code === code
        ? { ...member, permissions: { ...member.permissions, ...permissions } }
        : member
    ));
  };

  const completeTutorial = (screen: keyof Tutorial) => {
    setTutorials(prev => ({ ...prev, [screen]: true }));
  };

  const archiveCurrentMonth = () => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Get current data from AppContext (would need to be passed as props or accessed differently)
    const archive: LegacyMonthlyArchive = {
      month,
      income: 0, // Would get from AppContext
      expenses: 0, // Would get from AppContext
      balance: 0, // Would get from AppContext
      data: {}, // Would store full snapshot
    };
    
    setMonthlyArchive(prev => {
      const existing = prev.filter(a => a.month !== month);
      return [...existing, archive];
    });
  };

  const getArchiveByMonth = (month: string) => {
    return monthlyArchive.find(a => a.month === month);
  };

  const exportToCSV = () => {
    // Mock CSV export - in real app would generate actual CSV
    const csv = 'Data,Opis,Kwota\n2026-04-01,Przykład,100.00\n';
    return csv;
  };

  const exportToPDF = () => {
    // Mock PDF export - in real app would use library like jsPDF
    console.log('Eksportowanie do PDF...');
  };

  return (
    <ExtendedAppContext.Provider
      value={{
        expenseCategories,
        notes,
        monthlyArchive,
        familyMembers,
        tutorials,
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