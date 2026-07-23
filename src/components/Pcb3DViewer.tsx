'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const DynamicPcbGlbCanvas = dynamic(() => import('@/components/PcbGlbCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] bg-surface-container-high/60 border border-outline-variant/20 flex flex-col items-center justify-center gap-2 text-xs font-mono text-primary animate-pulse rounded">
      <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
      <span>Loading Interactive 3D PCB Model...</span>
    </div>
  ),
});

export function Pcb3DViewer({ url = "/assets/FC_PC_1.glb" }: { url?: string }) {
  return <DynamicPcbGlbCanvas url={url} />;
}
