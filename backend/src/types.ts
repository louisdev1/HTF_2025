export interface Fish {
  id: number;
  name: string;
  scientificName: string;
  description: string;
  imageUrl: string;
  rarity: string;
  habitat: string;
  size: string;
  minDepth: number;
  maxDepth: number;
  createdAt: Date;
  updatedAt: Date;
  seen?: boolean; // Computed from sightings
  lastSeen?: Date | null;
  sightingCount?: number;
}

export interface FishSighting {
  id: number;
  fishId: number;
  latitude: number;
  longitude: number;
  location: string;
  timestamp: Date;
  seen: boolean;
  createdAt: Date;
}

export interface DivingCenter {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  region: string;
  createdAt: Date;
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
