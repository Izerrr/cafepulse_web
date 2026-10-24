'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, User, KeyRound, CheckCircle2, Sparkles, Lock, LogOut } from 'lucide-react';
import { UserRole } from '@/hooks/useUserRole';

interface UserAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  onLoginCurator: (pin: string) => boolean;
  onLogoutVisitor: () => void;
}

export const UserAccessModal: React.FC<UserAccessModalProps> = ({
  isOpen,
  onClose,
  role,
  onLoginCurator,
  onLogoutVisitor,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const ok = onLoginCurator(pinInput);
    if (ok) {
      setPinInput('');
      setSuccessMsg('Berhasil beralih ke Mode Kurator / Pengelola Kafe!');
    } else {
      setErrorMsg('Kode akses Kurator tidak sesuai. Coba gunakan kode demo di bawah.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-roast-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-canvas-bg border border-canvas-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-canvas-border flex items-center justify-between bg-canvas-surface">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                role === 'curator' ? 'bg-crema-500 animate-pulse' : 'bg-status-green'
              }`}
            />
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-roast-900">
              Mode Akses Pengguna • CafePulse Solo
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal akses"
            className="w-8 h-8 rounded-full border border-canvas-border flex items-center justify-center text-roast-500 hover:text-roast-900 hover:bg-canvas-elevated transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Active Role Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
              role === 'curator'
                ? 'bg-crema-500/10 border-crema-500/30'
                : 'bg-canvas-surface border-canvas-border'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                role === 'curator'
                  ? 'bg-crema-500 text-canvas-surface shadow-sm'
                  : 'bg-roast-900 text-canvas-bg'
              }`}
            >
              {role === 'curator' ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-roast-500">
                  Status Saat Ini
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                    role === 'curator'
                      ? 'bg-crema-500 text-canvas-surface'
                      : 'bg-status-green/15 text-status-green'
                  }`}
                >
                  {role === 'curator' ? 'Kurator Terverifikasi' : 'Pengunjung Publik'}
                </span>
              </div>
              <h3 className="text-base font-bold text-roast-900 mt-1">
                {role === 'curator'
                  ? 'Mode Kurator & Pengelola Direktori'
                  : 'Mode Pengunjung & Penjelajah Kafe'}
              </h3>
              <p className="text-xs text-roast-600 mt-1 leading-relaxed">
                {role === 'curator'
                  ? 'Anda memiliki akses penuh untuk mengedit detail fasilitas, menghapus kafe yang sudah tutup, serta melakukan sinkronisasi massal kafe Solo dari peta.'
                  : 'Anda dapat menjelajahi seluruh kafe, menyimpan daftar favorit, mengimpor kafe baru dari Maps, serta memberikan rating dan laporan kecepatan Wi-Fi.'}
              </p>
            </div>
          </div>

          {/* Role Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-canvas-surface border border-canvas-border flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-status-green" />
                  <span className="font-bold text-xs text-roast-900">Akses Pengunjung</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-roast-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-status-green shrink-0" />
                    Cari & filter kafe sesuai suasana
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-status-green shrink-0" />
                    Simpan daftar kafe favorit pribadi
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-status-green shrink-0" />
                    Beri rating, ulasan & lapor Wi-Fi
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-status-green shrink-0" />
                    Usulkan / impor kafe dari Maps
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-canvas-surface border border-canvas-border flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-crema-500" />
                  <span className="font-bold text-xs text-roast-900">Akses Kurator (Admin)</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-roast-600">
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-crema-500 shrink-0" />
                    Semua fitur Pengunjung Publik
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-crema-500 shrink-0" />
                    Edit spesifikasi & fasilitas kafe
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-crema-500 shrink-0" />
                    Sinkronisasi kafe Solo sekali klik
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-crema-500 shrink-0" />
                    Hapus data kafe yang sudah tutup
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-status-green/10 border border-status-green/25 text-status-green text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-status-red/10 border border-status-red/25 text-status-red text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Switcher Form */}
          {role === 'visitor' ? (
            <form
              onSubmit={handleVerifyPin}
              className="p-4 rounded-2xl bg-canvas-surface border border-canvas-border space-y-3"
            >
              <div className="flex items-center justify-between">
                <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-roast-600 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-crema-500" /> Masuk sebagai Kurator / Pengelola
                </label>
                <button
                  type="button"
                  onClick={() => setPinInput('cafepulse2026')}
                  className="font-mono text-[10px] font-bold text-crema-500 hover:underline"
                >
                  Isi PIN Demo Otomatis
                </button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Lock className="w-3.5 h-3.5 text-roast-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Masukkan PIN Kurator (cafepulse2026)"
                    className="w-full pl-9 pr-3 py-2.5 bg-canvas-bg border border-canvas-border rounded-xl text-xs text-roast-900 focus:outline-none focus:border-crema-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-roast-900 hover:bg-crema-500 text-canvas-bg font-mono text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                >
                  Aktifkan
                </button>
              </div>
              <p className="text-[11px] text-roast-500">
                Untuk keperluan eksplorasi & demo portofolio, klik{' '}
                <span className="font-mono font-bold text-roast-800">Isi PIN Demo Otomatis</span>{' '}
                atau ketik <code className="font-mono text-crema-600">cafepulse2026</code>.
              </p>
            </form>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-canvas-surface border border-canvas-border">
              <div>
                <p className="text-xs font-bold text-roast-900">Selesai mengelola direktori?</p>
                <p className="text-[11px] text-roast-500">
                  Anda dapat kembali ke Mode Pengunjung kapan saja.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onLogoutVisitor();
                  setSuccessMsg(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-canvas-border hover:border-roast-900 text-roast-800 font-mono text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Mode Pengunjung
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
