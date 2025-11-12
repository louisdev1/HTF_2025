import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fishData = [
  {
    name: 'Clownfish',
    scientificName: 'Amphiprioninae',
    description: 'A small, colorful fish that lives among sea anemones in coral reefs. Made famous by the movie Finding Nemo, these fish have a symbiotic relationship with their anemone hosts.',
    imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800',
    habitat: 'Coral Reefs, Indo-Pacific',
    size: '7-11 cm',
    seen: false
  },
  {
    name: 'Blue Tang',
    scientificName: 'Paracanthurus hepatus',
    description: 'A vibrant blue fish with a yellow tail, commonly found in coral reefs. Also known as Dory from Finding Nemo, these fish are popular in marine aquariums.',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    habitat: 'Coral Reefs, Indo-Pacific',
    size: '20-30 cm',
    seen: false
  },
  {
    name: 'Great White Shark',
    scientificName: 'Carcharodon carcharias',
    description: 'One of the ocean\'s apex predators, known for its size, power, and distinctive white underbelly. These magnificent creatures can detect a single drop of blood in an Olympic-sized pool.',
    imageUrl: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=800',
    habitat: 'Coastal Waters Worldwide',
    size: '4-6 meters',
    seen: false
  },
  {
    name: 'Manta Ray',
    scientificName: 'Manta birostris',
    description: 'A graceful giant that glides through the ocean with wingspans up to 7 meters. Despite their size, they are gentle filter feeders that eat tiny plankton.',
    imageUrl: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=800',
    habitat: 'Tropical and Subtropical Waters',
    size: '4-7 meters wingspan',
    seen: false
  },
  {
    name: 'Lionfish',
    scientificName: 'Pterois volitans',
    description: 'A striking but venomous fish with elaborate fins and bold stripes. While beautiful, they are invasive in some regions and their venomous spines can deliver a painful sting.',
    imageUrl: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=800',
    habitat: 'Indo-Pacific Reefs',
    size: '30-40 cm',
    seen: false
  },
  {
    name: 'Seahorse',
    scientificName: 'Hippocampus',
    description: 'A unique fish where males carry the babies in a special pouch. They swim upright and use their prehensile tails to anchor themselves to seagrass and coral.',
    imageUrl: 'https://images.unsplash.com/photo-1559081965-c3f1143f9dde?w=800',
    habitat: 'Shallow Tropical and Temperate Waters',
    size: '2-35 cm',
    seen: false
  },
  {
    name: 'Angelfish',
    scientificName: 'Pomacanthidae',
    description: 'Colorful reef fish known for their compressed bodies and vibrant patterns. They graze on algae and sponges, and juveniles often have different colors than adults.',
    imageUrl: 'https://images.unsplash.com/photo-1520990269408-c88b6eea14e0?w=800',
    habitat: 'Tropical Coral Reefs',
    size: '15-60 cm',
    seen: false
  },
  {
    name: 'Pufferfish',
    scientificName: 'Tetraodontidae',
    description: 'Famous for inflating into a ball when threatened, these fish contain a powerful toxin called tetrodotoxin. Despite the danger, they are considered a delicacy in Japan.',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
    habitat: 'Tropical and Subtropical Waters',
    size: '2.5-61 cm',
    seen: false
  },
  {
    name: 'Moorish Idol',
    scientificName: 'Zanclus cornutus',
    description: 'A distinctive reef fish with a long dorsal fin and bold black, white, and yellow bands. They are common in coral reefs but difficult to keep in aquariums.',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800',
    habitat: 'Indo-Pacific Reefs',
    size: '18-23 cm',
    seen: false
  },
  {
    name: 'Barracuda',
    scientificName: 'Sphyraena',
    description: 'A sleek, torpedo-shaped predator with razor-sharp teeth. They are fast swimmers capable of sudden bursts of speed to catch prey.',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
    habitat: 'Tropical and Subtropical Oceans',
    size: '50-200 cm',
    seen: false
  },
  {
    name: 'Butterflyfish',
    scientificName: 'Chaetodontidae',
    description: 'Colorful reef fish that often swim in pairs. They have elongated snouts perfect for picking food from crevices in coral reefs.',
    imageUrl: 'https://images.unsplash.com/photo-1563281746-6f6cf5c281e1?w=800',
    habitat: 'Coral Reefs Worldwide',
    size: '12-22 cm',
    seen: false
  },
  {
    name: 'Hammerhead Shark',
    scientificName: 'Sphyrna',
    description: 'Distinctive shark with a flattened, hammer-shaped head that enhances their ability to find prey using electroreception. They often hunt in schools during the day.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    habitat: 'Coastal Waters, Tropical',
    size: '3-6 meters',
    seen: false
  },
  {
    name: 'Triggerfish',
    scientificName: 'Balistidae',
    description: 'Bold and sometimes aggressive fish with a special dorsal spine they can lock into place. They have powerful jaws capable of crushing shells.',
    imageUrl: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800',
    habitat: 'Tropical and Subtropical Reefs',
    size: '20-75 cm',
    seen: false
  },
  {
    name: 'Parrotfish',
    scientificName: 'Scaridae',
    description: 'Colorful fish with beak-like teeth used to scrape algae from coral. They produce much of the sand on tropical beaches by excreting ground-up coral.',
    imageUrl: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800',
    habitat: 'Tropical Coral Reefs',
    size: '30-120 cm',
    seen: false
  },
  {
    name: 'Moray Eel',
    scientificName: 'Muraenidae',
    description: 'Snake-like fish that hide in crevices with only their heads visible. They have a second set of jaws in their throat to help swallow prey.',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
    habitat: 'Tropical and Temperate Waters',
    size: '1-4 meters',
    seen: false
  },
  {
    name: 'Whale Shark',
    scientificName: 'Rhincodon typus',
    description: 'The largest fish in the ocean, growing up to 18 meters long. Despite their size, they are gentle giants that filter feed on plankton and small fish.',
    imageUrl: 'https://images.unsplash.com/photo-1564731071754-003816e39144?w=800',
    habitat: 'Tropical Oceans Worldwide',
    size: '5.5-18 meters',
    seen: false
  },
  {
    name: 'Grouper',
    scientificName: 'Epinephelinae',
    description: 'Large, slow-moving predatory fish that often lurk in caves and ledges. Some species can grow to over 2 meters and live for 50+ years.',
    imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800',
    habitat: 'Coral and Rocky Reefs',
    size: '30-270 cm',
    seen: false
  },
  {
    name: 'Royal Gramma',
    scientificName: 'Gramma loreto',
    description: 'A small, vibrant fish with purple and yellow coloring. They are peaceful fish that swim upside down under ledges in the wild.',
    imageUrl: 'https://images.unsplash.com/photo-1563281746-6f6cf5c281e1?w=800',
    habitat: 'Caribbean Reefs',
    size: '6-8 cm',
    seen: false
  },
  {
    name: 'Surgeonfish',
    scientificName: 'Acanthuridae',
    description: 'Named for the sharp, scalpel-like spines on their tails used for defense. They are herbivores that play a vital role in controlling algae on reefs.',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    habitat: 'Tropical Reefs',
    size: '15-40 cm',
    seen: false
  },
  {
    name: 'Mandarin Fish',
    scientificName: 'Synchiropus splendidus',
    description: 'One of the most colorful fish in the ocean with psychedelic blue, orange, and green patterns. They lack scales and instead secrete a toxic mucus for protection.',
    imageUrl: 'https://images.unsplash.com/photo-1520990269408-c88b6eea14e0?w=800',
    habitat: 'Western Pacific Reefs',
    size: '6-8 cm',
    seen: false
  },
  {
    name: 'Stingray',
    scientificName: 'Dasyatidae',
    description: 'Flat-bodied fish with a venomous barb on their tail. They spend much of their time buried in sand, hunting for mollusks and crustaceans.',
    imageUrl: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=800',
    habitat: 'Coastal and Freshwater Worldwide',
    size: '30-200 cm',
    seen: false
  },
  {
    name: 'Bannerfish',
    scientificName: 'Heniochus',
    description: 'Elegant fish with tall dorsal fins and distinctive black and white stripes. They often form pairs or small groups around coral reefs.',
    imageUrl: 'https://images.unsplash.com/photo-1559081965-c3f1143f9dde?w=800',
    habitat: 'Indo-Pacific Reefs',
    size: '15-25 cm',
    seen: false
  },
  {
    name: 'Octopus',
    scientificName: 'Octopoda',
    description: 'Highly intelligent cephalopod with eight arms and the ability to change color instantly. They can squeeze through tiny spaces and solve complex puzzles.',
    imageUrl: 'https://images.unsplash.com/photo-1545671913-b89de5ab6988?w=800',
    habitat: 'Oceans Worldwide',
    size: '30-90 cm',
    seen: false
  },
  {
    name: 'Jellyfish',
    scientificName: 'Medusozoa',
    description: 'Ancient creatures that have existed for over 500 million years. They drift through the ocean using pulsating bells and trailing tentacles.',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    habitat: 'Oceans Worldwide',
    size: '1-200 cm',
    seen: false
  },
  {
    name: 'Flying Fish',
    scientificName: 'Exocoetidae',
    description: 'Fish that can leap out of the water and glide for hundreds of meters using their enlarged pectoral fins. They do this to escape predators.',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800',
    habitat: 'Tropical and Subtropical Oceans',
    size: '15-50 cm',
    seen: false
  }
];

export async function seedFish() {
  console.log('🌱 Starting database seed...');

  for (const fish of fishData) {
    await prisma.fish.create({
      data: fish
    });
  }

  console.log(`✅ Seeded ${fishData.length} fish records`);
}

async function main() {
  try {
    await seedFish();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
