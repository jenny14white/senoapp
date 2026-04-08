import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface TutorialStep {
  id: string;
  targetId: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialContextType {
  currentStep: number;
  isActive: boolean;
  steps: TutorialStep[];
  startTutorial: (tutorialId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  isTutorialCompleted: (tutorialId: string) => boolean;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

const TUTORIALS = {
  dashboard: [
    {
      id: 'dashboard-1',
      targetId: 'balance-card',
      title: 'Twój Bilans',
      description: 'Tutaj widzisz swój aktualny bilans finansowy - przychody minus wydatki.',
      position: 'bottom' as const,
    },
    {
      id: 'dashboard-2',
      targetId: 'expenses-chart',
      title: 'Wykres Wydatków',
      description: 'Wizualizacja Twoich wydatków w podziale na kategorie.',
      position: 'top' as const,
    },
    {
      id: 'dashboard-3',
      targetId: 'quick-actions',
      title: 'Szybkie Akcje',
      description: 'Dodawaj wydatki, przychody i cele jednym kliknięciem.',
      position: 'top' as const,
    },
  ],
  expenses: [
    {
      id: 'expenses-1',
      targetId: 'add-expense-btn',
      title: 'Dodaj Wydatek',
      description: 'Kliknij tutaj, aby dodać nowy wydatek.',
      position: 'bottom' as const,
    },
    {
      id: 'expenses-2',
      targetId: 'expenses-list',
      title: 'Lista Wydatków',
      description: 'Tutaj znajdziesz wszystkie swoje wydatki. Kliknij wydatek, aby go edytować.',
      position: 'top' as const,
    },
    {
      id: 'expenses-3',
      targetId: 'filter-tabs',
      title: 'Filtry',
      description: 'Przełączaj się między własnymi wydatkami a wydatkami partnera.',
      position: 'bottom' as const,
    },
  ],
  work: [
    {
      id: 'work-1',
      targetId: 'work-calendar',
      title: 'Kalendarz Pracy',
      description: 'Kliknij dzień, aby dodać godziny pracy, urlop lub dzień wolny.',
      position: 'bottom' as const,
    },
    {
      id: 'work-2',
      targetId: 'monthly-earnings',
      title: 'Zarobki',
      description: 'Tutaj widzisz automatycznie obliczone zarobki na podstawie kalendarza.',
      position: 'top' as const,
    },
  ],
  goals: [
    {
      id: 'goals-1',
      targetId: 'add-goal-btn',
      title: 'Dodaj Cel',
      description: 'Utwórz nowy cel finansowy.',
      position: 'bottom' as const,
    },
    {
      id: 'goals-2',
      targetId: 'goals-list',
      title: 'Twoje Cele',
      description: 'Śledź postęp swoich celów finansowych. Kliknij cel, aby dodać środki.',
      position: 'top' as const,
    },
  ],
};

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState<string | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`tutorials-${user.id}`);
      if (saved) {
        setCompletedTutorials(JSON.parse(saved));
      }
    }
  }, [user]);

  const steps = activeTutorial ? TUTORIALS[activeTutorial as keyof typeof TUTORIALS] || [] : [];

  const startTutorial = (tutorialId: string) => {
    if (!isTutorialCompleted(tutorialId)) {
      setActiveTutorial(tutorialId);
      setCurrentStep(0);
      setIsActive(true);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    completeTutorial();
  };

  const completeTutorial = () => {
    if (activeTutorial && user) {
      const updated = [...completedTutorials, activeTutorial];
      setCompletedTutorials(updated);
      localStorage.setItem(`tutorials-${user.id}`, JSON.stringify(updated));
    }
    setIsActive(false);
    setActiveTutorial(null);
    setCurrentStep(0);
  };

  const isTutorialCompleted = (tutorialId: string) => {
    return completedTutorials.includes(tutorialId);
  };

  return (
    <TutorialContext.Provider
      value={{
        currentStep,
        isActive,
        steps,
        startTutorial,
        nextStep,
        prevStep,
        skipTutorial,
        completeTutorial,
        isTutorialCompleted,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
}
