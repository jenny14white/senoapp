import { X, User, UserCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatar: AvatarOption) => void;
  currentAvatar: AvatarOption;
}

export interface AvatarOption {
  type: 'color' | 'gender';
  value: string;
}

const AVATAR_COLORS = [
  { name: 'Fioletowy', gradient: 'from-violet-500 to-purple-600' },
  { name: 'Niebieski', gradient: 'from-blue-500 to-indigo-600' },
  { name: 'Zielony', gradient: 'from-green-500 to-emerald-600' },
  { name: 'Różowy', gradient: 'from-pink-500 to-rose-600' },
  { name: 'Pomarańczowy', gradient: 'from-orange-500 to-amber-600' },
  { name: 'Czerwony', gradient: 'from-red-500 to-pink-600' },
  { name: 'Oliwkowy', gradient: 'from-olive-500 to-olive-600' },
  { name: 'Turkusowy', gradient: 'from-cyan-500 to-teal-600' },
];

const GENDER_OPTIONS = [
  { icon: '👩', value: 'female' },
  { icon: '👨', value: 'male' },
  { icon: '🧑', value: 'person' },
  { icon: '👶', value: 'baby' },
  { icon: '🦸', value: 'superhero' },
  { icon: '🧙', value: 'wizard' },
  { icon: '🐱', value: 'cat' },
  { icon: '🐶', value: 'dog' },
  { icon: '🦊', value: 'fox' },
  { icon: '🐼', value: 'panda' },
  { icon: '🦁', value: 'lion' },
  { icon: '🐯', value: 'tiger' },
  { icon: '🐨', value: 'koala' },
  { icon: '🐻', value: 'bear' },
  { icon: '🦄', value: 'unicorn' },
  { icon: '🐉', value: 'dragon' },
  { icon: '🌟', value: 'star' },
  { icon: '⚡', value: 'lightning' },
  { icon: '💎', value: 'gem' },
  { icon: '👑', value: 'crown' },
];

export function AvatarPickerModal({ isOpen, onClose, onSelect, currentAvatar }: AvatarPickerModalProps) {
  const [selectedType, setSelectedType] = useState<'color' | 'gender'>(currentAvatar.type);
  const [selectedValue, setSelectedValue] = useState(currentAvatar.value);

  const handleSave = () => {
    onSelect({ type: selectedType, value: selectedValue });
    onClose();
  };

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
              className="bg-white dark:bg-[#17122A] rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-200/50 dark:border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Wybierz Avatar
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Tab Selection */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setSelectedType('color')}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all ${
                    selectedType === 'color'
                      ? 'bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] text-gray-900 dark:text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Kolor
                </button>
                <button
                  onClick={() => setSelectedType('gender')}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all ${
                    selectedType === 'gender'
                      ? 'bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] text-gray-900 dark:text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Postać
                </button>
              </div>

              {/* Color Selection */}
              {selectedType === 'color' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-4 gap-3 mb-6"
                >
                  {AVATAR_COLORS.map((color) => (
                    <motion.button
                      key={color.gradient}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedValue(color.gradient)}
                      className={`relative aspect-square rounded-2xl bg-gradient-to-br ${color.gradient} flex items-center justify-center transition-all ${
                        selectedValue === color.gradient ? 'ring-4 ring-olive-500 dark:ring-violet-400 ring-offset-2 dark:ring-offset-[#17122A]' : ''
                      }`}
                    >
                      <User className="w-8 h-8 text-gray-100" />
                      {selectedValue === color.gradient && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Gender Selection */}
              {selectedType === 'gender' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-4 gap-3 mb-6 max-h-80 overflow-y-auto pr-2"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  {GENDER_OPTIONS.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedValue(option.value)}
                      className={`relative aspect-square rounded-2xl flex items-center justify-center transition-all ${
                        selectedValue === option.value
                          ? 'bg-gradient-to-br from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] shadow-xl ring-4 ring-[#9fa659]/40 dark:ring-[#9A7490]/40 ring-offset-2 dark:ring-offset-[#17122A]'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-3xl">{option.icon}</span>
                      {selectedValue === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] text-white font-medium hover:shadow-lg transition-all"
                >
                  Zapisz
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}