import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Wprowadź adres email');
      return;
    }
    
    setIsLoading(true);
    try {
      await resetPassword(email);
      setEmailSent(true);
      toast.success('Link do resetowania hasła został wysłany');
    } catch (error: any) {
      toast.error(error.message || 'Błąd wysyłania emaila');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#556B2F] via-[#6B8E23] to-[#808000]">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#2F4F2F] mb-2">Email wysłany!</h1>
            <p className="text-muted-foreground mb-6">
              Sprawdź swoją skrzynkę pocztową. Wysłaliśmy link do resetowania hasła na adres <strong>{email}</strong>.
            </p>
            <Link to="/login">
              <Button className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#556B2F] to-[#6B8E23] hover:from-[#4A5F28] hover:to-[#5D7A1F] text-white">
                Wróć do logowania
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#556B2F] via-[#6B8E23] to-[#808000]">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-[#2F4F2F] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Wróć do logowania
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2F4F2F] mb-2">Resetuj hasło</h1>
            <p className="text-muted-foreground">
              Wprowadź swój adres email, a wyślemy Ci link do resetowania hasła.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="twoj@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-2xl"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#556B2F] to-[#6B8E23] hover:from-[#4A5F28] hover:to-[#5D7A1F] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wysyłanie...
                </>
              ) : (
                'Wyślij link resetujący'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}