# 🐟 Fishy Dex - Your Aquatic Species Catalog

A comprehensive, professional fish tracking application built with modern web technologies. Track, discover, and catalog ocean fish species with an intuitive interface featuring colored vs grayscale visual states for seen/unseen species.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)

## 📋 Overview

Fishy Dex is a full-stack application that serves as your personal aquatic species catalog. The application features:
- **Visual differentiation**: Spotted fish appear in full color, unspotted fish appear in grayscale
- **Comprehensive database**: 25 pre-seeded fish species with complete metadata
- **Real-time tracking**: Toggle seen/unseen status with persistent storage
- **Interactive map**: View sighting locations on an integrated map
- **Statistics dashboard**: Track your progress with detailed analytics
- **Rarity system**: Fish categorized as Common, Rare, or Epic

## ✨ Features Implemented

### Core Functionality
✅ **Dashboard Page** (`/`)
- Total species count
- Spotted vs unspotted statistics
- Completion percentage
- Progress visualization chart
- Rarity-based breakdown (Common, Rare, Epic)

✅ **Fish Catalog** (`/catalog`)
- Responsive grid layout
- Search by name, scientific name, habitat, or description
- Filter: All / Spotted / Unspotted
- Rarity filter: All / Common / Rare / Epic
- **Visual states**: Spotted fish in color, unspotted fish grayscale

✅ **Fish Detail Page** (`/fish/[id]`)
- Large hero image
- Complete species information
- Rarity badge
- Habitat, size, and depth range
- **Toggle button** to mark as spotted/unspotted
- Last spotted timestamp
- Sighting count

✅ **Map View** (`/map`)
- Visual representation of fish sightings
- Recent sightings list with locations
- Geographic distribution overview

### Technical Features
✅ TypeScript throughout entire codebase
✅ RESTful API with Express.js
✅ SQLite database with Prisma ORM
✅ Automatic database seeding
✅ Client-side state management
✅ Loading states with spinners
✅ Error handling with retry options
✅ Empty state designs
✅ Responsive design (mobile, tablet, desktop)
✅ Professional ocean-themed UI
✅ Hover effects and transitions
✅ Image optimization

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express 5
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: SQLite (local file)
- **CORS**: Enabled for localhost

### Frontend
- **Framework**: Next.js 15 (App Router)
- **React**: 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Image Optimization**: Next.js Image
- **Map**: MapLibre GL (basic implementation)

## 📁 Project Structure

```
HTF_2025/
│
├── backend/                          # Express API Server
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   └── seed.ts                  # Seed 25 fish species
│   ├── src/
│   │   ├── index.ts                 # Express server + API routes
│   │   └── types.ts                 # TypeScript interfaces
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                         # Next.js Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── page.tsx             # Dashboard
│   │   │   ├── globals.css          # Global styles
│   │   │   ├── catalog/
│   │   │   │   └── page.tsx         # Fish catalog
│   │   │   ├── fish/[id]/
│   │   │   │   └── page.tsx         # Fish details
│   │   │   └── map/
│   │   │       └── page.tsx         # Map view
│   │   ├── components/
│   │   │   ├── Navigation.tsx       # Top navigation
│   │   │   ├── FishCard.tsx         # Fish card component
│   │   │   ├── FishGrid.tsx         # Grid layout
│   │   │   ├── SearchFilter.tsx     # Search & filters
│   │   │   ├── StatsCard.tsx        # Stat display
│   │   │   ├── ProgressChart.tsx    # Progress bar
│   │   │   ├── MapView.tsx          # Map component
│   │   │   ├── LoadingSpinner.tsx   # Loading state
│   │   │   └── ErrorMessage.tsx     # Error state
│   │   ├── lib/
│   │   │   └── api.ts               # API client
│   │   └── types/
│   │       └── api.ts               # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.ts
│
└── README.md
```

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager
- Git

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd "C:\Users\louis\OneDrive - Thomas More\Thomas-More\Semester_5\HTF_2025\backend"
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file**:
```bash
copy .env.example .env
```

4. **Generate Prisma client**:
```bash
npx prisma generate
```

5. **Run database migrations**:
```bash
npx prisma migrate dev --name init
```

6. **Seed the database** (creates 25 fish species with sightings):
```bash
npm run seed
```

7. **Start the backend server**:
```bash
npm run dev
```

✅ **Backend running on: http://localhost:5555**

---

### Frontend Setup

