import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import type { Stats } from './types';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5555;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Fishy Dex API is running' });
});

// GET /api/fish - Get all fish with optional filters
app.get('/api/fish', async (req: Request, res: Response) => {
  try {
    const { search, filter, rarity } = req.query;

    // Get all fish with sightings
    const allFish = await prisma.fish.findMany({
      include: {
        sightings: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
      orderBy: { name: 'asc' }
    });

    // Enrich fish with seen status
    let fish = allFish.map(f => ({
      ...f,
      seen: f.sightings.length > 0 && f.sightings[0].seen,
      lastSeen: f.sightings.length > 0 ? f.sightings[0].timestamp : null,
      sightingCount: f.sightings.length
    }));

    // Apply search filter
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      fish = fish.filter(f =>
        f.name.toLowerCase().includes(searchLower) ||
        f.scientificName.toLowerCase().includes(searchLower) ||
        f.description.toLowerCase().includes(searchLower) ||
        f.habitat.toLowerCase().includes(searchLower)
      );
    }

    // Apply seen/unseen filter
    if (filter === 'seen') {
      fish = fish.filter(f => f.seen);
    } else if (filter === 'unseen') {
      fish = fish.filter(f => !f.seen);
    }

    // Apply rarity filter
    if (rarity && typeof rarity === 'string') {
      fish = fish.filter(f => f.rarity.toLowerCase() === rarity.toLowerCase());
    }

    res.json(fish);
  } catch (error) {
    console.error('Error fetching fish:', error);
    res.status(500).json({ error: 'Failed to fetch fish' });
  }
});

// GET /api/fish/:id - Get single fish by ID
app.get('/api/fish/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fish = await prisma.fish.findUnique({
      where: { id: parseInt(id) },
      include: {
        sightings: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    if (!fish) {
      return res.status(404).json({ error: 'Fish not found' });
    }

    // Enrich with seen status
    const enrichedFish = {
      ...fish,
      seen: fish.sightings.length > 0 && fish.sightings[0].seen,
      lastSeen: fish.sightings.length > 0 ? fish.sightings[0].timestamp : null,
      sightingCount: fish.sightings.length
    };

    res.json(enrichedFish);
  } catch (error) {
    console.error('Error fetching fish:', error);
    res.status(500).json({ error: 'Failed to fetch fish' });
  }
});

// PATCH /api/fish/:id/seen - Toggle seen status
app.patch('/api/fish/:id/seen', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { seen, latitude, longitude, location } = req.body;

    if (typeof seen !== 'boolean') {
      return res.status(400).json({ error: 'seen must be a boolean' });
    }

    const fishId = parseInt(id);

    // Check if fish exists
    const fish = await prisma.fish.findUnique({ where: { id: fishId } });
    if (!fish) {
      return res.status(404).json({ error: 'Fish not found' });
    }

    if (seen) {
      // Create a new sighting
      await prisma.fishSighting.create({
        data: {
          fishId,
          latitude: latitude || 0,
          longitude: longitude || 0,
          location: location || 'Unknown Location',
          seen: true,
          timestamp: new Date()
        }
      });
    } else {
      // Remove all sightings for this fish
      await prisma.fishSighting.deleteMany({
        where: { fishId }
      });
    }

    // Return updated fish
    const updatedFish = await prisma.fish.findUnique({
      where: { id: fishId },
      include: {
        sightings: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    });

    const enrichedFish = {
      ...updatedFish,
      seen: updatedFish!.sightings.length > 0,
      lastSeen: updatedFish!.sightings.length > 0 ? updatedFish!.sightings[0].timestamp : null,
      sightingCount: updatedFish!.sightings.length
    };

    res.json(enrichedFish);
  } catch (error) {
    console.error('Error updating fish:', error);
    res.status(500).json({ error: 'Failed to update fish' });
  }
});

// GET /api/stats - Get statistics
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const allFish = await prisma.fish.findMany({
      include: {
        sightings: true
      }
    });

    const total = allFish.length;
    const seen = allFish.filter(f => f.sightings.length > 0).length;
    const unseen = total - seen;
    const percentageSeen = total > 0 ? Math.round((seen / total) * 100) : 0;

    // Calculate by rarity
    const byRarity = {
      common: {
        total: allFish.filter(f => f.rarity === 'Common').length,
        seen: allFish.filter(f => f.rarity === 'Common' && f.sightings.length > 0).length
      },
      rare: {
        total: allFish.filter(f => f.rarity === 'Rare').length,
        seen: allFish.filter(f => f.rarity === 'Rare' && f.sightings.length > 0).length
      },
      epic: {
        total: allFish.filter(f => f.rarity === 'Epic').length,
        seen: allFish.filter(f => f.rarity === 'Epic' && f.sightings.length > 0).length
      }
    };

    const stats: Stats = {
      total,
      seen,
      unseen,
      percentageSeen,
      byRarity
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/diving-centers - Get all diving centers
app.get('/api/diving-centers', async (req: Request, res: Response) => {
  try {
    const centers = await prisma.divingCenter.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(centers);
  } catch (error) {
    console.error('Error fetching diving centers:', error);
    res.status(500).json({ error: 'Failed to fetch diving centers' });
  }
});

// GET /api/sightings - Get all sightings with fish data
app.get('/api/sightings', async (req: Request, res: Response) => {
  try {
    const sightings = await prisma.fishSighting.findMany({
      include: {
        fish: true
      },
      orderBy: { timestamp: 'desc' }
    });
    res.json(sightings);
  } catch (error) {
    console.error('Error fetching sightings:', error);
    res.status(500).json({ error: 'Failed to fetch sightings' });
  }
});

// POST /api/seed - Manual seed trigger (optional)
app.post('/api/seed', async (req: Request, res: Response) => {
  try {
    const count = await prisma.fish.count();
    if (count > 0) {
      return res.json({ message: 'Database already seeded', count });
    }

    res.json({ message: 'Please run: npm run seed' });
  } catch (error) {
    console.error('Error checking seed:', error);
    res.status(500).json({ error: 'Failed to check seed status' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🐠 Fishy Dex API running on http://localhost:${PORT}`);
  console.log(`🌊 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
