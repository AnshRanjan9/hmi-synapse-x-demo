import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export function ProgressBar({ value, max = 100, label, colorClass = "bg-accent-primary" }: { value: number, max?: number, label?: string, colorClass?: string }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs font-mono text-text-secondary mb-1">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 bg-bg-secondary rounded-full overflow-hidden border border-border">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorClass)}
        />
      </div>
    </div>
  );
}
