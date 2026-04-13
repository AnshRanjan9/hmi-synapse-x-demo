import { DigitalTwinViewport } from '@/components/DigitalTwinViewport';
import { useStore, MachineType } from '@/store/useStore';
import { soundManager } from '@/lib/audio';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/Switch';
import { useState } from 'react';

export function DigitalTwin() {
  const { selectedMachine, setSelectedMachine, machines } = useStore();
  const machineState = machines[selectedMachine];
  const [arOverlay, setArOverlay] = useState(false);

  const handleMachineSelect = (machine: MachineType) => {
    soundManager.play('click');
    setSelectedMachine(machine);
  };

  const wearLevel = selectedMachine === 'drilling' ? 72 : selectedMachine === 'milling' ? 81 : 65;

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Digital Twin</h1>
          <p className="text-text-secondary mt-1">Interactive 3D visualization and state sync</p>
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
      
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-full">
          <DigitalTwinViewport machineType={selectedMachine} />
        </div>
        
        <div className="space-y-6 overflow-y-auto pr-2">
          <div className="bg-surface border border-surface rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Component Inspector</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-text-secondary mb-1">Selected Part</div>
                <div className="font-mono text-accent-primary uppercase">{selectedMachine}_ASSEMBLY_V2</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary mb-1">Status</div>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", machineState.status === 'running' ? "bg-success" : "bg-warning")} />
                  <span className="font-mono text-sm uppercase">{machineState.status}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-text-secondary mb-1">Wear Level</div>
                <div className="w-full bg-bg-secondary rounded-full h-2 mt-2">
                  <div 
                    className={cn("h-2 rounded-full", wearLevel > 80 ? "bg-danger" : wearLevel > 60 ? "bg-warning" : "bg-success")} 
                    style={{ width: `${wearLevel}%` }} 
                  />
                </div>
                <div className="text-right text-xs font-mono text-text-secondary mt-1">{wearLevel}%</div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-surface rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Augmented Reality (AR)</h3>
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">Overlay predictive maintenance highlights and thermal stress points directly on the 3D model.</p>
              <Switch checked={arOverlay} onChange={(val) => {
                soundManager.play('click');
                setArOverlay(val);
              }} label="Enable AR Overlay" />
            </div>
          </div>

          <div className="bg-surface border border-surface rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Live Parameters</h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Speed</span>
                <span>{machineState.spindleSpeed.toFixed(0)} RPM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Temp</span>
                <span>{machineState.temperature.toFixed(1)} °C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Vibration</span>
                <span>{machineState.vibration.toFixed(2)} mm/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Pressure</span>
                <span>{machineState.pressure.toFixed(1)} kPa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
