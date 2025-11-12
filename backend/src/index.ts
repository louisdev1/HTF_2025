import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Fish Catalogue API is running' });
});

// GET all fish with optional search and filter
app.get('/api/fish', async (req: Request, res: Response) => {
  try {
    const { search, filter } = req.query;

    let where: any = {};

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { scientificName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (filter === 'seen') {
      where.seen = true;
    } else if (filter === 'unseen') {
      where.seen = false;
    }

    const fish = await prisma.fish.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    res.json(fish);
  } catch (error) {
    console.error('Error fetching fish:', error);
    res.status(500).json({ error: 'Failed to fetch fish' });
  }
});

// GET single fish by ID
app.get('/api/fish/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fish = await prisma.fish.findUnique({
      where: { id: parseInt(id) }
    });

    if (!fish) {
      return res.status(404).json({ error: 'Fish not found' });
    }

    res.json(fish);
  } catch (error) {
    console.error('Error fetching fish:', error);
    res.status(500).json({ error: 'Failed to fetch fish' });
  }
});

// PATCH toggle seen status
app.patch('/api/fish/:id/seen', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { seen } = req.body;

    if (typeof seen !== 'boolean') {
      return res.status(400).json({ error: 'seen must be a boolean' });
    }

    const fish = await prisma.fish.update({
      where: { id: parseInt(id) },
      data: { seen }
    });

    res.json(fish);
  } catch (error) {
    console.error('Error updating fish:', error);
    res.status(500).json({ error: 'Failed to update fish' });
  }
});

// GET statistics
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const total = await prisma.fish.count();
    const seen = await prisma.fish.count({ where: { seen: true } });
    const unseen = total - seen;
    const percentageSeen = total > 0 ? Math.round((seen / total) * 100) : 0;

    res.json({
      total,
      seen,
      unseen,
      percentageSeen
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// POST seed database (optional endpoint)
app.post('/api/seed', async (req: Request, res: Response) => {
  try {
    const count = await prisma.fish.count();
    if (count > 0) {
      return res.json({ message: 'Database already seeded', count });
    }

    const { seedFish } = await import('./seed');
    await seedFish();

    const newCount = await prisma.fish.count();
    res.json({ message: 'Database seeded successfully', count: newCount });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🐟 Fish Catalogue API running on http://localhost:${PORT}`);
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