1. **Open a NEW terminal and navigate to frontend**:
```bash
cd "C:\Users\louis\OneDrive - Thomas More\Thomas-More\Semester_5\HTF_2025\frontend"
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

✅ **Frontend running on: http://localhost:3000**

---

## 🌐 Access the Application

Open your browser and navigate to:

👉 **http://localhost:3000**

You should see:
- Navigation bar with Dashboard, Catalog, and Map
- Dashboard showing statistics and progress
- Catalog with 25 fish species
- Visual distinction: spotted fish in color, unspotted fish grayscale

## 🔌 API Endpoints

### Fish Species
- `GET /api/fish` - Get all fish (supports `?search=`, `?filter=`, `?rarity=`)
- `GET /api/fish/:id` - Get single fish by ID
- `PATCH /api/fish/:id/seen` - Toggle seen status

### Statistics
- `GET /api/stats` - Get statistics (total, seen, unseen, by rarity)

### Sightings
- `GET /api/sightings` - Get all sightings with fish data

### Diving Centers
- `GET /api/diving-centers` - Get all diving center locations

### Utility
- `GET /health` - Health check endpoint

## 📊 Database Schema

```prisma
model Fish {
  id             Int            @id @default(autoincrement())
  name           String
  scientificName String
  description    String
  imageUrl       String
  rarity         String         // Common, Rare, Epic
  habitat        String
  size           String
  minDepth       Int
  maxDepth       Int
  sightings      FishSighting[]
}

model FishSighting {
  id        Int      @id @default(autoincrement())
  fishId    Int
  latitude  Float
  longitude Float
  location  String
  timestamp DateTime
  seen      Boolean
  fish      Fish     @relation(fields: [fishId], references: [id])
}

model DivingCenter {
  id        Int      @id @default(autoincrement())
  name      String
  latitude  Float
  longitude Float
  region    String
}
```

## 🎨 Design Features

### Visual States
- **Spotted Fish**: Full color images, colored text, green "Spotted" badge
- **Unspotted Fish**: Grayscale images, muted text, no badge

### Color Palette
- Ocean blue theme (ocean-50 to ocean-950)
- Gradient backgrounds
- Rarity-based colors:
  - Common: Gray
  - Rare: Blue
  - Epic: Purple

### UI Components
- Card-based layout with hover effects
- Rounded corners and shadows
- Smooth transitions and animations
- Loading spinners
- Error messages with retry buttons
- Empty state designs

## 🐠 Sample Fish Data

The application comes pre-seeded with 25 diverse species:
- Clownfish, Blue Tang, Great White Shark
- Manta Ray, Lionfish, Seahorse
- Angelfish, Pufferfish, Moorish Idol
- Barracuda, Butterflyfish, Hammerhead Shark
- And many more!

Each fish includes:
- Common and scientific names
- Detailed description
- High-quality image (Unsplash)
- Rarity classification
- Habitat information
- Size specifications
- Depth range
- Automatic sighting generation (60% spotted by default)

## 🔧 Development Commands

### Backend
```bash
npm run dev          # Start with hot reload (port 5555)
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Re-seed database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
```

### Frontend
```bash
npm run dev          # Start Next.js dev server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🎯 What to Show in Demo

1. **Dashboard Overview** - Show statistics and progress tracking
2. **Filter Demonstration** - Toggle between All/Spotted/Unspotted
3. **Visual States** - Point out colored vs grayscale fish
4. **Search Functionality** - Search for "shark" or "blue"
5. **Rarity Filter** - Show Common, Rare, and Epic fish
6. **Fish Details** - Click any fish to show detail page
7. **Toggle Spotted** - Mark a fish as spotted/unspotted and show persistence
8. **Map View** - Display sightings map with locations
9. **Responsive Design** - Resize browser to show mobile view

## 🐛 Troubleshooting

### Backend won't start
```bash
# Ensure database is created
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### Frontend won't connect
- Verify backend is running on port 5555
- Check browser console for errors
- Ensure CORS is working (check backend logs)

### Database is empty
```bash
cd backend
npm run seed
```

### Port already in use
**Windows**:
```bash
# Find process on port 5555
netstat -ano | findstr :5555
# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Images not loading
- Check internet connection (images from Unsplash)
- Verify Next.js config allows images.unsplash.com

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
PORT=5555
```

### Frontend (optional .env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:5555"
```

## 🚀 Deployment Considerations

For production deployment:
1. Set `NODE_ENV=production`
2. Update CORS origins in backend
3. Use PostgreSQL instead of SQLite
4. Configure proper environment variables
5. Build both frontend and backend
6. Use process manager (PM2) for backend
7. Deploy frontend to Vercel or similar platform

## 📄 License

MIT License - feel free to use for learning and development

## 👤 Author

Built for HTF 2025 Hackathon
- GitHub: [louisdev1/HTF_2025](https://github.com/louisdev1/HTF_2025)

---

## 🎉 Final Verification

### Backend is running when you see:
```
🐠 Fishy Dex API running on http://localhost:5555
🌊 Health check: http://localhost:5555/health
```

### Frontend is running when you see:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
✓ Ready in Xms
```

### Application is working when:
✅ Dashboard shows statistics
✅ Catalog displays 25 fish species
✅ Spotted fish are in color, unspotted are grayscale
✅ Search and filters work
✅ Fish details page loads
✅ Toggle spotted button works and persists
✅ Map page shows sightings

---

**Happy Fish Spotting! 🐟🌊**
