import { Wifi, Activity, Database, Server } from 'lucide-react';
import { useState, useEffect } from 'react';

export function BottomStrip() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-1.5 bg-bg-secondary/90 backdrop-blur-md border-t border-border font-mono text-xs">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-success">
          <Wifi className="w-3.5 h-3.5" />
          <span>Connected</span>
        </div>
        
        <div className="flex items-center gap-2 text-success">
          <Activity className="w-3.5 h-3.5" />
          <span>Line: running</span>
        </div>

        <div className="flex items-center gap-2 text-warning">
          <Database className="w-3.5 h-3.5" />
          <span>Syncing</span>
        </div>

        <div className="flex items-center gap-2 text-white">
          <Server className="w-3.5 h-3.5" />
          <span>Node: Primary</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-text-primary font-medium tracking-wider">
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>
        <div className="text-text-secondary">
          v2.4.1-stable
        </div>
      </div>
    </footer>
  );
}
