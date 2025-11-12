import { Fish, Stats } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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
  async getAll(search?: string, filter?: string): Promise<Fish[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filter && filter !== 'all') params.append('filter', filter);

    const query = params.toString();
    return fetchApi<Fish[]>(`/api/fish${query ? `?${query}` : ''}`);
  },

  async getById(id: number): Promise<Fish> {
    return fetchApi<Fish>(`/api/fish/${id}`);
  },

  async updateSeen(id: number, seen: boolean): Promise<Fish> {
    return fetchApi<Fish>(`/api/fish/${id}/seen`, {
      method: 'PATCH',
      body: JSON.stringify({ seen }),
    });
  },

  async getStats(): Promise<Stats> {
    return fetchApi<Stats>('/api/stats');
  },
};
