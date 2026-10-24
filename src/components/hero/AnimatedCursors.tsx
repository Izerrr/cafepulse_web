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
    id: 'fullstack',
    label: 'Fullstack Dev',
    color: '#00B5CE', // Turquesa from onlines
    initialPos: { top: '65%', left: '28%' },
    path: [
      [0, 0], [140, -180], [-100, -260], [180, -90], [-120, 30], [50, 40], [0, 0]
    ],
  },
  {
    id: 'mahasiswa',
    label: 'Mahasiswa UNS',
    color: '#EF5533', // Naranja from onlines
    initialPos: { top: '35%', right: '14%' },
    path: [
      [0, 0], [-160, -120], [-240, 40], [-80, 160], [70, 200], [140, 50], [0, 0]
    ],
  },
  {
    id: 'remote',
    label: 'Remote Worker',
    color: '#1BC47D', // Verde from onlines
    initialPos: { top: '22%', left: '48%' },
    path: [
      [0, 0], [150, 100], [240, -60], [100, -180], [-70, -200], [-180, -70], [0, 0]
    ],
  },
  {
    id: 'ui',
    label: 'UI/UX Designer',
    color: '#6465ED', // Violeta from onlines
    initialPos: { top: '48%', left: '12%' },
    path: [
      [0, 0], [200, -80], [260, 70], [140, 190], [-40, 140], [-100, 40], [0, 0]
    ],
  },
];

export default function AnimatedCursors() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let animId: number;
    const startTime = performance.now();

    const cursorStates = CURSORS.map((c, i) => ({
      ...c,
      currentIndex: 0,
      phase: 'move' as 'move' | 'pause',
      phaseStart: startTime + i * 400,
      currentX: 0,
      currentY: 0,
      fromX: 0,
      fromY: 0,
      toX: c.path[0][0],
      toY: c.path[0][1],
      moveDuration: 2800 + (i % 3) * 400,
      pauseDuration: 900 + (i % 2) * 300,
    }));

    const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

    const tick = (now: number) => {
      cursorStates.forEach((st) => {
        const el = container.querySelector(`[data-cursor-id="${st.id}"]`) as HTMLElement;
        if (!el) return;

        const elapsed = now - st.phaseStart;

        if (st.phase === 'pause') {
          if (elapsed >= st.pauseDuration) {
            const nextIdx = (st.currentIndex + 1) % st.path.length;
            st.fromX = st.path[st.currentIndex][0];
            st.fromY = st.path[st.currentIndex][1];
            st.toX = st.path[nextIdx][0];
            st.toY = st.path[nextIdx][1];
            st.currentIndex = nextIdx;
            st.phase = 'move';
            st.phaseStart = now;
          }
        } else {
          const progress = Math.min(elapsed / st.moveDuration, 1);
          const eased = easeInOutSine(progress);

          st.currentX = st.fromX + (st.toX - st.fromX) * eased;
          st.currentY = st.fromY + (st.toY - st.fromY) * eased;

          if (progress >= 1) {
            st.phase = 'pause';
            st.phaseStart = now;
          }
        }

        el.style.transform = `translate3d(${st.currentX.toFixed(1)}px, ${st.currentY.toFixed(1)}px, 0)`;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden hidden sm:block"
      aria-hidden="true"
    >
      {CURSORS.map((c) => (
        <div
          key={c.id}
          data-cursor-id={c.id}
          style={{
            position: 'absolute',
            top: c.initialPos.top,
            left: c.initialPos.left,
            right: c.initialPos.right,
            willChange: 'transform',
          }}
          className="flex flex-col items-start transition-opacity duration-700"
        >
          {/* Custom SVG Figma Arrow Pointer with shadow */}
          <svg
            width="17"
            height="19"
            viewBox="0 0 22 24"
            fill="none"
            className="drop-shadow-md select-none"
          >
            <path
              d="M6.47489 17.1216L4.00903 2.58942C3.93912 2.17746 4.3754 1.86658 4.74197 2.06714L17.5232 9.06009C17.9445 9.29057 17.8302 9.92457 17.355 9.99355L11.0105 10.9145C10.8527 10.9374 10.7153 11.0342 10.6406 11.1752L7.40964 17.272C7.18605 17.694 6.55477 17.5923 6.47489 17.1216Z"
              fill={c.color}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </svg>
          <span
            style={{
              backgroundColor: c.color,
              color: c.textColor || '#FFFFFF',
            }}
            className="ml-2 -mt-1 rounded-r-md rounded-bl-md px-2 py-0.5 text-[11px] font-sans font-semibold tracking-tight shadow-md select-none whitespace-nowrap"
          >
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}

