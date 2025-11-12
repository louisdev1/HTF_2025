import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fishData = [
  {
    name: 'Clownfish',
    scientificName: 'Amphiprioninae',
    description: 'Small, vibrant orange fish with white bands, famously living in symbiosis with sea anemones. Known for their distinctive waddle-like swimming pattern and protective behavior of their anemone homes.',
    imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800',
    rarity: 'Common',
    habitat: 'Coral Reefs, Indo-Pacific',
    size: '7-11 cm',
    minDepth: 1,
    maxDepth: 15
  },
  {
    name: 'Blue Tang',
    scientificName: 'Paracanthurus hepatus',
    description: 'Striking royal blue fish with a yellow tail fin. Popular in reef aquariums, these fish are herbivores that help control algae growth on coral reefs.',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    rarity: 'Common',
    habitat: 'Coral Reefs, Indo-Pacific',
    size: '20-30 cm',
    minDepth: 2,
    maxDepth: 40
  },
  {
    name: 'Great White Shark',
    scientificName: 'Carcharodon carcharias',
    description: 'Apex predator of the ocean, recognizable by its powerful build, torpedo-shaped body, and distinctive white underbelly. These magnificent creatures can detect a single drop of blood in 100 liters of water.',
    imageUrl: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=800',
    rarity: 'Epic',
    habitat: 'Coastal Waters Worldwide',
    size: '4-6 meters',
    minDepth: 0,
    maxDepth: 1200
  },
  {
    name: 'Manta Ray',
    scientificName: 'Manta birostris',
    description: 'Gentle giants of the ocean with wingspans reaching up to 7 meters. Despite their imposing size, they are filter feeders consuming only plankton and small fish.',
    imageUrl: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=800',
    rarity: 'Rare',
    habitat: 'Tropical and Subtropical Waters',
    size: '4-7 meters wingspan',
    minDepth: 0,
    maxDepth: 120
  },
  {
    name: 'Lionfish',
    scientificName: 'Pterois volitans',
    description: 'Spectacular but venomous fish with elaborate, feathery pectoral fins and bold red and white stripes. Native to Indo-Pacific, they have become invasive in Atlantic waters.',
    imageUrl: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=800',
    rarity: 'Rare',
    habitat: 'Indo-Pacific Reefs',
    size: '30-40 cm',
    minDepth: 2,
    maxDepth: 50
  },
  {
    name: 'Seahorse',
    scientificName: 'Hippocampus',
    description: 'Unique fish species where males carry and birth the young. They swim upright and use their prehensile tails to anchor to seagrass and coral, camouflaging perfectly in their environment.',
    imageUrl: 'https://images.unsplash.com/photo-1559081965-c3f1143f9dde?w=800',
    rarity: 'Rare',
    habitat: 'Shallow Tropical and Temperate Waters',
    size: '2-35 cm',
    minDepth: 1,
    maxDepth: 50
  },
  {
    name: 'Angelfish',
    scientificName: 'Pomacanthidae',
    description: 'Brilliantly colored reef fish with compressed bodies and striking patterns. Juveniles often display different coloration than adults, and they graze primarily on sponges and algae.',
    imageUrl: 'https://images.unsplash.com/photo-1520990269408-c88b6eea14e0?w=800',
    rarity: 'Common',
    habitat: 'Tropical Coral Reefs',
    size: '15-60 cm',
    minDepth: 3,
    maxDepth: 70
  },
  {
    name: 'Pufferfish',
    scientificName: 'Tetraodontidae',
    description: 'Capable of inflating into a near-spherical ball when threatened. Contains tetrodotoxin, one of the most potent natural toxins. In Japan, specially trained chefs prepare it as the delicacy "fugu".',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
    rarity: 'Common',
    habitat: 'Tropical and Subtropical Waters',
    size: '2.5-61 cm',
    minDepth: 1,
    maxDepth: 300
  },
  {
    name: 'Moorish Idol',
    scientificName: 'Zanclus cornutus',
    description: 'Elegant fish with a distinctively long dorsal fin and bold black, white, and yellow bands. Sacred in Hawaiian culture, they are notoriously difficult to keep in captivity.',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800',
    rarity: 'Rare',
    habitat: 'Indo-Pacific Reefs',
    size: '18-23 cm',
    minDepth: 3,
    maxDepth: 180
  },
  {
    name: 'Barracuda',
    scientificName: 'Sphyraena',
    description: 'Sleek, torpedo-shaped predators with fearsome teeth and lightning-fast strikes. Can reach speeds of 27 mph in short bursts when hunting prey.',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
    rarity: 'Common',
    habitat: 'Tropical and Subtropical Oceans',
    size: '50-200 cm',
    minDepth: 0,
    maxDepth: 100
  },
  {
    name: 'Butterflyfish',
    scientificName: 'Chaetodontidae',
    description: 'Delicate, colorful reef fish that typically mate for life and swim in bonded pairs. Their elongated snouts are perfect for picking food from coral crevices.',
    imageUrl: 'https://images.unsplash.com/photo-1563281746-6f6cf5c281e1?w=800',
    rarity: 'Common',
    habitat: 'Coral Reefs Worldwide',
    size: '12-22 cm',
    minDepth: 1,
    maxDepth: 25
  },
  {
    name: 'Hammerhead Shark',
    scientificName: 'Sphyrna',
    description: 'Distinctive sharks with flattened, hammer-shaped heads that enhance electroreception for hunting. Often school in large groups during the day.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    rarity: 'Epic',
    habitat: 'Coastal Waters, Tropical',
    size: '3-6 meters',
    minDepth: 1,
    maxDepth: 275
  },
  {
    name: 'Triggerfish',
    scientificName: 'Balistidae',
    description: 'Bold fish with a special dorsal spine they can lock into place for defense. Equipped with powerful jaws capable of crushing shells and coral.',
    imageUrl: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800',
    rarity: 'Common',
    habitat: 'Tropical and Subtropical Reefs',
    size: '20-75 cm',
    minDepth: 2,
    maxDepth: 75
  },
  {
    name: 'Parrotfish',
    scientificName: 'Scaridae',
    description: 'Vibrantly colored fish with beak-like teeth for scraping algae from coral. They produce much of the white sand on tropical beaches by excreting ground-up coral.',
    imageUrl: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800',
    rarity: 'Common',
    habitat: 'Tropical Coral Reefs',
    size: '30-120 cm',
    minDepth: 1,
    maxDepth: 25
  },
  {
    name: 'Moray Eel',
    scientificName: 'Muraenidae',
    description: 'Snake-like fish that hide in reef crevices with only their heads visible. Possess a second set of pharyngeal jaws in their throat to secure prey.',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
    rarity: 'Rare',
    habitat: 'Tropical and Temperate Waters',
    size: '1-4 meters',
    minDepth: 1,
    maxDepth: 50
  },
  {
    name: 'Whale Shark',
    scientificName: 'Rhincodon typus',
    description: 'The largest fish in the ocean, growing up to 18 meters. Despite their enormous size, they are gentle filter feeders consuming plankton and small fish.',
    imageUrl: 'https://images.unsplash.com/photo-1564731071754-003816e39144?w=800',
    rarity: 'Epic',
    habitat: 'Tropical Oceans Worldwide',
    size: '5.5-18 meters',
    minDepth: 0,
    maxDepth: 1000
  },
  {
    name: 'Grouper',
    scientificName: 'Epinephelinae',
    description: 'Large, robust predators that often lurk in caves and under ledges. Some species can live over 50 years and change sex from female to male as they mature.',
    imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800',
    rarity: 'Rare',
    habitat: 'Coral and Rocky Reefs',
    size: '30-270 cm',
    minDepth: 4,
    maxDepth: 400
  },
  {
    name: 'Royal Gramma',
    scientificName: 'Gramma loreto',
    description: 'Stunning small fish split between vibrant purple front and brilliant yellow rear. Often swim upside down under ledges and caves.',
    imageUrl: 'https://images.unsplash.com/photo-1563281746-6f6cf5c281e1?w=800',
    rarity: 'Common',
    habitat: 'Caribbean Reefs',
    size: '6-8 cm',
    minDepth: 3,
    maxDepth: 60
  },
  {
    name: 'Surgeonfish',
    scientificName: 'Acanthuridae',
    description: 'Herbivorous fish named for the sharp, scalpel-like spines on their tails used for defense. Play a crucial role in controlling algae on coral reefs.',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    rarity: 'Common',
    habitat: 'Tropical Reefs',
    size: '15-40 cm',
    minDepth: 2,
    maxDepth: 40
  },
  {
    name: 'Mandarin Fish',
    scientificName: 'Synchiropus splendidus',
    description: 'One of the most psychedelically colored fish in the ocean with electric blue, orange, and green patterns. Lack scales and instead secrete toxic mucus for protection.',
    imageUrl: 'https://images.unsplash.com/photo-1520990269408-c88b6eea14e0?w=800',
    rarity: 'Epic',
    habitat: 'Western Pacific Reefs',
    size: '6-8 cm',
    minDepth: 3,
    maxDepth: 18
  },
  {
    name: 'Stingray',
    scientificName: 'Dasyatidae',
    description: 'Flat-bodied fish with venomous barbs on their tails for defense. Often bury themselves in sand to ambush mollusks and crustaceans.',
    imageUrl: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=800',
    rarity: 'Common',
    habitat: 'Coastal and Freshwater Worldwide',
    size: '30-200 cm',
    minDepth: 0,
    maxDepth: 60
  },
  {
    name: 'Bannerfish',
    scientificName: 'Heniochus',
    description: 'Elegant fish with tall dorsal fins and striking black and white vertical stripes. Often found in pairs or small groups around coral reefs.',
    imageUrl: 'https://images.unsplash.com/photo-1559081965-c3f1143f9dde?w=800',
    rarity: 'Common',
    habitat: 'Indo-Pacific Reefs',
    size: '15-25 cm',
    minDepth: 2,
    maxDepth: 75
  },
  {
    name: 'Octopus',
    scientificName: 'Octopoda',
    description: 'Highly intelligent cephalopods with eight arms, three hearts, and the ability to change color and texture instantly. Can squeeze through openings as small as their beak.',
    imageUrl: 'https://images.unsplash.com/photo-1545671913-b89de5ab6988?w=800',
    rarity: 'Rare',
    habitat: 'Oceans Worldwide',
    size: '30-90 cm',
    minDepth: 0,
    maxDepth: 200
  },
  {
    name: 'Nautilus',
    scientificName: 'Nautilidae',
    description: 'Ancient cephalopod with a distinctive spiraled shell divided into chambers. Living fossils that have remained virtually unchanged for 500 million years.',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    rarity: 'Epic',
    habitat: 'Deep Tropical Waters',
    size: '15-25 cm',
    minDepth: 100,
    maxDepth: 600
  },
  {
    name: 'Flying Fish',
    scientificName: 'Exocoetidae',
    description: 'Remarkable fish that leap from the water and glide for hundreds of meters using their enlarged pectoral fins. Primary defense mechanism against predators.',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800',
    rarity: 'Common',
    habitat: 'Tropical and Subtropical Oceans',
    size: '15-50 cm',
    minDepth: 0,
    maxDepth: 20
  }
];

