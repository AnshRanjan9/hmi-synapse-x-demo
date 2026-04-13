import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { Card } from './ui/Card';

interface TelemetryCardProps {
  title: string;
  value: number | string;
  unit: string;
  state?: 'normal' | 'warning' | 'critical';
  trend?: number;
  decimals?: number;
}

export function TelemetryCard({ title, value, unit, state = 'normal', trend, decimals = 1 }: TelemetryCardProps) {
  return (
    <Card className={cn(
      "flex flex-col transition-all duration-300",
      state === 'normal' && "hover:border-accent-primary/50",
      state === 'warning' && "border-warning/50 bg-warning/5",
      state === 'critical' && "border-danger/50 bg-danger/5"
    )}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">{title}</h3>
        {state !== 'normal' && (
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            state === 'warning' ? "bg-warning" : "bg-danger"
          )} />
        )}
      </div>
      
      <div className="flex items-baseline gap-2 mt-auto">
        <motion.span 
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "text-4xl font-mono font-light tracking-tight",
            state === 'normal' && "text-text-primary",
            state === 'warning' && "text-warning",
            state === 'critical' && "text-danger"
          )}
        >
          {typeof value === 'number' ? value.toFixed(decimals) : value}
        </motion.span>
        <span className="text-text-secondary font-mono text-sm">{unit}</span>
      </div>

      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1">
          <span className={cn(
            "text-xs font-mono",
            trend > 0 ? "text-success" : trend < 0 ? "text-danger" : "text-text-secondary"
          )}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '−'} {Math.abs(trend)}%
          </span>
          <span className="text-xs text-text-secondary">vs last hour</span>
        </div>
      )}
    </Card>
  );
}
