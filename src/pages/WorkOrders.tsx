import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Search, Filter, Plus, Play, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { soundManager } from '@/lib/audio';
import { cn } from '@/lib/utils';
import { useStore, MachineType } from '@/store/useStore';

const orderSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  assetCode: z.string().regex(/^[A-Z]-[0-9]{3}$/, "Format must be X-123"),
  priority: z.enum(['low', 'medium', 'high']),
  assignee: z.string().min(2, "Assignee name required"),
  taskType: z.enum(['production', 'maintenance', 'inspection']),
  notes: z.string().max(200, "Notes cannot exceed 200 characters").optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

const initialOrders = [
  { id: 'WO-1042', title: 'Replace Drill Bit', assetCode: 'M-105', priority: 'high', status: 'active', dueDate: 'Today', machine: 'drilling', assignee: 'Rahul Sharma', taskType: 'maintenance' },
  { id: 'WO-1043', title: 'Calibrate Z-Axis Motor', assetCode: 'M-105', priority: 'medium', status: 'queued', dueDate: 'Tomorrow', machine: 'drilling', assignee: 'Priya Patel', taskType: 'maintenance' },
  { id: 'WO-1048', title: 'Drilling Batch 500', assetCode: 'D-101', priority: 'high', status: 'queued', dueDate: 'Today', machine: 'drilling', assignee: 'Amit Kumar', taskType: 'production' },
  { id: 'WO-1044', title: 'Batch 402 Production', assetCode: 'C-201', priority: 'high', status: 'queued', dueDate: 'Tomorrow', machine: 'milling', assignee: 'Ansh Ranjan', taskType: 'production' },
  { id: 'WO-1045', title: 'Lubricate Guide Rails', assetCode: 'F-099', priority: 'low', status: 'queued', dueDate: 'In 3 days', machine: 'milling', assignee: 'Vikram Singh', taskType: 'maintenance' },
  { id: 'WO-1049', title: 'Milling Quality Check', assetCode: 'C-201', priority: 'medium', status: 'active', dueDate: 'Today', machine: 'milling', assignee: 'Sneha Gupta', taskType: 'inspection' },
  { id: 'WO-1046', title: 'Check Chuck Alignment', assetCode: 'T-301', priority: 'medium', status: 'active', dueDate: 'Today', machine: 'turning', assignee: 'Neha Desai', taskType: 'inspection' },
  { id: 'WO-1047', title: 'Batch 403 Production', assetCode: 'T-302', priority: 'low', status: 'complete', dueDate: 'Yesterday', machine: 'turning', assignee: 'Ravi Verma', taskType: 'production' },
  { id: 'WO-1050', title: 'Replace Turning Tool', assetCode: 'T-301', priority: 'high', status: 'queued', dueDate: 'Tomorrow', machine: 'turning', assignee: 'Arjun Reddy', taskType: 'maintenance' },
];

