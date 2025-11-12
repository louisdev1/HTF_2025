export interface Fish {
  id: number;
  name: string;
  scientificName: string;
  description: string;
  imageUrl: string;
  habitat: string;
  size: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  total: number;
  seen: number;
  unseen: number;
  percentageSeen: number;
}

export type FilterType = 'all' | 'seen' | 'unseen';
