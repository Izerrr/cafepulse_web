export type CrowdDensity = 'LOW' | 'MODERATE' | 'HIGH';
export type WifiStability = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
export type PlugScore = 'PLENTY' | 'MODERATE' | 'LIMITED' | 'NONE';
export type NoiseLevel = 'QUIET' | 'MODERATE' | 'NOISY';

export interface CafeAmenities {
  id?: number;
  cafe_id?: number;
  wifi_speed_mbps: number;
  wifi_stability: WifiStability;
  plug_score: PlugScore;
  noise_level: NoiseLevel;
  has_outdoor: boolean;
  air_conditioned: boolean;
  has_prayer_room: boolean;
  updated_at?: string;
}

export interface CafeReview {
  id: number;
  cafe_id: number;
  user_id?: number;
  reviewer_name?: string;
  rating: number;
  comment: string;
  verified_wifi_speed?: number;
  verified_crowd?: CrowdDensity | string;
  created_at: string;
}

export interface Cafe {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  opening_hours: string;
  crowd_density: CrowdDensity;
  is_active: boolean;
  owner_id?: number;
  rating?: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  amenities?: CafeAmenities;
  reviews?: CafeReview[];
}

export interface SystemStatus {
  database: string;
  schema: string;
  stats: {
    active_cafes: number;
  };
  status: 'success' | 'error';
}

export interface CafeListResponse {
  data: Cafe[];
  status: string;
  total: number;
}

export interface CafeDetailResponse {
  data: Cafe;
  status: string;
}

export interface CreateCafeInput {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  opening_hours: string;
  crowd_density: CrowdDensity;
  amenities: {
    wifi_speed_mbps: number;
    wifi_stability: WifiStability;
    plug_score: PlugScore;
    noise_level: NoiseLevel;
    has_outdoor: boolean;
    air_conditioned: boolean;
    has_prayer_room: boolean;
  };
}

export interface UpdateCafeInput {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  opening_hours?: string;
  crowd_density?: CrowdDensity;
  is_active?: boolean;
  amenities?: Partial<CafeAmenities>;
}


export interface FilterState {
  search: string;
  crowdDensity: 'ALL' | CrowdDensity;
  minWifiSpeed: number;
  plugScore: 'ALL' | PlugScore;
  noiseLevel: 'ALL' | NoiseLevel;
  acOnly: boolean;
  outdoorOnly: boolean;
  prayerRoomOnly: boolean;
}

export interface CreateReviewInput {
  rating: number;
  comment: string;
  verified_wifi_speed?: number;
  verified_crowd?: CrowdDensity;
  reviewer_name?: string;
}

export type PlaceCategory = 'cafe' | 'warkop' | 'resto';

export interface MapsPlaceCandidate {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  opening_hours?: string;
  rating?: number;
  total_reviews?: number;
  google_maps_url?: string;
  place_id?: string;
  category?: PlaceCategory;
  source?: 'google_places_api' | 'google_maps_curated' | 'google_maps_link' | 'osm' | 'overpass_poi';
}
