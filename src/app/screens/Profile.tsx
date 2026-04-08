import { User, Palette, LogOut, Copy, Check, Link as LinkIcon, X, Settings, Trash2, Download, Upload, DollarSign, Target, Receipt, Users as UsersIcon, Lock, StickyNote, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp, IncomeType } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useExtendedApp } from '../contexts/ExtendedAppContext';
import { useTheme, THEMES } from '../contexts/ThemeContext';
import { ConnectPartnerModal } from '../components/modals/ConnectPartnerModal';
import { AvatarPickerModal, AvatarOption } from '../components/modals/AvatarPickerModal';
import { ChangePasswordModal } from '../components/modals/ChangePasswordModal';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

export function Profile() {
  const { userData, updateUserData, getMonthlyIncome, appData } = useApp();
  const { themeName, setTheme } = useTheme();
  const { logout } = useAuth();
  const { notes, addNote } = useExtendedApp();
  const navigate = useNavigate();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [name, setName] = useState(userData.name);
  const [copiedCode, setCopiedCode] = useState(false);
  const [noteContent, setNoteContent] = useState(notes.length > 0 ? notes[0].content : '');

  const monthlyIncome = getMonthlyIncome(true);
  const activeGoals = appData.own.goals.length;
  const fixedExpenses = appData.own.expenses.filter(e => e.isFixed).length;

  const incomeTypeLabels: Record<IncomeType, string> = {
    hourly: 'Godzinowy',
    per_km: 'Za kilometr',
    daily: 'Dzienny',
    monthly: 'Miesięczny',
  };

  const incomeTypeRateLabels: Record<IncomeType, string> = {
    hourly: 'Stawka godzinowa',
    per_km: 'Stawka za km',
    daily: 'Stawka dzienna',
    monthly: 'Stawka miesięczna',
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userData.userCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveName = () => {
    if (name.trim()) {
      updateUserData({ name: name.trim() });
      setShowEditName(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSaveNotes = () => {
    addNote(noteContent);
    toast.success('Notatki zapisane!');
  };

  const handleAvatarSelect = (avatar: AvatarOption) => {
    updateUserData({ avatar });
    toast.success('Avatar zaktualizowany!');
  };

  const getAvatarDisplay = () => {
    if (!userData.avatar || userData.avatar.type === 'color') {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAvatarModal(true)}
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl cursor-pointer transition-all hover:shadow-2xl"
          style={{ background: `linear-gradient(to bottom right, var(--color-accent), var(--color-primary))` }}
        >
          <User className="w-10 h-10 text-white" />
        </motion.button>
      );
    } else {
      // Map values to icons
      const iconMap: Record<string, string> = {
        'female': '👩',
        'male': '👨',
        'person': '🧑',
        'baby': '👶',
        'superhero': '🦸',
        'wizard': '🧙',
        'cat': '🐱',
        'dog': '🐶',
        'fox': '🦊',
        'panda': '🐼',
        'lion': '🦁',
        'tiger': '🐯',
        'koala': '🐨',
        'bear': '🐻',
        'unicorn': '🦄',
        'dragon': '🐉',
        'star': '🌟',
        'lightning': '⚡',
        'gem': '💎',
        'crown': '👑',
      };
      const icon = iconMap[userData.avatar.value] || '👤';
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAvatarModal(true)}
          className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl cursor-pointer transition-all hover:shadow-2xl text-4xl"
        >
          {icon}
        </motion.button>
      );
    }
  };

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        {getAvatarDisplay()}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {userData.name}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Zarządzanie kontem
        </p>
      </div>

      {/* User Data Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl rounded-3xl p-6 border border-gray-200/20 dark:border-white/10"
        style={{ backgroundColor: 'var(--color-card-bg-solid)' }}
      >
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Dane użytkownika
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Imię</span>
            {showEditName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] text-white text-sm"
                >
                  Zapisz
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowEditName(true)}
                className="font-medium text-gray-900 dark:text-gray-100"
              >
                {userData.name}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-xl rounded-3xl p-6 border border-gray-200/20 dark:border-white/10"
        style={{ backgroundColor: 'var(--color-card-bg-solid)' }}
      >
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Podsumowanie
        </h2>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2"
              style={{ background: 'linear-gradient(to bottom right, #10b981, #059669)' }}
            >
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dochód</p>
            <p className="font-bold text-gray-900 dark:text-gray-100">
              {monthlyIncome.toLocaleString('pl-PL', { maximumFractionDigits: 0 })} zł
            </p>
          </div>

          <div className="text-center">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2"
              style={{ background: `linear-gradient(to bottom right, var(--color-accent), var(--color-primary))` }}
            >
              <Target className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cele</p>
            <p className="font-bold text-gray-900 dark:text-gray-100">{activeGoals}</p>
          </div>

          <div className="text-center">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2"
              style={{ background: 'linear-gradient(to bottom right, #f97316, #dc2626)' }}
            >
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Stałe</p>
            <p className="font-bold text-gray-900 dark:text-gray-100">{fixedExpenses}</p>
          </div>
        </div>
      </motion.div>

      {/* Partner Connection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="backdrop-blur-xl rounded-3xl p-6 border border-gray-200/20 dark:border-white/10"
        style={{ backgroundColor: 'var(--color-card-bg-solid)' }}
      >
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5" />
          Połączenie z partnerem
        </h2>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Twój kod połączenia
            </p>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono text-lg text-center text-gray-900 dark:text-gray-100">
                {userData.userCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] flex items-center justify-center hover:shadow-lg transition-colors"
              >
                <Copy className="w-5 h-5 text-white" />
              </button>
            </div>
            {copiedCode && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Kod skopiowany!
              </p>
            )}
          </div>

          {userData.partnerCode ? (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                ✓ Połączono z partnerem
              </p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                Kod: {userData.partnerCode}
              </p>
            </div>
          ) : (
            <button
              onClick={() => setShowConnectModal(true)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] text-white font-medium hover:shadow-lg transition-all"
            >
              Połącz z partnerem
            </button>
          )}
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="backdrop-blur-xl rounded-3xl p-6 border border-gray-200/20 dark:border-white/10"
        style={{ backgroundColor: 'var(--color-card-bg-solid)' }}
      >
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Ustawienia
        </h2>
        
        <div className="space-y-3">
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              Motyw
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {THEMES[themeName].name}
              </span>
              <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
          </button>

          {showThemePicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 gap-3 p-2"
            >
              {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((themeKey) => {
                const themeData = THEMES[themeKey];
                const isSelected = themeName === themeKey;
                return (
                  <motion.button
                    key={themeKey}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setTheme(themeKey);
                      toast.success(`Zmieniono motyw na: ${themeData.name}`);
                    }}
                    className={`relative p-3 rounded-xl transition-all ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800'
                        : 'hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${themeData.colors.primary} 0%, ${themeData.colors.primaryDark} 100%)`,
                      ringColor: isSelected ? themeData.colors.accent : undefined,
                    }}
                  >
                    <p className="text-white text-xs font-medium mb-2">
                      {themeData.name}
                    </p>
                    <div className="flex gap-1">
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: themeData.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: themeData.colors.primaryDark }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: themeData.colors.accent }}
                      />
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xs">✓</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          <button
            onClick={() => navigate('/family')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              Rodzina
            </span>
            <UsersIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={() => setShowChangePasswordModal(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              Zmień hasło
            </span>
            <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <span className="font-medium">
              Wyloguj się
            </span>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Notes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 dark:bg-[#17122A]/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-white/10 shadow-lg"
      >
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          Moje Notatki
        </h2>
        
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Zarządzaj swoimi notatkami, pomysłami i przypomnieniami
        </p>

        <button
          onClick={() => navigate('/notes')}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] text-white hover:shadow-lg transition-all"
        >
          <span className="font-medium">
            Przejdź do notatek
          </span>
          <StickyNote className="w-5 h-5" />
        </button>
      </motion.div>

      <ConnectPartnerModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
      <AvatarPickerModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={userData.avatar || { type: 'color', value: 'from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A]' }}
      />
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
}