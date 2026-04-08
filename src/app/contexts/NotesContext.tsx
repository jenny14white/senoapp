import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  sharedWith: string[];
  createdAt: Date;
  updatedAt?: Date;
}

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  addNote: (note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'sharedWith'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  shareNoteWith: (noteId: string, userId: string) => Promise<void>;
  unshareNoteWith: (noteId: string, userId: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setIsLoading(false);
      return;
    }

    // Load notes from localStorage
    const savedNotes = localStorage.getItem(`notes-${user.id}`);
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: note.updatedAt ? new Date(note.updatedAt) : undefined,
      }));
      setNotes(parsedNotes);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (user && notes.length >= 0) {
      const notesToSave = notes.map((note) => ({
        ...note,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt?.toISOString(),
      }));
      localStorage.setItem(`notes-${user.id}`, JSON.stringify(notesToSave));
    }
  }, [notes, user]);

  const addNote = async (note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'sharedWith'>) => {
    if (!user) return;

    const newNote: Note = {
      id: Date.now().toString(),
      userId: user.id,
      title: note.title,
      content: note.content,
      sharedWith: [],
      createdAt: new Date(),
    };

    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!user) return;

    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    );
  };

  const deleteNote = async (id: string) => {
    if (!user) return;

    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const shareNoteWith = async (noteId: string, userId: string) => {
    if (!user) return;

    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? { ...note, sharedWith: [...(note.sharedWith || []), userId] }
          : note
      )
    );
  };

  const unshareNoteWith = async (noteId: string, userId: string) => {
    if (!user) return;

    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? {
              ...note,
              sharedWith: (note.sharedWith || []).filter((id) => id !== userId),
            }
          : note
      )
    );
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        isLoading,
        addNote,
        updateNote,
        deleteNote,
        shareNoteWith,
        unshareNoteWith,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
}