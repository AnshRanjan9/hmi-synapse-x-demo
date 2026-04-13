import { Factory, Search, Bell, User, AlertTriangle, Info } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function TopBar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { alerts } = useStore();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-bg-secondary/80 backdrop-blur-xl border-b border-border">
      {/* Factory Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-accent-primary">
          <Factory className="w-6 h-6 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
          <span className="text-xl font-bold tracking-tight text-white">Synapse X</span>
        </div>
        <div className="h-6 w-px bg-border mx-2" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-primary">Factory_BS23 (Peenya)</span>
          <span className="text-xs text-text-secondary">Morning Shift</span>
        </div>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-accent-primary transition-colors" />
          <input
            type="text"
            placeholder="Search assets, orders..."
            onFocus={() => soundManager.play('hover')}
            className="w-full min-h-[44px] bg-bg-primary border border-border rounded-full py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg-secondary shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all"
          />
        </div>
      </div>

      {/* Notifications & Profile */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            className="relative w-11 h-11 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
            onMouseEnter={() => soundManager.play('hover')}
            onClick={() => {
              soundManager.play('click');
              setShowNotifications(!showNotifications);
            }}
          >
            <Bell className="w-5 h-5" />
            {alerts.length > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
              </>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-bg-secondary border border-border rounded-lg shadow-xl overflow-hidden z-50"
              >
                <div className="p-3 border-b border-border bg-surface flex justify-between items-center">
                  <h3 className="font-medium text-text-primary">Notifications</h3>
                  <span className="text-xs bg-bg-primary px-2 py-1 rounded-full text-text-secondary">{alerts.length} New</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <div key={alert.id} className="p-3 border-b border-border hover:bg-surface transition-colors">
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            {alert.level === 'critical' ? (
                              <AlertTriangle className="w-4 h-4 text-danger" />
                            ) : alert.level === 'warning' ? (
                              <AlertTriangle className="w-4 h-4 text-warning" />
                            ) : (
                              <Info className="w-4 h-4 text-accent-primary" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-text-primary">{alert.message}</p>
                            <p className="text-xs text-text-secondary mt-1">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-text-secondary">
                      No new notifications
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-text-primary">Ansh Ranjan</span>
            <span className="text-xs text-success">Admin | Active</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => soundManager.play('hover')}
            onClick={() => soundManager.play('click')}
            className="w-11 h-11 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
          >
            <User className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
