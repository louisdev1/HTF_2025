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

// ==================== ANALYTICS ENDPOINTS ====================

// GET /api/analytics/timeline - Sightings over time
app.get('/api/analytics/timeline', async (req: Request, res: Response) => {
  try {
    const { period = 'week' } = req.query; // week, month, year

    const sightings = await prisma.fishSighting.findMany({
      orderBy: { timestamp: 'asc' },
      include: { fish: true }
    });

    // Group by date
    const grouped = sightings.reduce((acc: any, sighting) => {
      const date = new Date(sighting.timestamp).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, count: 0, common: 0, rare: 0, epic: 0 };
      }
      acc[date].count++;
      const rarity = sighting.fish.rarity.toLowerCase();
      if (acc[date][rarity] !== undefined) {
        acc[date][rarity]++;
      }
      return acc;
    }, {});

    res.json(Object.values(grouped));
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

// GET /api/analytics/progress - Overall completion progress
app.get('/api/analytics/progress', async (req: Request, res: Response) => {
  try {
    const totalFish = await prisma.fish.count();
    const allFish = await prisma.fish.findMany({
      include: { sightings: true }
    });

    const seenCount = allFish.filter(f => f.sightings.length > 0).length;
    const byRarity = {
      common: { total: 0, seen: 0 },
      rare: { total: 0, seen: 0 },
      epic: { total: 0, seen: 0 }
    };

    allFish.forEach(fish => {
      const rarity = fish.rarity.toLowerCase();
      if (byRarity[rarity as keyof typeof byRarity]) {
        byRarity[rarity as keyof typeof byRarity].total++;
        if (fish.sightings.length > 0) {
          byRarity[rarity as keyof typeof byRarity].seen++;
        }
      }
    });

    res.json({
      total: totalFish,
      seen: seenCount,
      unseen: totalFish - seenCount,
      percentage: Math.round((seenCount / totalFish) * 100),
      byRarity
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// GET /api/analytics/locations - Sighting locations heatmap
app.get('/api/analytics/locations', async (req: Request, res: Response) => {
  try {
    const sightings = await prisma.fishSighting.findMany({
      select: {
        latitude: true,
        longitude: true,
        location: true,
        fish: { select: { name: true, rarity: true } }
      }
    });

    res.json(sightings);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// ==================== ACHIEVEMENT ENDPOINTS ====================

// GET /api/achievements - Get all achievements
app.get('/api/achievements', async (req: Request, res: Response) => {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: [{ category: 'asc' }, { threshold: 'asc' }]
    });
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// GET /api/users/:userId/achievements - Get user's achievements
app.get('/api/users/:userId/achievements', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: parseInt(userId) },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' }
    });

    res.json(userAchievements);
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({ error: 'Failed to fetch user achievements' });
  }
});

// ==================== LEADERBOARD ENDPOINTS ====================

// GET /api/leaderboard - Get leaderboard
app.get('/api/leaderboard', async (req: Request, res: Response) => {
  try {
    const { period = 'alltime', limit = 100 } = req.query;

    // For demo purposes, generate mock leaderboard data
    // In production, this would query actual user data
    const mockUsers = [
      { id: 1, username: 'MarineExplorer', displayName: 'Marine Explorer', points: 2500, rank: 1, sightingCount: 25, avatarUrl: null },
      { id: 2, username: 'OceanMaster', displayName: 'Ocean Master', points: 2200, rank: 2, sightingCount: 23, avatarUrl: null },
      { id: 3, username: 'DeepDiver', displayName: 'Deep Diver', points: 1900, rank: 3, sightingCount: 20, avatarUrl: null },
      { id: 4, username: 'FishWatcher', displayName: 'Fish Watcher', points: 1600, rank: 4, sightingCount: 18, avatarUrl: null },
      { id: 5, username: 'CoralSeeker', displayName: 'Coral Seeker', points: 1400, rank: 5, sightingCount: 16, avatarUrl: null },
    ];

    res.json(mockUsers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// ==================== TEMPERATURE ENDPOINTS ====================

// GET /api/temperature - Get temperature readings
app.get('/api/temperature', async (req: Request, res: Response) => {
  try {
    const { minLat, maxLat, minLon, maxLon, depth } = req.query;

    let where: any = {};

    if (minLat && maxLat && minLon && maxLon) {
      where = {
        latitude: { gte: parseFloat(minLat as string), lte: parseFloat(maxLat as string) },
        longitude: { gte: parseFloat(minLon as string), lte: parseFloat(maxLon as string) }
      };
    }

    if (depth) {
      where.depth = parseInt(depth as string);
    }

    const readings = await prisma.temperatureReading.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 1000
    });

    res.json(readings);
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    res.status(500).json({ error: 'Failed to fetch temperature data' });
  }
});

// ==================== ACTIVITY FEED ENDPOINTS ====================

// GET /api/activity - Get global activity feed
app.get('/api/activity', async (req: Request, res: Response) => {
  try {
    const { limit = 50, userId } = req.query;

    // For demo purposes, generate mock activity data
    const activities = [
      {
        id: 1,
        userId: 1,
        type: 'sighting',
        message: 'spotted a Great White Shark',
        user: { username: 'MarineExplorer', displayName: 'Marine Explorer', avatarUrl: null },
        sighting: { fish: { name: 'Great White Shark', rarity: 'Epic' } },
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
      },
      {
        id: 2,
        userId: 2,
        type: 'achievement',
        message: 'unlocked "Ocean Master" achievement',
        user: { username: 'OceanMaster', displayName: 'Ocean Master', avatarUrl: null },
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
      },
      {
        id: 3,
        userId: 3,
        type: 'sighting',
        message: 'spotted a Manta Ray',
        user: { username: 'DeepDiver', displayName: 'Deep Diver', avatarUrl: null },
        sighting: { fish: { name: 'Manta Ray', rarity: 'Rare' } },
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      }
    ];

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    res.status(500).json({ error: 'Failed to fetch activity feed' });
  }
});

// ==================== FRIEND SYSTEM ENDPOINTS ====================

// GET /api/friends - Get user's friends
app.get('/api/friends', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // For demo purposes, return mock friends data
    const friends = [
      { id: 2, username: 'OceanMaster', displayName: 'Ocean Master', points: 2200, avatarUrl: null, status: 'accepted' },
      { id: 3, username: 'DeepDiver', displayName: 'Deep Diver', points: 1900, avatarUrl: null, status: 'accepted' },
    ];

    res.json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

// POST /api/friends/request - Send friend request
app.post('/api/friends/request', async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: 'senderId and receiverId are required' });
    }

    // For demo purposes, return success
    res.json({ message: 'Friend request sent', status: 'pending' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

// ==================== NOTIFICATION ENDPOINTS ====================

// GET /api/notifications - Get user notifications
app.get('/api/notifications', async (req: Request, res: Response) => {
  try {
    const { userId, unreadOnly } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // For demo purposes, return mock notifications
    const notifications = [
      {
        id: 1,
        type: 'achievement',
        message: 'You unlocked "First Catch" achievement!',
        isRead: false,
        link: '/achievements',
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString()
      },
      {
        id: 2,
        type: 'friend_request',
        message: 'DeepDiver sent you a friend request',
        isRead: false,
        link: '/friends',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      }
    ];

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PATCH /api/notifications/:id/read - Mark notification as read
app.patch('/api/notifications/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // For demo purposes, return success
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// ==================== AI CHAT ASSISTANT ENDPOINT ====================

// POST /api/chat - AI Chat Assistant
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    // Get all fish data for context
    const allFish = await prisma.fish.findMany({
      include: {
        sightings: {
          orderBy: { timestamp: 'desc' },
          take: 5
        }
      }
    });

    // Get recent sightings for context
    const recentSightings = await prisma.fishSighting.findMany({
      include: { fish: true },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    // Build context about fish database
    const fishContext = allFish.map(f => ({
      name: f.name,
      scientificName: f.scientificName,
      description: f.description,
      habitat: f.habitat,
      rarity: f.rarity,
      size: f.size,
      depth: `${f.minDepth}-${f.maxDepth}m`,
      sightingCount: f.sightings.length
    }));

    // Build system prompt
    const systemPrompt = `You are an AI marine biology assistant for Fishy Dex, a fish tracking application. You help users learn about fish species, find diving locations, and track their sightings.

Your knowledge base includes ${allFish.length} fish species. You can:
1. Answer questions about specific fish species (characteristics, habitat, size, rarity)
2. Suggest where to find certain fish based on their habitat
3. Provide interesting facts about marine life
4. Help users understand their sighting statistics
5. Respond to voice commands like "log a sighting" or "show me rare fish"

Fish database: ${JSON.stringify(fishContext, null, 2)}

Recent sightings: ${recentSightings.map(s => `${s.fish.name} at ${s.location}`).join(', ')}

Be friendly, informative, and enthusiastic about marine life! Keep responses concise (2-3 sentences max unless detailed explanation is needed).

If the user asks to "log a sighting" or similar action commands, respond with a JSON object: {"action": "log_sighting", "message": "your response"}
If asking to "show rare fish" or filter requests, respond with: {"action": "filter_fish", "filter": "rare", "message": "your response"}`;

    // Build messages array
    const messages: any[] = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      messages.push(...conversationHistory);
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    // Call OpenRouter AI
    const result = await generateText({
      model: openrouter('meta-llama/llama-3.2-3b-instruct:free'),
      messages,
      maxTokens: 500,
    });

    // Parse response for actions
    let response = result.text;
    let action = null;
    let actionData = null;

    // Check if response contains action JSON
    try {
      if (response.includes('"action"')) {
        const jsonMatch = response.match(/\{[^}]*"action"[^}]*\}/);
        if (jsonMatch) {
          const actionObj = JSON.parse(jsonMatch[0]);
          action = actionObj.action;
          actionData = actionObj;
          response = actionObj.message || response;
        }
      }
    } catch (parseError) {
      // If JSON parsing fails, just use the text response
    }

    res.json({
      response,
      action,
      actionData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// ==================== AI FISH IDENTIFICATION ENDPOINT ====================

// POST /api/identify-fish - AI Fish Identification
app.post('/api/identify-fish', upload.single('photo'), async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Photo is required' });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    // Get all fish for matching
    const allFish = await prisma.fish.findMany();

    // Read the image file as base64
    const imageBuffer = fs.readFileSync(file.path);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = file.mimetype;

    // Create fish list for AI
    const fishList = allFish.map(f => `${f.name} (${f.scientificName}) - ${f.rarity}`).join('\n');

    // Use OpenRouter AI to identify the fish
    const result = await generateText({
      model: openrouter('meta-llama/llama-3.2-11b-vision-instruct:free'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a marine biology expert. Analyze this image and identify the fish species.

Our fish catalog includes:
${fishList}

Respond with ONLY a JSON object in this exact format:
{
  "identified": true/false,
  "fishName": "exact name from catalog or best guess",
  "scientificName": "scientific name if known",
  "confidence": 0.0-1.0,
  "matchedCatalog": true/false (true if it matches our catalog),
  "catalogFishId": null or the ID if matched,
  "reasoning": "brief explanation of identification",
  "characteristics": ["list", "of", "visible", "features"]
}

Be accurate and conservative with confidence scores.`
            },
            {
              type: 'image',
              image: `data:${mimeType};base64,${base64Image}`
            }
          ]
        }
      ],
      maxTokens: 500,
    });

    // Parse AI response
    let identification;
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        identification = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', result.text);
      identification = {
        identified: false,
        fishName: 'Unknown',
        confidence: 0,
        matchedCatalog: false,
        reasoning: 'Failed to identify fish from image',
        characteristics: []
      };
    }

    // Try to match with our catalog
    let matchedFish = null;
    if (identification.fishName) {
      const fishNameLower = identification.fishName.toLowerCase();
      matchedFish = allFish.find(f =>
        f.name.toLowerCase().includes(fishNameLower) ||
        fishNameLower.includes(f.name.toLowerCase()) ||
        f.scientificName.toLowerCase() === (identification.scientificName || '').toLowerCase()
      );

      if (matchedFish) {
        identification.matchedCatalog = true;
        identification.catalogFishId = matchedFish.id;
        identification.catalogFish = {
          id: matchedFish.id,
          name: matchedFish.name,
          scientificName: matchedFish.scientificName,
          rarity: matchedFish.rarity,
          habitat: matchedFish.habitat,
          imageUrl: matchedFish.imageUrl
        };
      }
    }

    // Clean up the uploaded file
    fs.unlinkSync(file.path);

    res.json({
      ...identification,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error identifying fish:', error);
    res.status(500).json({ error: 'Failed to identify fish' });
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
