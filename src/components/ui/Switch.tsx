import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { soundManager } from '@/lib/audio';

export function Switch({ checked, onChange, label }: { checked: boolean, onChange: (c: boolean) => void, label?: string }) {
  const handleClick = () => {
    soundManager.play('toggle');
    onChange(!checked);
  };

  return (
    <div 
      className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border bg-bg-secondary hover:border-accent-primary/50 transition-colors cursor-pointer" 
      onClick={handleClick}
      onMouseEnter={() => soundManager.play('hover')}
    >
      {label && <span className="text-sm font-medium text-text-primary">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary",
          checked ? "bg-accent-primary" : "bg-surface border-border"
        )}
      >
        <motion.span
          layout
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0 bg-text-secondary"
          )}
        />
      </button>
    </div>
  );
}
