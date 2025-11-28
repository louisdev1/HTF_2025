import { fetchFishes } from "@/api/fish";
import { getRarityOrder } from "@/utils/rarity";
import FishTrackerLayout from "@/components/FishTrackerLayout";
import AuthWrapper from "@/components/AuthWrapper";
import { Fish } from "@/types/fish";

export default async function Home() {
  let fishes: Fish[];

  try {
    fishes = await fetchFishes();
  } catch (error) {
    console.error("Failed to fetch fishes:", error);
    fishes = [];
  }

  // Sort fish by rarity (rarest first)
  const sortedFishes = [...fishes].sort(
    (a, b) => getRarityOrder(a.rarity) - getRarityOrder(b.rarity)
  );

  return (
    <AuthWrapper>
      <FishTrackerLayout fishes={fishes} sortedFishes={sortedFishes} />
    </AuthWrapper>
  );
}
