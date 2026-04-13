import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Truck, Package, MapPin, BatteryCharging, RefreshCw } from 'lucide-react';
import { soundManager } from '@/lib/audio';

const inventory = [
  { name: 'Raw Aluminum Stock', value: 85, status: 'optimal' },
  { name: 'Titanium Inserts', value: 22, status: 'warning' },
  { name: 'Coolant Fluid', value: 45, status: 'optimal' },
  { name: 'Finished Assemblies', value: 92, status: 'critical' }, // almost full
];

const agvs = [
  { id: 'AGV-01', status: 'In Transit', location: 'Corridor B', battery: 88, task: 'Delivering Raw Material' },
  { id: 'AGV-02', status: 'Charging', location: 'Docking Station 2', battery: 15, task: 'None' },
  { id: 'AGV-03', status: 'Idle', location: 'Zone C Staging', battery: 95, task: 'Awaiting Dispatch' },
];

export function Logistics() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logistics & Flow</h1>
          <p className="text-text-secondary mt-1">Track materials and workflow</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => soundManager.play('click')}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Sync Data
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-accent-primary" />
              <h3 className="text-lg font-medium">Inventory Levels</h3>
            </div>
            <Button variant="ghost" size="sm">Order Stock</Button>
          </div>
          <div className="space-y-6">
            {inventory.map((item, i) => (
              <div 
                key={i} 
                className="p-2 -mx-2 rounded-md hover:bg-bg-secondary transition-colors cursor-pointer"
                onMouseEnter={() => soundManager.play('hover')}
                onClick={() => soundManager.play('click')}
              >
                <ProgressBar 
                  value={item.value} 
                  label={item.name} 
                  colorClass={item.status === 'warning' ? 'bg-warning' : item.status === 'critical' ? 'bg-danger' : 'bg-accent-primary'}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-accent-secondary" />
              <h3 className="text-lg font-medium">AGV Fleet Status</h3>
            </div>
            <Button variant="ghost" size="sm">Dispatch All</Button>
          </div>
          <div className="space-y-4">
            {agvs.map(agv => (
              <div 
                key={agv.id} 
                className="flex flex-col gap-3 p-4 rounded-lg border border-border bg-bg-secondary hover:border-accent-secondary/50 transition-colors cursor-pointer"
                onMouseEnter={() => soundManager.play('hover')}
                onClick={() => soundManager.play('click')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-text-primary">{agv.id}</span>
                    <Badge variant={agv.status === 'Charging' ? 'warning' : agv.status === 'In Transit' ? 'success' : 'default'}>
                      {agv.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-text-secondary text-sm font-mono">
                    <BatteryCharging className="w-4 h-4" />
                    {agv.battery}%
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {agv.location}
                  </div>
                  <span className="truncate max-w-[150px]">{agv.task}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
