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
    id: 'solo-tanaku',
    name: 'Tanaku Kopi Manahan',
    address: 'Jl. Menteri Supeno No. 17, Manahan, Banjarsari, Surakarta',
    latitude: -7.5542,
    longitude: 110.8055,
    opening_hours: '08:00 - 23:00',
  },
  {
    id: 'solo-coldnbrew',
    name: "Cold 'N Brew Slamet Riyadi",
    address: 'Jl. Brigjen Slamet Riyadi No. 300, Sriwedari, Laweyan, Surakarta',
    latitude: -7.5678,
    longitude: 110.8112,
    opening_hours: '07:00 - 23:59',
  },
  {
    id: 'solo-kopinako',
    name: 'Kopi Nako Solo',
    address: 'Jl. M.T. Haryono No. 10, Manahan, Banjarsari, Surakarta',
    latitude: -7.5521,
    longitude: 110.8091,
    opening_hours: '08:00 - 23:00',
  },
  {
    id: 'solo-kolektif',
    name: 'Kolektif Coffee & Coworking Space',
    address: 'Jl. Teuku Umar No. 48, Keprabon, Banjarsari, Surakarta',
    latitude: -7.5691,
    longitude: 110.8224,
    opening_hours: '09:00 - 22:00',
  },
  {
    id: 'solo-arahkopi',
    name: 'Arah Kopi Kentingan UNS',
    address: 'Jl. Ki Hajar Dewantara No. 35, Jebres, Surakarta',
    latitude: -7.5584,
    longitude: 110.8562,
    opening_hours: '08:00 - 23:00',
  },
  {
    id: 'solo-loske',
    name: 'Loske Coffee Service Pasar Gede',
    address: 'Jl. Teuku Umar No. 20, Keprabon, Banjarsari, Surakarta',
    latitude: -7.5682,
    longitude: 110.8241,
    opening_hours: '07:00 - 22:00',
  },
  {
    id: 'solo-bhumi',
    name: 'Bhumi Kopi Kotabarat',
    address: 'Jl. Dr. Moewardi No. 42, Mangkubumen, Banjarsari, Surakarta',
    latitude: -7.5618,
    longitude: 110.8068,
    opening_hours: '08:00 - 23:00',
  },
  {
    id: 'solo-sekutu',
    name: 'Sekutu Kopi Laweyan',
    address: 'Jl. Dr. Rajiman No. 450, Bumi, Laweyan, Surakarta',
    latitude: -7.5715,
    longitude: 110.7955,
    opening_hours: '09:00 - 23:00',
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

  // Search cafes in Surakarta from OpenStreetMap Nominatim + Curated Solo Directory
  async searchSoloPlacesFromMaps(query: string): Promise<MapsPlaceCandidate[]> {
    const q = query.trim().toLowerCase();
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
