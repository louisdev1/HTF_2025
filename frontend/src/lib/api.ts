import { Fish, Stats, FishSighting, DivingCenter } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, `API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const fishApi = {
  async getAll(search?: string, filter?: string, rarity?: string): Promise<Fish[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filter && filter !== 'all') params.append('filter', filter);
    if (rarity) params.append('rarity', rarity);

    const query = params.toString();
    return fetchApi<Fish[]>(`/api/fish${query ? `?${query}` : ''}`);
  },

  async getById(id: number): Promise<Fish> {
    return fetchApi<Fish>(`/api/fish/${id}`);
  },

  async updateSeen(id: number, seen: boolean, location?: { latitude: number; longitude: number; location: string }): Promise<Fish> {
    return fetchApi<Fish>(`/api/fish/${id}/seen`, {
      method: 'PATCH',
      body: JSON.stringify({
        seen,
        ...location
      }),
    });
  },

  async getStats(): Promise<Stats> {
    return fetchApi<Stats>('/api/stats');
  },

  async getSightings(): Promise<FishSighting[]> {
    return fetchApi<FishSighting[]>('/api/sightings');
  },

  async getDivingCenters(): Promise<DivingCenter[]> {
    return fetchApi<DivingCenter[]>('/api/diving-centers');
  },
};
