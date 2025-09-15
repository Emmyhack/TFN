# TFN - The Fellowship Network

A modern, production-ready community platform built with Next.js 14, featuring live streaming, real-time chat, and comprehensive admin tools for church and fellowship groups.

![TFN Preview](https://via.placeholder.com/800x400/6366f1/ffffff?text=TFN+-+The+Fellowship+Network)

## ✨ Features

### 🎥 Live Streaming

- **Audio & Video Sessions**: Start live streams directly from browser camera/mic
- **RTMP Support**: Accept external hardware/encoder streams via RTMP → HLS
- **Real-time Chat**: Live comments, reactions (❤️ 🙌 🔥), and viewer interaction
- **Recording & Replays**: Automatic session recording with replay pages
- **Moderation Tools**: Mute users, remove participants, profanity filter

### 📱 Instagram-Style Highlights

- **Story Rings**: Animated highlight rings for live sessions and status updates
- **Live Indicators**: Real-time "LIVE" badges with pulsing animations
- **24h Expiry**: Status updates expire automatically (live replays remain)

### 👥 Groups & Channels

- **Community Management**: Create public/private groups with role-based permissions
- **Topic Channels**: Organize discussions by topic with dedicated chat rooms
- **File Sharing**: Upload and share images, documents, and media
- **Permissions**: Fine-grained control over posting and participation

### 💬 Direct Messaging & Calls

- **1:1 & Group DMs**: Private conversations with file sharing
- **Audio Calls**: WebRTC-powered voice calls with ringing UI
- **Typing Indicators**: Real-time typing status and read receipts
- **Presence System**: Online/last seen status tracking

### 📅 Events & Calendar

- **Event Management**: Create, schedule, and manage community events
- **Hero Carousel**: Animated homepage showcase with countdown timers
- **Calendar Integration**: Export events to external calendars (ICS format)
- **Reminders**: Automated event reminder notifications

### 🔔 Notifications

- **Multi-Channel**: In-app, email, and Web Push notifications
- **Granular Settings**: User-configurable notification preferences
- **Real-time Delivery**: Instant notifications via WebSocket connections

### 🛡️ Admin Console

- **User Management**: Role assignment, bans, verifications
- **Content Moderation**: Review and manage reported content
- **Analytics Dashboard**: User engagement and platform metrics
- **Feature Flags**: Toggle platform features and experimental options

## 🚀 Tech Stack

### Frontend

- **Next.js 14** - App Router, Server Actions, TypeScript
- **Tailwind CSS** - Utility-first styling with custom design system
- **shadcn/ui** - Pre-built accessible components
- **Framer Motion** - Smooth animations and micro-interactions
- **Zustand** - Lightweight state management

### Backend & Database

- **Supabase** - PostgreSQL database, authentication, real-time subscriptions
- **Prisma** - Type-safe database client with schema management
- **Row Level Security** - Database-level authorization and data protection

### Real-time Features

- **Supabase Realtime** - WebSocket connections for live updates
- **WebRTC** - Peer-to-peer audio/video calls
- **Server-Sent Events** - Live session streaming and chat

### Streaming & Media

- **WebRTC** - Browser-based streaming with STUN/TURN servers
- **HLS.js** - Adaptive bitrate video playback
- **RTMP Ingest** - External encoder support (configurable providers)

### Development & Deployment

- **TypeScript** - Full type safety across the stack
- **ESLint & Prettier** - Code formatting and quality
- **Vitest** - Unit and integration testing
- **GitHub Actions** - Automated CI/CD pipeline

## 🏗️ Project Structure

```
TFN/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # User dashboard
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── ui/             # Base UI components
│   │   └── layout/         # Layout components
│   └── lib/                # Utilities and configurations
│       ├── supabase.ts     # Database client
│       ├── validations.ts  # Zod schemas
│       └── utils.ts        # Helper functions
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
└── env.example            # Environment variables template
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn
- Supabase account (free tier available)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/tfn.git
cd tfn
npm install
```

### 2. Environment Setup

```bash
cp env.example .env.local
```

Fill in your environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tfn"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Live Streaming (Choose one)
# Option A: LiveKit
LIVEKIT_API_KEY="your-livekit-api-key"
LIVEKIT_API_SECRET="your-livekit-api-secret"
NEXT_PUBLIC_LIVEKIT_URL="your-livekit-url"

# Option B: Mux
MUX_TOKEN_ID="your-mux-token-id"
MUX_TOKEN_SECRET="your-mux-token-secret"

# File Storage
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Email
RESEND_API_KEY="your-resend-api-key"

# Web Push
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checker
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with demo data
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Copy your project URL and anon key to `.env.local`
3. Run the database migrations:
   ```sql
   -- Enable necessary extensions
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";
   ```
4. Set up Row Level Security policies (automated with Prisma migrations)

### Live Streaming Providers

#### Option A: LiveKit (Recommended)

- Sign up at [LiveKit Cloud](https://livekit.io/)
- Get API key and secret
- Configure WebRTC settings

#### Option B: Mux

- Sign up at [Mux](https://mux.com/)
- Get token ID and secret
- Configure RTMP ingest settings

### File Storage

- Sign up at [UploadThing](https://uploadthing.com/)
- Get app ID and secret key
- Configure file upload limits and types

### Email Notifications

- Sign up at [Resend](https://resend.com/)
- Get API key
- Configure sender domain

### Web Push Notifications

```bash
# Generate VAPID keys
npx web-push generate-vapid-keys
```

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### End-to-End Tests

```bash
npm run test:e2e
```

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Live session creation and joining
- [ ] Real-time chat and reactions
- [ ] File uploads and sharing
- [ ] Group creation and management
- [ ] Event scheduling and reminders
- [ ] Admin moderation tools

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Docker

```bash
# Build image
docker build -t tfn .

# Run container
docker run -p 3000:3000 tfn
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📊 Monitoring & Analytics

### PostHog (Optional)

- Add `NEXT_PUBLIC_POSTHOG_KEY` to track user events
- Monitor engagement and feature usage

### Error Tracking

- Configure Sentry for error monitoring
- Set up performance monitoring alerts

## 🔒 Security

### Authentication

- Supabase Auth with JWT tokens
- OAuth providers (Google, Apple)
- Password strength requirements

### Authorization

- Role-based access control (RBAC)
- Row Level Security (RLS) policies
- API rate limiting

### Data Protection

- Input validation with Zod schemas
- XSS protection
- CSRF protection
- Secure headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@tfn.community
- 💬 Discord: [Join our community](https://discord.gg/tfn)
- 📖 Documentation: [docs.tfn.community](https://docs.tfn.community)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/tfn/issues)

## 🎯 Roadmap

### Phase 1 (Current)

- [x] Core authentication system
- [x] Basic live streaming
- [x] Real-time chat
- [x] Group management
- [x] Admin dashboard

### Phase 2 (Next)

- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Advanced moderation AI

### Phase 3 (Future)

- [ ] Voice rooms
- [ ] Podcast hosting
- [ ] Event ticketing
- [ ] Custom branding
- [ ] API for third-party integrations

---

**Built with ❤️ for communities by the TFN Team**
#   T F N 
 
 
