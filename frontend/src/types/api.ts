export interface Fish {
  id: number;
  name: string;
  scientificName: string;
  description: string;
  imageUrl: string;
  rarity: 'Common' | 'Rare' | 'Epic';
  habitat: string;
  size: string;
  minDepth: number;
  maxDepth: number;
  createdAt: string;
  updatedAt: string;
  seen: boolean;
  lastSeen: string | null;
  sightingCount: number;
  sightings?: FishSighting[];
}

export interface FishSighting {
  id: number;
  fishId: number;
  latitude: number;
  longitude: number;
  location: string;
  timestamp: string;
  seen: boolean;
  createdAt: string;
  fish?: Fish;
}

export interface DivingCenter {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  region: string;
  createdAt: string;
}

export interface Stats {
  total: number;
  seen: number;
  unseen: number;
  percentageSeen: number;
  byRarity: {
    common: { total: number; seen: number };
    rare: { total: number; seen: number };
    epic: { total: number; seen: number };
  };
}

export type FilterType = 'all' | 'seen' | 'unseen';
export type RarityType = 'Common' | 'Rare' | 'Epic';
