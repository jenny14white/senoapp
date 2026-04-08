import { ButtonHTMLAttributes } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function PrimaryButton({ children, className = '', ...props }: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-xl text-white font-medium hover:shadow-lg transition-all ${className}`}
      style={{ background: 'linear-gradient(to right, var(--color-accent), var(--color-primary))' }}
    >
      {children}
    </button>
  );
}

export function ModalContainer({ children, onClick }: { children: React.ReactNode; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <div
      className="rounded-3xl p-6 w-full shadow-2xl"
      style={{ backgroundColor: 'var(--color-background)' }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
