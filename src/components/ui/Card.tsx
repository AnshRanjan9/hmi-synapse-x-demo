import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export function Card({ className, children, ...props }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-surface border border-border rounded-xl p-6 shadow-lg", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
