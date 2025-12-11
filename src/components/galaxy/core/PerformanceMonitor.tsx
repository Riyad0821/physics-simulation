'use client';

/**
 * Performance Monitor
 * Displays FPS, Memory, and GPU stats
 */

import React, { useEffect } from 'react';
import { usePerformanceStore } from '@/stores/performanceStore';
import { Stats } from '@react-three/drei';

export default function PerformanceMonitor() {
  const updateMetrics = usePerformanceStore((state) => state.updateMetrics);

  useEffect(() => {
    // Polling for custom metrics if needed
    const interval = setInterval(() => {
        // In a real scenario, we might query generic renderer info here if accessible
        // or just rely on R3F Stats for FPS
    }, 1000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return (
    <div className="performance-monitor absolute top-0 left-0 z-50 pointer-events-none">
      <Stats className="!static !ml-2 !mt-2" />
    </div>
  );
}
