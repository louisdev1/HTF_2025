# 🐟 Fish Catalogue - Ocean Life Explorer

A modern, full-stack fish catalogue application built for tracking and discovering ocean life. Built with Next.js, Express, Prisma, and SQLite.

## 📋 Project Overview

Fish Catalogue is a comprehensive web application that allows users to browse, search, and track fish species they've encountered in the ocean. The application features a responsive design with an ocean-themed interface, complete search and filter capabilities, and real-time status tracking.

## ✨ Features

### Core Functionality
- ✅ **Fish Catalogue Page** - Browse all fish species with search and filter options
- ✅ **Fish Details Page** - View detailed information about each fish with toggle seen/unseen status
- ✅ **Dashboard** - Track your progress with statistics and visual charts
- ✅ **Search & Filter** - Find fish by name, scientific name, or description
- ✅ **Status Tracking** - Mark fish as seen or unseen and persist to database
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices

### Technical Features
- ✅ TypeScript throughout the entire codebase
- ✅ RESTful API with Express
- ✅ SQLite database with Prisma ORM
- ✅ Server-side data persistence
- ✅ Client-side state management
- ✅ Modern UI with Tailwind CSS
- ✅ Image optimization with Next.js
- ✅ Loading and error states
- ✅ Professional ocean theme

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React 18**

### Backend
- **Node.js**
- **Express**
- **TypeScript**
- **Prisma ORM**
- **SQLite**
- **CORS enabled**

## 📁 Project Structure

```
HTF_2025/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── index.ts               # Express server & API routes
│   │   └── seed.ts                # Database seeding script
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── fish/[id]/
│   │   │   └── page.tsx           # Fish details page
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Dashboard page
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home/Catalogue page
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── Navigation.tsx         # Navigation bar
│   │   ├── FishCard.tsx           # Fish card component
│   │   ├── StatsChart.tsx         # Statistics chart
│   │   ├── LoadingSpinner.tsx     # Loading state
│   │   ├── ErrorMessage.tsx       # Error state
│   │   └── EmptyState.tsx         # Empty state
│   ├── lib/
│   │   └── api.ts                 # API service layer
│   ├── types/
│   │   └── api.ts                 # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
└── README.md
```

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Generate Prisma client and create database:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Seed the database with 25 fish records:
```bash
npm run seed
```

5. Start the backend server:
```bash
npm run dev
```

The backend API will run on **http://localhost:4000**

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on **http://localhost:3000**

### Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

## 🌊 API Endpoints

### Fish Endpoints
- `GET /api/fish` - Get all fish (supports ?search= and ?filter= query params)
- `GET /api/fish/:id` - Get single fish by ID
- `PATCH /api/fish/:id/seen` - Update fish seen status

### Statistics
- `GET /api/stats` - Get statistics (total, seen, unseen, percentage)

### Utility
- `GET /health` - Health check endpoint
- `POST /api/seed` - Manually trigger database seeding

## 📊 Database Schema

```prisma
model Fish {
  id             Int      @id @default(autoincrement())
  name           String
  scientificName String
  description    String
  imageUrl       String
  habitat        String
  size           String
  seen           Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

## 🎨 Design Features

- **Ocean Theme** - Professional blue color palette inspired by the ocean
- **Responsive Grid** - Automatically adjusts from 1 to 3 columns based on screen size
- **Card-Based UI** - Modern card design with hover effects
- **Status Badges** - Visual indicators for seen/unseen fish
- **Interactive Charts** - Progress visualization on the dashboard
- **Loading States** - Smooth loading spinners during data fetch
- **Error Handling** - User-friendly error messages with retry options
- **Empty States** - Helpful messages when no data is available

## 🧪 Sample Data

The application comes pre-seeded with 25 diverse fish species including:
- Clownfish
- Blue Tang
- Great White Shark
- Manta Ray
- Lionfish
- Seahorse
- And many more!

Each fish includes:
- Common name
- Scientific name
- Detailed description
- High-quality image
- Habitat information
- Size specifications
- Seen/unseen tracking status

## 🔧 Development Commands

### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Seed the database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
```

### Frontend
```bash
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📸 Screenshots

*(Space reserved for project screenshots)*

## 🎯 Future Enhancements

Potential features for future development:
- Advanced filtering (by habitat, size, etc.)
- Sorting options (alphabetical, by size, etc.)
- Fish comparison tool
- Export sightings data
- Share fish on social media
- User-contributed fish entries
- Dark mode toggle

## 🐛 Troubleshooting

### Backend won't start
- Ensure SQLite database is created: `npx prisma migrate dev`
- Check if port 4000 is available
- Verify all dependencies are installed: `npm install`

### Frontend won't connect to backend
- Verify backend is running on port 4000
- Check browser console for CORS errors
- Ensure API_BASE_URL is correct in `lib/api.ts`

### Database is empty
- Run the seed script: `npm run seed`
- Or use the API endpoint: `POST http://localhost:4000/api/seed`

### Images not loading
- Check internet connection (images are from Unsplash)
- Verify Next.js image configuration in `next.config.js`

## 📝 License

MIT License - feel free to use this project for learning and development.

## 👤 Author

Built for HTF 2025 Hackathon

---

**Happy Fish Tracking! 🐟🌊**
