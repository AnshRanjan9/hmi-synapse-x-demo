import { create } from 'zustand';

export type AlertLevel = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  message: string;
  level: AlertLevel;
  timestamp: number;
}

export interface MachineState {
  spindleSpeed: number;
  temperature: number;
  vibration: number;
  pressure: number;
  powerDraw: number;
  status: 'running' | 'idle' | 'error';
}

export type MachineType = 'drilling' | 'milling' | 'turning';

interface AppState {
  theme: 'dark' | 'light';
  selectedMachine: MachineType;
  machines: Record<MachineType, MachineState>;
  alerts: Alert[];
  setTheme: (theme: 'dark' | 'light') => void;
  setSelectedMachine: (machine: MachineType) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  removeAlert: (id: string) => void;
  updateMachineState: (machine: MachineType, state: Partial<MachineState>) => void;
}

const initialMachineState: MachineState = {
  spindleSpeed: 1200,
  temperature: 45,
  vibration: 0.2,
  pressure: 101.3,
  powerDraw: 12.5,
  status: 'running',
};

export const useStore = create<AppState>((set) => ({
  theme: 'dark',
  selectedMachine: 'drilling',
  machines: {
    drilling: { ...initialMachineState },
    milling: { ...initialMachineState, spindleSpeed: 800, temperature: 55, pressure: 110.5, powerDraw: 18.2 },
    turning: { ...initialMachineState, spindleSpeed: 1500, temperature: 40, vibration: 0.1, powerDraw: 15.0 },
  },
  alerts: [
    { id: '1', message: 'System initialized successfully.', level: 'info', timestamp: Date.now() }
  ],
  setTheme: (theme) => {
    set({ theme });
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  },
  setSelectedMachine: (machine) => set({ selectedMachine: machine }),
  addAlert: (alert) => set((state) => ({
    alerts: [...state.alerts, { ...alert, id: Math.random().toString(36).substring(7), timestamp: Date.now() }]
  })),
  removeAlert: (id) => set((state) => ({
    alerts: state.alerts.filter(a => a.id !== id)
  })),
  updateMachineState: (machine, newState) => set((state) => ({
    machines: {
      ...state.machines,
      [machine]: { ...state.machines[machine], ...newState }
    }
  }))
}));
