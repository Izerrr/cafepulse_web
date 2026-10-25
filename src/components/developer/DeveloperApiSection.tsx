'use client';

import React, { useState } from 'react';
import { Copy, Check, Code2, Terminal, ExternalLink } from 'lucide-react';

export default function DeveloperApiSection() {
  const [activeTab, setActiveTab] = useState<'curl' | 'js' | 'python'>('curl');
  const [copied, setCopied] = useState(false);

  const baseUrl = 'https://api.cafepulse.izerworks.my.id';

  const codeSnippets = {
    curl: `# Ambil daftar kafe dengan crowd density rendah (fokus nugas)
curl -s "${baseUrl}/api/cafes?crowd_density=LOW"`,
    js: `// Fetch daftar kafe ramah kerja di Surakarta
const res = await fetch('${baseUrl}/api/cafes?limit=10');
const { data, total } = await res.json();

console.log(\`Ditemukan \${total} kafe ramah kerja:\`, data);`,
    python: `import requests

# Mengambil data kafe dengan Wi-Fi terverifikasi
response = requests.get('${baseUrl}/api/cafes')
data = response.json()

for cafe in data.get('data', []):
    amenities = cafe.get('amenities', {})
    print(f"{cafe['name']}: {amenities.get('wifi_speed_mbps')} Mbps | Colokan: {amenities.get('plug_score')}")`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developer-api" className="bg-roast-950 py-20 lg:py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Onlines dark roast card wrapper */}
        <div className="rounded-3xl border border-white/8 bg-roast-900 p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
          
          {/* Subtle warm dot pattern background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage: 'radial-gradient(rgba(224, 142, 69, 0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Context & Documentation */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-crema-500/30 bg-crema-500/10 px-3.5 py-1 text-xs text-crema-300">
                <Code2 className="h-3.5 w-3.5 text-crema-400" />
                <span className="font-mono">Keterbukaan Data Komunitas</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Akses data CafePulse untuk karya &amp; penelitianmu<span className="text-crema-400">.</span>
              </h2>

              <p className="text-sm leading-relaxed text-roast-200">
                Selain sebagai direktori kafe publik, seluruh data kafe di Surakarta terbuka gratis bagi mahasiswa yang menyusun tugas akhir, pegiat riset, atau pengembang aplikasi melalui REST API dengan dukungan CORS penuh.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`${baseUrl}/db-check`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/4 px-4 py-2 text-xs font-semibold text-white hover:bg-white/8 transition-colors"
                >
                  <Terminal className="h-3.5 w-3.5 text-crema-400" />
                  <span>Cek Telemetri /db-check</span>
                  <ExternalLink className="h-3 w-3 text-roast-300" />
                </a>

                <a
                  href={`${baseUrl}/api/cafes`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/4 px-4 py-2 text-xs font-semibold text-white hover:bg-white/8 transition-colors"
                >
                  <span className="font-mono text-crema-400">GET</span>
                  <span>/api/cafes</span>
                  <ExternalLink className="h-3 w-3 text-roast-300" />
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Code Console */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/8 bg-roast-950 overflow-hidden shadow-2xl">
                
                {/* Top Terminal Bar */}
                <div className="flex items-center justify-between border-b border-white/8 bg-roast-900 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 font-mono text-xs text-roast-400 hidden sm:inline">
                      api.cafepulse.izerworks.my.id
                    </span>
                  </div>

                  {/* Language Tabs */}
                  <div className="flex items-center gap-1">
                    {(['curl', 'js', 'python'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                          activeTab === tab
                            ? 'bg-crema-500 text-white font-medium shadow-xs'
                            : 'text-roast-300 hover:text-white'
                        }`}
                      >
                        {tab === 'curl' ? 'cURL' : tab === 'js' ? 'JS (fetch)' : 'Python'}
                      </button>
                    ))}

                    <button
                      onClick={handleCopy}
                      className="ml-2 flex items-center gap-1 rounded-md border border-white/8 bg-white/4 px-2.5 py-1 text-xs text-roast-200 hover:text-white transition-colors"
                      title="Salin kode"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Code Body */}
                <div className="p-4 sm:p-5 overflow-x-auto">
                  <pre className="font-mono text-xs text-roast-100 leading-relaxed">
                    <code>{codeSnippets[activeTab]}</code>
                  </pre>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
