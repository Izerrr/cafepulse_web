'use client';

import React, { useEffect, useRef } from 'react';

interface GrillaCeldasProps {
  className?: string;
  cellSize?: number;
  highlightCount?: number;
}

export default function GrillaCeldas({
  className = '',
  cellSize = 60,
  highlightCount = 12,
}: GrillaCeldasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check hover capability
    const canHover = window.matchMedia('(hover: hover)').matches;

    let cellWidth = cellSize;
    let cellHeight = cellSize;

    const measure = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      if (!width || !height) return;

      const cols = Math.max(1, Math.round(width / cellSize));
      const rows = Math.max(1, Math.round(height / cellSize));

      cellWidth = width / cols;
      cellHeight = height / rows;

      container.style.setProperty('--grilla-celda-ancho', `${cellWidth}px`);
      container.style.setProperty('--grilla-celda-alto', `${cellHeight}px`);
    };

    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });
    resizeObserver.observe(container);

    if (!canHover) {
      return () => resizeObserver.disconnect();
    }

    // Highlight elements pool (matching onlines.com.ar grilla-celdas-view.js)
    const pool: { el: HTMLDivElement; timer: number | null }[] = [];
    let nextIndex = 0;

    for (let i = 0; i < highlightCount; i++) {
      const el = document.createElement('div');
      el.className = 'grilla-celdas__lit';
      container.appendChild(el);
      pool.push({ el, timer: null });
    }

    let lastCol = -1;
    let lastRow = -1;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      const col = Math.floor(x / cellWidth);
      const row = Math.floor(y / cellHeight);

      if (col === lastCol && row === lastRow) return;
      lastCol = col;
      lastRow = row;

      const item = pool[nextIndex];
      nextIndex = (nextIndex + 1) % pool.length;

      if (item.timer) {
        window.clearTimeout(item.timer);
        item.timer = null;
      }

      item.el.style.transition = 'none';
      item.el.classList.remove('is-lit');
      item.el.style.transform = `translate(${col * cellWidth}px, ${row * cellHeight}px)`;

      window.requestAnimationFrame(() => {
        item.el.style.transition = 'background-color 650ms cubic-bezier(0.16, 1, 0.3, 1)';
        item.el.classList.add('is-lit');

        item.timer = window.setTimeout(() => {
          item.el.classList.remove('is-lit');
        }, 300);
      });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handlePointerMove);
      pool.forEach((item) => {
        if (item.timer) window.clearTimeout(item.timer);
        if (item.el.parentNode === container) {
          container.removeChild(item.el);
        }
      });
    };
  }, [cellSize, highlightCount]);

  return (
    <div
      ref={containerRef}
      className={`grilla-celdas ${className}`}
      aria-hidden="true"
    />
  );
}

