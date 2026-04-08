import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotes } from '../contexts/NotesContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Plus, Edit2, Trash2, Share2, Clock, Sparkles, FileText, X } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';

export function Notes() {
  const { notes, isLoading, addNote, updateNote, deleteNote } = useNotes();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [viewingNote, setViewingNote] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const handleAdd = async () => {
    if (!formData.title.trim()) {
      toast.error('Tytuł notatki jest wymagany');
      return;
    }

    try {
      await addNote(formData);
      setFormData({ title: '', content: '' });
      setIsAddDialogOpen(false);
      toast.success('Notatka została dodana');
    } catch (error) {
      toast.error('Błąd podczas dodawania notatki');
    }
  };

  const handleEdit = async (id: string) => {
    if (!formData.title.trim()) {
      toast.error('Tytuł notatki jest wymagany');
      return;
    }

    try {
      await updateNote(id, formData);
      setFormData({ title: '', content: '' });
      setEditingNote(null);
      toast.success('Notatka została zaktualizowana');
    } catch (error) {
      toast.error('Błąd podczas aktualizacji notatki');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      toast.success('Notatka została usunięta');
    } catch (error) {
      toast.error('Błąd podczas usuwania notatki');
    }
  };

  const openEditDialog = (note: any) => {
    setFormData({ title: note.title, content: note.content });
    setEditingNote(note.id);
  };

  const openViewDialog = (note: any) => {
    setViewingNote(note.id);
  };

  const viewingNoteData = notes.find((n) => n.id === viewingNote);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="w-7 h-7 text-olive-600 dark:text-violet-400" />
            Notatki
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Twoje prywatne notatki i pomysły
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nowa Notatka</span>
            </motion.button>
          </DialogTrigger>
          <DialogContent className="bg-white/95 dark:bg-[#17122A]/95 backdrop-blur-xl border border-gray-200/50 dark:border-white/10">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-olive-600 dark:text-violet-400" />
                Nowa Notatka
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Tytuł
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Wpisz tytuł..."
                  className="bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-700 focus:ring-olive-500 dark:focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Treść
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Wpisz treść notatki..."
                  rows={8}
                  className="bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-700 focus:ring-olive-500 dark:focus:ring-violet-500"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-olive-600 to-olive-700 dark:from-violet-500 dark:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Dodaj Notatkę
              </motion.button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-olive-600/30 dark:border-violet-600/30 border-t-olive-600 dark:border-t-violet-600 rounded-full"
          />
        </div>
      ) : notes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/60 dark:bg-[#17122A]/60 backdrop-blur-xl rounded-3xl p-12 text-center border border-gray-200/20 dark:border-white/10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#efeeb6] to-[#b7b094] dark:from-[#63335A]/30 dark:to-[#9A7490]/30 mb-4"
          >
            <FileText className="w-10 h-10 text-[#797641] dark:text-[#9A7490]" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Brak notatek
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Utwórz swoją pierwszą notatkę, aby zacząć
          </p>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card
                  className="h-full bg-white/80 dark:bg-[#17122A]/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 hover:border-olive-300 dark:hover:border-violet-500/50 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => openViewDialog(note)}
                >
                  {/* Gradient accent */}
                  <div className="h-1.5 bg-gradient-to-r from-olive-500 to-olive-600 dark:from-violet-500 dark:to-purple-600" />
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 pr-2 line-clamp-2">
                        {note.title}
                      </h3>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(note);
                          }}
                          className="w-8 h-8 rounded-lg bg-olive-100 dark:bg-violet-900/30 hover:bg-olive-200 dark:hover:bg-violet-900/50 flex items-center justify-center transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-olive-700 dark:text-violet-400" />
                        </motion.button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 flex items-center justify-center transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </motion.button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white/95 dark:bg-[#17122A]/95 backdrop-blur-xl border border-gray-200/50 dark:border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                                Czy na pewno?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                Ta akcja nie może być cofnięta. Notatka zostanie trwale usunięta.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">
                                Anuluj
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(note.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Usuń
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-4 mb-4 min-h-[5rem]">
                      {note.content || 'Brak treści...'}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-white/10">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {format(note.createdAt, 'dd MMM yyyy', { locale: pl })}
                      </div>
                      {note.sharedWith && note.sharedWith.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-olive-600 dark:text-violet-400">
                          <Share2 className="w-3.5 h-3.5" />
                          Udostępniona
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* View Note Dialog */}
      <AnimatePresence>
        {viewingNote && (
          <Dialog open={!!viewingNote} onOpenChange={(open) => !open && setViewingNote(null)}>
            <DialogContent className="bg-white/95 dark:bg-[#17122A]/95 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-olive-500 to-olive-600 dark:from-violet-500 dark:to-purple-600 rounded-t-lg" />
                
                <DialogHeader className="pt-2">
                  <DialogTitle className="text-2xl text-gray-900 dark:text-gray-100 flex items-start justify-between gap-4">
                    <span className="flex-1">{viewingNoteData?.title}</span>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setViewingNote(null)}
                      className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {viewingNoteData?.content || 'Brak treści...'}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-white/10 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Utworzono: {viewingNoteData && format(viewingNoteData.createdAt, 'dd MMMM yyyy, HH:mm', { locale: pl })}
                    </p>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Edit Note Dialog */}
      <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
        <DialogContent className="bg-white/95 dark:bg-[#17122A]/95 backdrop-blur-xl border border-gray-200/50 dark:border-white/10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-olive-500 to-olive-600 dark:from-violet-500 dark:to-purple-600 rounded-t-lg" />
            
            <DialogHeader className="pt-2">
              <DialogTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-olive-600 dark:text-violet-400" />
                Edytuj Notatkę
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Tytuł
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Wpisz tytuł..."
                  className="bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-700 focus:ring-olive-500 dark:focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Treść
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Wpisz treść notatki..."
                  rows={8}
                  className="bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-700 focus:ring-olive-500 dark:focus:ring-violet-500"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => editingNote && handleEdit(editingNote)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-olive-600 to-olive-700 dark:from-violet-500 dark:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Zapisz Zmiany
              </motion.button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}