export interface Fish {
  id: number;
  name: string;
  scientificName: string;
  imageUrl: string;
  rarity: string;
  habitat: string;
  sightings?: FishSighting[];
  latestSighting?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

export interface FishSighting {
  id: number;
  fishId: number;
  latitude: number;
  longitude: number;
  location: string;
  timestamp: string;
  seen: boolean;
}

export type Rarity = "COMMON" | "RARE" | "EPIC";
