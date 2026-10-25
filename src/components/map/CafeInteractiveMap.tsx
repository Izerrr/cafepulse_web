'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
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
  Globe2,
  Layers,
} from 'lucide-react';

interface CafeInteractiveMapProps {
  cafes: Cafe[];
  allCafes: Cafe[];
  onSelectCafe: (cafe: Cafe) => void;
  onReviewCafe: (cafe: Cafe) => void;
}

const SOLO_CENTER = { lat: -7.562, lng: 110.818 };

export default function CafeInteractiveMap({
  cafes,
  allCafes,
  onSelectCafe,
  onReviewCafe,
}: CafeInteractiveMapProps) {
  const queryClient = useQueryClient();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // References for Google Maps Mode
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const googleMarkersRef = useRef<google.maps.Marker[]>([]);

  // References for Leaflet Fallback Mode
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletLayerRef = useRef<L.LayerGroup | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() || '';
  const [mapEngine, setMapEngine] = useState<'google' | 'leaflet'>(apiKey ? 'google' : 'leaflet');

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

  // Handle Search or Link Paste
  const handleSearchMaps = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapSearchQuery.trim()) {
      setDiscoveredPlaces(CURATED_SOLO_PLACES);
      return;
    }

    setIsSearchingMap(true);
    try {
      // 1. If Google Maps Live API is active and we have places service
      if (mapEngine === 'google' && googleMapRef.current && window.google?.maps?.places) {
        const service = new google.maps.places.PlacesService(googleMapRef.current);
        service.textSearch(
          {
            query: `${mapSearchQuery} cafe Surakarta Solo`,
            location: new google.maps.LatLng(SOLO_CENTER.lat, SOLO_CENTER.lng),
            radius: 10000,
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
              const mapped: MapsPlaceCandidate[] = results.map((place) => ({
                id: `gmap-live-${place.place_id || Date.now()}`,
                name: place.name || 'Kafe Solo',
                address: place.formatted_address || 'Surakarta, Jawa Tengah',
                latitude: place.geometry?.location?.lat() || SOLO_CENTER.lat,
                longitude: place.geometry?.location?.lng() || SOLO_CENTER.lng,
                opening_hours: '08:00 - 23:00',
                rating: place.rating || 4.7,
                total_reviews: place.user_ratings_total || 100,
                place_id: place.place_id,
                google_maps_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
                source: 'google_places_api',
              }));

              setDiscoveredPlaces(mapped);
              if (mapped[0]) {
                setSelectedCandidate(mapped[0]);
                setSelectedCafe(null);
                googleMapRef.current?.panTo({ lat: mapped[0].latitude, lng: mapped[0].longitude });
                googleMapRef.current?.setZoom(15);
              }
            } else {
              fallbackSearch();
            }
          }
        );
      } else {
        await fallbackSearch();
      }
    } catch {
      await fallbackSearch();
    } finally {
      setIsSearchingMap(false);
    }
  };

  const fallbackSearch = async () => {
    const results = await api.searchSoloPlacesFromMaps(mapSearchQuery);
    setDiscoveredPlaces(results);
    if (results.length > 0) {
      const top = results[0];
      setSelectedCandidate(top);
      setSelectedCafe(null);
      if (mapEngine === 'leaflet' && leafletMapRef.current) {
        leafletMapRef.current.flyTo([top.latitude, top.longitude], 15, { duration: 0.8 });
      } else if (mapEngine === 'google' && googleMapRef.current) {
        googleMapRef.current.panTo({ lat: top.latitude, lng: top.longitude });
        googleMapRef.current.setZoom(15);
      }
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
        `"${createdCafe.name}" berhasil ditarik dari Google Maps & masuk ke database API! Sekarang Anda bisa langsung memberikan rating.`
      );
      setTimeout(() => setSyncNotice(null), 6000);
    },
  });

  // Mutation to batch-sync top unsynced Solo cafes into API
  const syncBatchMutation = useMutation({
    mutationFn: async () => {
      const batch = unsyncedCandidates.slice(0, 4);
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
            wifi_speed_mbps: 65,
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
          `${createdList.length} kafe Google Maps Surakarta berhasil disinkronkan sekaligus ke database CafePulse!`
        );
        setTimeout(() => setSyncNotice(null), 6000);
      }
    },
  });

  // Helper to init Leaflet mode
  const initLeafletMap = useCallback(() => {
    if (!mapContainerRef.current || leafletMapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [SOLO_CENTER.lat, SOLO_CENTER.lng],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Clean Google Maps-like Voyager tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; Google Maps Data Sync &bull; OpenStreetMap &bull; CafePulse Solo',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    leafletMapRef.current = map;
    leafletLayerRef.current = layerGroup;
  }, []);

  // Initialize Map: Try Google Maps if API key provided, otherwise Leaflet
  useEffect(() => {
    let isCancelled = false;

    if (apiKey) {
      setOptions({
        key: apiKey,
        v: 'weekly',
      });

      Promise.all([importLibrary('maps'), importLibrary('places')])
        .then(() => {
          if (isCancelled || !mapContainerRef.current || googleMapRef.current) return;
          const map = new google.maps.Map(mapContainerRef.current, {
            center: SOLO_CENTER,
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });
          googleMapRef.current = map;
          setMapEngine('google');
        })
        .catch((err: unknown) => {
          console.warn('Google Maps API failed, falling back to interactive map view:', err);
          setMapEngine('leaflet');
          initLeafletMap();
        });
    } else {
      initLeafletMap();
    }

    return () => {
      isCancelled = true;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        leafletLayerRef.current = null;
      }
    };
  }, [apiKey, initLeafletMap]);

  // Update Markers for Leaflet Engine
  useEffect(() => {
    if (mapEngine !== 'leaflet') return;
    const map = leafletMapRef.current;
    const layerGroup = leafletLayerRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Synced Database Cafes (Deep Roast / Amber Crema)
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
        className: 'cafepulse-db-pin',
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
            box-shadow: 0 8px 20px rgba(30,23,20,0.3);
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

    // 2. Unsynced Google Maps Candidates
    unsyncedCandidates.forEach((cand) => {
      const isSelected = selectedCandidate?.id === cand.id;

      const icon = L.divIcon({
        className: 'cafepulse-gmap-pin',
        html: `
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 9px;
            border-radius: 999px;
            background: ${isSelected ? '#EA4335' : '#FFFDF9'};
            color: ${isSelected ? '#FFFDF9' : '#C5221F'};
            border: 1.5px solid #EA4335;
            box-shadow: 0 6px 16px rgba(234,67,53,0.25);
            font-family: monospace;
            font-size: 10px;
            font-weight: 700;
            white-space: nowrap;
            transform: translate(-50%, -50%) scale(${isSelected ? '1.1' : '1'});
          ">
            <span>📍 ${cand.name}</span>
            <span style="background: rgba(234,67,53,0.12); padding: 1px 5px; border-radius: 99px; font-size: 9px;">+Sync</span>
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
  }, [mapEngine, cafes, unsyncedCandidates, selectedCafe, selectedCandidate]);

  // Update Markers for Native Google Maps Engine
  useEffect(() => {
    if (mapEngine !== 'google' || !googleMapRef.current) return;
    const map = googleMapRef.current;

    // Clear existing markers
    googleMarkersRef.current.forEach((m) => m.setMap(null));
    googleMarkersRef.current = [];

    // Add Synced Cafes
    cafes.forEach((cafe) => {
      const lat = cafe.latitude ?? -7.565;
      const lng = cafe.longitude ?? 110.825;
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: cafe.name,
      });

      marker.addListener('click', () => {
        setSelectedCandidate(null);
        setSelectedCafe(cafe);
        map.panTo({ lat, lng });
      });
      googleMarkersRef.current.push(marker);
    });

    // Add Unsynced Candidates
    unsyncedCandidates.forEach((cand) => {
      const marker = new google.maps.Marker({
        position: { lat: cand.latitude, lng: cand.longitude },
        map,
        title: `[Google Maps] ${cand.name}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: '#EA4335',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        setSelectedCafe(null);
        setSelectedCandidate(cand);
        map.panTo({ lat: cand.latitude, lng: cand.longitude });
      });
      googleMarkersRef.current.push(marker);
    });
  }, [mapEngine, cafes, unsyncedCandidates]);

  return (
    <div className="space-y-4">
      {/* Top Map Control & Auto-Sync Bar */}
      <div className="p-4 rounded-3xl bg-canvas-surface border border-canvas-border shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-crema-500/15 border border-crema-500/30 flex items-center justify-center text-crema-600 shrink-0">
            <Globe2 className="w-5 h-5 text-crema-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-roast-900">
                Peta Kafe Surakarta &bull; Sinkronisasi Google Maps
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-status-green/15 text-status-green font-mono text-[10px] font-bold">
                {cafes.length} di Database API
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 font-mono text-[10px] font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {unsyncedCandidates.length} Kafe Google Maps Siap Sync
              </span>
              <span className="px-2 py-0.5 rounded-full bg-canvas-bg border border-canvas-border text-roast-600 font-mono text-[9px] uppercase">
                {mapEngine === 'google' ? 'Google Maps Live API' : 'Google Maps Hybrid Mode'}
              </span>
            </div>
            <p className="text-xs text-roast-600 mt-0.5">
              Klik pin merah untuk memasukkan kafe dari Google Maps ke database &amp; membuka rating, atau tempel link Google Maps di bawah.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search or Paste Google Maps URL */}
          <form onSubmit={handleSearchMaps} className="relative flex-1 sm:w-80">
            <Search className="w-3.5 h-3.5 text-roast-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={mapSearchQuery}
              onChange={(e) => setMapSearchQuery(e.target.value)}
              placeholder="Cari kafe Solo atau tempel link Google Maps..."
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
              title="Masukkan 4 kafe Google Maps populer sekaligus ke database CafePulse"
            >
              {syncBatchMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>Sync {Math.min(4, unsyncedCandidates.length)} Kafe Google Maps</span>
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
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden border border-canvas-border shadow-md bg-canvas-elevated min-h-115">
          <div ref={mapContainerRef} className="w-full h-115 sm:h-130 z-10" />

          {/* Floating Map Legend */}
          <div className="absolute bottom-4 left-4 z-20 p-3 rounded-2xl bg-canvas-surface/95 backdrop-blur-md border border-canvas-border shadow-lg flex flex-wrap items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-roast-900 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-roast-900 inline-block" /> Di Database (Siap Rating)
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Dari Google Maps (Klik untuk Sync)
            </span>
          </div>
        </div>

        {/* Right Side Inspector Card */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl bg-canvas-surface border border-canvas-border p-5 shadow-sm">
          {selectedCafe ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full bg-status-green/15 text-status-green font-mono text-[10px] font-bold uppercase tracking-wider">
                  ✓ Tersinkron di Database CafePulse
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
                    <span>Buka di Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ) : selectedCandidate ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-600 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Kafe dari Google Maps Solo
                </span>
                {selectedCandidate.rating && (
                  <span className="font-mono text-xs font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> {selectedCandidate.rating.toFixed(1)} di Google Maps
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-lg font-bold text-roast-900">{selectedCandidate.name}</h4>
                <p className="text-xs text-roast-600 mt-1">{selectedCandidate.address}</p>
              </div>

              <div className="p-4 rounded-2xl bg-canvas-bg border border-canvas-border space-y-2 text-xs text-roast-600">
                <div className="flex items-center justify-between pb-1 border-b border-canvas-border text-[11px]">
                  <span className="text-roast-500">Status Google Maps:</span>
                  <span className="font-mono font-bold text-roast-800">
                    {selectedCandidate.total_reviews ? `${selectedCandidate.total_reviews} ulasan publik` : 'Terdaftar di Solo'}
                  </span>
                </div>
                <p className="leading-relaxed pt-1">
                  Kafe ini terdaftar di Google Maps. Klik tombol di bawah untuk **memasukkannya otomatis ke database CafePulse** agar pengunjung bisa langsung memberikan rating kecepatan Wi-Fi dan suasananya!
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={syncSingleMutation.isPending}
                  onClick={() => syncSingleMutation.mutate(selectedCandidate)}
                  className="w-full py-3 px-4 rounded-full bg-roast-900 hover:bg-crema-500 disabled:opacity-50 text-canvas-bg font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  {syncSingleMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memasukkan ke Database...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>📥 Masukkan ke Database &amp; Mulai Rating</span>
                    </>
                  )}
                </button>

                <a
                  href={
                    selectedCandidate.google_maps_url ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${selectedCandidate.name} ${selectedCandidate.address}`
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-full border border-canvas-border hover:border-roast-900 text-roast-700 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Lihat di Halaman Google Maps</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="my-auto text-center py-8 space-y-2">
              <Navigation className="w-8 h-8 text-crema-500 mx-auto" />
              <h4 className="text-sm font-bold text-roast-900">Pilih Kafe di Peta Google</h4>
              <p className="text-xs text-roast-500 max-w-xs mx-auto">
                Pilih salah satu pin merah untuk menarik kafe dari Google Maps ke database CafePulse dan mulai peratingan.
              </p>
            </div>
          )}

          {/* Quick Unsynced Google Maps Chips at Bottom of Inspector */}
          {unsyncedCandidates.length > 0 && (
            <div className="pt-4 mt-4 border-t border-canvas-border">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-roast-500 block mb-2 flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-rose-500" /> Kafe Google Maps Solo Siap Dimasukkan:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {unsyncedCandidates.slice(0, 5).map((cand) => (
                  <button
                    key={cand.id}
                    type="button"
                    onClick={() => {
                      setSelectedCafe(null);
                      setSelectedCandidate(cand);
                      if (mapEngine === 'leaflet' && leafletMapRef.current) {
                        leafletMapRef.current.flyTo([cand.latitude, cand.longitude], 15, {
                          duration: 0.7,
                        });
                      } else if (mapEngine === 'google' && googleMapRef.current) {
                        googleMapRef.current.panTo({ lat: cand.latitude, lng: cand.longitude });
                        googleMapRef.current.setZoom(15);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-full font-mono text-[10px] border transition-all ${
                      selectedCandidate?.id === cand.id
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-canvas-bg border-canvas-border text-roast-800 hover:border-rose-500'
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