const divingCenters = [
  { name: 'Blue Horizon Diving', latitude: -8.409518, longitude: 115.188919, region: 'Bali, Indonesia' },
  { name: 'Coral Bay Divers', latitude: 25.033964, longitude: -77.396280, region: 'Nassau, Bahamas' },
  { name: 'Great Barrier Reef Dive Co', latitude: -16.920067, longitude: 145.778076, region: 'Cairns, Australia' },
  { name: 'Red Sea Adventures', latitude: 27.258476, longitude: 33.812057, region: 'Sharm El Sheikh, Egypt' },
  { name: 'Maldives Deep Blue', latitude: 4.175496, longitude: 73.509347, region: 'Malé, Maldives' },
  { name: 'Pacific Dive Center', latitude: 21.315603, longitude: -157.858093, region: 'Honolulu, Hawaii' },
  { name: 'Caribbean Reef Explorers', latitude: 12.056098, longitude: -68.935623, region: 'Curaçao' },
  { name: 'Mediterranean Divers', latitude: 43.733333, longitude: 7.416667, region: 'Monaco' }
];

const sightingLocations = [
  { location: 'Tulamben Bay, Bali', lat: -8.274, lng: 115.596 },
  { location: 'Great Barrier Reef, Australia', lat: -18.286, lng: 147.699 },
  { location: 'Blue Corner, Palau', lat: 7.273, lng: 134.217 },
  { location: 'Ras Mohammed, Egypt', lat: 27.739, lng: 34.231 },
  { location: 'Sipadan Island, Malaysia', lat: 4.116, lng: 118.628 },
  { location: 'Koh Tao, Thailand', lat: 10.096, lng: 99.840 },
  { location: 'Cozumel, Mexico', lat: 20.423, lng: -86.922 },
  { location: 'Bonaire, Caribbean', lat: 12.201, lng: -68.262 },
  { location: 'Raja Ampat, Indonesia', lat: -0.230, lng: 130.521 },
  { location: 'Galapagos Islands', lat: -0.953, lng: -90.965 }
];

