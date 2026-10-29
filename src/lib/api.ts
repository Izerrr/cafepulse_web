import {
  Cafe,
  CafeDetailResponse,
  CafeListResponse,
  CafeReview,
  CreateCafeInput,
  CreateReviewInput,
  MapsPlaceCandidate,
  PlaceCategory,
  SystemStatus,
  UpdateCafeInput,
} from '@/types/cafe';

const PRIMARY_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.cafepulse.izerworks.my.id';
const FALLBACK_API_URL = 'https://cafepulse-api.vercel.app';

const LOCAL_REVIEWS_KEY = 'cafepulse_community_reviews_v1';

export function inferPlaceCategory(
  name: string,
  amenity?: string,
  cuisine?: string
): PlaceCategory {
  const lower = `${name} ${amenity || ''} ${cuisine || ''}`.toLowerCase();
  if (
    lower.includes('warkop') ||
    lower.includes('warmindo') ||
    lower.includes('wedangan') ||
    lower.includes('angkringan') ||
    lower.includes('kedai kopi')
  ) {
    return 'warkop';
  }
  if (
    lower.includes('kopi') ||
    lower.includes('coffee') ||
    lower.includes('cafe') ||
    lower.includes('kafe') ||
    lower.includes('roastery') ||
    lower.includes('espresso') ||
    amenity === 'cafe'
  ) {
    return 'cafe';
  }
  return 'resto';
}

export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function isPlaceAlreadySynced(
  candidate: MapsPlaceCandidate,
  existingCafes: Cafe[]
): boolean {
  const candNorm = candidate.name.toLowerCase().trim();
  for (const cafe of existingCafes) {
    const existingNorm = cafe.name.toLowerCase().trim();
    if (existingNorm.includes(candNorm) || candNorm.includes(existingNorm)) {
      return true;
    }
    if (cafe.latitude && cafe.longitude) {
      const dist = calculateDistanceMeters(
        candidate.latitude,
        candidate.longitude,
        cafe.latitude,
        cafe.longitude
      );
      if (dist < 25) return true;
    }
  }
  return false;
}

