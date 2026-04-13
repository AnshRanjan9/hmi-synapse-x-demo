import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, CheckCircle2, AlertTriangle, Clock, Terminal, BrainCircuit, Timer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore, MachineType } from '@/store/useStore';
import { soundManager } from '@/lib/audio';
import { cn } from '@/lib/utils';

const generateWearData = (machine: MachineType) => {
  const base = machine === 'drilling' ? 20 : machine === 'milling' ? 30 : 15;
  return Array.from({ length: 30 }).map((_, i) => ({
    day: `D-${30 - i}`,
    primaryWear: Math.min(100, base + (i * 2.5) + (Math.random() * 5 - 2.5)),
    secondaryWear: Math.min(100, base - 5 + (i * 1.8) + (Math.random() * 3 - 1.5))
  }));
};

const tasksByMachine: Record<MachineType, any[]> = {
  drilling: [
    { id: 1, title: 'Replace Drill Bit', priority: 'critical', due: 'Today', status: 'pending' },
    { id: 2, title: 'Calibrate Z-Axis Motor', priority: 'warning', due: 'In 2 days', status: 'scheduled' },
    { id: 3, title: 'Coolant Flush', priority: 'info', due: 'In 5 days', status: 'pending' },
  ],
  milling: [
    { id: 4, title: 'Replace Milling Cutter', priority: 'critical', due: 'Tomorrow', status: 'pending' },
    { id: 5, title: 'Lubricate Guide Rails', priority: 'info', due: 'In 3 days', status: 'pending' },
  ],
  turning: [
    { id: 6, title: 'Check Chuck Alignment', priority: 'warning', due: 'Today', status: 'pending' },
    { id: 7, title: 'Replace Tailstock Seal', priority: 'info', due: 'Next week', status: 'scheduled' },
  ]
};

export function Maintenance() {
  const { selectedMachine, setSelectedMachine } = useStore();
  const [wearData, setWearData] = useState(generateWearData(selectedMachine));
  const [logs, setLogs] = useState<string[]>([
    '> SYSTEM INIT: Diagnostics module loaded.',
    '> SCANNING: Sensors 1-42...',
    '> OK: All primary sensors responding.',
  ]);

  useEffect(() => {
    setWearData(generateWearData(selectedMachine));
    setLogs([
      `> SWITCHED CONTEXT: ${selectedMachine.toUpperCase()}`,
      '> SCANNING: Local sensor array...',
      '> OK: Telemetry stream established.',
      selectedMachine === 'drilling' ? '> WARNING: Vibration anomaly detected on Drill Head A (0.24 mm/s).' : '> INFO: Nominal operation.',
      selectedMachine === 'drilling' ? '> PREDICTION: Bearing failure likely in 48-72 hours.' : ''
    ].filter(Boolean));
  }, [selectedMachine]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, `> PING: Health check OK at ${new Date().toLocaleTimeString()}`];
        if (newLogs.length > 8) newLogs.shift();
        return newLogs;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMachineSelect = (machine: MachineType) => {
    soundManager.play('click');
    setSelectedMachine(machine);
  };

  const tasks = tasksByMachine[selectedMachine];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance & Diagnostics</h1>
          <p className="text-text-secondary mt-1">System health and predictive maintenance</p>
        </div>
        <div className="flex bg-bg-secondary p-1 rounded-lg border border-border">
          {(['drilling', 'milling', 'turning'] as MachineType[]).map((m) => (
            <button
              key={m}
              onClick={() => handleMachineSelect(m)}
              onMouseEnter={() => soundManager.play('hover')}
              className={cn(
                "min-h-[44px] px-4 py-1.5 text-sm font-medium capitalize rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                selectedMachine === m 
                  ? "bg-surface text-accent-primary shadow-sm" 
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Predictive Wear Analysis ({selectedMachine})</h3>
            <Badge variant={selectedMachine === 'drilling' ? 'warning' : 'success'}>
              {selectedMachine === 'drilling' ? 'Action Required Soon' : 'Nominal'}
            </Badge>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <LineChart data={wearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-text-primary)' }}
                />
                <Line type="monotone" dataKey="primaryWear" name="Primary Tool Wear %" stroke="var(--color-danger)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="secondaryWear" name="Secondary Component Wear %" stroke="var(--color-accent-secondary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="flex flex-col h-[180px]">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-accent-primary" />
              <h3 className="text-lg font-medium">Diagnostic Stream</h3>
            </div>
            <div className="flex-1 bg-bg-primary rounded-md p-4 font-mono text-xs text-text-secondary overflow-y-auto border border-border">
              {logs.map((log, i) => (
                <div key={i} className={log.includes('WARNING') ? 'text-warning' : log.includes('PREDICTION') ? 'text-danger' : ''}>
                  {log}
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-accent-primary/5 border-accent-primary/20">
            <div className="flex items-center gap-2 mb-4 text-accent-primary">
              <BrainCircuit className="w-5 h-5" />
              <h3 className="text-lg font-medium">AI Insights & RUL</h3>
            </div>
            <div className="mb-4 p-3 bg-bg-primary border border-border rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-text-secondary" />
                <span className="text-sm font-medium text-text-secondary">Remaining Useful Life (RUL)</span>
              </div>
              <span className={cn("font-mono font-bold", selectedMachine === 'drilling' ? "text-warning" : "text-success")}>
                {selectedMachine === 'drilling' ? '72 hrs' : selectedMachine === 'milling' ? '340 hrs' : '512 hrs'}
              </span>
            </div>
            <p className="text-sm text-text-primary leading-relaxed">
              {selectedMachine === 'drilling' 
                ? "Neural network analysis indicates a 87% probability of bearing failure within 72 hours. Recommend scheduling replacement during next shift change to minimize downtime."
                : "Vibration and temperature profiles are within the 95th percentile of optimal operation. No immediate maintenance required."}
            </p>
            <Button variant="secondary" className="w-full mt-4 bg-bg-primary hover:bg-surface border-border">
              Generate Full Report
            </Button>
          </Card>
        </div>
      </div>

      <Card>
        <h3 className="text-lg font-medium mb-6">Upcoming Service Tasks ({selectedMachine})</h3>
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-bg-secondary hover:border-accent-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                {task.status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6 text-success" />
                ) : task.priority === 'critical' ? (
                  <AlertTriangle className="w-6 h-6 text-danger" />
                ) : (
                  <Activity className="w-6 h-6 text-accent-primary" />
                )}
                <div>
                  <h4 className="font-medium text-text-primary">{task.title}</h4>
                  <p className="text-sm text-text-secondary flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {task.due}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={task.priority === 'critical' ? 'danger' : task.priority === 'warning' ? 'warning' : 'default'}>
                  {task.priority}
                </Badge>
                {task.status !== 'completed' && (
                  <Button variant="secondary" size="sm">
                    Schedule
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
