'use client';

import React, { useState, useEffect } from 'react';
import { Coffee, MapPin, Sparkles } from 'lucide-react';

const RECOMMENDATIONS = [
  {
    title: 'Sudut Teduh Hari Ini',
    location: 'Kawasan Manahan, Surakarta',
    notes: 'Kopi susu aren lembut, semilir angin di area outdoor, cocok buat melepas penat sore hari.',
    tag: 'Suasana Adem',
  },
  {
    title: 'Fokus & Nugas Tenang',
    location: 'Dekat Kampus UNS & ISI',
    notes: 'Wi-Fi 85 Mbps kencang, banyak colokan di meja kayu, musik latar pelan dan nyaman.',
    tag: 'Rekomendasi Nugas',
  },
  {
    title: 'Kumpul Santai Bersama',
    location: 'Area Slamet Riyadi',
    notes: 'Tempat duduk sofa empuk, pilihan pastry hangat, asyik buat ngobrol lama bareng kawan.',
    tag: 'Tempat Ngobrol',
  },
];

export default function TypingCodeBlock() {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');

  const current = RECOMMENDATIONS[index];

  useEffect(() => {
    let charIndex = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const fullText = current.notes;

    const tick = () => {
      if (!isDeleting) {
        charIndex++;
        setDisplayText(fullText.slice(0, charIndex));

        if (charIndex >= fullText.length) {
          isDeleting = true;
          timer = setTimeout(tick, 4000); // pause at end
          return;
        }
        timer = setTimeout(tick, 30 + (Math.random() * 20 - 10));
      } else {
        charIndex--;
        setDisplayText(fullText.slice(0, charIndex));

        if (charIndex <= 0) {
          isDeleting = false;
          setIndex((prev) => (prev + 1) % RECOMMENDATIONS.length);
          timer = setTimeout(tick, 600);
          return;
        }
        timer = setTimeout(tick, 15);
      }
    };

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [index, current.notes]);

  return (
    <div className="relative w-[250px] select-none rounded-2xl overflow-hidden shadow-xl border border-canvas-border bg-white p-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-canvas-border pb-2.5">
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-crema-100 text-crema-600">
            <Coffee className="h-3 w-3" />
          </div>
          <span className="text-[11px] font-bold text-roast-900 tracking-tight">
            {current.title}
          </span>
        </div>
        <span className="rounded-full bg-crema-50 border border-crema-200 px-2 py-0.5 text-[9px] font-semibold text-crema-600">
          {current.tag}
        </span>
      </div>

      {/* Location */}
      <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-roast-400">
        <MapPin className="h-2.5 w-2.5 shrink-0 text-crema-500" />
        <span className="truncate">{current.location}</span>
      </div>

      {/* Dynamic Note Body with blinking cursor */}
      <div className="mt-2 min-h-[52px] text-[11px] leading-relaxed text-roast-700">
        &ldquo;{displayText}&rdquo;
        <span className="inline-block w-[1.5px] h-[11px] bg-crema-500 ml-0.5 align-middle animate-pulse" />
      </div>

      {/* Friendly Footer Pill */}
      <div className="mt-2.5 flex items-center justify-between border-t border-canvas-border pt-2 text-[9px] font-mono text-roast-400">
        <div className="flex items-center gap-1">
          <Sparkles className="h-2.5 w-2.5 text-crema-500" />
          <span>Kurasi Komunitas Solo</span>
        </div>
        <span>{index + 1}/{RECOMMENDATIONS.length}</span>
      </div>
    </div>
  );
}
