import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';
import { soundManager } from '@/lib/audio';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  onClick,
  onMouseEnter,
  ...props 
}: ButtonProps) {
  
  const handleMouseEnter = (e: any) => {
    soundManager.play('hover');
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleClick = (e: any) => {
    if (variant === 'danger') soundManager.play('error');
    else if (variant === 'success') soundManager.play('success');
    else soundManager.play('click');
    
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary",
        
        // Sizes
        size === 'sm' && "min-h-[36px] px-3 py-1.5 text-xs",
        size === 'md' && "min-h-[44px] px-4 py-2 text-sm",
        size === 'lg' && "min-h-[56px] px-6 py-3 text-base",
        
        // Variants
        variant === 'primary' && "bg-accent-primary text-white hover:bg-accent-primary/90 shadow-lg shadow-accent-primary/20 focus:ring-accent-primary",
        variant === 'secondary' && "bg-surface text-text-primary border border-border hover:border-text-secondary focus:ring-text-secondary",
        variant === 'danger' && "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 focus:ring-danger",
        variant === 'success' && "bg-success/10 text-success border border-success/30 hover:bg-success/20 focus:ring-success",
        variant === 'outline' && "border-2 border-accent-primary text-accent-primary hover:bg-accent-primary/10 focus:ring-accent-primary",
        variant === 'ghost' && "text-text-secondary hover:text-text-primary hover:bg-surface focus:ring-surface",
        
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
