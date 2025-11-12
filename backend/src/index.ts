import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';
import type { Stats } from './types';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5555;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'fish-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

// Initialize OpenRouter client
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

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

// POST /api/sightings - Create a new sighting with photo
app.post('/api/sightings', upload.single('photo'), async (req: Request, res: Response) => {
  try {
    const { fishId, latitude, longitude, location } = req.body;
    const file = req.file;

    if (!fishId || !latitude || !longitude) {
      return res.status(400).json({ error: 'fishId, latitude, and longitude are required' });
    }

    // Check if fish exists
    const fish = await prisma.fish.findUnique({
      where: { id: parseInt(fishId) }
    });

    if (!fish) {
      return res.status(404).json({ error: 'Fish not found' });
    }

    let photoUrl = null;
    let aiConfidence = null;
    let verified = false;

    // If photo is uploaded, verify it with AI
    if (file && process.env.OPENROUTER_API_KEY) {
      photoUrl = `/uploads/${file.filename}`;

      try {
        // Read the image file as base64
        const imageBuffer = fs.readFileSync(file.path);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = file.mimetype;

        // Use OpenRouter AI to verify the fish
        const result = await generateText({
          model: openrouter('meta-llama/llama-3.2-11b-vision-instruct:free'),
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this image and determine if it contains a "${fish.name}" (${fish.scientificName}).
                  Respond with ONLY a JSON object in this exact format: {"contains_fish": true/false, "confidence": 0.0-1.0, "reasoning": "brief explanation"}
                  Be strict - only return true if you're confident this is the correct species.`
                },
                {
                  type: 'image',
                  image: `data:${mimeType};base64,${base64Image}`
                }
              ]
            }
          ],
          maxTokens: 200,
        });

        // Parse AI response
        try {
          const aiResponse = JSON.parse(result.text);
          aiConfidence = aiResponse.confidence || 0;
          verified = aiResponse.contains_fish && aiConfidence >= 0.6; // 60% threshold
        } catch (parseError) {
          console.error('Failed to parse AI response:', result.text);
          aiConfidence = 0;
          verified = false;
        }
      } catch (aiError) {
        console.error('AI verification failed:', aiError);
        // Continue without verification if AI fails
      }
    }

    // Create the sighting
    const sighting = await prisma.fishSighting.create({
      data: {
        fishId: parseInt(fishId),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        location: location || 'Unknown Location',
        photoUrl,
        aiConfidence,
        verified,
        seen: true,
        timestamp: new Date()
      },
      include: {
        fish: true
      }
    });

    res.json(sighting);
  } catch (error) {
    console.error('Error creating sighting:', error);
    res.status(500).json({ error: 'Failed to create sighting' });
  }
});

// POST /api/sightings/verify - Verify a photo against a fish species
app.post('/api/sightings/verify', upload.single('photo'), async (req: Request, res: Response) => {
  try {
    const { fishId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Photo is required' });
    }

    if (!fishId) {
      return res.status(400).json({ error: 'fishId is required' });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'AI verification not configured' });
    }

    // Get fish details
    const fish = await prisma.fish.findUnique({
      where: { id: parseInt(fishId) }
    });

    if (!fish) {
      return res.status(404).json({ error: 'Fish not found' });
    }

    // Read the image file as base64
    const imageBuffer = fs.readFileSync(file.path);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = file.mimetype;

    // Use OpenRouter AI to verify the fish
    const result = await generateText({
      model: openrouter('meta-llama/llama-3.2-11b-vision-instruct:free'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image and determine if it contains a "${fish.name}" (${fish.scientificName}).
              Respond with ONLY a JSON object in this exact format: {"contains_fish": true/false, "confidence": 0.0-1.0, "reasoning": "brief explanation"}
              Be strict - only return true if you're confident this is the correct species.`
            },
            {
              type: 'image',
              image: `data:${mimeType};base64,${base64Image}`
            }
          ]
        }
      ],
      maxTokens: 200,
    });

    // Parse AI response
    let verification;
    try {
      verification = JSON.parse(result.text);
    } catch (parseError) {
      console.error('Failed to parse AI response:', result.text);
      verification = {
        contains_fish: false,
        confidence: 0,
        reasoning: 'Failed to parse AI response'
      };
    }

    // Clean up the uploaded file
    fs.unlinkSync(file.path);

    res.json({
      verified: verification.contains_fish && verification.confidence >= 0.6,
      confidence: verification.confidence,
      reasoning: verification.reasoning,
      threshold: 0.6
    });
  } catch (error) {
    console.error('Error verifying photo:', error);
    res.status(500).json({ error: 'Failed to verify photo' });
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
