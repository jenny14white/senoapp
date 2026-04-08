import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Expense, ExpenseCategory, useApp } from '../../contexts/AppContext';
import { useView } from '../../contexts/ViewContext';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId: string | null;
}

const categories: { value: ExpenseCategory; label: string }[] = [
  { value: 'food', label: 'Jedzenie' },
  { value: 'transport', label: 'Transport' },
  { value: 'housing', label: 'Mieszkanie' },
  { value: 'entertainment', label: 'Rozrywka' },
  { value: 'health', label: 'Zdrowie' },
  { value: 'other', label: 'Inne' },
];

export function EditExpenseModal({ isOpen, onClose, expenseId }: EditExpenseModalProps) {
  const { appData, updateExpense, deleteExpense } = useApp();
  const { viewMode } = useView();
  
  const isOwn = viewMode === 'own';
  const expense = appData[isOwn ? 'own' : 'partner'].expenses.find(e => e.id === expenseId);
  
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory>('other');

  useEffect(() => {
    if (isOpen && expense) {
      setName(expense.name);
      setAmount(expense.amount.toString());
      setDate(expense.date);
      setIsPaid(expense.isPaid);
      setIsFixed(expense.isFixed);
      setCategory(expense.category || 'other');
    }
  }, [isOpen, expense]);

  const handleSave = () => {
    if (!expense || !name || !amount || !date) {
      toast.error('Wypełnij wszystkie pola');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Podaj poprawną kwotę');
      return;
    }

    updateExpense(
      expense.id,
      {
        name,
        amount: amountNum,
        date,
        isPaid,
        isFixed,
        category,
      },
      isOwn
    );

    toast.success('Wydatek zaktualizowany');
    onClose();
  };

  const handleDelete = () => {
    if (!expense) return;
    
    if (window.confirm('Czy na pewno chcesz usunąć ten wydatek?')) {
      deleteExpense(expense.id, isOwn);
      toast.success('Wydatek usunięty');
      onClose();
    }
  };

  if (!expense) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>Edytuj wydatek</DialogTitle>
          <DialogDescription>Edytuj szczegóły wydatku</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nazwa</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nazwa wydatku"
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Kwota (PLN)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategoria</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ExpenseCategory)}>
              <SelectTrigger className="rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isPaid">Opłacone</Label>
            <Switch id="isPaid" checked={isPaid} onCheckedChange={setIsPaid} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isFixed">Stały wydatek</Label>
            <Switch id="isFixed" checked={isFixed} onCheckedChange={setIsFixed} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="rounded-2xl"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Usuń
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[#9fa659] to-[#797641] dark:from-[#9A7490] dark:to-[#63335A] hover:from-[#8a9150] hover:to-[#6b6839] text-white"
            >
              Zapisz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}