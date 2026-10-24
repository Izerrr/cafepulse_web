'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Cafe, MapsPlaceCandidate } from '@/types/cafe';
import { api, CURATED_SOLO_PLACES } from '@/lib/api';
import {
  MapPin,
  Wifi,
  Star,
  Sparkles,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  Navigation,
  Loader2,
} from 'lucide-react';

interface CafeInteractiveMapProps {
  cafes: Cafe[];
  allCafes: Cafe[];
  onSelectCafe: (cafe: Cafe) => void;
  onReviewCafe: (cafe: Cafe) => void;
}

const SOLO_CENTER: [number, number] = [-7.562, 110.818];

export default function CafeInteractiveMap({
  cafes,
  allCafes,
  onSelectCafe,
  onReviewCafe,
}: CafeInteractiveMapProps) {
  const queryClient = useQueryClient();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(cafes[0] ?? null);
  const [selectedCandidate, setSelectedCandidate] = useState<MapsPlaceCandidate | null>(null);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [discoveredPlaces, setDiscoveredPlaces] =
    useState<MapsPlaceCandidate[]>(CURATED_SOLO_PLACES);
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Filter out places that are already synced in allCafes (by name similarity)
  const unsyncedCandidates = useMemo(() => {
    const existingNames = new Set(allCafes.map((c) => c.name.toLowerCase().trim()));
    return discoveredPlaces.filter((cand) => {
      const normalized = cand.name.toLowerCase().trim();
      for (const existing of existingNames) {
        if (existing.includes(normalized) || normalized.includes(existing)) {
          return false;
        }
      }
      return true;
    });
  }, [discoveredPlaces, allCafes]);

  // Search OpenStreetMap + Curated Solo places when user searches inside map
  const handleSearchMaps = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchingMap(true);
    try {
      const results = await api.searchSoloPlacesFromMaps(mapSearchQuery);
      setDiscoveredPlaces(results);
      if (results.length > 0 && mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([results[0].latitude, results[0].longitude], 15, {
          duration: 0.9,
        });
      }
    } finally {
      setIsSearchingMap(false);
    }
  };

  // Mutation to sync a single candidate from Maps to our Backend API
  const syncSingleMutation = useMutation({
    mutationFn: async (candidate: MapsPlaceCandidate) => {
      const res = await api.createCafe({
        name: candidate.name,
        address: candidate.address,
        opening_hours: candidate.opening_hours || '08:00 - 23:00',
        crowd_density: 'MODERATE',
        latitude: candidate.latitude,
        longitude: candidate.longitude,
        amenities: {
          wifi_speed_mbps: 65,
          wifi_stability: 'GOOD',
          plug_score: 'PLENTY',
          noise_level: 'MODERATE',
          air_conditioned: true,
          has_outdoor: true,
          has_prayer_room: true,
        },
      });
      return res.data;
    },
    onSuccess: (createdCafe) => {
      queryClient.invalidateQueries({ queryKey: ['cafes'] });
      queryClient.invalidateQueries({ queryKey: ['system-status'] });
      setSelectedCandidate(null);
      setSelectedCafe(createdCafe);
      setSyncNotice(
        `"${createdCafe.name}" berhasil ditarik dari Maps & disinkronkan ke API! Sekarang Anda bisa langsung memberi rating.`
      );
      setTimeout(() => setSyncNotice(null), 6000);
    },
  });

  // Mutation to batch-sync top unsynced Solo cafes into API
  const syncBatchMutation = useMutation({
    mutationFn: async () => {
      const batch = unsyncedCandidates.slice(0, 3);
      const created: Cafe[] = [];
      for (const cand of batch) {
        const res = await api.createCafe({
          name: cand.name,
          address: cand.address,
          opening_hours: cand.opening_hours || '08:00 - 23:00',
          crowd_density: 'MODERATE',
          latitude: cand.latitude,
          longitude: cand.longitude,
          amenities: {
            wifi_speed_mbps: 60,
            wifi_stability: 'GOOD',
            plug_score: 'PLENTY',
            noise_level: 'MODERATE',
            air_conditioned: true,
            has_outdoor: true,
            has_prayer_room: true,
          },
        });
        created.push(res.data);
      }
      return created;
    },
    onSuccess: (createdList) => {
      queryClient.invalidateQueries({ queryKey: ['cafes'] });
      queryClient.invalidateQueries({ queryKey: ['system-status'] });
      if (createdList.length > 0) {
        setSelectedCandidate(null);
        setSelectedCafe(createdList[0]);
        setSyncNotice(
          `${createdList.length} kafe populer Surakarta berhasil disinkronkan otomatis dari Maps ke API CafePulse!`
        );
        setTimeout(() => setSyncNotice(null), 6000);
      }
    },
  });

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: SOLO_CENTER,
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &bull; CafePulse Solo',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersLayerRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Render markers whenever cafes or unsyncedCandidates change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersLayerRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Render Synced API Cafes (Solid Warm Espresso / Crema Pins)
    cafes.forEach((cafe) => {
      const lat = cafe.latitude ?? -7.565;
      const lng = cafe.longitude ?? 110.825;
      const isSelected = selectedCafe?.id === cafe.id;
      const wifiSpeed = cafe.amenities?.wifi_speed_mbps || 50;

      const badgeColor =
        cafe.crowd_density === 'LOW'
          ? '#2A7B52'
          : cafe.crowd_density === 'MODERATE'
          ? '#D07D2B'
          : '#C43B3B';

      const icon = L.divIcon({
        className: 'cafepulse-custom-pin',
        html: `
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 10px;
            border-radius: 999px;
            background: ${isSelected ? '#C86237' : '#1E1714'};
            color: #FFFDF9;
            border: 2px solid #FFFDF9;
            box-shadow: 0 8px 20px rgba(30,23,20,0.28);
            font-family: monospace;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            transform: translate(-50%, -50%) scale(${isSelected ? '1.12' : '1'});
            transition: all 0.2s ease;
          ">
            <span style="width: 8px; height: 8px; border-radius: 999px; background: ${badgeColor}; display: inline-block;"></span>
            <span>☕ ${cafe.name}</span>
            <span style="opacity: 0.85; font-size: 10px;">${wifiSpeed}Mbps</span>
          </div>
        `,
        iconSize: [140, 32],
        iconAnchor: [70, 16],
      });

      const marker = L.marker([lat, lng], { icon });
      marker.on('click', () => {
        setSelectedCandidate(null);
        setSelectedCafe(cafe);
        map.flyTo([lat, lng], 15, { duration: 0.7 });
      });
      marker.addTo(layerGroup);
    });

    // 2. Render Unsynced Maps Discovery Candidates (Dashed Terracotta Pins)
    unsyncedCandidates.forEach((cand) => {
      const isSelected = selectedCandidate?.id === cand.id;

      const icon = L.divIcon({
        className: 'cafepulse-candidate-pin',
        html: `
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 9px;
            border-radius: 999px;
            background: ${isSelected ? '#C86237' : '#FFFDF9'};
            color: ${isSelected ? '#FFFDF9' : '#A94D26'};
            border: 1.5px dashed #C86237;
            box-shadow: 0 6px 16px rgba(200,98,55,0.22);
            font-family: monospace;
            font-size: 10px;
            font-weight: 700;
            white-space: nowrap;
            transform: translate(-50%, -50%) scale(${isSelected ? '1.1' : '1'});
          ">
            <span>📍 ${cand.name}</span>
            <span style="background: rgba(200,98,55,0.15); padding: 1px 5px; border-radius: 99px; font-size: 9px;">+Impor</span>
          </div>
        `,
        iconSize: [140, 28],
        iconAnchor: [70, 14],
      });

      const marker = L.marker([cand.latitude, cand.longitude], { icon });
      marker.on('click', () => {
        setSelectedCafe(null);
        setSelectedCandidate(cand);
        map.flyTo([cand.latitude, cand.longitude], 15, { duration: 0.7 });
      });
      marker.addTo(layerGroup);
    });
  }, [cafes, unsyncedCandidates, selectedCafe, selectedCandidate]);

  return (
    <div className="space-y-4">
      {/* Top Map Control & Auto-Sync Bar */}
      <div className="p-4 rounded-3xl bg-canvas-surface border border-canvas-border shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-crema-500/15 border border-crema-500/30 flex items-center justify-center text-crema-600 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-roast-900">
                Peta Radar Kafe Surakarta • Sinkronisasi API &amp; Maps
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-status-green/15 text-status-green font-mono text-[10px] font-bold">
                {cafes.length} Terdaftar di API
              </span>
              {unsyncedCandidates.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-crema-500/15 text-crema-600 font-mono text-[10px] font-bold">
                  +{unsyncedCandidates.length} Kafe Maps Siap Impor
                </span>
              )}
            </div>
            <p className="text-xs text-roast-600 mt-0.5">
              Klik pin kopi gelap untuk melihat &amp; memberi rating kafe terdaftar, atau klik pin
              bergaris putus-putus untuk menarik kafe baru dari Maps ke API CafePulse.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Solo Maps Input */}
          <form onSubmit={handleSearchMaps} className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-roast-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={mapSearchQuery}
              onChange={(e) => setMapSearchQuery(e.target.value)}
              placeholder="Cari kafe di Maps Solo..."
              className="w-full pl-9 pr-16 py-2 rounded-full bg-canvas-bg border border-canvas-border text-xs text-roast-900 placeholder-roast-400 focus:outline-none focus:border-crema-500"
            />
            <button
              type="submit"
              disabled={isSearchingMap}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-roast-900 text-canvas-bg font-mono text-[10px] font-bold hover:bg-crema-500 transition-colors"
            >
              {isSearchingMap ? '...' : 'Cari'}
            </button>
          </form>

          {/* Batch Sync Button */}
          {unsyncedCandidates.length > 0 && (
            <button
              type="button"
              onClick={() => syncBatchMutation.mutate()}
              disabled={syncBatchMutation.isPending}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-crema-500 hover:bg-crema-600 disabled:opacity-50 text-canvas-surface font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm shrink-0"
            >
              {syncBatchMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>Sinkronkan {Math.min(3, unsyncedCandidates.length)} Kafe Maps</span>
            </button>
          )}
        </div>
      </div>

      {/* Sync Notification Banner */}
      {syncNotice && (
        <div className="p-3.5 rounded-2xl bg-status-green/10 border border-status-green/30 text-status-green text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{syncNotice}</span>
          </div>
          {selectedCafe && (
            <button
              type="button"
              onClick={() => onReviewCafe(selectedCafe)}
              className="px-3 py-1 rounded-full bg-status-green text-white font-mono text-[10px] font-bold uppercase tracking-wider shrink-0"
            >
              ⭐ Beri Rating Sekarang
            </button>
          )}
        </div>
      )}

      {/* Main Map + Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Map Canvas */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden border border-canvas-border shadow-md bg-canvas-elevated min-h-[460px]">
          <div ref={mapContainerRef} className="w-full h-[460px] sm:h-[520px] z-10" />

          {/* Floating Map Legend */}
          <div className="absolute bottom-4 left-4 z-20 p-3 rounded-2xl bg-canvas-surface/95 backdrop-blur-md border border-canvas-border shadow-lg flex flex-wrap items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-roast-900 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-roast-900 inline-block" /> Kafe Terdaftar
              API
            </span>
            <span className="flex items-center gap-1.5 text-crema-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full border border-dashed border-crema-500 bg-crema-500/20 inline-block" />{' '}
              Temuan Maps (Klik untuk Impor)
            </span>
          </div>
        </div>

        {/* Right Side Inspector Card */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl bg-canvas-surface border border-canvas-border p-5 shadow-sm">
          {selectedCafe ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full bg-status-green/15 text-status-green font-mono text-[10px] font-bold uppercase tracking-wider">
                  ✓ Tersinkron di API CafePulse
                </span>
                <span className="font-mono text-xs font-bold text-crema-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-crema-500" />{' '}
                  {(selectedCafe.rating || 5.0).toFixed(1)}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-roast-900">{selectedCafe.name}</h4>
                <p className="text-xs text-roast-600 mt-1 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-crema-500 shrink-0 mt-0.5" />
                  <span>{selectedCafe.address}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-canvas-bg border border-canvas-border">
                  <span className="font-mono text-[10px] text-roast-500 uppercase block">
                    Kecepatan Wi-Fi
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Wifi className="w-4 h-4 text-crema-500" />
                    <span className="font-mono text-sm font-bold text-roast-900">
                      {selectedCafe.amenities?.wifi_speed_mbps || 50} Mbps
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-canvas-bg border border-canvas-border">
                  <span className="font-mono text-[10px] text-roast-500 uppercase block">
                    Suasana Saat Ini
                  </span>
                  <span className="font-mono text-xs font-bold text-roast-900 mt-1 block">
                    {selectedCafe.crowd_density === 'LOW'
                      ? 'Leluasa / Sepi'
                      : selectedCafe.crowd_density === 'MODERATE'
                      ? 'Kondusif / Sedang'
                      : 'Ramai Pengunjung'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-canvas-bg border border-canvas-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-roast-500">Jam Buka</span>
                  <span className="font-mono font-bold text-roast-900">
                    {selectedCafe.opening_hours || '08:00 - 23:00'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-roast-500">Ketersediaan Colokan</span>
                  <span className="font-mono font-bold text-roast-900">
                    {selectedCafe.amenities?.plug_score === 'PLENTY'
                      ? 'Banyak (Tiap Meja)'
                      : selectedCafe.amenities?.plug_score === 'MODERATE'
                      ? 'Sedang'
                      : 'Terbatas'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-roast-500">Koordinat Peta</span>
                  <span className="font-mono text-[11px] text-roast-600">
                    {selectedCafe.latitude?.toFixed(4)}, {selectedCafe.longitude?.toFixed(4)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => onReviewCafe(selectedCafe)}
                  className="w-full py-2.5 px-4 rounded-full bg-crema-500 hover:bg-crema-600 text-canvas-surface font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Beri Rating &amp; Lapor Wi-Fi
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectCafe(selectedCafe)}
                    className="py-2.5 px-3 rounded-full bg-roast-900 hover:bg-roast-800 text-canvas-bg font-mono text-[11px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Detail &amp; Ulasan
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${selectedCafe.name} ${selectedCafe.address}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-full border border-canvas-border hover:border-roast-900 text-roast-800 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ) : selectedCandidate ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-crema-500/15 text-crema-600 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Kafe dari Peta Surakarta
                </span>
                <span className="font-mono text-[10px] text-roast-500">Belum di API</span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-roast-900">{selectedCandidate.name}</h4>
                <p className="text-xs text-roast-600 mt-1">{selectedCandidate.address}</p>
              </div>

              <div className="p-4 rounded-2xl bg-canvas-bg border border-canvas-border space-y-2 text-xs text-roast-600">
                <p className="font-medium text-roast-900">
                  Ingin memberi rating atau melihat ulasan kafe ini?
                </p>
                <p className="leading-relaxed">
                  Kafe ini ditemukan di peta Surakarta namun belum masuk ke database CafePulse. Klik
                  tombol di bawah untuk menyinkronkannya secara otomatis ke API agar semua pengunjung
                  bisa mulai memberi rating!
                </p>
              </div>

              <button
                type="button"
                disabled={syncSingleMutation.isPending}
                onClick={() => syncSingleMutation.mutate(selectedCandidate)}
                className="w-full py-3 px-4 rounded-full bg-roast-900 hover:bg-crema-500 disabled:opacity-50 text-canvas-bg font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                {syncSingleMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyinkronkan ke API...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Impor &amp; Sinkronkan ke API Sekarang</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="my-auto text-center py-8 space-y-2">
              <Navigation className="w-8 h-8 text-crema-500 mx-auto" />
              <h4 className="text-sm font-bold text-roast-900">Pilih Titik Kafe di Peta</h4>
              <p className="text-xs text-roast-500 max-w-xs mx-auto">
                Klik salah satu pin di peta Surakarta untuk melihat kecepatan Wi-Fi, memberi rating,
                atau mengimpor kafe baru dari Maps.
              </p>
            </div>
          )}

          {/* Quick Unsynced Discovery Chips at Bottom of Inspector */}
          {unsyncedCandidates.length > 0 && (
            <div className="pt-4 mt-4 border-t border-canvas-border">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-roast-500 block mb-2">
                Temuan Kafe Solo di Maps (Klik untuk Impor):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {unsyncedCandidates.slice(0, 4).map((cand) => (
                  <button
                    key={cand.id}
                    type="button"
                    onClick={() => {
                      setSelectedCafe(null);
                      setSelectedCandidate(cand);
                      mapInstanceRef.current?.flyTo([cand.latitude, cand.longitude], 15, {
                        duration: 0.7,
                      });
                    }}
                    className={`px-2.5 py-1 rounded-full font-mono text-[10px] border transition-all ${
                      selectedCandidate?.id === cand.id
                        ? 'bg-crema-500 text-white border-crema-500'
                        : 'bg-canvas-bg border-canvas-border text-roast-800 hover:border-crema-500'
                    }`}
                  >
                    + {cand.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
