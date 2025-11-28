# Love Pages - AI-Powered Romantic Page Generator ✨

A beautiful, **mobile-first** SaaS platform for creating personalized love pages for birthdays, anniversaries, proposals, and special moments. Features an **intuitive visual editor** with **inline AI assistance** for instant text enhancement.

## ✨ Key Features

### 🎨 **Visual Page Editor**
- **Mobile-first responsive design** - Works perfectly on phones, tablets, and desktops
- **Drag-and-drop components** - Hero sections, photo galleries, timelines, and more
- **Live preview** - See changes in real-time as you edit
- **Bottom sheet UI** on mobile for component selection
- **Fixed sidebar** on desktop for optimal workflow

### 🤖 **Inline AI Assistant**
- **Auto-generated suggestions** - Get 3 AI-enhanced versions instantly
- **Quick actions** - Improve, romanticize, translate, or add emojis with one click
- **Context-aware** - Positioned next to your text, never blocking your work
- **Lightning-fast** - 3x faster than traditional AI workflows

### 🎯 **Template System**
- **15+ beautiful templates** across multiple categories:
  - 🎂 **Birthday**: Romantic, Galaxy, Rainbow Dreams
  - 💕 **Romance**: Modern Anniversary, Neon Love, Crystal Romance
  - 💍 **Wedding**: Elegant Wedding, Golden Luxury
  - 🎄 **Seasonal**: Christmas, Valentine's Day, Sakura Blossom
  - 🌊 **Nature**: Ocean Waves, Northern Lights, Sunset Beach
- **Component-based architecture** - Mix and match elements
- **Fully customizable** - Colors, fonts, layouts

### 🌍 **Multi-Language Support**
- **30+ languages** with AI-powered translation
- **Bilingual content** - Arabic/English and more
- **Maintains tone** - Romantic sentiment preserved across languages

### 💎 **Tier System**
- **Free**: 1 page, basic templates
- **Premium ($9.99)**: 10 pages, all templates, media uploads
- **Pro ($19.99)**: Unlimited pages, advanced animations, priority AI, analytics

### 📱 **Mobile Experience**
- **Touch-optimized** - 44px+ tap targets everywhere
- **Bottom sheet navigation** - Native mobile feel
- **Responsive typography** - Scales beautifully 320px to 4K
- **Smooth animations** - 60fps transitions

### 🔒 **Privacy & Security**
- Password protection for pages
- Private/public visibility controls
- Secure authentication with Supabase

### 📊 **Analytics (Pro)**
- Page view tracking
- Share analytics
- Engagement metrics

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: Vercel AI SDK + OpenAI GPT-4 Turbo
- **Payments**: Stripe (monthly subscriptions)
- **Type Safety**: TypeScript
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account (free tier works)
- An OpenAI API key (for AI features)
- A Stripe account (optional, for payments)

### Setup

1. **Clone and install:**

```bash
npm install
```

