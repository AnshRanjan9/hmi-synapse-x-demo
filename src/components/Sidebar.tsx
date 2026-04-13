import { Link, useLocation } from 'react-router-dom';
import { Activity, Box, Sliders, Wrench, ShieldAlert, Truck, Sparkles, ClipboardList, LineChart, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { soundManager } from '@/lib/audio';
import { useStore } from '@/store/useStore';

const navItems = [
  { name: 'Dashboard', path: '/', icon: Activity },
  { name: 'Analytics', path: '/analytics', icon: LineChart },
  { name: 'Digital Twin', path: '/digital-twin', icon: Box },
  { name: 'Process Control', path: '/process-control', icon: Sliders },
  { name: 'Work Orders', path: '/work-orders', icon: ClipboardList },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'Safety', path: '/safety', icon: ShieldAlert },
  { name: 'Logistics', path: '/logistics', icon: Truck },
  { name: 'AI Assistant', path: '/ai-assistant', icon: Sparkles },
];

export function Sidebar() {
  const location = useLocation();
  const { theme, setTheme } = useStore();

  return (
    <div className="w-64 bg-bg-secondary border-r border-border h-full flex flex-col">
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onMouseEnter={() => soundManager.play('hover')}
              onClick={() => soundManager.play('click')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary",
                isActive 
                  ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20" 
                  : "text-text-secondary hover:bg-surface hover:text-text-primary border border-transparent"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <button
          onClick={() => {
            soundManager.play('click');
            setTheme(theme === 'dark' ? 'light' : 'dark');
          }}
          onMouseEnter={() => soundManager.play('hover')}
          className="flex items-center gap-3 px-4 py-3 w-full min-h-[44px] rounded-md transition-all duration-200 text-text-secondary hover:bg-surface hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="font-medium text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </div>
  );
}
