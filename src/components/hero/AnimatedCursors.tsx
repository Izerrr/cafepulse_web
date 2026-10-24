'use client';

import React, { useEffect, useRef } from 'react';

interface CursorConfig {
  id: string;
  label: string;
  color: string;
  textColor?: string;
  path: [number, number][];
  initialPos: { top: string; left?: string; right?: string };
}

const CURSORS: CursorConfig[] = [
  {
    id: 'penikmat-kopi',
    label: 'Penikmat Kopi',
    color: '#C86237', // Warm terracotta roast
    initialPos: { top: '65%', left: '26%' },
    path: [
      [0, 0], [140, -180], [-100, -260], [180, -90], [-120, 30], [50, 40], [0, 0]
    ],
  },
  {
    id: 'teman-ngobrol',
    label: 'Teman Ngobrol',
    color: '#D97706', // Warm caramel
    initialPos: { top: '35%', right: '14%' },
    path: [
      [0, 0], [-160, -120], [-240, 40], [-80, 160], [70, 200], [140, 50], [0, 0]
    ],
  },
  {
    id: 'mahasiswa-nugas',
    label: 'Mahasiswa Nugas',
    color: '#0284C7', // Gentle calm blue
    initialPos: { top: '22%', left: '48%' },
    path: [
      [0, 0], [150, 100], [240, -60], [100, -180], [-70, -200], [-180, -70], [0, 0]
    ],
  },
  {
    id: 'pencari-ketenangan',
    label: 'Pencari Ketenangan',
    color: '#10B981', // Forest sage green
    initialPos: { top: '48%', left: '12%' },
    path: [
      [0, 0], [200, -80], [260, 70], [140, 190], [-40, 140], [-100, 40], [0, 0]
    ],
  },
];

export default function AnimatedCursors() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only animate on desktop with hover
    if (typeof window === 'undefined') return;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    let animFrame: number;
    let startTime: number | null = null;
    const duration = 16000; // 16s loop

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

        // Smooth cubic easing
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

  return (
    <div
      ref={containerRef}
      className="hidden md:block pointer-events-none absolute inset-0 z-20 overflow-hidden"
      aria-hidden="true"
    >
      {CURSORS.map((c) => (
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

          {/* Friendly Role Badge */}
          <span
            style={{
              backgroundColor: c.color,
              color: c.textColor || '#FFFFFF',
            }}
            className="mt-0.5 ml-2.5 inline-flex items-center rounded-r-md rounded-bl-md px-2 py-0.5 font-sans text-[11px] font-semibold tracking-tight shadow-sm"
          >
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}