export const CURATED_SOLO_PLACES: MapsPlaceCandidate[] = [
  {
    id: 'gmap-tanaku',
    name: 'Tanaku Kopi Manahan',
    address: 'Jl. Menteri Supeno No. 17, Manahan, Banjarsari, Surakarta',
    latitude: -7.5542,
    longitude: 110.8055,
    opening_hours: '08:00 - 23:00',
    rating: 4.7,
    total_reviews: 420,
    google_maps_url: 'https://maps.google.com/?q=Tanaku+Kopi+Manahan+Surakarta',
    place_id: 'ChIJb6x0tanaku',
    category: 'cafe',
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-coldnbrew-sr',
    name: "Cold 'N Brew Slamet Riyadi",
    address: 'Jl. Brigjen Slamet Riyadi No. 300, Sriwedari, Laweyan, Surakarta',
    latitude: -7.5678,
    longitude: 110.8112,
    opening_hours: '07:00 - 23:59',
    rating: 4.8,
    total_reviews: 1250,
    google_maps_url: 'https://maps.google.com/?q=Cold+N+Brew+Slamet+Riyadi+Surakarta',
    place_id: 'ChIJz8f9coldnbrew',
    category: 'cafe',
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-natahati',
    name: 'Natahati Coffee & Eatery',
    address: 'Jl. Punggawan No. 6, Punggawan, Banjarsari, Surakarta',
    latitude: -7.5588,
    longitude: 110.8174,
    opening_hours: '08:00 - 22:30',
    rating: 4.6,
    total_reviews: 940,
    google_maps_url: 'https://maps.google.com/?q=Natahati+Coffee+Surakarta',
    place_id: 'ChIJ9x_natahati',
    category: 'cafe',
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-kopinako',
    name: 'Kopi Nako Solo',
    address: 'Jl. M.T. Haryono No. 10, Manahan, Banjarsari, Surakarta',
    latitude: -7.5521,
    longitude: 110.8091,
    opening_hours: '08:00 - 23:00',
    rating: 4.7,
    total_reviews: 810,
    google_maps_url: 'https://maps.google.com/?q=Kopi+Nako+Manahan+Surakarta',
    place_id: 'ChIJ_kopinako',
    category: 'cafe',
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-kolektif',
    name: 'Kolektif Coffee & Space',
    address: 'Jl. Teuku Umar No. 48, Keprabon, Banjarsari, Surakarta',
    latitude: -7.5691,
    longitude: 110.8224,
    opening_hours: '09:00 - 22:00',
    rating: 4.7,
    total_reviews: 350,
    google_maps_url: 'https://maps.google.com/?q=Kolektif+Coffee+Keprabon+Surakarta',
    place_id: 'ChIJ_kolektif',
    category: 'cafe',
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-loske',
    name: 'Loske Coffee Service',
    address: 'Jl. Teuku Umar No. 50, Keprabon, Banjarsari, Surakarta',
    latitude: -7.56948,
    longitude: 110.82292,
    opening_hours: '07:00 - 22:00',
    rating: 4.8,
    total_reviews: 620,
    google_maps_url: 'https://maps.google.com/?q=Loske+Coffee+Service+Surakarta',
    place_id: 'ChIJ_loske',
    category: 'cafe',
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-sototriwindu',
    name: 'Soto Triwindu Keprabon',
    address: 'Jl. Teuku Umar No. 43, Keprabon, Banjarsari, Surakarta',
    latitude: -7.56962,
    longitude: 110.82235,
    opening_hours: '05:30 - 15:30',
    rating: 4.7,
    total_reviews: 3400,
    google_maps_url: 'https://maps.google.com/?q=Soto+Triwindu+Surakarta',
    place_id: 'ChIJ_sototriwindu',
    category: 'resto',
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-reddog',
    name: 'REDDog Keprabon Korean',
    address: 'Jl. Ronggowarsito No. 65, Keprabon, Banjarsari, Surakarta',
    latitude: -7.56898,
    longitude: 110.82218,
    opening_hours: '10:00 - 22:00',
    rating: 4.6,
    total_reviews: 410,
    google_maps_url: 'https://maps.google.com/?q=RedDog+Keprabon+Surakarta',
    place_id: 'ChIJ_reddog',
    category: 'resto',
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-bentokopi',
    name: 'Bento Kopi Solo UNS',
    address: 'Jl. Antariksa II, Kentingan, Jebres, Surakarta',
    latitude: -7.5562,
    longitude: 110.8548,
    opening_hours: '09:00 - 01:00',
    rating: 4.6,
    total_reviews: 730,
    google_maps_url: 'https://maps.google.com/?q=Bento+Kopi+Solo+UNS',
    place_id: 'ChIJ_bentokopi',
    category: 'warkop',
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-wedanganpendopo',
    name: 'Wedangan Pendopo Mangkunegaran',
    address: 'Jl. Sugiyopranoto No. 20, Keprabon, Banjarsari, Surakarta',
    latitude: -7.5679,
    longitude: 110.8252,
    opening_hours: '16:00 - 23:59',
    rating: 4.6,
    total_reviews: 1180,
    google_maps_url: 'https://maps.google.com/?q=Wedangan+Pendopo+Surakarta',
    place_id: 'ChIJ_wedanganpendopo',
    category: 'warkop',
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-warmindouns',
    name: 'Warkop & Warmindo Surya Kentingan',
    address: 'Jl. Surya Utama, Jebres, Belakang Kampus UNS, Surakarta',
    latitude: -7.5575,
    longitude: 110.8581,
    opening_hours: '07:00 - 02:00',
    rating: 4.5,
    total_reviews: 290,
    google_maps_url: 'https://maps.google.com/?q=Warmindo+Kentingan+UNS+Surakarta',
    place_id: 'ChIJ_warmindouns',
    category: 'warkop',
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-sekutu',
    name: 'Sekutu Kopi Laweyan',
    address: 'Jl. Dr. Rajiman No. 450, Bumi, Laweyan, Surakarta',
    latitude: -7.5715,
    longitude: 110.7955,
    opening_hours: '09:00 - 23:00',
    rating: 4.7,
    total_reviews: 580,
    google_maps_url: 'https://maps.google.com/?q=Sekutu+Kopi+Laweyan+Surakarta',
    place_id: 'ChIJ_sekutu',
    category: 'cafe',
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-bhumi',
    name: 'Bhumi Kopi Kotabarat',
    address: 'Jl. Dr. Moewardi No. 42, Mangkubumen, Banjarsari, Surakarta',
    latitude: -7.5618,
    longitude: 110.8068,
    opening_hours: '08:00 - 23:00',
    rating: 4.6,
    total_reviews: 490,
    google_maps_url: 'https://maps.google.com/?q=Bhumi+Kopi+Kotabarat+Surakarta',
    place_id: 'ChIJ_bhumikopi',
    category: 'cafe',
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-arahkopi',
    name: 'Arah Kopi Kentingan UNS',
    address: 'Jl. Ki Hajar Dewantara No. 35, Jebres, Surakarta',
    latitude: -7.5584,
    longitude: 110.8562,
    opening_hours: '08:00 - 23:00',
    rating: 4.5,
    total_reviews: 310,
    google_maps_url: 'https://maps.google.com/?q=Arah+Kopi+Kentingan+UNS+Surakarta',
    place_id: 'ChIJ_arahkopi',
    category: 'cafe',
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-selaras',
    name: 'Selaras Coffee & Space Solo',
    address: 'Jl. Kenanga No. 22, Purwosari, Laweyan, Surakarta',
    latitude: -7.5645,
    longitude: 110.8012,
    opening_hours: '08:00 - 23:00',
    rating: 4.7,
    total_reviews: 440,
    google_maps_url: 'https://maps.google.com/?q=Selaras+Coffee+Purwosari+Surakarta',
    place_id: 'ChIJ_selaras',
    category: 'cafe',
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-halojae',
    name: 'Halo Jae Coffee & Space',
    address: 'Jl. Kahuripan No. 12, Sumber, Banjarsari, Surakarta',
    latitude: -7.5458,
    longitude: 110.8123,
    opening_hours: '09:00 - 23:00',
    rating: 4.7,
    total_reviews: 510,
    google_maps_url: 'https://maps.google.com/?q=Halo+Jae+Coffee+Sumber+Surakarta',
    place_id: 'ChIJ_halojae',
    category: 'cafe',
    source: 'google_maps_curated',
  },
];

