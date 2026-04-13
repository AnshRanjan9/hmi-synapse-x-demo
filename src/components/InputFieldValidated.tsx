import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface InputFieldValidatedProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  validate: (val: string) => string | null; // Returns error message or null if valid
  unit?: string;
  type?: string;
}

export function InputFieldValidated({ label, value, onChange, validate, unit, type = "text" }: InputFieldValidatedProps) {
  const [error, setError] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (isTouched) {
      setError(validate(value));
    }
  }, [value, isTouched, validate]);

  const isValid = isTouched && !error;
  const isInvalid = isTouched && error;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-secondary">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!isTouched) setIsTouched(true);
          }}
          onBlur={() => setIsTouched(true)}
          className={cn(
            "w-full bg-bg-secondary border rounded-md px-4 py-2.5 text-text-primary font-mono focus:outline-none focus:ring-2 transition-all",
            !isTouched && "border-surface focus:border-accent-primary focus:ring-accent-primary/20",
            isValid && "border-success focus:border-success focus:ring-success/20",
            isInvalid && "border-danger focus:border-danger focus:ring-danger/20"
          )}
        />
        {unit && (
          <span className="absolute right-10 top-1/2 -translate-y-1/2 text-text-secondary font-mono text-sm">
            {unit}
          </span>
        )}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isValid && <CheckCircle2 className="w-5 h-5 text-success" />}
          {isInvalid && <AlertCircle className="w-5 h-5 text-danger" />}
        </div>
      </div>
      {isInvalid && (
        <motion.span 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-danger font-medium mt-1"
        >
          {error}
        </motion.span>
      )}
    </div>
  );
}
