import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌊 Seeding achievements...');

  // Define achievements
  const achievements = [
    // Milestone achievements
    { name: 'First Catch', description: 'Spot your first fish', icon: '🐠', category: 'milestone', threshold: 1, points: 10 },
    { name: 'Getting Started', description: 'Spot 5 different fish', icon: '🌊', category: 'milestone', threshold: 5, points: 25 },
    { name: 'Marine Explorer', description: 'Spot 10 different fish', icon: '🐡', category: 'milestone', threshold: 10, points: 50 },
    { name: 'Ocean Master', description: 'Spot 25 different fish', icon: '🦈', category: 'milestone', threshold: 25, points: 100 },

    // Rarity achievements
    { name: 'Rare Find', description: 'Spot a rare fish', icon: '✨', category: 'rarity', threshold: 1, points: 30 },
    { name: 'Epic Discovery', description: 'Spot an epic fish', icon: '💎', category: 'rarity', threshold: 1, points: 50 },
    { name: 'Rarity Hunter', description: 'Spot 5 rare or epic fish', icon: '🔍', category: 'rarity', threshold: 5, points: 75 },
    { name: 'Legend Seeker', description: 'Spot all epic fish', icon: '👑', category: 'rarity', threshold: 5, points: 150 },

    // Photo achievements
    { name: 'Photographer', description: 'Upload your first photo', icon: '📸', category: 'milestone', threshold: 1, points: 15 },
    { name: 'AI Verified', description: 'Get an AI-verified sighting', icon: '🤖', category: 'milestone', threshold: 1, points: 25 },
    { name: 'Paparazzi', description: 'Upload 10 photos', icon: '📷', category: 'milestone', threshold: 10, points: 60 },

    // Social achievements
    { name: 'Social Butterfly', description: 'Add your first friend', icon: '👥', category: 'social', threshold: 1, points: 20 },
    { name: 'Popular', description: 'Have 5 friends', icon: '🌟', category: 'social', threshold: 5, points: 50 },
    { name: 'Community Leader', description: 'Have 10 friends', icon: '🏆', category: 'social', threshold: 10, points: 100 },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement
    });
  }

  console.log(`✅ Created ${achievements.length} achievements`);

  // Seed temperature data (simulated global ocean temperatures)
  console.log('🌡️ Seeding temperature data...');

  const temperaturePoints = [
    // Tropical waters
    { latitude: 25.0, longitude: -80.0, temperature: 26.5, depth: 10 }, // Caribbean
    { latitude: -8.0, longitude: 115.0, temperature: 28.0, depth: 10 }, // Bali
    { latitude: -18.0, longitude: 147.0, temperature: 27.0, depth: 10 }, // Great Barrier Reef
    { latitude: 7.0, longitude: 134.0, temperature: 29.0, depth: 10 }, // Palau
    { latitude: 21.0, longitude: -157.0, temperature: 25.5, depth: 10 }, // Hawaii

    // Temperate waters
    { latitude: 36.0, longitude: -122.0, temperature: 14.0, depth: 10 }, // California
    { latitude: 41.0, longitude: -70.0, temperature: 16.0, depth: 10 }, // Cape Cod
    { latitude: 35.0, longitude: 139.0, temperature: 18.0, depth: 10 }, // Tokyo Bay
    { latitude: -33.0, longitude: 18.0, temperature: 17.0, depth: 10 }, // Cape Town
    { latitude: -37.0, longitude: 144.0, temperature: 15.0, depth: 10 }, // Melbourne

    // Cold waters
    { latitude: 60.0, longitude: -1.0, temperature: 8.0, depth: 10 }, // Scotland
    { latitude: 64.0, longitude: -21.0, temperature: 6.0, depth: 10 }, // Iceland
    { latitude: -60.0, longitude: -45.0, temperature: 2.0, depth: 10 }, // Antarctic
    { latitude: 71.0, longitude: -156.0, temperature: 1.0, depth: 10 }, // Arctic

    // Deep waters (cooler)
    { latitude: 25.0, longitude: -80.0, temperature: 22.0, depth: 50 },
    { latitude: 25.0, longitude: -80.0, temperature: 18.0, depth: 100 },
    { latitude: -18.0, longitude: 147.0, temperature: 23.0, depth: 50 },
    { latitude: -18.0, longitude: 147.0, temperature: 19.0, depth: 100 },
  ];

  for (const point of temperaturePoints) {
    await prisma.temperatureReading.create({
      data: {
        latitude: point.latitude,
        longitude: point.longitude,
        temperature: point.temperature,
        depth: point.depth,
        source: 'simulated'
      }
    });
  }

  console.log(`✅ Created ${temperaturePoints.length} temperature readings`);

  console.log('🎉 Social/Gamification seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
