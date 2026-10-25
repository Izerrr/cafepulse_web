import {
  Cafe,
  CafeDetailResponse,
  CafeListResponse,
  CafeReview,
  CreateCafeInput,
  CreateReviewInput,
  MapsPlaceCandidate,
  SystemStatus,
  UpdateCafeInput,
} from '@/types/cafe';

const PRIMARY_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.cafepulse.izerworks.my.id';
const FALLBACK_API_URL = 'https://cafepulse-api.vercel.app';

const LOCAL_REVIEWS_KEY = 'cafepulse_community_reviews_v1';

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
    source: 'google_maps_curated',
  },
  {
    id: 'gmap-loske',
    name: 'Loske Coffee Service Pasar Gede',
    address: 'Jl. Teuku Umar No. 20, Keprabon, Banjarsari, Surakarta',
    latitude: -7.5682,
    longitude: 110.8241,
    opening_hours: '07:00 - 22:00',
    rating: 4.8,
    total_reviews: 620,
    google_maps_url: 'https://maps.google.com/?q=Loske+Coffee+Service+Surakarta',
    place_id: 'ChIJ_loske',
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

  // Parse a Google Maps URL (or share link) to extract cafe metadata
  parseGoogleMapsUrl(input: string): MapsPlaceCandidate | null {
    const trimmed = input.trim();
    if (!trimmed.includes('google.com/maps') && !trimmed.includes('maps.app.goo.gl')) {
      return null;
    }

    // Try match place name and coordinates: /place/Name/@lat,lng
    const placeRegex = /\/place\/([^/@]+)(?:.*@(-?\d+\.\d+),(-?\d+\.\d+))?/;
    const placeMatch = trimmed.match(placeRegex);

    if (placeMatch) {
      const rawName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      const lat = placeMatch[2] ? parseFloat(placeMatch[2]) : -7.562;
      const lng = placeMatch[3] ? parseFloat(placeMatch[3]) : 110.818;
      return {
        id: `gmap-link-${Date.now()}`,
        name: rawName,
        address: `${rawName}, Surakarta (Impor Google Maps)`,
        latitude: lat,
        longitude: lng,
        opening_hours: '08:00 - 23:00',
        rating: 4.7,
        google_maps_url: trimmed,
        source: 'google_maps_link',
      };
    }

    // Try match query coordinates: ?q=lat,lng
    const qCoordsRegex = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;
    const qCoordsMatch = trimmed.match(qCoordsRegex);
    if (qCoordsMatch) {
      const lat = parseFloat(qCoordsMatch[1]);
      const lng = parseFloat(qCoordsMatch[2]);
      return {
        id: `gmap-coords-${Date.now()}`,
        name: 'Kafe Baru dari Google Maps',
        address: 'Surakarta, Jawa Tengah (Titik Google Maps)',
        latitude: lat,
        longitude: lng,
        opening_hours: '08:00 - 23:00',
        rating: 4.7,
        google_maps_url: trimmed,
        source: 'google_maps_link',
      };
    }

    // Generic Google Maps link fallback
    return {
      id: `gmap-generic-${Date.now()}`,
      name: 'Kafe dari Tautan Google Maps',
      address: 'Surakarta, Jawa Tengah',
      latitude: -7.562,
      longitude: 110.818,
      opening_hours: '08:00 - 23:00',
      rating: 4.7,
      google_maps_url: trimmed,
      source: 'google_maps_link',
    };
  },

  // Search cafes in Surakarta from Google Maps Curated Directory + Links + OpenStreetMap Nominatim
  async searchSoloPlacesFromMaps(query: string): Promise<MapsPlaceCandidate[]> {
    const q = query.trim().toLowerCase();

    // 1. Check if user pasted a Google Maps URL
    if (query.includes('google.com/maps') || query.includes('maps.app.goo.gl')) {
      const parsed = api.parseGoogleMapsUrl(query);
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
      )}&limit=6&addressdetails=1`;
      const res = await fetch(osmUrl, {
        headers: { 'Accept-Language': 'id' },
      });
      if (!res.ok) return matchedCurated;

      const data: Array<{
        place_id: number;
        display_name: string;
        name?: string;
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
          opening_hours: '08:00 - 23:00',
          rating: 4.6,
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
