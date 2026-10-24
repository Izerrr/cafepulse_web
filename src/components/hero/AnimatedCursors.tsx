'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Cafe } from '@/types/cafe';

interface CursorConfig {
  id: string;
  label: string;
  color: string;
  textColor?: string;
  path: [number, number][];
  initialPos: { top: string; left?: string; right?: string };
  cafeStops: string[];
}

const CURSORS: CursorConfig[] = [
  {
    id: 'penikmat-kopi',
    label: 'Penikmat Kopi',
    color: '#C86237',
    initialPos: { top: '64%', left: '24%' },
    path: [
      [0, 0], [130, -160], [-80, -230], [160, -80], [-100, 30], [45, 35], [0, 0]
    ],
    cafeStops: [
      'Tanaku Kopi · Manahan',
      'Cold \'N Brew · Slamet Riyadi',
      'Kopi Nako · Banjarsari',
    ],
  },
  {
    id: 'teman-ngobrol',
    label: 'Teman Ngobrol',
    color: '#D97706',
    initialPos: { top: '34%', right: '14%' },
    path: [
      [0, 0], [-140, -100], [-210, 40], [-70, 140], [60, 170], [120, 40], [0, 0]
    ],
    cafeStops: [
      'Ruang Temu · Laweyan',
      'Kolektif Space · Keprabon',
      'Bhumi Kopi · Kotabarat',
    ],
  },
  {
    id: 'mahasiswa-nugas',
    label: 'Mahasiswa Nugas',
    color: '#0284C7',
    initialPos: { top: '22%', left: '46%' },
    path: [
      [0, 0], [130, 90], [200, -50], [90, -150], [-60, -170], [-150, -60], [0, 0]
    ],
    cafeStops: [
      'Kopi Susu UNS · Jebres (85 Mbps)',
      'Arah Kopi · Kentingan (Colokan Banyak)',
      'Sekutu Kopi · Slamet Riyadi',
    ],
  },
  {
    id: 'pencari-ketenangan',
    label: 'Pencari Ketenangan',
    color: '#10B981',
    initialPos: { top: '48%', left: '12%' },
    path: [
      [0, 0], [180, -70], [230, 60], [120, 160], [-35, 120], [-90, 35], [0, 0]
    ],
    cafeStops: [
      'Sudut Teduh · Mangkunegaran',
      'Loske Coffee · Pasar Gede',
      'Kana Kopi · Manahan (Tenang)',
    ],
  },
];

interface AnimatedCursorsProps {
  cafes?: Cafe[];
}

export default function AnimatedCursors({ cafes = [] }: AnimatedCursorsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stepIndex, setStepIndex] = useState(0);

  // Cycle the displayed cafe stop every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    let animFrame: number;
    let startTime: number | null = null;
    const duration = 18000; // 18s smooth radar loop

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % duration;
      const progress = elapsed / duration;

      CURSORS.forEach((c) => {
        const el = document.getElementById(`live-cursor-${c.id}`);
        if (!el) return;

        const path = c.path;
        const totalSegments = path.length - 1;
        const currentSegmentProgress = (progress * totalSegments) % 1;
        const segmentIndex = Math.min(
          Math.floor(progress * totalSegments),
          totalSegments - 1
        );

        const p1 = path[segmentIndex];
        const p2 = path[segmentIndex + 1];

        const t = currentSegmentProgress;
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        const x = p1[0] + (p2[0] - p1[0]) * eased;
        const y = p1[1] + (p2[1] - p1[1]) * eased;

        el.style.transform = `translate(${x}px, ${y}px)`;
      });

      animFrame = requestAnimationFrame(step);
    };

    animFrame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // Merge API cafe names into the stops if available
  const getActiveStop = (cursor: CursorConfig, idx: number) => {
    const dynamicStops =
      cafes.length > 0
        ? [
            ...cafes.map(
              (cf) =>
                `${cf.name} · ${cf.amenities?.wifi_speed_mbps || 60} Mbps`
            ),
            ...cursor.cafeStops,
          ]
        : cursor.cafeStops;
    return dynamicStops[(stepIndex + idx) % dynamicStops.length];
  };

  return (
    <div
      ref={containerRef}
      className="hidden md:block pointer-events-none absolute inset-0 z-20 overflow-hidden"
      aria-hidden="true"
    >
      {CURSORS.map((c, idx) => {
        const currentCafeLabel = getActiveStop(c, idx);
        return (
          <div
            key={c.id}
            id={`live-cursor-${c.id}`}
            style={{
              position: 'absolute',
              top: c.initialPos.top,
              left: c.initialPos.left,
              right: c.initialPos.right,
              transition: 'opacity 0.4s ease',
              willChange: 'transform',
            }}
            className="flex flex-col items-start select-none"
          >
            {/* Authentic Figma-style SVG Pointer */}
            <svg
              width="17"
              height="18"
              viewBox="0 0 17 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))' }}
            >
              <path
                d="M0 0V15.2L4.6 11.2L8.2 17.6L10.8 16.2L7.2 9.8L12.8 9.6L0 0Z"
                fill={c.color}
              />
              <path
                d="M1 1.8V13.4L4.8 10.1L8.5 16.6L9.7 15.9L6 9.4L10.7 9.2L1 1.8Z"
                fill={c.color}
              />
            </svg>

            {/* Role Badge + Cycling Cafe Discovery Tag */}
            <div className="mt-0.5 ml-2.5 flex flex-col items-start gap-1">
              <span
                style={{
                  backgroundColor: c.color,
                  color: c.textColor || '#FFFFFF',
                }}
                className="inline-flex items-center rounded-r-md rounded-bl-md px-2 py-0.5 font-sans text-[11px] font-semibold tracking-tight shadow-sm"
              >
                {c.label}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full border border-canvas-border bg-white/95 px-2.5 py-0.5 font-mono text-[10px] font-medium text-roast-800 shadow-xs backdrop-blur-xs transition-all duration-300">
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: c.color }}
                />
                <span>{currentCafeLabel}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
