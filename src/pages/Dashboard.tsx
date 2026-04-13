import { useEffect, useState } from 'react';
import { TelemetryCard } from '@/components/TelemetryCard';
import { useStore, MachineType } from '@/store/useStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { soundManager } from '@/lib/audio';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const generateData = () => {
  let currentEff = 85;
  let currentOut = 130;
  return Array.from({ length: 20 }).map((_, i) => {
    currentEff = Math.max(60, Math.min(100, currentEff + (Math.random() * 6 - 3)));
    currentOut = Math.max(80, Math.min(180, currentOut + (Math.random() * 10 - 5)));
    return {
      time: `10:${i.toString().padStart(2, '0')}`,
      efficiency: currentEff,
      output: currentOut,
    };
  });
};

export function Dashboard() {
  const { selectedMachine, setSelectedMachine, machines, updateMachineState } = useStore();
  const [chartData, setChartData] = useState(generateData());
  const [oee, setOee] = useState(85);

  const machineState = machines[selectedMachine];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      (['drilling', 'milling', 'turning'] as MachineType[]).forEach(machine => {
        const current = machines[machine];
        updateMachineState(machine, {
          spindleSpeed: current.spindleSpeed + (Math.random() * 10 - 5),
          temperature: current.temperature + (Math.random() * 1 - 0.5),
          vibration: Math.max(0, current.vibration + (Math.random() * 0.02 - 0.01)),
          pressure: current.pressure + (Math.random() * 0.5 - 0.25),
          powerDraw: Math.max(5, current.powerDraw + (Math.random() * 0.4 - 0.2))
        });
      });

      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastTime = prev[prev.length - 1].time;
        const [h, m] = lastTime.split(':');
        const nextM = (parseInt(m) + 1).toString().padStart(2, '0');
        
        const lastEff = prev[prev.length - 1].efficiency;
        const lastOut = prev[prev.length - 1].output;
        
        newData.push({
          time: `${h}:${nextM}`,
          efficiency: Math.max(60, Math.min(100, lastEff + (Math.random() * 6 - 3))),
          output: Math.max(80, Math.min(180, lastOut + (Math.random() * 10 - 5))),
        });
        return newData;
      });

      setOee(prev => Math.max(75, Math.min(100, prev + (Math.random() * 4 - 2))));
    }, 2000);
    return () => clearInterval(interval);
  }, [machines, updateMachineState]);

  const handleMachineSelect = (machine: MachineType) => {
    soundManager.play('click');
    setSelectedMachine(machine);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-text-secondary mt-1">Real-time telemetry and production KPIs</p>
        </div>
        <div className="flex items-center gap-4">
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
          <Badge variant={machineState.status === 'running' ? 'success' : 'warning'}>
            {machineState.status.toUpperCase()}
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <TelemetryCard 
          title="Speed" 
          value={machineState.spindleSpeed} 
          unit="RPM" 
          trend={2.4}
        />
        <TelemetryCard 
          title="Core Temp" 
          value={machineState.temperature} 
          unit="°C" 
          state={machineState.temperature > 60 ? 'warning' : 'normal'}
          trend={1.2}
        />
        <TelemetryCard 
          title="Vibration" 
          value={machineState.vibration} 
          unit="mm/s" 
          state={machineState.vibration > 0.3 ? 'critical' : 'normal'}
          trend={-0.5}
          decimals={2}
        />
        <TelemetryCard 
          title="Pressure" 
          value={machineState.pressure} 
          unit="kPa" 
          trend={1.5}
        />
        <TelemetryCard 
          title="Power Draw" 
          value={machineState.powerDraw} 
          unit="kW" 
          trend={0.8}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-medium mb-6">Production Efficiency</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="time" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-text-primary)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line type="monotone" dataKey="efficiency" name="Efficiency" stroke="var(--color-accent-primary)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="output" name="Throughput" stroke="var(--color-accent-secondary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium mb-8 w-full text-left">Production Effectiveness</h3>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                className="stroke-surface fill-none"
                strokeWidth="12"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                className={cn("fill-none transition-colors duration-500", oee < 80 ? "stroke-danger" : "stroke-success")}
                strokeWidth="12"
                strokeLinecap="round"
                initial={{ strokeDasharray: 553, strokeDashoffset: 553 }}
                animate={{ strokeDashoffset: 553 - (553 * oee) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ filter: `drop-shadow(0px 0px 8px ${oee < 80 ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'})` }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={cn("text-4xl font-bold transition-colors duration-500", oee < 80 ? "text-danger" : "text-text-primary")}>
                {oee.toFixed(1)}%
              </span>
              <span className="text-xs text-text-secondary uppercase tracking-wider mt-1">Target: 80%</span>
            </div>
          </div>
          <div className="w-full mt-8 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">Availability</span>
              <span className="font-mono font-medium text-success">92%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">Performance</span>
              <span className="font-mono font-medium text-warning">88%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">Quality</span>
              <span className="font-mono font-medium text-success">98%</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium mb-6">Active Alerts</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 text-warning mb-1">
                <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                <span className="text-sm font-medium uppercase tracking-wider">Warning</span>
              </div>
              <p className="text-sm text-text-primary">Temperature approaching upper threshold in Zone B.</p>
              <p className="text-xs text-text-secondary font-mono mt-2">10:42:05 AM</p>
            </div>
            
            <div className="p-4 rounded-md bg-bg-secondary border border-border">
              <div className="flex items-center gap-2 text-accent-primary mb-1">
                <div className="w-2 h-2 rounded-full bg-accent-primary" />
                <span className="text-sm font-medium uppercase tracking-wider">Info</span>
              </div>
              <p className="text-sm text-text-primary">Routine maintenance scheduled for tomorrow.</p>
              <p className="text-xs text-text-secondary font-mono mt-2">09:15:00 AM</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