async function main() {
  console.log('🌊 Starting Fishy Dex database seed...');

  // Clear existing data
  await prisma.fishSighting.deleteMany({});
  await prisma.fish.deleteMany({});
  await prisma.divingCenter.deleteMany({});

  // Create fish species
  console.log('🐠 Seeding fish species...');
  const createdFish = [];
  for (const fish of fishData) {
    const created = await prisma.fish.create({ data: fish });
    createdFish.push(created);
  }
  console.log(`✅ Created ${createdFish.length} fish species`);

  // Create diving centers
  console.log('🏝️ Seeding diving centers...');
  for (const center of divingCenters) {
    await prisma.divingCenter.create({ data: center });
  }
  console.log(`✅ Created ${divingCenters.length} diving centers`);

  // Create sightings (randomly mark some fish as seen)
  console.log('👁️ Creating fish sightings...');
  let sightingCount = 0;
  for (let i = 0; i < createdFish.length; i++) {
    // 60% chance of having been seen
    if (Math.random() < 0.6) {
      const location = sightingLocations[Math.floor(Math.random() * sightingLocations.length)];
      await prisma.fishSighting.create({
        data: {
          fishId: createdFish[i].id,
          latitude: location.lat,
          longitude: location.lng,
          location: location.location,
          seen: true,
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
        }
      });
      sightingCount++;
    }
  }
  console.log(`✅ Created ${sightingCount} sightings`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
