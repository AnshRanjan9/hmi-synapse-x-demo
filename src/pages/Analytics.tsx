import { Card } from '@/components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from 'recharts';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const productionData = [
  { day: 'Mon', drilling: 420, milling: 380, turning: 450, target: 450 },
  { day: 'Tue', drilling: 460, milling: 410, turning: 440, target: 450 },
  { day: 'Wed', drilling: 480, milling: 430, turning: 460, target: 450 },
  { day: 'Thu', drilling: 430, milling: 400, turning: 420, target: 450 },
  { day: 'Fri', drilling: 490, milling: 460, turning: 480, target: 450 },
  { day: 'Sat', drilling: 510, milling: 480, turning: 500, target: 450 },
  { day: 'Sun', drilling: 470, milling: 440, turning: 450, target: 450 },
];

const downtimeData = [
  { reason: 'Machine Faults', drilling: 45, milling: 60, turning: 15 },
  { reason: 'Setup', drilling: 25, milling: 40, turning: 20 },
  { reason: 'Maintenance', drilling: 20, milling: 30, turning: 10 },
  { reason: 'Material Shortage', drilling: 10, milling: 15, turning: 5 },
  { reason: 'Operator Break', drilling: 15, milling: 15, turning: 15 },
];

const energyData = [
  { time: '08:00', drilling: 12.5, milling: 18.2, turning: 15.0 },
  { time: '10:00', drilling: 13.1, milling: 19.5, turning: 14.8 },
  { time: '12:00', drilling: 11.8, milling: 17.0, turning: 15.5 },
  { time: '14:00', drilling: 14.2, milling: 20.1, turning: 16.2 },
  { time: '16:00', drilling: 12.9, milling: 18.8, turning: 15.1 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-secondary/80 backdrop-blur-md border border-border p-3 rounded-lg shadow-xl">
        <p className="text-text-primary font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-text-secondary capitalize">{entry.name}:</span>
            <span className="font-mono font-medium text-text-primary">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function Analytics() {
  const [yieldPercentage, setYieldPercentage] = useState(0);
  const targetYield = 96.2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setYieldPercentage(targetYield);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Performance</h1>
        <p className="text-text-secondary mt-1">Unified production metrics and downtime across all equipment</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-medium mb-6">Production Trend vs. Target</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
              <LineChart data={productionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3A" vertical={false} />
                <XAxis dataKey="day" stroke="#6B7280" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#374151', strokeWidth: 1, strokeDasharray: '5 5' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#6B7280" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false}
                  name="Target"
                />
                <Line 
                  type="monotone" 
                  dataKey="drilling" 
                  stroke="#2563EB" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#2563EB', strokeWidth: 2, stroke: '#0F172A' }}
                  activeDot={{ r: 5, fill: '#60A5FA', strokeWidth: 0 }}
                  name="Drilling"
                />
                <Line 
                  type="monotone" 
                  dataKey="milling" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#F59E0B', strokeWidth: 2, stroke: '#0F172A' }}
                  activeDot={{ r: 5, fill: '#FCD34D', strokeWidth: 0 }}
                  name="Milling"
                />
                <Line 
                  type="monotone" 
                  dataKey="turning" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#10B981', strokeWidth: 2, stroke: '#0F172A' }}
                  activeDot={{ r: 5, fill: '#34D399', strokeWidth: 0 }}
                  name="Turning"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium mb-8 w-full text-left">Overall Quality Yield (FPY)</h3>
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
                className="stroke-accent-primary fill-none"
                strokeWidth="12"
                strokeLinecap="round"
                initial={{ strokeDasharray: 553, strokeDashoffset: 553 }}
                animate={{ strokeDashoffset: 553 - (553 * yieldPercentage) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ filter: 'drop-shadow(0px 0px 8px rgba(37,99,235,0.4))' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold text-text-primary">{yieldPercentage.toFixed(1)}%</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider mt-1">Target: 95%</span>
            </div>
          </div>
          <div className="w-full mt-8 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-primary" />
                <span className="text-text-secondary">Passed</span>
              </div>
              <span className="font-mono font-medium">9,426</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-danger" />
                <span className="text-text-secondary">Scrap</span>
              </div>
              <span className="font-mono font-medium">372</span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <h3 className="text-lg font-medium mb-6">Energy Consumption (kW)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
              <LineChart data={energyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3A" vertical={false} />
                <XAxis dataKey="time" stroke="#6B7280" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#374151', strokeWidth: 1, strokeDasharray: '5 5' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line 
                  type="monotone" 
                  dataKey="drilling" 
                  stroke="#2563EB" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#2563EB', strokeWidth: 2, stroke: '#0F172A' }}
                  activeDot={{ r: 5, fill: '#60A5FA', strokeWidth: 0 }}
                  name="Drilling"
                />
                <Line 
                  type="monotone" 
                  dataKey="milling" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#F59E0B', strokeWidth: 2, stroke: '#0F172A' }}
                  activeDot={{ r: 5, fill: '#FCD34D', strokeWidth: 0 }}
                  name="Milling"
                />
                <Line 
                  type="monotone" 
                  dataKey="turning" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#10B981', strokeWidth: 2, stroke: '#0F172A' }}
                  activeDot={{ r: 5, fill: '#34D399', strokeWidth: 0 }}
                  name="Turning"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <h3 className="text-lg font-medium mb-6">Downtime of Machine</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
              <BarChart data={downtimeData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3A" horizontal={false} />
                <XAxis type="number" stroke="#6B7280" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="reason" type="category" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#1E2330' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-bg-secondary/80 backdrop-blur-md border border-border p-3 rounded shadow-lg">
                          <p className="text-text-primary font-medium mb-2">{payload[0].payload.reason}</p>
                          {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between gap-4 text-sm mb-1">
                              <span className="text-text-secondary capitalize">{entry.name}:</span>
                              <span className="font-mono font-medium text-text-primary">{entry.value} mins</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="drilling" name="Drilling" stackId="a" fill="#2563EB" />
                <Bar dataKey="milling" name="Milling" stackId="a" fill="#F59E0B" />
                <Bar dataKey="turning" name="Turning" stackId="a" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
