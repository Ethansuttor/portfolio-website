'use client';

import React, { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className = ''
}: ScrollRevealProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
