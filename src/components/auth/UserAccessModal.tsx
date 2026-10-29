'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  User,
  KeyRound,
  CheckCircle2,
  Sparkles,
  Lock,
  LogOut,
  Coffee,
  Code2,
} from 'lucide-react';
import { UserRole } from '@/hooks/useUserRole';

interface UserAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  onLoginCurator: (pin: string) => boolean;
  onLogoutVisitor: () => void;
  pendingActionMessage?: string | null;
  onSuccessAuth?: () => void;
}

export const UserAccessModal: React.FC<UserAccessModalProps> = ({
  isOpen,
  onClose,
  role,
  onLoginCurator,
  onLogoutVisitor,
  pendingActionMessage,
  onSuccessAuth,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const ok = onLoginCurator(pinInput);
    if (ok) {
      const isStaffPin = pinInput.trim() === 'staffsolo2026';
      setPinInput('');
      setSuccessMsg(
        isStaffPin
          ? 'Berhasil beralih ke Kelas Staff Kafe!'
          : 'Berhasil beralih ke Kelas Kurator & Developer!'
      );
      if (onSuccessAuth) {
        setTimeout(() => {
          onSuccessAuth();
        }, 450);
      }
    } else {
      setErrorMsg('Kode PIN tidak sesuai. Gunakan kode demo Staff atau Kurator di bawah.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-roast-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="access-modal-title"
        className="relative w-full max-w-xl bg-canvas-bg border border-canvas-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-canvas-border flex items-center justify-between bg-canvas-surface">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                role !== 'visitor' ? 'bg-crema-500 animate-pulse' : 'bg-status-green'
              }`}
            />
            <span
              id="access-modal-title"
              className="font-mono text-[11px] font-bold uppercase tracking-widest text-roast-900"
            >
              Kelas Akses Pengguna • CafePulse Solo
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
          {/* Pending Action Alert */}
          {pendingActionMessage && role === 'visitor' && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-medium flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-roast-900">Otorisasi Diperlukan</p>
                <p className="text-[11px] text-roast-600 mt-0.5">{pendingActionMessage}</p>
              </div>
            </div>
          )}

          {/* Active Role Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
              role !== 'visitor'
                ? 'bg-crema-500/10 border-crema-500/30'
                : 'bg-canvas-surface border-canvas-border'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                role !== 'visitor'
                  ? 'bg-crema-500 text-canvas-surface shadow-sm'
                  : 'bg-roast-900 text-canvas-bg'
              }`}
            >
              {role === 'curator' ? (
                <Code2 className="w-5 h-5" />
              ) : role === 'staff' ? (
                <Coffee className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-roast-500">
                  Kelas Aktif
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                    role !== 'visitor'
                      ? 'bg-crema-500 text-canvas-surface'
                      : 'bg-status-green/15 text-status-green'
                  }`}
                >
                  {role === 'curator'
                    ? 'Kurator & Developer'
                    : role === 'staff'
                    ? 'Staff Kafe Mitra'
                    : 'Pengunjung Publik'}
                </span>
              </div>
              <h3 className="text-base font-bold text-roast-900 mt-1">
                {role === 'curator'
                  ? 'Mode Kurator & Developer Direktori'
                  : role === 'staff'
                  ? 'Mode Staff & Kasir Kafe Mitra'
                  : 'Mode Pengunjung & Penjelajah Kafe'}
              </h3>
              <p className="text-xs text-roast-600 mt-1 leading-relaxed">
                {role === 'curator'
                  ? 'Akses penuh untuk mengaudit titik Google Maps ke database, sinkronisasi massal, edit spesifikasi WFC, dan kurasi direktori.'
                  : role === 'staff'
                  ? 'Akses pengelola kafe untuk memperbarui indikator keramaian (Live Pulse), mengaudit fasilitas kafe, dan mendaftarkan cabang dari peta.'
                  : 'Anda dapat mencari kafe, memfilter spesifikasi WFC, menyimpan bookmark, serta mengirim ulasan dan laporan speedtest Wi-Fi.'}
              </p>
            </div>
          </div>

          {/* 3-Tier Role Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-canvas-surface border border-canvas-border flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <User className="w-3.5 h-3.5 text-status-green" />
                  <span className="font-bold text-xs text-roast-900">1. Visitor</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-roast-600">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-status-green shrink-0 mt-0.5" />
                    <span>Filter Wi-Fi, colokan & suasana</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-status-green shrink-0 mt-0.5" />
                    <span>Simpan bookmark pribadi</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-status-green shrink-0 mt-0.5" />
                    <span>Kirim ulasan & tes Wi-Fi</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-canvas-surface border border-canvas-border flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Coffee className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-bold text-xs text-roast-900">2. Staff Kafe</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-roast-600">
                  <li className="flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                    <span>Update status Live Pulse</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                    <span>Edit fasilitas & jam buka</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                    <span>Audit kafe dari Google Maps</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-canvas-surface border border-canvas-border flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-crema-500" />
                  <span className="font-bold text-xs text-roast-900">3. Kurator / Dev</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-roast-600">
                  <li className="flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-crema-500 shrink-0 mt-0.5" />
                    <span>Audit & +Sync POI Solo</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-crema-500 shrink-0 mt-0.5" />
                    <span>Batch sync multi-kafe</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-crema-500 shrink-0 mt-0.5" />
                    <span>Hapus kafe tutup & API</span>
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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-roast-600 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-crema-500" /> Verifikasi PIN Kelas Pengguna
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPinInput('staffsolo2026')}
                    className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 font-mono text-[10px] font-bold text-amber-700 hover:bg-amber-500/20"
                  >
                    PIN Staff (staffsolo2026)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPinInput('cafepulse2026')}
                    className="px-2 py-0.5 rounded-md bg-crema-500/10 border border-crema-500/30 font-mono text-[10px] font-bold text-crema-600 hover:bg-crema-500/20"
                  >
                    PIN Kurator (cafepulse2026)
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Lock className="w-3.5 h-3.5 text-roast-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Masukkan PIN Staff (staffsolo2026) atau Kurator (cafepulse2026)"
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
                Pilih salah satu tombol PIN demo di atas untuk menguji hak akses <strong>Staff Kafe</strong> atau <strong>Kurator / Developer</strong>.
              </p>
            </form>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-canvas-surface border border-canvas-border">
              <div>
                <p className="text-xs font-bold text-roast-900">Selesai melakukan kurasi atau audit?</p>
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

