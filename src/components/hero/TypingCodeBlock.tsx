'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const CODE_LINES = [
  '# REST API CafePulse',
  'curl "https://api.cafepulse.izerworks.my.id/api/cafes?wifi_min=50"',
  '',
  'HTTP/2 200 OK',
  '{',
  '  "status": "success",',
  '  "total_spaces": 14,',
  '  "data": [',
  '    { "name": "Ruang Temu", "wifi_speed": 85, "plug": "PLENTY" }',
  '  ]',
  '}',
];

const CODE_TEXT = CODE_LINES.join('\n');

export default function TypingCodeBlock() {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let charIndex = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const tick = () => {
      if (!isDeleting) {
        charIndex++;
        setDisplayText(CODE_TEXT.slice(0, charIndex));

        if (charIndex >= CODE_TEXT.length) {
          isDeleting = true;
          timer = setTimeout(tick, 3500); // pause at end
          return;
        }
        timer = setTimeout(tick, 35 + (Math.random() * 20 - 10));
      } else {
        charIndex--;
        setDisplayText(CODE_TEXT.slice(0, charIndex));

        if (charIndex <= 0) {
          isDeleting = false;
          timer = setTimeout(tick, 900); // pause before retyping
          return;
        }
        timer = setTimeout(tick, 15);
      }
    };

    timer = setTimeout(tick, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-[230px] h-[170px] select-none rounded-xl overflow-hidden shadow-xl border border-[#111111]/10 bg-[#161618]">
      {/* Code background frame */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <Image
          src="/onlines/codigo.svg"
          alt="Code editor frame"
          fill
          className="object-cover"
        />
      </div>

      {/* Code Text with blinking cursor */}
      <div className="relative z-10 p-3 pt-7 font-mono text-[9px] leading-relaxed text-[#D2D2D2] whitespace-pre-wrap overflow-hidden h-full">
        {displayText}
        <span className="inline-block w-[1.5px] h-[11px] bg-accent-amber ml-0.5 align-middle animate-pulse" />
      </div>
    </div>
  );
}

