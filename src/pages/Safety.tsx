import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, Users, Wind, Thermometer, AlertOctagon, Activity, BellRing, Check, HardHat, Glasses, Ear, MapPin, Lock, Brain } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

const incidents = [
  { time: '10 MINS AGO', type: 'Minor Spill', desc: 'Coolant leak detected in Zone B.', severity: 'warning', zone: 'B' },
];

const ppeRequirements = [
  { name: 'Hard Hat', icon: HardHat, required: true },
  { name: 'Safety Glasses', icon: Glasses, required: true },
  { name: 'Hearing Protection', icon: Ear, required: true },
];

export function Safety() {
  const { addAlert } = useStore();
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Inspect E-Stop functionality', checked: false },
    { id: 2, text: 'Verify guard doors are locked', checked: false },
    { id: 3, text: 'Check fluid levels (Coolant/Lube)', checked: false },
    { id: 4, text: 'Confirm PPE is worn by all personnel', checked: false },
  ]);

  const [comments, setComments] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const checkedCount = checklist.filter(item => item.checked).length;
  const allChecked = checkedCount === checklist.length;

  const toggleCheck = (id: number) => {
    soundManager.play('click');
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleSubmitReport = () => {
    soundManager.play('success');
    setReportSubmitted(true);
    setTimeout(() => {
      setChecklist(checklist.map(item => ({ ...item, checked: false })));
      setComments('');
      setReportSubmitted(false);
    }, 3000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Safety & Compliance</h1>
          <p className="text-text-secondary mt-1">Enforce protocols and monitor hazards</p>
        </div>
        <Button variant="danger" size="sm" onClick={() => {
          soundManager.play('alert');
          addAlert({ message: 'Evacuation Alarm Triggered!', level: 'critical' });
        }}>
          <BellRing className="w-4 h-4 mr-2" />
          Sound Evacuation Alarm
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shift Safety Checklist */}
        <Card className="lg:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Shift Safety Checklist</h3>
            <Badge variant={allChecked ? 'success' : 'warning'}>
              {allChecked ? 'Shift Cleared' : 'Checks Pending'}
            </Badge>
          </div>
          <div className="space-y-3 flex-1">
            {checklist.map((item) => (
              <div 
                key={item.id}
                tabIndex={0}
                role="checkbox"
                aria-checked={item.checked}
                onClick={() => toggleCheck(item.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCheck(item.id); } }}
                onMouseEnter={() => soundManager.play('hover')}
                className={cn(
                  "flex items-center gap-3 p-3 min-h-[44px] rounded-lg border cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                  item.checked 
                    ? "bg-success/10 border-success/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                    : "bg-bg-secondary border-border hover:border-accent-primary/50"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border transition-colors",
                  item.checked ? "bg-success border-success text-bg-primary" : "border-text-secondary text-transparent"
                )}>
                  <motion.div
                    initial={false}
                    animate={{ scale: item.checked ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                </div>
                <span className={cn(
                  "text-sm font-medium transition-all",
                  item.checked ? "text-text-secondary line-through" : "text-text-primary"
                )}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">Shift Comments (Optional)</label>
            <textarea 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full bg-bg-secondary border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:border-accent-primary transition-colors resize-none h-20"
              placeholder="Any anomalies or notes..."
            />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm font-mono text-text-secondary">{checkedCount} / {checklist.length} Completed</span>
            <Button 
              disabled={!allChecked || reportSubmitted} 
              onClick={handleSubmitReport}
              className={cn(
                "transition-all", 
                allChecked && !reportSubmitted && "shadow-[0_0_15px_rgba(37,99,235,0.4)]",
                reportSubmitted && "bg-success hover:bg-success text-bg-primary"
              )}
            >
              {reportSubmitted ? "Report Submitted!" : "Submit Shift Report"}
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {/* Active Incidents */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Active Incidents & Hazards</h3>
            {incidents.map((incident, i) => (
              <div 
                key={i} 
                className="relative overflow-hidden rounded-xl border border-warning/50 bg-warning/10 p-4 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.15)]"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-warning" />
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="mt-1">
                      <AlertOctagon className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-warning">{incident.type} - Zone {incident.zone}</h4>
                        <Badge variant="warning" className="text-[10px] px-1.5 py-0">{incident.time}</Badge>
                      </div>
                      <p className="text-sm text-text-primary">{incident.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => soundManager.play('click')}>View Details</Button>
                    <Button variant="secondary" size="sm" onClick={() => soundManager.play('click')}>Acknowledge</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LOTO Status */}
            <Card className="md:col-span-2 bg-bg-secondary/50 border-danger/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-danger" />
                  <h3 className="text-lg font-medium">Lockout / Tagout (LOTO) Status</h3>
                </div>
                <Badge variant="danger">1 Active Lock</Badge>
              </div>
              <div className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text-primary">Milling Machine - Main Breaker</h4>
                  <p className="text-sm text-text-secondary mt-1">Locked by: John Smith (Maintenance)</p>
                  <p className="text-xs text-text-secondary font-mono mt-1">Tag ID: LOTO-8492 • Applied: 08:30 AM</p>
                </div>
                <Button variant="secondary" size="sm">View Procedure</Button>
              </div>
            </Card>

            {/* PPE Requirements */}
            <Card>
              <h3 className="text-lg font-medium mb-4">Required PPE</h3>
              <div className="grid grid-cols-3 gap-4">
                {ppeRequirements.map((ppe, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary shadow-[0_4px_15px_rgba(37,99,235,0.15)]">
                      <ppe.icon className="w-8 h-8" />
                    </div>
                    <span className="text-xs text-center font-medium text-text-secondary">{ppe.name}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Operator Cognitive Load (Industry 5.0) */}
            <Card className="bg-bg-secondary/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-accent-secondary" />
                  <h3 className="text-lg font-medium">Operator Cognitive Load</h3>
                </div>
                <Badge variant="success">Optimal</Badge>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Fatigue Index</span>
                    <span className="font-mono text-success">24%</span>
                  </div>
                  <div className="w-full bg-bg-primary rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Attention Level</span>
                    <span className="font-mono text-accent-primary">92%</span>
                  </div>
                  <div className="w-full bg-bg-primary rounded-full h-2">
                    <div className="bg-accent-primary h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
                <p className="text-xs text-text-secondary mt-2">
                  Based on biometric feedback and interaction frequency. Operator Ansh Ranjan is within safe operating parameters.
                </p>
              </div>
            </Card>

            {/* Live Zone Map */}
            <Card className="flex flex-col">
              <h3 className="text-lg font-medium mb-4">Live Zone Map</h3>
              <div className="relative flex-1 bg-bg-secondary rounded-lg border border-border overflow-hidden min-h-[150px]">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                {/* Zones */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-2 gap-2">
                  <div className="border border-border/50 rounded flex items-center justify-center text-text-secondary/30 font-bold text-2xl">A</div>
                  <div className="border border-warning/50 bg-warning/10 rounded flex items-center justify-center text-warning/50 font-bold text-2xl relative shadow-[inset_0_0_20px_rgba(245,158,11,0.2)]">
                    B
                    <motion.div 
                      className="absolute top-1/4 left-1/2 -translate-x-1/2 text-danger"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                    >
                      <MapPin className="w-6 h-6 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    </motion.div>
                  </div>
                  <div className="border border-border/50 rounded flex items-center justify-center text-text-secondary/30 font-bold text-2xl">C</div>
                  <div className="border border-border/50 rounded flex items-center justify-center text-text-secondary/30 font-bold text-2xl">D</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
