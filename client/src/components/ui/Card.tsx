import React from 'react';
import { cn } from './Button';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn('bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm', className)}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn('p-6 border-b border-slate-200 dark:border-slate-800', className)}>{children}</div>
);

export const CardContent: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn('p-6', className)}>{children}</div>
);
