import { useStore } from '@/store/useStore';
import { AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export function AlertBanner() {
  const { alerts, removeAlert } = useStore();

  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex flex-col items-center pt-4 pointer-events-none">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn(
              "pointer-events-auto mb-2 flex items-center gap-3 px-4 py-3 rounded-md shadow-lg border min-w-[400px]",
              alert.level === 'info' && "bg-surface border-accent-primary/30 text-text-primary",
              alert.level === 'warning' && "bg-warning/10 border-warning/30 text-warning",
              alert.level === 'critical' && "bg-danger/10 border-danger/30 text-danger"
            )}
          >
            {alert.level === 'info' && <Info className="w-5 h-5 text-accent-primary" />}
            {alert.level === 'warning' && <AlertTriangle className="w-5 h-5" />}
            {alert.level === 'critical' && <AlertCircle className="w-5 h-5" />}
            
            <span className="flex-1 font-medium text-sm">{alert.message}</span>
            
            <button 
              onClick={() => removeAlert(alert.id)}
              className="p-1 hover:bg-black/10 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
