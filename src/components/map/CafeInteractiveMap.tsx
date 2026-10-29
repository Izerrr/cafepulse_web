/// <reference types="@types/google.maps" />

"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Cafe, MapsPlaceCandidate, PlaceCategory } from "@/types/cafe";
import { api, CURATED_SOLO_PLACES, inferPlaceCategory, isPlaceAlreadySynced } from "@/lib/api";
import { MapPin, Wifi, Star, Sparkles, RefreshCw, Search, ExternalLink, CheckCircle2, Navigation, Loader2, Globe2, Layers, Compass, ShieldCheck, Radar } from "lucide-react";

interface CafeInteractiveMapProps {
  cafes: Cafe[];
  allCafes: Cafe[];
  onSelectCafe: (cafe: Cafe) => void;
  onReviewCafe: (cafe: Cafe) => void;
  onAuditCandidate?: (candidate: MapsPlaceCandidate) => void;
  isCurator?: boolean;
  onRequestCuratorAccess?: (reason: string) => void;
}

const SOLO_CENTER = { lat: -7.562, lng: 110.818 };

const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  cafe: "☕ Kafe & Coffee",
  warkop: "🍵 Warkop & Wedangan",
  resto: "🍽️ Resto & Kuliner",
};

export default function CafeInteractiveMap({ cafes, allCafes, onSelectCafe, onReviewCafe, onAuditCandidate, isCurator = false, onRequestCuratorAccess }: CafeInteractiveMapProps) {
  const queryClient = useQueryClient();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // References for Google Maps Mode
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const googleMarkersRef = useRef<google.maps.Marker[]>([]);

  // References for Leaflet Google Maps Tiles Mode
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletLayerRef = useRef<L.LayerGroup | null>(null);
  const clickedMarkerRef = useRef<L.Marker | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() || "";
  const [mapEngine, setMapEngine] = useState<"google" | "leaflet">(apiKey ? "google" : "leaflet");

  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(cafes[0] ?? null);
  const [selectedCandidate, setSelectedCandidate] = useState<MapsPlaceCandidate | null>(null);
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [discoveredPlaces, setDiscoveredPlaces] = useState<MapsPlaceCandidate[]>(CURATED_SOLO_PLACES);
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | PlaceCategory>("ALL");
  const [showOnlyUnsynced, setShowOnlyUnsynced] = useState(false);
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const [isScanningArea, setIsScanningArea] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Auto-scan Solo area POIs on initial mount so real cafes/warkops/restos in Surakarta appear
  useEffect(() => {
    let active = true;
    api.scanSoloAreaPOIs().then((places) => {
      if (active && places.length > 0) {
        setDiscoveredPlaces(places);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Scan visible viewport bounds for Cafes, Warkops & Restos
  const handleScanVisibleArea = useCallback(async () => {
    setIsScanningArea(true);
    try {
      let boundsObj: { south: number; west: number; north: number; east: number } | undefined;
      if (mapEngine === "leaflet" && leafletMapRef.current) {
        const b = leafletMapRef.current.getBounds();
        boundsObj = {
          south: b.getSouth(),
          west: b.getWest(),
          north: b.getNorth(),
          east: b.getEast(),
        };
      } else if (mapEngine === "google" && googleMapRef.current) {
        const b = googleMapRef.current.getBounds();
        if (b) {
          boundsObj = {
            south: b.getSouthWest().lat(),
            west: b.getSouthWest().lng(),
            north: b.getNorthEast().lat(),
            east: b.getNorthEast().lng(),
          };
        }
      }
      const scanned = await api.scanSoloAreaPOIs(boundsObj);
      setDiscoveredPlaces(scanned);
      setSyncNotice(`Berhasil memindai area peta Solo: ditemukan ${scanned.length} titik Kafe, Warkop & Resto siap diaudit.`);
      setTimeout(() => setSyncNotice(null), 5000);
    } finally {
      setIsScanningArea(false);
    }
  }, [mapEngine]);

  // Filter out places that are already synced in allCafes (by name similarity or <25m Haversine) + Category filter
  const unsyncedCandidates = useMemo(() => {
    return discoveredPlaces.filter((cand) => {
      if (isPlaceAlreadySynced(cand, allCafes)) return false;
      const cat = cand.category || inferPlaceCategory(cand.name);
      if (categoryFilter !== "ALL" && cat !== categoryFilter) return false;
      return true;
    });
  }, [discoveredPlaces, allCafes, categoryFilter]);

  // Handle Search or Link Paste
  const handleSearchMaps = async (e?: React.FormEvent, customQuery?: string) => {
    e?.preventDefault();
    const query = (customQuery ?? mapSearchQuery).trim();
    if (!query) {
      setDiscoveredPlaces(CURATED_SOLO_PLACES);
      return;
    }

    setIsSearchingMap(true);

    // 1. Check if user pasted a Google Maps link (maps.app.goo.gl, goo.gl/maps, or google.com/maps)
    if (
      query.includes('maps.app.goo.gl') ||
      query.includes('google.com/maps') ||
      query.includes('goo.gl/maps')
    ) {
      try {
        const parsed = await api.parseGoogleMapsUrl(query);
        if (parsed) {
          setSelectedCandidate(parsed);
          setSelectedCafe(null);
          setDiscoveredPlaces([parsed]);
          if (mapEngine === 'leaflet' && leafletMapRef.current) {
            leafletMapRef.current.flyTo([parsed.latitude, parsed.longitude], 17, { duration: 0.8 });
          } else if (mapEngine === 'google' && googleMapRef.current) {
            googleMapRef.current.panTo({ lat: parsed.latitude, lng: parsed.longitude });
            googleMapRef.current.setZoom(17);
          }
          setSyncNotice(`Tautan Google Maps berhasil dikonversi ke titik "${parsed.name}"!`);
          setTimeout(() => setSyncNotice(null), 5000);
          return;
        }
      } catch (err) {
        console.warn('Gagal memproses tautan Google Maps:', err);
      } finally {
        setIsSearchingMap(false);
      }
    }

    // 2. Normal search
    try {
      if (mapEngine === 'google' && googleMapRef.current && window.google?.maps?.places) {
        const service = new google.maps.places.PlacesService(googleMapRef.current);
        service.textSearch(
          {
            query: `${query} Surakarta Solo`,
            location: new google.maps.LatLng(SOLO_CENTER.lat, SOLO_CENTER.lng),
            radius: 10000,
          },
          (
            results: google.maps.places.PlaceResult[] | null,
            status: google.maps.places.PlacesServiceStatusString
          ) => {
            if (status === 'OK' && results && results.length > 0) {
              const mapped: MapsPlaceCandidate[] = results.map((place: google.maps.places.PlaceResult) => {
                const placeName = place.name || 'Kafe Solo';
                return {
                  id: `gmap-live-${place.place_id || Date.now()}`,
                  name: placeName,
                  address: place.formatted_address || 'Surakarta, Jawa Tengah',
                  latitude: place.geometry?.location?.lat() || SOLO_CENTER.lat,
                  longitude: place.geometry?.location?.lng() || SOLO_CENTER.lng,
                  opening_hours: place.opening_hours?.weekday_text?.join(', '),
                  rating: place.rating,
                  total_reviews: place.user_ratings_total,
                  place_id: place.place_id,
                  google_maps_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
                  category: inferPlaceCategory(placeName, place.types?.join(' ')),
                  source: 'google_places_api',
                };
              });

              setDiscoveredPlaces(mapped);
              if (mapped[0]) {
                setSelectedCandidate(mapped[0]);
                setSelectedCafe(null);
                googleMapRef.current?.panTo({ lat: mapped[0].latitude, lng: mapped[0].longitude });
                googleMapRef.current?.setZoom(16);
              }
            } else {
              fallbackSearch(query);
            }
          }
        );
      } else {
        await fallbackSearch(query);
      }
    } catch {
      await fallbackSearch(query);
    } finally {
      setIsSearchingMap(false);
    }
  };

  const fallbackSearch = async (queryText?: string) => {
    const q = queryText || mapSearchQuery;
    const results = await api.searchSoloPlacesFromMaps(q);
    setDiscoveredPlaces(results);
    if (results.length > 0) {
      const top = results[0];
      setSelectedCandidate(top);
      setSelectedCafe(null);
      if (mapEngine === 'leaflet' && leafletMapRef.current) {
        leafletMapRef.current.flyTo([top.latitude, top.longitude], 16, { duration: 0.8 });
      } else if (mapEngine === 'google' && googleMapRef.current) {
        googleMapRef.current.panTo({ lat: top.latitude, lng: top.longitude });
        googleMapRef.current.setZoom(16);
      }
    }
  };

  // Mutation to sync a single candidate from Maps to our Backend API
  const syncSingleMutation = useMutation({
    mutationFn: async (candidate: MapsPlaceCandidate) => {
      const res = await api.createCafe({
        name: candidate.name,
        address: candidate.address,
        opening_hours: candidate.opening_hours || "08:00 - 23:00",
        crowd_density: "MODERATE",
        latitude: candidate.latitude,
        longitude: candidate.longitude,
        amenities: {
          wifi_speed_mbps: 65,
          wifi_stability: "GOOD",
          plug_score: "PLENTY",
          noise_level: "MODERATE",
          air_conditioned: true,
          has_outdoor: true,
          has_prayer_room: true,
        },
      });
      return res.data;
    },
    onSuccess: (createdCafe) => {
      queryClient.invalidateQueries({ queryKey: ["cafes"] });
      queryClient.invalidateQueries({ queryKey: ["system-status"] });
      setSelectedCandidate(null);
      setSelectedCafe(createdCafe);
      setSyncNotice(`"${createdCafe.name}" berhasil disinkronkan dari Google Maps ke database CafePulse!`);
      setTimeout(() => setSyncNotice(null), 7000);
      onReviewCafe(createdCafe);
    },
  });

  // Trigger Audit Modal (preferred workflow: inspect & verify WFC specs before saving)
  const handleTriggerAudit = useCallback(
    (candidate: MapsPlaceCandidate) => {
      if (onAuditCandidate) {
        onAuditCandidate(candidate);
      } else {
        syncSingleMutation.mutate(candidate);
      }
    },
    [onAuditCandidate, syncSingleMutation],
  );

  // Trigger Quick Sync (gated by Curator / Staff role)
  const handleTriggerQuickSync = useCallback(
    (candidate: MapsPlaceCandidate) => {
      if (!isCurator && onRequestCuratorAccess) {
        onRequestCuratorAccess(`Verifikasi PIN Staff Kafe atau Kurator diperlukan untuk melakukan Quick Sync "${candidate.name}" ke database.`);
        return;
      }
      syncSingleMutation.mutate(candidate);
    },
    [isCurator, onRequestCuratorAccess, syncSingleMutation],
  );

  // Mutation to batch-sync top unsynced Solo cafes into API
  const syncBatchMutation = useMutation({
    mutationFn: async () => {
      const batch = unsyncedCandidates.slice(0, 4);
      const created: Cafe[] = [];
      for (const cand of batch) {
        const res = await api.createCafe({
          name: cand.name,
          address: cand.address,
          opening_hours: cand.opening_hours || "08:00 - 23:00",
          crowd_density: "MODERATE",
          latitude: cand.latitude,
          longitude: cand.longitude,
          amenities: {
            wifi_speed_mbps: 65,
            wifi_stability: "GOOD",
            plug_score: "PLENTY",
            noise_level: "MODERATE",
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
      queryClient.invalidateQueries({ queryKey: ["cafes"] });
      queryClient.invalidateQueries({ queryKey: ["system-status"] });
      if (createdList.length > 0) {
        setSelectedCandidate(null);
        setSelectedCafe(createdList[0]);
        setSyncNotice(`${createdList.length} kafe Google Maps Surakarta berhasil disinkronkan sekaligus ke database CafePulse!`);
        setTimeout(() => setSyncNotice(null), 6000);
      }
    },
  });

  // Helper to init Leaflet mode with Google Maps Roadmap Tiles
  const initLeafletMap = useCallback(() => {
    if (!mapContainerRef.current || leafletMapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [SOLO_CENTER.lat, SOLO_CENTER.lng],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // 100% Genuine Google Maps Roadmap Tiles
    L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      attribution: "&copy; Google Maps Data &bull; Surakarta &bull; CafePulse Solo",
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    leafletMapRef.current = map;
    leafletLayerRef.current = layerGroup;

    // Direct click anywhere on the Google Maps canvas to drop a pointer and detect a cafe/warkop/resto!
    map.on("click", async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const geo = await api.reverseGeocode(lat, lng);

      const candidate: MapsPlaceCandidate = {
        id: `gmap-clicked-${Date.now()}`,
        name: geo.name,
        address: geo.address,
        latitude: lat,
        longitude: lng,
        opening_hours: geo.opening_hours,
        google_maps_url: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        category: geo.category,
        source: 'google_maps_link',
      };

      setSelectedCafe(null);
      setSelectedCandidate(candidate);

      if (clickedMarkerRef.current) {
        map.removeLayer(clickedMarkerRef.current);
      }

      const dropIcon = L.divIcon({
        className: "cafepulse-drop-pin",
        html: `
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 12px;
            border-radius: 999px;
            background: #FFFDF9;
            color: #C5221F;
            border: 2px solid #EA4335;
            box-shadow: 0 10px 24px rgba(234,67,53,0.35);
            font-family: monospace;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            transform: translate(-50%, -50%);
          ">
            <span>📍 ${candidate.name}</span>
            <span style="background: rgba(234,67,53,0.16); color: #C5221F; padding: 1px 6px; border-radius: 99px; font-size: 9px;">+Sync</span>
          </div>
        `,
        iconSize: [160, 32],
        iconAnchor: [80, 16],
      });

      const dropMarker = L.marker([lat, lng], { icon: dropIcon }).addTo(map);
      clickedMarkerRef.current = dropMarker;

      const catLabel = CATEGORY_LABELS[candidate.category || "cafe"];
      const popupHtml = `
        <div id="popup-drop-${candidate.id}" style="font-family: inherit; min-width: 240px; max-width: 280px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #EA4335; background: rgba(234,67,53,0.12); padding: 2px 8px; border-radius: 99px;">
              ${catLabel}
            </span>
            <span style="font-size: 10px; font-family: monospace; color: #7E6A5E;">
              ${lat.toFixed(4)}, ${lng.toFixed(4)}
            </span>
          </div>
          <h4 style="font-size: 14px; font-weight: 800; color: #1E1714; margin: 0 0 4px 0; line-height: 1.25;">
            ${candidate.name}
          </h4>
          <p style="font-size: 11px; color: #68554B; margin: 0 0 8px 0; line-height: 1.35;">
            ${candidate.address}
          </p>
          <div style="background: rgba(234,67,53,0.06); border: 1px solid rgba(234,67,53,0.2); padding: 6px 8px; border-radius: 10px; margin-bottom: 8px; font-size: 11px; color: #52423A; line-height: 1.3;">
            Titik terdeteksi dari peta Solo. Audit spesifikasi WFC terlebih dahulu sebelum menyimpan ke database:
          </div>
          <button class="btn-audit-drop" style="width: 100%; background: #C86237; color: #FFFDF9; border: none; padding: 8px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 5px;">
            🛡️ Audit &amp; Tambah ke Database
          </button>
          <button class="btn-sync-drop" style="width: 100%; background: #1E1714; color: #FFFDF9; border: none; padding: 6px 12px; border-radius: 99px; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            ⚡ Quick Sync (Default)
          </button>
        </div>
      `;

      dropMarker
        .bindPopup(popupHtml, {
          maxWidth: 300,
          className: "cafepulse-custom-popup",
          offset: [0, -10],
        })
        .openPopup();

      dropMarker.on("popupopen", () => {
        setTimeout(() => {
          const container = document.getElementById(`popup-drop-${candidate.id}`);
          if (container) {
            const auditBtn = container.querySelector(".btn-audit-drop");
            auditBtn?.addEventListener("click", (ev) => {
              ev.stopPropagation();
              handleTriggerAudit(candidate);
            });
            const syncBtn = container.querySelector(".btn-sync-drop");
            syncBtn?.addEventListener("click", (ev) => {
              ev.stopPropagation();
              handleTriggerQuickSync(candidate);
            });
          }
        }, 50);
      });
    });
  }, [handleTriggerAudit, handleTriggerQuickSync]);

  // Initialize Map: Try Google Maps JS API if API key provided, otherwise Google Maps Tiles mode
  useEffect(() => {
    let isCancelled = false;

    if (apiKey) {
      setOptions({
        key: apiKey,
        v: "weekly",
      });

      Promise.all([importLibrary("maps"), importLibrary("places")])
        .then(() => {
          if (isCancelled || !mapContainerRef.current || googleMapRef.current) return;
          const map = new google.maps.Map(mapContainerRef.current, {
            center: SOLO_CENTER,
            zoom: 14,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });
          googleMapRef.current = map;
          setMapEngine("google");

          // Intercept native Google Maps POI clicks (Cafes, Warkops, Restos)
          map.addListener("click", async (event: google.maps.MapMouseEvent & { placeId?: string }) => {
            if (!event.latLng) return;
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            if (event.placeId && window.google?.maps?.places) {
              event.stop?.();
              const service = new google.maps.places.PlacesService(map);
              service.getDetails(
                {
                  placeId: event.placeId,
                  fields: ["name", "formatted_address", "rating", "user_ratings_total", "types"],
                },
                (
                  place: google.maps.places.PlaceResult | null,
                  status: google.maps.places.PlacesServiceStatusString
                ) => {
                  if (status === 'OK' && place) {
                    const pName = place.name || "Kafe Solo";
                    const cand: MapsPlaceCandidate = {
                      id: `gmap-poi-${event.placeId}`,
                      name: pName,
                      address: place.formatted_address || "Surakarta, Jawa Tengah",
                      latitude: lat,
                      longitude: lng,
                      opening_hours: place.opening_hours?.weekday_text?.join(', '),
                      rating: place.rating,
                      total_reviews: place.user_ratings_total,
                      place_id: event.placeId,
                      google_maps_url: `https://www.google.com/maps/place/?q=place_id:${event.placeId}`,
                      category: inferPlaceCategory(pName, place.types?.join(' ')),
                      source: 'google_places_api',
                    };
                    setSelectedCafe(null);
                    setSelectedCandidate(cand);
                  }
                },
              );
            } else {
              const geo = await api.reverseGeocode(lat, lng);
              setSelectedCafe(null);
              setSelectedCandidate({
                id: `gmap-click-${Date.now()}`,
                name: geo.name,
                address: geo.address,
                latitude: lat,
                longitude: lng,
                opening_hours: geo.opening_hours,
                category: geo.category,
                source: 'google_maps_link',
              });
            }
          });
        })
        .catch((err: unknown) => {
          console.warn("Google Maps API failed, falling back to Google Maps tiles mode:", err);
          setMapEngine("leaflet");
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

  // Update Markers with Interactive Popups directly on the pointers
  useEffect(() => {
    if (mapEngine !== "leaflet") return;
    const map = leafletMapRef.current;
    const layerGroup = leafletLayerRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Synced Database Cafes (Deep Roast / Amber Crema Pins with Interactive Popups)
    if (!showOnlyUnsynced) {
      cafes.forEach((cafe, index) => {
        const lat = cafe.latitude ?? -7.565;
        const lng = cafe.longitude ?? 110.825;
        const isSelected = selectedCafe?.id === cafe.id;
        const wifiSpeed = cafe.amenities?.wifi_speed_mbps || 50;

        const badgeColor = cafe.crowd_density === "LOW" ? "#2A7B52" : cafe.crowd_density === "MODERATE" ? "#D07D2B" : "#C43B3B";

        const crowdText = cafe.crowd_density === "LOW" ? "Sepi" : cafe.crowd_density === "MODERATE" ? "Sedang" : "Ramai";

        const gmapsDirUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

        const icon = L.divIcon({
          className: "cafepulse-db-pin",
          html: `
            <div style="
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 5px 10px;
              border-radius: 999px;
              background: ${isSelected ? "#C86237" : "#1E1714"};
              color: #FFFDF9;
              border: 2px solid #FFFDF9;
              box-shadow: 0 8px 20px rgba(30,23,20,0.35);
              font-family: monospace;
              font-size: 11px;
              font-weight: 700;
              white-space: nowrap;
              transform: translate(-50%, -50%) scale(${isSelected ? "1.12" : "1"});
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

        // Direct interactive popup attached to pointer
        const popupHtml = `
          <div id="popup-cafe-${cafe.id}" style="font-family: inherit; min-width: 230px; max-width: 270px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2A7B52; background: rgba(42,123,82,0.12); padding: 2px 8px; border-radius: 99px;">
                ✓ Di Database
              </span>
              <span style="font-size: 11px; font-weight: 700; color: #D97706;">
                ★ ${(cafe.rating || 5.0).toFixed(1)}
              </span>
            </div>
            <h4 style="font-size: 14px; font-weight: 800; color: #1E1714; margin: 0 0 4px 0; line-height: 1.25;">
              ${cafe.name}
            </h4>
            <p style="font-size: 11px; color: #68554B; margin: 0 0 8px 0; line-height: 1.35;">
              ${cafe.address}
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px; font-size: 10px; font-family: monospace;">
              <div style="background: #FBF9F5; border: 1px solid rgba(45,30,20,0.08); padding: 4px 6px; border-radius: 8px; text-align: center;">
                <span style="color: #7E6A5E; display: block; font-size: 9px;">WI-FI</span>
                <b style="color: #0284C7; font-size: 11px;">${wifiSpeed} Mbps</b>
              </div>
              <div style="background: #FBF9F5; border: 1px solid rgba(45,30,20,0.08); padding: 4px 6px; border-radius: 8px; text-align: center;">
                <span style="color: #7E6A5E; display: block; font-size: 9px;">SUASANA</span>
                <b style="color: ${badgeColor}; font-size: 11px;">${crowdText}</b>
              </div>
            </div>
            <div style="display: flex; gap: 6px; margin-bottom: 6px;">
              <button class="btn-review-cafe" style="flex: 1.2; background: #C86237; color: #FFFDF9; border: none; padding: 7px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; cursor: pointer; transition: background 0.2s;">
                ⭐ Ulas &amp; Tes Wi-Fi
              </button>
              <button class="btn-detail-cafe" style="flex: 1; background: #1E1714; color: #FFFDF9; border: none; padding: 7px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; cursor: pointer;">
                Detail
              </button>
            </div>
            <a href="${gmapsDirUrl}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 4px; padding: 5px; border-radius: 99px; border: 1px solid rgba(45,30,20,0.12); color: #251D18; font-size: 10px; font-weight: 700; text-decoration: none; background: #F5EFEB;">
              <span>🗺️ Rute Google Maps</span>
            </a>
          </div>
        `;

        marker.bindPopup(popupHtml, {
          maxWidth: 290,
          className: "cafepulse-custom-popup",
          offset: [0, -10],
        });

        marker.on("popupopen", () => {
          setSelectedCandidate(null);
          setSelectedCafe(cafe);
          setTimeout(() => {
            const container = document.getElementById(`popup-cafe-${cafe.id}`);
            if (container) {
              const reviewBtn = container.querySelector(".btn-review-cafe");
              reviewBtn?.addEventListener("click", (e) => {
                e.stopPropagation();
                onReviewCafe(cafe);
              });
              const detailBtn = container.querySelector(".btn-detail-cafe");
              detailBtn?.addEventListener("click", (e) => {
                e.stopPropagation();
                onSelectCafe(cafe);
              });
            }
          }, 50);
        });

        marker.on("click", () => {
          setSelectedCandidate(null);
          setSelectedCafe(cafe);
          map.flyTo([lat, lng], 16, { duration: 0.6 });
        });

        marker.addTo(layerGroup);

        // Auto-open first cafe popup on map load so the pointer card is immediately visible!
        if (index === 0 && !selectedCandidate) {
          setTimeout(() => {
            marker.openPopup();
          }, 300);
        }
      });
    }

    // 2. Unsynced Google Maps / Overpass POI Candidates (Red Pill Pins with Audit & Sync Popups)
    unsyncedCandidates.forEach((cand) => {
      const isSelected = selectedCandidate?.id === cand.id;
      const cat = cand.category || inferPlaceCategory(cand.name);
      const catLabel = CATEGORY_LABELS[cat];
      const gmapsPlaceUrl = cand.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cand.name} ${cand.address}`)}`;

      const icon = L.divIcon({
        className: "cafepulse-gmap-pin",
        html: `
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 10px;
            border-radius: 999px;
            background: ${isSelected ? "#EA4335" : "#FFFDF9"};
            color: ${isSelected ? "#FFFDF9" : "#C5221F"};
            border: 1.5px solid #EA4335;
            box-shadow: 0 6px 16px rgba(234,67,53,0.28);
            font-family: monospace;
            font-size: 10px;
            font-weight: 700;
            white-space: nowrap;
            transform: translate(-50%, -50%) scale(${isSelected ? "1.1" : "1"});
          ">
            <span>📍 ${cand.name}</span>
            <span style="background: ${isSelected ? "rgba(255,255,255,0.22)" : "rgba(234,67,53,0.14)"}; padding: 1px 6px; border-radius: 99px; font-size: 9px;">+Sync</span>
          </div>
        `,
        iconSize: [150, 28],
        iconAnchor: [75, 14],
      });

      const marker = L.marker([cand.latitude, cand.longitude], { icon });

      // Direct interactive popup on the pointer
      const candPopupHtml = `
        <div id="popup-cand-${cand.id}" style="font-family: inherit; min-width: 240px; max-width: 280px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #EA4335; background: rgba(234,67,53,0.12); padding: 2px 8px; border-radius: 99px;">
              ${catLabel}
            </span>
            ${cand.rating ? `<span style="font-size: 11px; font-weight: 700; color: #D97706;">★ ${cand.rating.toFixed(1)}</span>` : ""}
          </div>
          <h4 style="font-size: 14px; font-weight: 800; color: #1E1714; margin: 0 0 4px 0; line-height: 1.25;">
            ${cand.name}
          </h4>
          <p style="font-size: 11px; color: #68554B; margin: 0 0 8px 0; line-height: 1.35;">
            ${cand.address}
          </p>
          <div style="background: rgba(234,67,53,0.06); border: 1px solid rgba(234,67,53,0.2); padding: 6px 8px; border-radius: 10px; margin-bottom: 8px; font-size: 11px; color: #52423A; line-height: 1.3;">
            Terdeteksi di peta Solo. Audit spesifikasi WFC (Wi-Fi, colokan, AC, mushola) atau sinkronkan langsung ke database:
          </div>
          <button class="btn-audit-cand" style="width: 100%; background: #C86237; color: #FFFDF9; border: none; padding: 7px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 5px;">
            🛡️ Audit &amp; Tambah ke Database
          </button>
          <button class="btn-sync-cand" style="width: 100%; background: #1E1714; color: #FFFDF9; border: none; padding: 6px 12px; border-radius: 99px; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 6px;">
            ⚡ Quick Sync (Default)
          </button>
          <a href="${gmapsPlaceUrl}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 4px; padding: 5px; border-radius: 99px; border: 1px solid rgba(45,30,20,0.12); color: #251D18; font-size: 10px; font-weight: 700; text-decoration: none; background: #F5EFEB;">
            <span>🗺️ Buka di Google Maps</span>
          </a>
        </div>
      `;

      marker.bindPopup(candPopupHtml, {
        maxWidth: 295,
        className: "cafepulse-custom-popup",
        offset: [0, -10],
      });

      marker.on("popupopen", () => {
        setSelectedCafe(null);
        setSelectedCandidate(cand);
        setTimeout(() => {
          const container = document.getElementById(`popup-cand-${cand.id}`);
          if (container) {
            const auditBtn = container.querySelector(".btn-audit-cand");
            auditBtn?.addEventListener("click", (e) => {
              e.stopPropagation();
              handleTriggerAudit(cand);
            });
            const syncBtn = container.querySelector(".btn-sync-cand");
            syncBtn?.addEventListener("click", (e) => {
              e.stopPropagation();
              handleTriggerQuickSync(cand);
            });
          }
        }, 50);
      });

      marker.on("click", () => {
        setSelectedCafe(null);
        setSelectedCandidate(cand);
        map.flyTo([cand.latitude, cand.longitude], 16, { duration: 0.6 });
      });

      marker.addTo(layerGroup);
    });
  }, [mapEngine, cafes, unsyncedCandidates, selectedCafe, selectedCandidate, showOnlyUnsynced, onReviewCafe, onSelectCafe, handleTriggerAudit, handleTriggerQuickSync]);

  // Update Markers for Native Google Maps Engine (if API Key provided)
  useEffect(() => {
    if (mapEngine !== "google" || !googleMapRef.current) return;
    const map = googleMapRef.current;

    googleMarkersRef.current.forEach((m) => m.setMap(null));
    googleMarkersRef.current = [];

    if (!showOnlyUnsynced) {
      cafes.forEach((cafe) => {
        const lat = cafe.latitude ?? -7.565;
        const lng = cafe.longitude ?? 110.825;
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          title: cafe.name,
        });

        marker.addListener("click", () => {
          setSelectedCandidate(null);
          setSelectedCafe(cafe);
          map.panTo({ lat, lng });
        });
        googleMarkersRef.current.push(marker);
      });
    }

    unsyncedCandidates.forEach((cand) => {
      const marker = new google.maps.Marker({
        position: { lat: cand.latitude, lng: cand.longitude },
        map,
        title: `[Google Maps] ${cand.name}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#EA4335",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
      });

      marker.addListener("click", () => {
        setSelectedCafe(null);
        setSelectedCandidate(cand);
        map.panTo({ lat: cand.latitude, lng: cand.longitude });
      });
      googleMarkersRef.current.push(marker);
    });
  }, [mapEngine, cafes, unsyncedCandidates, showOnlyUnsynced]);

  return (
    <div className="space-y-4">
      {/* Top Map Control & Auto-Sync Bar */}
      <div className="p-4 rounded-3xl bg-canvas-surface border border-canvas-border shadow-sm space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-crema-500/15 border border-crema-500/30 flex items-center justify-center text-crema-600 shrink-0">
              <Globe2 className="w-5 h-5 text-crema-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-roast-900">Peta Google Maps Surakarta &bull; Auto-Detect &amp; Audit Database</h3>
                <span className="px-2 py-0.5 rounded-full bg-status-green/15 text-status-green font-mono text-[10px] font-bold">{cafes.length} di Database</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 font-mono text-[10px] font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {unsyncedCandidates.length} Titik Siap Audit
                </span>
              </div>
              <p className="text-xs text-roast-600 mt-0.5">
                Klik pointer merah **`+Sync`** atau <strong>klik ikon kafe/warkop/resto mana pun di peta</strong> untuk mengaudit fasilitasnya ke database CafePulse!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search or Paste Google Maps URL */}
            <form onSubmit={(e) => handleSearchMaps(e)} className="relative flex-1 sm:w-80">
              <Search className="w-3.5 h-3.5 text-roast-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={mapSearchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setMapSearchQuery(val);
                  if (
                    val.includes('maps.app.goo.gl') ||
                    val.includes('google.com/maps') ||
                    val.includes('goo.gl/maps')
                  ) {
                    handleSearchMaps(undefined, val);
                  }
                }}
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData('text');
                  if (
                    pasted.includes('maps.app.goo.gl') ||
                    pasted.includes('google.com/maps') ||
                    pasted.includes('goo.gl/maps')
                  ) {
                    setMapSearchQuery(pasted);
                    handleSearchMaps(undefined, pasted);
                  }
                }}
                placeholder="Tempel tautan Google Maps (maps.app.goo.gl) atau cari..."
                className="w-full pl-9 pr-24 py-2 rounded-full bg-canvas-bg border border-canvas-border text-xs text-roast-900 placeholder-roast-400 focus:outline-none focus:border-crema-500"
              />
              <button
                type="submit"
                disabled={isSearchingMap}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-roast-900 text-canvas-bg font-mono text-[10px] font-bold hover:bg-crema-500 transition-colors flex items-center gap-1"
              >
                {isSearchingMap ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Urai...</span>
                  </>
                ) : mapSearchQuery.includes('http') || mapSearchQuery.includes('maps') ? (
                  <>
                    <Sparkles className="w-3 h-3 text-crema-400" />
                    <span>Konversi</span>
                  </>
                ) : (
                  'Cari'
                )}
              </button>
            </form>

            {/* Scan Visible Area POI Button */}
            <button
              type="button"
              onClick={handleScanVisibleArea}
              disabled={isScanningArea}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-roast-900 hover:bg-crema-600 disabled:opacity-50 text-canvas-bg font-mono text-[11px] font-bold transition-all shadow-xs shrink-0"
              title="Pindai semua Kafe, Warkop & Resto di area peta yang sedang tampil"
            >
              {isScanningArea ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Radar className="w-3.5 h-3.5 text-crema-300" />}
              <span>Scan Area Peta Ini</span>
            </button>

            {/* Batch Sync Button */}
            {unsyncedCandidates.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (!isCurator && onRequestCuratorAccess) {
                    onRequestCuratorAccess("Verifikasi PIN Kurator diperlukan untuk melakukan sinkronisasi massal (Batch Sync) kafe Google Maps.");
                    return;
                  }
                  syncBatchMutation.mutate();
                }}
                disabled={syncBatchMutation.isPending}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-crema-500 hover:bg-crema-600 disabled:opacity-50 text-canvas-surface font-mono text-[11px] font-bold transition-all shadow-xs shrink-0"
                title="Masukkan 4 titik populer sekaligus ke database CafePulse"
              >
                {syncBatchMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Batch Sync ({Math.min(4, unsyncedCandidates.length)})</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter & Layer Bar (Kafe, Warkop, Resto) */}
        <div className="pt-2.5 border-t border-canvas-border flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-roast-500 mr-1">Filter Kategori Maps:</span>
            {(
              [
                { id: "ALL", label: "Semua Titik" },
                { id: "cafe", label: "☕ Kafe & Coffee Shop" },
                { id: "warkop", label: "🍵 Warkop & Wedangan" },
                { id: "resto", label: "🍽️ Resto & Kuliner" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategoryFilter(item.id)}
                className={`px-3 py-1 rounded-full font-mono text-[11px] font-semibold border transition-all ${
                  categoryFilter === item.id ? "bg-roast-900 text-canvas-bg border-roast-900 shadow-2xs" : "bg-canvas-bg text-roast-700 border-canvas-border hover:border-roast-400"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowOnlyUnsynced((prev) => !prev)}
            className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold border transition-all flex items-center gap-1.5 ${
              showOnlyUnsynced ? "bg-rose-500 text-white border-rose-500" : "bg-canvas-bg text-roast-600 border-canvas-border hover:border-rose-400"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>{showOnlyUnsynced ? "Menampilkan: Hanya Belum Sync" : "Tampilkan Hanya Belum Sync"}</span>
          </button>
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
            <button type="button" onClick={() => onReviewCafe(selectedCafe)} className="px-3 py-1 rounded-full bg-status-green text-white font-mono text-[10px] font-bold uppercase tracking-wider shrink-0">
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

          {/* Floating Map Legend & Interactive Tip */}
          <div className="absolute bottom-4 left-4 z-20 p-3 rounded-2xl bg-canvas-surface/95 backdrop-blur-md border border-canvas-border shadow-lg flex flex-wrap items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-roast-900 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-roast-900 inline-block" /> Di Database
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Kandidat Maps (+Sync)
            </span>
            <span className="text-roast-500 text-[10px] hidden sm:inline border-l border-canvas-border pl-2">💡 Klik ikon kafe/warkop di peta untuk mengaudit ke database</span>
          </div>
        </div>

        {/* Right Side Inspector Card */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl bg-canvas-surface border border-canvas-border p-5 shadow-sm">
          {selectedCafe ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full bg-status-green/15 text-status-green font-mono text-[10px] font-bold uppercase tracking-wider">✓ Tersinkron di Database CafePulse</span>
                <span className="font-mono text-xs font-bold text-crema-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-crema-500" /> {(selectedCafe.rating || 5.0).toFixed(1)}
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
                  <span className="font-mono text-[10px] text-roast-500 uppercase block">Kecepatan Wi-Fi</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Wifi className="w-4 h-4 text-crema-500" />
                    <span className="font-mono text-sm font-bold text-roast-900">{selectedCafe.amenities?.wifi_speed_mbps || 50} Mbps</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-canvas-bg border border-canvas-border">
                  <span className="font-mono text-[10px] text-roast-500 uppercase block">Suasana Saat Ini</span>
                  <span className="font-mono text-xs font-bold text-roast-900 mt-1 block">
                    {selectedCafe.crowd_density === "LOW" ? "Leluasa / Sepi" : selectedCafe.crowd_density === "MODERATE" ? "Kondusif / Sedang" : "Ramai Pengunjung"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-canvas-bg border border-canvas-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-roast-500">Jam Buka</span>
                  <span className="font-mono font-bold text-roast-900">{selectedCafe.opening_hours || "08:00 - 23:00"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-roast-500">Ketersediaan Colokan</span>
                  <span className="font-mono font-bold text-roast-900">{selectedCafe.amenities?.plug_score === "PLENTY" ? "Banyak (Tiap Meja)" : selectedCafe.amenities?.plug_score === "MODERATE" ? "Sedang" : "Terbatas"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-roast-500">Koordinat Google Maps</span>
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
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCafe.latitude},${selectedCafe.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-full border border-canvas-border hover:border-roast-900 text-roast-800 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 bg-canvas-bg"
                  >
                    <Compass className="w-3.5 h-3.5 text-crema-500" />
                    <span>Rute Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ) : selectedCandidate ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-600 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {CATEGORY_LABELS[selectedCandidate.category || inferPlaceCategory(selectedCandidate.name)]}
                </span>
                {selectedCandidate.rating ? (
                  <span className="font-mono text-xs font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> {selectedCandidate.rating.toFixed(1)} di Maps
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-roast-500 bg-canvas-bg px-2 py-0.5 rounded-full border border-canvas-border">
                    Belum Diaudit
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-lg font-bold text-roast-900">{selectedCandidate.name}</h4>
                <p className="text-xs text-roast-600 mt-1">{selectedCandidate.address}</p>
              </div>

              <div className="p-4 rounded-2xl bg-canvas-bg border border-canvas-border space-y-2 text-xs text-roast-600">
                <div className="flex items-center justify-between pb-1 border-b border-canvas-border text-[11px]">
                  <span className="text-roast-500">Koordinat Terdeteksi:</span>
                  <span className="font-mono font-bold text-roast-800">
                    {selectedCandidate.latitude.toFixed(4)}, {selectedCandidate.longitude.toFixed(4)}
                  </span>
                </div>
                <p className="leading-relaxed pt-1">
                  Tempat ini belum ada di database CafePulse. Klik <strong>Audit &amp; Tambah ke Database</strong> untuk melengkapi spesifikasi Wi-Fi, colokan, AC, dan mushola!
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleTriggerAudit(selectedCandidate)}
                  className="w-full py-3 px-4 rounded-full bg-crema-500 hover:bg-crema-600 text-canvas-surface font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Audit &amp; Tambah ke Database</span>
                </button>

                <button
                  type="button"
                  disabled={syncSingleMutation.isPending}
                  onClick={() => handleTriggerQuickSync(selectedCandidate)}
                  className="w-full py-2.5 px-4 rounded-full bg-roast-900 hover:bg-roast-800 disabled:opacity-50 text-canvas-bg font-mono text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  {syncSingleMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyinkronkan...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Quick Sync (Spesifikasi Default)</span>
                    </>
                  )}
                </button>

                <a
                  href={selectedCandidate.google_maps_url || `https://www.google.com/maps/dir/?api=1&destination=${selectedCandidate.latitude},${selectedCandidate.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-full border border-canvas-border hover:border-roast-900 text-roast-700 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Halaman Google Maps</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="my-auto text-center py-8 space-y-2">
              <Navigation className="w-8 h-8 text-crema-500 mx-auto" />
              <h4 className="text-sm font-bold text-roast-900">Pilih Kafe di Peta Google</h4>
              <p className="text-xs text-roast-500 max-w-xs mx-auto">Klik pointer kafe mana saja untuk melihat info &amp; rute, atau klik titik mana pun di peta untuk mengaudit kafe baru.</p>
            </div>
          )}

          {/* Quick Unsynced Google Maps Chips at Bottom of Inspector */}
          {unsyncedCandidates.length > 0 && (
            <div className="pt-4 mt-4 border-t border-canvas-border">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-roast-500 flex items-center gap-1.5 mb-2">
                <Layers className="w-3 h-3 text-rose-500" /> Titik Solo Siap Diaudit ({unsyncedCandidates.length}):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {unsyncedCandidates.slice(0, 8).map((cand) => (
                  <button
                    key={cand.id}
                    type="button"
                    onClick={() => {
                      setSelectedCafe(null);
                      setSelectedCandidate(cand);
                      if (mapEngine === "leaflet" && leafletMapRef.current) {
                        leafletMapRef.current.flyTo([cand.latitude, cand.longitude], 16, {
                          duration: 0.7,
                        });
                      } else if (mapEngine === "google" && googleMapRef.current) {
                        googleMapRef.current.panTo({ lat: cand.latitude, lng: cand.longitude });
                        googleMapRef.current.setZoom(16);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-full font-mono text-[10px] border transition-all ${
                      selectedCandidate?.id === cand.id ? "bg-rose-500 text-white border-rose-500" : "bg-canvas-bg border-canvas-border text-roast-800 hover:border-rose-500"
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