export function WorkOrders() {
  const { selectedMachine, setSelectedMachine } = useStore();
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<'all' | 'queued' | 'active' | 'complete'>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { register, handleSubmit, formState: { errors, isValid, isDirty }, reset } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    mode: 'onChange'
  });

  const filteredOrders = orders.filter(order => {
    const matchesMachine = order.machine === selectedMachine;
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) || order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMachine && matchesFilter && matchesSearch;
  });

  const onSubmit = (data: OrderFormValues) => {
    const newOrder = {
      id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      title: data.title,
      assetCode: data.assetCode,
      priority: data.priority,
      assignee: data.assignee,
      taskType: data.taskType,
      status: 'queued',
      dueDate: 'TBD',
      machine: selectedMachine
    };
    setOrders([newOrder, ...orders]);
    setIsCreating(false);
    reset();
    soundManager.play('success');
  };

  const handleMachineSelect = (machine: MachineType) => {
    soundManager.play('click');
    setSelectedMachine(machine);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
          <p className="text-text-secondary mt-1">Manage maintenance and production tasks</p>
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
          <Button onClick={() => setIsCreating(!isCreating)}>
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-accent-primary/50 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
              <h3 className="text-lg font-medium mb-4">Create New Work Order</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                    <input 
                      {...register('title')} 
                      className={cn(
                        "w-full min-h-[44px] bg-bg-secondary border rounded-md px-4 py-2 text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary transition-colors",
                        errors.title ? "border-danger focus:border-danger" : "border-border focus:border-accent-primary"
                      )}
                      placeholder="e.g., Replace Spindle Bearings"
                    />
                    {errors.title && (
                      <p className="text-danger text-xs mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Asset Code</label>
                    <input 
                      {...register('assetCode')} 
                      className={cn(
                        "w-full min-h-[44px] bg-bg-secondary border rounded-md px-4 py-2 text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary transition-colors",
                        errors.assetCode ? "border-danger focus:border-danger" : "border-border focus:border-accent-primary"
                      )}
                      placeholder="e.g., M-105"
                    />
                    {errors.assetCode && (
                      <p className="text-danger text-xs mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {errors.assetCode.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Priority</label>
                    <select 
                      {...register('priority')}
                      className="w-full min-h-[44px] bg-bg-secondary border border-border rounded-md px-4 py-2 text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus:border-accent-primary transition-colors"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Assignee</label>
                    <input 
                      {...register('assignee')} 
                      className={cn(
                        "w-full min-h-[44px] bg-bg-secondary border rounded-md px-4 py-2 text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary transition-colors",
                        errors.assignee ? "border-danger focus:border-danger" : "border-border focus:border-accent-primary"
                      )}
                      placeholder="e.g., Ansh Ranjan"
                    />
                    {errors.assignee && (
                      <p className="text-danger text-xs mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {errors.assignee.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Task Type</label>
                    <select 
                      {...register('taskType')}
                      className="w-full min-h-[44px] bg-bg-secondary border border-border rounded-md px-4 py-2 text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus:border-accent-primary transition-colors"
                    >
                      <option value="production">Production</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inspection">Inspection</option>
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-text-secondary mb-1">Notes (Optional)</label>
                    <input 
                      {...register('notes')} 
                      className={cn(
                        "w-full min-h-[44px] bg-bg-secondary border rounded-md px-4 py-2 text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary transition-colors",
                        errors.notes ? "border-danger focus:border-danger" : "border-border focus:border-accent-primary"
                      )}
                    />
                    {errors.notes && (
                      <p className="text-danger text-xs mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {errors.notes.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <Button variant="ghost" type="button" onClick={() => { setIsCreating(false); reset(); }}>Cancel</Button>
                  <Button type="submit" disabled={!isValid || !isDirty}>Create Order</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-bg-secondary p-1 rounded-lg border border-border relative">
          {['all', 'queued', 'active', 'complete'].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f as any); soundManager.play('click'); }}
              onMouseEnter={() => soundManager.play('hover')}
              className={cn(
                "relative min-h-[44px] px-4 py-1.5 text-sm font-medium capitalize transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-md",
                filter === f ? "text-white" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {filter === f && (
                <motion.div
                  layoutId="filter-pill"
                  className="absolute inset-0 bg-accent-primary rounded-md -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {f}
            </button>
          ))}
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-accent-primary transition-colors" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[44px] bg-bg-secondary border border-border rounded-md py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:border-accent-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] transition-all"
            />
          </div>
          <Button variant="secondary" className="shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary border-b border-border text-text-secondary text-sm">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Assignee</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Priority</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Due Date</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-bg-secondary/50 transition-colors group cursor-pointer"
                    onMouseEnter={() => soundManager.play('hover')}
                    onClick={() => soundManager.play('click')}
                  >
                    <td className="p-4 font-mono text-sm">{order.id}</td>
                    <td className="p-4 font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                      {order.title}
                      <div className="text-xs text-text-secondary font-mono mt-0.5">{order.assetCode}</div>
                    </td>
                    <td className="p-4 text-sm">{order.assignee}</td>
                    <td className="p-4">
                      <Badge variant="default" className="capitalize bg-bg-secondary text-text-secondary border-border">
                        {order.taskType}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={order.priority === 'high' ? 'danger' : order.priority === 'medium' ? 'warning' : 'default'}>
                        {order.priority}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {order.status === 'active' && <Play className="w-4 h-4 text-accent-primary animate-pulse" />}
                        {order.status === 'complete' && <CheckCircle2 className="w-4 h-4 text-success" />}
                        {order.status === 'queued' && <Clock className="w-4 h-4 text-text-secondary" />}
                        <span className="capitalize text-sm">{order.status}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-text-secondary">{order.dueDate}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-text-secondary">
              No work orders found matching your criteria.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
