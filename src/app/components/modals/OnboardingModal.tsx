import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useApp, IncomeType } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

interface OnboardingModalProps {
  open: boolean;
}

export function OnboardingModal({ open }: OnboardingModalProps) {
  const { updateUserData } = useApp();
  const { completeOnboarding } = useAuth();
  const [name, setName] = useState('');

  const handleContinue = () => {
    updateUserData({
      name: name.trim() || 'Użytkownik',
    });
    completeOnboarding();
    toast.success('Witaj w Seno! 🎉');
  };

  const handleSkip = () => {
    updateUserData({
      name: 'Użytkownik',
    });
    completeOnboarding();
    toast.success('Witaj w Seno! 🎉');
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Witaj w Seno! 👋
          </DialogTitle>
          <DialogDescription className="text-center">
            Zacznijmy od poznania Cię
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Jak masz na imię?</Label>
              <Input
                id="name"
                placeholder="Twoje imię"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-2xl"
                autoFocus
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleContinue}
              className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] hover:shadow-lg text-white"
            >
              Rozpocznij
            </Button>
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1 h-12 rounded-2xl"
            >
              Pomiń
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}