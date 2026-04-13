import { useState, useEffect } from 'react';
import { useStore, MachineType } from '@/store/useStore';
import { Play, Square, Settings2, AlertTriangle, Plus, Minus, Loader2, CheckCircle2, Save, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '@/lib/audio';
import { cn } from '@/lib/utils';

interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (val: number) => void;
  disabled?: boolean;
}

function Stepper({ label, value, min, max, step, unit, onChange, disabled }: StepperProps) {
  const [inputValue, setInputValue] = useState(value.toFixed(1));

  useEffect(() => {
    setInputValue(value.toFixed(1));
  }, [value]);

  const handleIncrement = () => {
    if (value + step <= max && !disabled) {
      soundManager.play('click');
      onChange(value + step);
    } else {
      soundManager.play('error');
    }
  };

  const handleDecrement = () => {
    if (value - step >= min && !disabled) {
      soundManager.play('click');
      onChange(value - step);
    } else {
      soundManager.play('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    let num = parseFloat(inputValue);
    if (isNaN(num)) {
      setInputValue(value.toFixed(1));
      return;
    }
    if (num < min) num = min;
    if (num > max) num = max;
    onChange(Number(num.toFixed(1)));
    setInputValue(num.toFixed(1));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", disabled && "opacity-50 pointer-events-none")}>
      <label className="text-sm font-medium text-text-secondary">{label}</label>
      <div className="flex items-center gap-4 bg-bg-secondary border border-border rounded-lg p-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="w-11 h-11 flex items-center justify-center rounded-md bg-surface text-text-primary hover:bg-border transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        >
          <Minus className="w-5 h-5" />
        </motion.button>
        <div className="flex-1 flex items-center justify-center gap-1">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="w-20 h-11 text-center font-mono text-xl font-bold text-text-primary bg-transparent border-b border-transparent focus:border-accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-md transition-colors"
          />
          <span className="text-sm text-text-secondary font-sans font-normal">{unit}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className="w-11 h-11 flex items-center justify-center rounded-md bg-surface text-text-primary hover:bg-border transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

export function ProcessControl() {
  const { selectedMachine, setSelectedMachine, machines, updateMachineState, addAlert } = useStore();
  const machineState = machines[selectedMachine];

  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [interlockActive, setInterlockActive] = useState(false);
  
  // Local state for editing parameters before applying
  const [localSpindleSpeed, setLocalSpindleSpeed] = useState(machineState.spindleSpeed);
  const [localTemperature, setLocalTemperature] = useState(machineState.temperature);
  const [localPressure, setLocalPressure] = useState(machineState.pressure);
  
  // Sync local state when machine changes
  useEffect(() => {
    setLocalSpindleSpeed(machineState.spindleSpeed);
    setLocalTemperature(machineState.temperature);
    setLocalPressure(machineState.pressure);
  }, [selectedMachine, machineState.spindleSpeed, machineState.temperature, machineState.pressure]);

  // Auxiliary Systems
  const [coolant, setCoolant] = useState(true);
  const [exhaust, setExhaust] = useState(true);
  const [auxPower, setAuxPower] = useState(false);
  const [lotoActive, setLotoActive] = useState(false);

  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'success'>('idle');
  const [changeLog, setChangeLog] = useState([
    { id: 1, action: 'SYS_START', user: 'System', time: '10:42:00' },
    { id: 2, action: 'SET_SPEED 1200', user: 'Ansh Ranjan', time: '10:45:12' },
  ]);

  // Simulate interlock triggering randomly for demonstration
  useEffect(() => {
    const timer = setInterval(() => {
      // Increase likelihood of interlock when in manual mode
      const threshold = mode === 'manual' ? 0.5 : 0.8;
      if (Math.random() > threshold) {
        if (!interlockActive) {
          setInterlockActive(true);
          if (mode === 'manual') {
            soundManager.play('alert');
            addAlert({ message: 'Safety Interlock Activated due to manual override anomaly', level: 'critical' });
          }
        }
      } else {
        setInterlockActive(false);
      }
    }, 10000); // Check more frequently
    return () => clearInterval(timer);
  }, [mode, interlockActive, addAlert]);

  const handleModeSwitch = (newMode: 'auto' | 'manual') => {
    if (newMode === 'manual' && interlockActive) {
      soundManager.play('error');
      addAlert({ message: 'Cannot switch to Manual: Safety Interlock Active', level: 'critical' });
      return;
    }
    soundManager.play('click');
    setMode(newMode);
    setChangeLog(prev => [{ id: Date.now(), action: `MODE_${newMode.toUpperCase()}`, user: 'Ansh Ranjan', time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
  };

  const handleApply = () => {
    soundManager.play('click');
    setSaveState('saving');
    setTimeout(() => {
      updateMachineState(selectedMachine, {
        spindleSpeed: localSpindleSpeed,
        temperature: localTemperature,
        pressure: localPressure
      });
      setSaveState('success');
      soundManager.play('success');
      setChangeLog(prev => [{ id: Date.now(), action: `PARAMS_UPDATED (${selectedMachine})`, user: 'Ansh Ranjan', time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
      setTimeout(() => setSaveState('idle'), 3000);
    }, 1500);
  };

  const handleMachineSelect = (machine: MachineType) => {
    soundManager.play('click');
    setSelectedMachine(machine);
  };

  const controlsDisabled = mode === 'auto' || interlockActive || lotoActive;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Process Control</h1>
          <p className="text-text-secondary mt-1">Direct manipulation of machine parameters</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant={lotoActive ? "danger" : "secondary"} 
            onClick={() => {
              soundManager.play('click');
              setLotoActive(!lotoActive);
              setChangeLog(prev => [{ id: Date.now(), action: `LOTO_${!lotoActive ? 'ENGAGED' : 'RELEASED'}`, user: 'Ansh Ranjan', time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
            }}
            className={cn("transition-all", lotoActive && "shadow-[0_0_15px_rgba(239,68,68,0.4)]")}
          >
            <Lock className="w-4 h-4 mr-2" />
            {lotoActive ? "LOTO Active" : "Engage LOTO"}
          </Button>

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

          {/* Mode Switcher */}
          <div className="flex bg-bg-secondary p-1 rounded-lg border border-border relative">
            {['auto', 'manual'].map((m) => (
              <button
                key={m}
                onClick={() => handleModeSwitch(m as any)}
                onMouseEnter={() => soundManager.play('hover')}
                className={cn(
                  "relative min-h-[44px] px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-md",
                  mode === m ? "text-white" : "text-text-secondary hover:text-text-primary",
                  lotoActive && "opacity-50 pointer-events-none"
                )}
              >
                {mode === m && (
                  <motion.div
                    layoutId="mode-pill"
                    className={cn(
                      "absolute inset-0 rounded-md -z-10 shadow-[0_0_15px_rgba(0,0,0,0.2)]",
                      m === 'auto' ? "bg-accent-primary" : "bg-warning"
                    )}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {m}
              </button>
            ))}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {lotoActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-danger/20 border border-danger/50 text-danger p-4 rounded-lg flex items-center gap-3 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            <Lock className="w-6 h-6" />
            <div>
              <h4 className="font-bold">Lockout / Tagout (LOTO) Engaged</h4>
              <p className="text-sm">Machine is physically locked out for maintenance. All controls disabled.</p>
            </div>
          </motion.div>
        )}
        {interlockActive && mode === 'manual' && !lotoActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-danger/20 border border-danger/50 text-danger p-4 rounded-lg flex items-center gap-3 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <div>
              <h4 className="font-bold">Safety Interlock Active</h4>
              <p className="text-sm">Guard door open or sensor fault. Manual controls locked.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-accent-primary" />
              <h3 className="text-lg font-medium">Primary Parameters ({selectedMachine})</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">Presets:</span>
              <select 
                className="min-h-[44px] bg-bg-secondary border border-border rounded-md px-3 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:border-accent-primary transition-colors"
                disabled={controlsDisabled}
                onChange={(e) => {
                  soundManager.play('click');
                  const preset = e.target.value;
                  if (preset === 'roughing') {
                    setLocalSpindleSpeed(800);
                    setLocalTemperature(60);
                    setLocalPressure(150);
                  } else if (preset === 'finishing') {
                    setLocalSpindleSpeed(2500);
                    setLocalTemperature(40);
                    setLocalPressure(90);
                  } else if (preset === 'eco') {
                    setLocalSpindleSpeed(1000);
                    setLocalTemperature(35);
                    setLocalPressure(80);
                  }
                }}
              >
                <option value="custom">Custom</option>
                <option value="roughing">Roughing</option>
                <option value="finishing">Finishing</option>
                <option value="eco">Eco Mode</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Stepper
              label="Main Drive Speed"
              value={localSpindleSpeed}
              min={0}
              max={5000}
              step={100}
              unit="RPM"
              onChange={setLocalSpindleSpeed}
              disabled={controlsDisabled}
            />
            
            <Stepper
              label="Target Temperature"
              value={localTemperature}
              min={20}
              max={150}
              step={5}
              unit="°C"
              onChange={setLocalTemperature}
              disabled={controlsDisabled}
            />

            <div className={cn("md:col-span-2 pt-2", controlsDisabled && "opacity-50 pointer-events-none")}>
              <Slider
                label="System Pressure"
                value={localPressure}
                min={50}
                max={200}
                unit="psi"
                onChange={setLocalPressure}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-sm font-medium text-text-secondary mb-4 uppercase tracking-wider">Auxiliary Systems</h4>
            <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity", controlsDisabled && "opacity-50 pointer-events-none")}>
              <Switch checked={coolant} onChange={setCoolant} label="Coolant Flow" />
              <Switch checked={exhaust} onChange={setExhaust} label="Exhaust Fan" />
              <Switch checked={auxPower} onChange={setAuxPower} label="Aux Power" />
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-4">
            <Button variant="ghost" disabled={controlsDisabled} onClick={() => {
              setLocalSpindleSpeed(machineState.spindleSpeed);
              setLocalTemperature(machineState.temperature);
              setLocalPressure(machineState.pressure);
            }}>
              Reset Defaults
            </Button>
            <Button 
              onClick={handleApply} 
              disabled={controlsDisabled || saveState !== 'idle'}
              className={cn(
                "min-w-[160px] transition-all duration-300",
                saveState === 'success' && "bg-success hover:bg-success shadow-[0_0_15px_rgba(16,185,129,0.4)] text-bg-primary"
              )}
            >
              {saveState === 'idle' && "Apply Changes"}
              {saveState === 'saving' && (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              )}
              {saveState === 'success' && (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Saved Successfully
                </>
              )}
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Execution</h3>
            <div className={cn("grid grid-cols-2 gap-4", controlsDisabled && "opacity-50 pointer-events-none")}>
              <Button variant="success" className="h-24 flex-col gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Play className="w-6 h-6" />
                <span className="font-medium text-sm">START</span>
              </Button>
              <Button variant="danger" className="h-24 flex-col gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <Square className="w-6 h-6" />
                <span className="font-medium text-sm">E-STOP</span>
              </Button>
            </div>
          </Card>

          <Card className="flex flex-col h-[calc(100%-140px)]">
            <h3 className="text-lg font-medium mb-4">Change Log</h3>
            <div className="space-y-3 font-mono text-xs text-text-secondary flex-1 overflow-y-auto pr-2">
              <AnimatePresence initial={false}>
                {changeLog.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col border-b border-border pb-2"
                  >
                    <div className="flex justify-between text-text-primary font-bold">
                      <span>{log.action}</span>
                      <span>{log.time}</span>
                    </div>
                    <span className="text-[10px] mt-1">{log.user}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
