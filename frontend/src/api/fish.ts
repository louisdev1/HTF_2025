import { Fish } from "@/types/fish";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

export const fetchFishes = async (): Promise<Fish[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fish`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Transform backend data to match Fish interface
    return data.map((fish: any) => ({
      id: fish.id.toString(),
      name: fish.name,
      scientificName: fish.scientificName,
      imageUrl: fish.imageUrl,
      rarity: fish.rarity.toUpperCase(),
      habitat: fish.habitat,
      sightings: fish.sightings,
      latestSighting: fish.sightings && fish.sightings.length > 0 ? {
        latitude: fish.sightings[0].latitude,
        longitude: fish.sightings[0].longitude,
        timestamp: fish.sightings[0].timestamp,
      } : {
        latitude: 0,
        longitude: 0,
        timestamp: new Date().toISOString(),
      }
    }));
  } catch (error) {
    console.error("Error fetching fishes:", error);
    throw error;
  }
};
