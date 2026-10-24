'use client';

import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

export default function DeveloperApiSection() {
  const [activeTab, setActiveTab] = useState<'curl' | 'js' | 'python'>('curl');
  const [copied, setCopied] = useState(false);

  const baseUrl = 'https://api.cafepulse.izerworks.my.id';

  const codeSnippets = {
    curl: `curl -s "${baseUrl}/api/cafes?crowd_density=LOW"`,
    js: `// Fetch daftar kafe ramah kerja
const res = await fetch('${baseUrl}/api/cafes');
const { data, total } = await res.json();
console.log(\`Ditemukan \${total} kafe:\`, data);`,
    python: `import requests

# Mengambil data kafe dengan Wi-Fi terverifikasi
response = requests.get('${baseUrl}/api/cafes')
cafes = response.json().get('data', [])

for cafe in cafes:
    print(cafe['name'], cafe['amenities']['wifi_speed_mbps'], 'Mbps')`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developer-api" className="border-t border-white/[0.08] bg-[#0C0C0F] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-[#A1A1AA] mb-4">
            <Code2 className="h-3.5 w-3.5 text-[#E59850]" />
            <span>Open Data &amp; REST API</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#EDEDED]">
            Gunakan data CafePulse untuk proyekmu.
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[#A1A1AA]">
            Sedang membuat tugas akhir, aplikasi mobile, bot Telegram, atau visualisasi data?
            Data direktori kafe di CafePulse terbuka untuk umum dan dapat diakses gratis via REST API dengan dukungan CORS penuh.
          </p>
        </div>

        {/* Interactive Code Console */}
        <div className="mt-8 rounded-xl border border-white/10 bg-[#070709] overflow-hidden shadow-2xl">
          
          {/* Top Console Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-[#121215] px-4 py-2.5">
            
            {/* Tabs */}
            <div className="flex items-center gap-1 text-xs">
              {(['curl', 'js', 'python'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-md px-3 py-1 font-mono transition-colors ${
                    activeTab === tab
                      ? 'bg-white/10 text-white font-medium'
                      : 'text-[#71717A] hover:text-[#D4D4D8]'
                  }`}
                >
                  {tab === 'curl' ? 'cURL' : tab === 'js' ? 'JavaScript' : 'Python'}
                </button>
              ))}
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded border border-white/10 bg-white/[0.02] px-2.5 py-1 text-xs text-[#A1A1AA] hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin Perintah</span>
                </>
              )}
            </button>

          </div>

          {/* Code Viewer */}
          <div className="p-4 sm:p-5 overflow-x-auto">
            <pre className="font-mono text-xs sm:text-sm text-[#D4D4D8] leading-relaxed">
              <code>{codeSnippets[activeTab]}</code>
            </pre>
          </div>

          {/* Endpoints Quick Guide */}
          <div className="grid grid-cols-1 gap-px border-t border-white/[0.08] bg-white/[0.04] sm:grid-cols-3 text-xs">
            <div className="bg-[#0A0A0D] p-3.5">
              <span className="font-mono text-emerald-400 font-medium">GET /api/cafes</span>
              <p className="mt-1 text-[11px] text-[#71717A]">Daftar semua kafe, filter keramaian &amp; pencarian.</p>
            </div>
            <div className="bg-[#0A0A0D] p-3.5">
              <span className="font-mono text-emerald-400 font-medium">GET /api/cafes/:id</span>
              <p className="mt-1 text-[11px] text-[#71717A]">Detail spesifik kafe lengkap dengan ulasan.</p>
            </div>
            <div className="bg-[#0A0A0D] p-3.5">
              <span className="font-mono text-blue-400 font-medium">POST /api/cafes</span>
              <p className="mt-1 text-[11px] text-[#71717A]">Kontribusi data kafe baru dalam format JSON.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