export function getLocalReviews(cafeId: number): CafeReview[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_REVIEWS_KEY);
    if (!raw) return [];
    const parsed: Record<number, CafeReview[]> = JSON.parse(raw);
    return parsed[cafeId] || [];
  } catch {
    return [];
  }
}

function saveLocalReview(cafeId: number, review: CafeReview) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(LOCAL_REVIEWS_KEY);
    const parsed: Record<number, CafeReview[]> = raw ? JSON.parse(raw) : {};
    const existing = parsed[cafeId] || [];
    parsed[cafeId] = [review, ...existing];
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(parsed));
  } catch {
    // ignore storage errors
  }
}

export function deleteLocalReview(cafeId: number, reviewId: number) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(LOCAL_REVIEWS_KEY);
    if (!raw) return;
    const parsed: Record<number, CafeReview[]> = JSON.parse(raw);
    if (!parsed[cafeId]) return;
    parsed[cafeId] = parsed[cafeId].filter((r) => r.id !== reviewId);
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(parsed));
  } catch {
    // ignore storage errors
  }
}

async function fetchWithFallback<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const urlPrimary = `${PRIMARY_API_URL}${endpoint}`;
  try {
    const res = await fetch(urlPrimary, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      throw new Error(
        errorBody?.message || `HTTP error ${res.status}: ${res.statusText}`
      );
    }

    return await res.json();
  } catch (primaryErr) {
    console.warn(`Primary API ${urlPrimary} failed, attempting fallback...`, primaryErr);

    const urlFallback = `${FALLBACK_API_URL}${endpoint}`;
    const fallbackRes = await fetch(urlFallback, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!fallbackRes.ok) {
      const errorBody = await fallbackRes.json().catch(() => null);
      throw new Error(
        errorBody?.message || `Fallback API failed with HTTP ${fallbackRes.status}`
      );
    }

    return await fallbackRes.json();
  }
}

