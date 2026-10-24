import {
  Cafe,
  CafeDetailResponse,
  CafeListResponse,
  CreateCafeInput,
  SystemStatus,
  UpdateCafeInput,
} from '@/types/cafe';

const PRIMARY_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.cafepulse.izerworks.my.id';
const FALLBACK_API_URL = 'https://cafepulse-api.vercel.app';

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
    
    // Attempt fallback
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
    if (params?.crowd_density && params.crowd_density !== 'ALL') {
      query.append('crowd_density', params.crowd_density);
    }

    const qs = query.toString();
    const endpoint = `/api/cafes${qs ? `?${qs}` : ''}`;
    return fetchWithFallback<CafeListResponse>(endpoint);
  },

  // Fetch single cafe details including reviews
  async getCafeById(id: number): Promise<CafeDetailResponse> {
    return fetchWithFallback<CafeDetailResponse>(`/api/cafes/${id}`);
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
};

