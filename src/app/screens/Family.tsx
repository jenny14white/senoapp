import { motion } from 'framer-motion';
import { useState } from 'react';
import { Users, Plus, Trash2, Settings, Copy, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useExtendedApp } from '../contexts/ExtendedAppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';

export function Family() {
  const { userData } = useApp();
  const { familyMembers, addFamilyMember, removeFamilyMember, updateFamilyPermissions } = useExtendedApp();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [memberCode, setMemberCode] = useState('');
  const [memberName, setMemberName] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(userData.userCode);
    setCodeCopied(true);
    toast.success('Kod skopiowany do schowka');
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleAddMember = () => {
    if (!memberCode || !memberName) {
      toast.error('Wypełnij wszystkie pola');
      return;
    }

    addFamilyMember(memberCode, memberName, {
      viewExpenses: true,
      viewIncome: true,
      viewGoals: true,
      viewBills: true,
      fullAccess: false,
    });

    toast.success('Członek rodziny dodany');
    setMemberCode('');
    setMemberName('');
    setShowAddDialog(false);
  };

  const handleRemoveMember = (code: string, name: string) => {
    if (window.confirm(`Czy na pewno chcesz usunąć ${name} z rodziny?`)) {
      removeFamilyMember(code);
      toast.success('Członek rodziny usunięty');
    }
  };

  return (
    <div className="py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Rodzina
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Zarządzaj dostępem do swoich danych finansowych
        </p>
      </motion.div>

      {/* Your Code */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#556B2F] to-[#6B8E23] dark:from-violet-500 dark:to-purple-600 rounded-3xl p-6 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white/90 text-sm font-medium">Twój kod rodziny</p>
            <p className="text-white text-xs">Udostępnij go członkom rodziny</p>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between">
          <code className="text-2xl font-bold text-white tracking-wider">
            {userData.userCode}
          </code>
          <Button
            onClick={copyCode}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white rounded-xl"
          >
            {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </motion.div>

      {/* Add Member Button */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Button className="w-full h-14 rounded-2xl bg-white/60 dark:bg-[#17122A]/60 backdrop-blur-xl border border-gray-200/20 dark:border-white/10 hover:bg-white dark:hover:bg-[#17122A] text-gray-900 dark:text-gray-100">
            <Plus className="w-5 h-5 mr-2" />
            Dodaj członka rodziny
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Dodaj członka rodziny</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="memberName">Imię</Label>
              <Input
                id="memberName"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Np. Maria"
                className="rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberCode">Kod rodziny</Label>
              <Input
                id="memberCode"
                value={memberCode}
                onChange={(e) => setMemberCode(e.target.value.toUpperCase())}
                placeholder="ABCD1234"
                className="rounded-2xl uppercase"
                maxLength={8}
              />
            </div>
            <Button
              onClick={handleAddMember}
              className="w-full rounded-2xl bg-gradient-to-r from-[#556B2F] to-[#6B8E23] dark:from-violet-500 dark:to-purple-600 hover:from-[#4A5F28] hover:to-[#5D7A1F] text-white"
            >
              Dodaj
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Family Members List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Członkowie rodziny ({familyMembers.length})
        </h3>

        {familyMembers.length === 0 ? (
          <div className="bg-white/60 dark:bg-[#17122A]/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/20 dark:border-white/10 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Nie masz jeszcze żadnych członków rodziny
            </p>
          </div>
        ) : (
          familyMembers.map((member) => (
            <div
              key={member.code}
              className="bg-white/60 dark:bg-[#17122A]/60 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/20 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {member.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Kod: {member.code}
                  </p>
                </div>
                <Button
                  onClick={() => handleRemoveMember(member.code, member.name)}
                  variant="destructive"
                  size="sm"
                  className="rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pełny dostęp</span>
                  <Switch
                    checked={member.permissions.fullAccess}
                    onCheckedChange={(checked) =>
                      updateFamilyPermissions(member.code, { fullAccess: checked })
                    }
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
}