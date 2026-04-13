import { cn } from '@/lib/utils';

export function Badge({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline', className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-mono uppercase tracking-wider",
      variant === 'default' && "bg-accent-primary/10 text-accent-primary border border-accent-primary/20",
      variant === 'success' && "bg-success/10 text-success border border-success/20",
      variant === 'warning' && "bg-warning/10 text-warning border border-warning/20",
      variant === 'danger' && "bg-danger/10 text-danger border border-danger/20",
      variant === 'outline' && "border border-border text-text-secondary",
      className
    )}>
      {children}
    </span>
  );
}