export const api = {
  // Check Supabase connection and status
  async getSystemStatus(): Promise<SystemStatus> {
    return fetchWithFallback<SystemStatus>('/db-check');
  },

  // Fetch cafes with search query and crowd filter
  async getCafes(params?: {
    q?: string;
    crowd_density?: string;
  }): Promise<CafeListResponse> {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.crowd_density && params?.crowd_density !== 'ALL') {
      query.append('crowd_density', params.crowd_density);
    }

    const qs = query.toString();
    const endpoint = `/api/cafes${qs ? `?${qs}` : ''}`;
    return fetchWithFallback<CafeListResponse>(endpoint);
  },

  // Fetch single cafe details including reviews (merged with community local reviews)
  async getCafeById(id: number): Promise<CafeDetailResponse> {
    const response = await fetchWithFallback<CafeDetailResponse>(`/api/cafes/${id}`);
    const localRevs = getLocalReviews(id);
    if (response?.data && localRevs.length > 0) {
      const apiRevs = response.data.reviews || [];
      response.data.reviews = [...localRevs, ...apiRevs];
      response.data.total_reviews = response.data.reviews.length;
    }
    return response;
  },

  // Register a new cafe workspace
  async createCafe(payload: CreateCafeInput): Promise<{ data: Cafe; status: string }> {
    return fetchWithFallback<{ data: Cafe; status: string }>('/api/cafes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Update existing cafe amenities or specs
  async updateCafe(
    id: number,
    payload: UpdateCafeInput
  ): Promise<{ data: Cafe; status: string }> {
    return fetchWithFallback<{ data: Cafe; status: string }>(`/api/cafes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // Delete cafe
  async deleteCafe(id: number): Promise<{ message: string; status: string }> {
    return fetchWithFallback<{ message: string; status: string }>(`/api/cafes/${id}`, {
      method: 'DELETE',
    });
  },

  // Submit community review & sync live Wi-Fi / crowd telemetry to API
  async submitReview(
    cafeId: number,
    payload: CreateReviewInput
  ): Promise<{ status: string; review: CafeReview }> {
    const newReview: CafeReview = {
      id: Date.now(),
      cafe_id: cafeId,
      reviewer_name: payload.reviewer_name,
      rating: payload.rating,
      comment: payload.comment,
      verified_wifi_speed: payload.verified_wifi_speed,
      verified_crowd: payload.verified_crowd,
      created_at: new Date().toISOString(),
    };

    // Save locally so the contributor immediately sees their review
    saveLocalReview(cafeId, newReview);

    // Also try POSTing to backend review endpoint if available, or sync live telemetry via PUT
    try {
      await fetchWithFallback(`/api/cafes/${cafeId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      // Sync verified crowd & Wi-Fi speed directly to the cafe record on the backend API
      const updatePayload: UpdateCafeInput = {};
      if (payload.verified_crowd) {
        updatePayload.crowd_density = payload.verified_crowd;
      }
      if (payload.verified_wifi_speed && payload.verified_wifi_speed > 0) {
        updatePayload.amenities = {
          wifi_speed_mbps: payload.verified_wifi_speed,
        };
      }
      if (Object.keys(updatePayload).length > 0) {
        await api.updateCafe(cafeId, updatePayload).catch(() => null);
      }
    }

    return { status: 'success', review: newReview };
  },

  // Reverse geocode & snap to nearby POI (Cafe, Warkop, Resto) in Surakarta
  async reverseGeocode(
    lat: number,
    lng: number
  ): Promise<{ name: string; address: string; category: PlaceCategory; opening_hours?: string }> {
    // 1. Check if click is right on top of a known curated Solo place (< 55m)
    for (const curated of CURATED_SOLO_PLACES) {
      if (calculateDistanceMeters(lat, lng, curated.latitude, curated.longitude) < 55) {
        return {
          name: curated.name,
          address: curated.address,
          category: curated.category || inferPlaceCategory(curated.name),
          opening_hours: curated.opening_hours,
        };
      }
    }

    // 2. Check Overpass API for exact nearby POI within 45 meters (Cafe / Warkop / Resto)
    try {
      const overpassQuery = `[out:json][timeout:4];(node(around:45,${lat},${lng})["name"];way(around:45,${lat},${lng})["name"];);out center 5;`;
      const ovRes = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`
      );
      if (ovRes.ok) {
        const ovData = await ovRes.json();
        const elements: Array<{
          tags?: Record<string, string>;
        }> = ovData.elements || [];
        const poi = elements.find(
          (el) =>
            el.tags?.name &&
            (el.tags?.amenity || el.tags?.shop || el.tags?.cuisine || el.tags?.tourism)
        );
        if (poi && poi.tags?.name) {
          const street = poi.tags['addr:street'] || 'Surakarta';
          const houseNo = poi.tags['addr:housenumber'] ? ` No. ${poi.tags['addr:housenumber']}` : '';
          return {
            name: poi.tags.name,
            address: `${street}${houseNo}, Surakarta`,
            category: inferPlaceCategory(poi.tags.name, poi.tags.amenity, poi.tags.cuisine),
            opening_hours: poi.tags.opening_hours || undefined,
          };
        }
      }
    } catch {
      // continue to Nominatim fallback
    }

    // 3. Nominatim zoom=18 reverse geocode
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&namedetails=1`,
        { headers: { 'Accept-Language': 'id' } }
      );
      if (res.ok) {
        const data = await res.json();
        const road =
          data.address?.road ||
          data.address?.neighbourhood ||
          data.address?.suburb ||
          'Surakarta';
        const rawName =
          data.name ||
          data.namedetails?.name ||
          data.address?.cafe ||
          data.address?.restaurant ||
          data.address?.fast_food ||
          data.address?.amenity ||
          `Kafe di ${road}`;
        const address = data.display_name || `${road}, Surakarta`;
        return {
          name: rawName,
          address,
          category: inferPlaceCategory(rawName, data.type),
        };
      }
    } catch {
      // fallback
    }
    return {
      name: `Titik Kafe (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      address: `Surakarta, Jawa Tengah (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      category: 'cafe',
    };
  },

  // Scan visible map bounding box in Surakarta for real Cafes, Warkops & Restos via Overpass POI API
  async scanSoloAreaPOIs(bounds?: {
    south: number;
    west: number;
    north: number;
    east: number;
  }): Promise<MapsPlaceCandidate[]> {
    const bbox = bounds || {
      south: -7.585,
      west: 110.785,
      north: -7.54,
      east: 110.865,
    };

    try {
      const query = `[out:json][timeout:8];(node["amenity"~"cafe|restaurant|fast_food"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});way["amenity"~"cafe|restaurant|fast_food"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});node["shop"="coffee"](${bbox.south},${bbox.west},${bbox.north},${bbox.east}););out center 55;`;
      const res = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );

      if (!res.ok) return CURATED_SOLO_PLACES;

      const data = await res.json();
      const elements: Array<{
        id: number;
        lat?: number;
        lon?: number;
        center?: { lat: number; lon: number };
        tags?: Record<string, string>;
      }> = data.elements || [];

      const discovered: MapsPlaceCandidate[] = [...CURATED_SOLO_PLACES];

      for (const el of elements) {
        const name = el.tags?.name?.trim();
        if (!name) continue;

        const lat = el.lat ?? el.center?.lat;
        const lon = el.lon ?? el.center?.lon;
        if (typeof lat !== 'number' || typeof lon !== 'number') continue;

        // Avoid duplicates with curated or already added items
        const isDup = discovered.some(
          (d) =>
            d.name.toLowerCase() === name.toLowerCase() ||
            calculateDistanceMeters(lat, lon, d.latitude, d.longitude) < 30
        );
        if (isDup) continue;

        const street =
          el.tags?.['addr:street'] ||
          el.tags?.['addr:full'] ||
          el.tags?.['addr:subdistrict'] ||
          'Surakarta';
        const houseNumber = el.tags?.['addr:housenumber']
          ? ` No. ${el.tags['addr:housenumber']}`
          : '';
        const city = el.tags?.['addr:city'] || 'Surakarta';
        const category = inferPlaceCategory(name, el.tags?.amenity, el.tags?.cuisine);

        discovered.push({
          id: `poi-${el.id}`,
          name,
          address: `${street}${houseNumber}, ${city}`,
          latitude: lat,
          longitude: lon,
          opening_hours: el.tags?.opening_hours || undefined,
          google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${name} Surakarta`
          )}`,
          category,
          source: 'overpass_poi',
        });
      }

      return discovered;
    } catch {
      return CURATED_SOLO_PLACES;
    }
  },

  // Parse a Google Maps URL (or share link) to extract real place metadata via server resolver
  async parseGoogleMapsUrl(input: string): Promise<MapsPlaceCandidate | null> {
    const trimmed = input.trim();
    if (
      !trimmed.includes('google.com/maps') &&
      !trimmed.includes('maps.app.goo.gl') &&
      !trimmed.includes('goo.gl/maps')
    ) {
      return null;
    }

    // Call server-side API parser (handles redirect unshortening & exact coordinates)
    try {
      const res = await fetch('/api/gmaps/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.candidate) {
          return data.candidate;
        }
      }
    } catch (err) {
      console.warn('Server parse route unreachable, fallback to client regex:', err);
    }

    // Local regex fallback without fabricated ratings
    const placeRegex = /\/place\/([^/@]+)(?:.*@(-?\d+\.\d+),(-?\d+\.\d+))?/;
    const placeMatch = trimmed.match(placeRegex);

    if (placeMatch) {
      const rawName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      const lat = placeMatch[2] ? parseFloat(placeMatch[2]) : -7.562;
      const lng = placeMatch[3] ? parseFloat(placeMatch[3]) : 110.818;
      return {
        id: `gmap-link-${Date.now()}`,
        name: rawName,
        address: `${rawName}, Surakarta`,
        latitude: lat,
        longitude: lng,
        google_maps_url: trimmed,
        category: inferPlaceCategory(rawName),
        source: 'google_maps_link',
      };
    }

    const qCoordsRegex = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;
    const qCoordsMatch = trimmed.match(qCoordsRegex);
    if (qCoordsMatch) {
      const lat = parseFloat(qCoordsMatch[1]);
      const lng = parseFloat(qCoordsMatch[2]);
      return {
        id: `gmap-coords-${Date.now()}`,
        name: 'Titik dari Tautan Google Maps',
        address: `Surakarta (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        latitude: lat,
        longitude: lng,
        google_maps_url: trimmed,
        category: 'cafe',
        source: 'google_maps_link',
      };
    }

    return null;
  },

  // Search cafes in Surakarta from Google Maps Curated Directory + Links + OpenStreetMap Nominatim
  async searchSoloPlacesFromMaps(query: string): Promise<MapsPlaceCandidate[]> {
    const q = query.trim().toLowerCase();

    // 1. Check if user pasted a Google Maps URL
    if (
      query.includes('google.com/maps') ||
      query.includes('maps.app.goo.gl') ||
      query.includes('goo.gl/maps')
    ) {
      const parsed = await api.parseGoogleMapsUrl(query);
      if (parsed) return [parsed];
    }

    // 2. Filter curated Google Maps places
    const matchedCurated = CURATED_SOLO_PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );

    if (!q) return CURATED_SOLO_PLACES;

    try {
      const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        `${query} Surakarta`
      )}&limit=8&addressdetails=1`;
      const res = await fetch(osmUrl, {
        headers: { 'Accept-Language': 'id' },
      });
      if (!res.ok) return matchedCurated;

      const data: Array<{
        place_id: number;
        display_name: string;
        name?: string;
        type?: string;
        lat: string;
        lon: string;
      }> = await res.json();

      const osmResults: MapsPlaceCandidate[] = data.map((item) => {
        const parts = item.display_name.split(',');
        const title = item.name || parts[0]?.trim() || 'Kafe Surakarta';
        const addr = parts.slice(1, 4).join(',').trim() || item.display_name;
        return {
          id: `osm-${item.place_id}`,
          name: title,
          address: addr,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          category: inferPlaceCategory(title, item.type),
          source: 'osm',
        };
      });

      // Deduplicate by name
      const combined = [...matchedCurated];
      for (const item of osmResults) {
        if (!combined.some((c) => c.name.toLowerCase() === item.name.toLowerCase())) {
          combined.push(item);
        }
      }
      return combined;
    } catch {
      return matchedCurated;
    }
  },
};