2. **Set up Supabase:**

   - Create a project at [supabase.com](https://supabase.com)
   - Run the migration in SQL Editor:
     ```sql
     supabase/migrations/COMBINED_MIGRATION.sql
     ```
   - Set up Storage buckets (see `STORAGE_SETUP.md`)
   - Copy your Project URL and Anon key

3. **Configure environment variables:**

   Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

4. **Run development server:**

```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📂 Project Structure

```
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── enhance/         # AI text enhancement
│   │   │   ├── generate/        # AI text generation
│   │   │   └── translate/       # AI translation
│   │   ├── analytics/           # Analytics tracking
│   │   ├── pages/               # Page CRUD
│   │   ├── upload/              # File uploads
│   │   ├── subscriptions/       # Legacy subscriptions
│   │   ├── templates/           # Template API
│   │   └── webhooks/            # Stripe webhooks
│   ├── auth/                    # Auth callbacks
│   ├── create/
│   │   └── template/[id]/       # Visual editor
│   ├── dashboard/               # User dashboard
│   ├── pricing/                 # Pricing & checkout
│   ├── templates/               # Template gallery
│   ├── p/[slug]/                # Public page viewer
│   └── page.tsx                 # Landing page
├── components/
│   ├── templates/               # 15+ template components
│   ├── AIInlineAssistant.tsx    # Inline AI helper
│   ├── VisualTemplateEditor.tsx # Visual page editor
│   ├── MediaUploader.tsx        # Image/video upload
│   ├── MusicUploader.tsx        # Audio upload
│   ├── AITextGenerator.tsx      # AI generation UI
│   ├── LanguageSelector.tsx     # Language picker
│   ├── AnalyticsTracker.tsx     # Analytics client
│   └── UpgradeModal.tsx         # Upgrade prompts
├── lib/
│   ├── ai.ts                    # AI utilities
│   ├── ai-enhancements.ts       # AI enhancement types
│   ├── animations.ts            # Animation presets
│   ├── storage.ts               # Supabase Storage helpers
│   ├── subscription.ts          # Purchase/tier logic
│   ├── tiers.ts                 # Tier limits & features
│   ├── template-schemas.ts      # Template structure
│   ├── supabase/                # Supabase clients
│   └── utils.ts                 # Utilities
├── supabase/
│   └── migrations/
│       └── COMBINED_MIGRATION.sql  # Complete DB schema
├── types/
│   ├── database.ts              # Supabase types
│   └── index.ts                 # App types
└── middleware.ts                # Auth middleware
```

## 🎨 Visual Editor Features

### Mobile Experience
- **Bottom sheet menu** - Swipe up to add components
- **Floating + button** - Quick access to add elements
- **Touch-optimized inputs** - Large tap targets
- **Responsive previews** - See how it looks on any device

### Desktop Experience
- **Fixed sidebar** - Component library always visible
- **Hover effects** - Smooth interactions
- **Keyboard shortcuts** - Fast workflow
- **Multi-column layouts** - Optimal space usage

### AI Integration
- **✨ Sparkle icons** - Click for AI assistance
- **Auto-suggestions** - 3 variations generated instantly
- **Quick actions**:
  - 🪄 Improve - Better wording
  - 💬 Romantic - Add warmth
  - 🌍 Translate - Multi-language
  - ✨ Add Emoji - Fun & expressive

## 📱 Responsive Design

### Breakpoints

| Size | Device | Layout |
|------|--------|--------|
| < 475px | Small phones | Stacked, icons only |
| ≥ 475px | Large phones | Labels shown |
| ≥ 640px | Tablets | 2-3 columns |
| ≥ 768px | Tablets (landscape) | Horizontal layouts |
| ≥ 1024px | Desktop | Sidebar + canvas |
| ≥ 1280px | Large desktop | Optimal spacing |

### Mobile-First Approach
- Touch targets: 44px minimum
- Readable fonts: 14px+ body text
- Inputs don't zoom on focus
- Smooth bottom sheet animations
- Native-feeling interactions

## 🤖 AI Capabilities

### Text Enhancement
- Improve writing quality
- Add romantic tone
- Make formal or casual
- Shorten or expand text
- Fix grammar and spelling
- Add appropriate emojis

### Content Generation
- Hero titles and subtitles
- Romantic introductions
- Memory descriptions
- Final love messages
- Context-aware personalization

### Translation
- 30+ supported languages
- Maintains emotional tone
- Cultural sensitivity
- Bilingual output

## 💳 Pricing Model

### Monthly Subscriptions
- **Affordable monthly pricing**
- Cancel anytime, no commitment
- Instant access to features
- Automatic renewals

### Tiers

#### Free ($0/month)
- 1 page forever
- Basic templates
- Standard features
- 1 language per page
- 3 images per page

#### Premium ($4.99/month)
- Unlimited pages
- All premium templates
- 2 languages per page
- Unlimited images
- 5 videos per page
- Background music
- Basic animations
- Basic analytics
- Cancel anytime

#### Pro ($9.99/month)
- Everything in Premium
- Unlimited languages
- Unlimited videos
- Advanced animations
- Custom domain/vanity URL
- Detailed analytics dashboard
- Priority support
- Export options (PDF, video)
- Cancel anytime

## 📊 Database Schema

### Core Tables
- **templates** - Available page templates
- **pages** - User-created pages
- **memories** - Timeline events
- **media** - Uploaded files
- **subscriptions** - Monthly subscriptions
- **purchases** - Legacy one-time payments (backward compatibility)
- **page_analytics** - View/share tracking

### Features
- Row Level Security (RLS)
- Multi-language JSON fields
- Automatic timestamps
- User isolation
- Tier-based access

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

2. **Import to Vercel**

3. **Add environment variables:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (production URL)
   - Stripe keys (if using payments)

4. **Deploy!**

### Post-Deployment
1. Run database migration in Supabase: `supabase/migrations/001_initial_schema.sql`
2. Set up Storage buckets
3. Configure Stripe webhooks (subscription events)
4. Test all features
5. Monitor error logs

## 🎯 Usage

### Creating a Page

1. **Sign up/Login** - Quick email auth
2. **Browse templates** - 15+ beautiful designs
3. **Choose template** - Pick your favorite
4. **Edit visually**:
   - Add/remove components
   - Edit text inline
   - Upload photos/videos
   - Add background music
5. **Use AI assistant**:
   - Click ✨ on any text
   - Get instant suggestions
   - Apply with one click
6. **Save & share** - Get unique URL

### Mobile Workflow

1. Tap template on phone
2. Tap floating + button to add components
3. Edit text by tapping
4. Tap ✨ for AI help
5. See suggestions instantly
6. Tap to apply
7. Save and share

## 📝 Development

### Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Testing

```bash
# Responsive testing
# Chrome DevTools: Ctrl+Shift+M (device mode)
# Test on: iPhone SE, iPad, Desktop

# Mobile testing
# Find IP: ifconfig (Mac) or ipconfig (Windows)
# Visit: http://YOUR_IP:3000

# Or use ngrok:
npx ngrok http 3000
```

## 🎨 Template Categories

- **Birthday** - Romantic, Galaxy, Rainbow Dreams
- **Anniversary** - Modern, Elegant, Crystal
- **Romance** - Neon Love, Golden Luxury, Midnight Stars
- **Wedding** - Elegant Wedding, Golden Luxury
- **Seasonal** - Christmas, Valentine's, Sakura Blossom
- **Nature** - Ocean Waves, Northern Lights, Sunset Beach

Each template includes:
- Hero section
- Introduction
- Photo galleries
- Timeline/memories
- Final message
- Custom styling

## 🔜 Roadmap

- [x] Visual page editor
- [x] Inline AI assistant
- [x] Mobile-first responsive design
- [x] 15+ templates
- [x] File uploads (images/videos/audio)
- [x] One-time payment model
- [x] Analytics tracking
- [ ] Animation editor UI
- [ ] Custom domain support
- [ ] Export to PDF/video
- [ ] Social media sharing cards
- [ ] Template marketplace
- [ ] User-created templates

## 📚 Documentation

- `USER_FLOW_AND_BACKEND.md` - Complete architecture
- `MIGRATION_GUIDE.md` - Migration steps
- `STORAGE_SETUP.md` - File upload setup
- `AI_PROMPT.md` - AI integration guide

## 🤝 Contributing

This is a private project. All rights reserved.

## 📄 License

Private - All rights reserved

---

**Built with ❤️ using Next.js 15, Supabase, and OpenAI**

*Create beautiful, personalized love pages in minutes, not hours!* ✨
