# RamadanHub USA 🌙

A comprehensive Ramadan companion app for American Muslims, featuring prayer times, iftar events, meal planning, charity information, and workplace rights resources.

## Features

- **Prayer Times**: Accurate prayer times based on your location using the Aladhan API
- **Dynamic Event System**: Community-powered iftar events with Supabase database
- **AI Event Discovery**: Find events near you using Claude API with web search
- **Event Submission**: Submit and share your community iftar events
- **Meal Planning**: 30-day Ramadan meal plans with suhoor and iftar suggestions
- **Charity Directory**: Curated list of verified Islamic charities
- **Workplace Rights**: Know your rights as a Muslim employee during Ramadan
- **Iftar Countdown**: Real-time countdown to iftar

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **AI**: Claude API (Anthropic)
- **APIs**: Aladhan API for prayer times

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier available)
- An Anthropic API key (for AI event discovery)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/AzeemSyed123/RamadanHub.git
cd RamadanHub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [Supabase](https://app.supabase.com) and create a free account
2. Create a new project
3. Go to **Project Settings** → **API**
4. Copy your **Project URL** and **anon/public key**

The `events` table should already be created with this schema:

```sql
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  organization TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  is_approved BOOLEAN DEFAULT false,
  submitted_by TEXT
);
```

### 4. Get Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to **Settings** → **API Keys**
4. Create a new API key and copy it

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Claude API Configuration  
ANTHROPIC_API_KEY=your_claude_api_key_here
```

Replace the placeholder values with your actual credentials.

### 6. Seed Initial Events (Optional)

To populate the database with sample events:

```bash
# Start the development server first
npm run dev

# Then in another terminal or use a tool like curl/Postman
curl -X POST http://localhost:3000/api/events/seed
```

Or visit `http://localhost:3000/api/events/seed` in your browser and make a POST request.

### 7. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Event System

#### Viewing Events
- All approved events from the Supabase database are displayed on the Events tab
- Events can be filtered by state and searched by city, name, or organization
- No API keys needed for viewing (uses public Supabase key)

#### Submitting Events
1. Click **"Submit an Event"** button on the Events tab
2. Fill out the form with event details (title, location, date, time, etc.)
3. Submit the form
4. Events are marked as `is_approved: false` by default for moderation
5. Once approved by an admin in Supabase, they appear publicly

#### AI Event Discovery
1. Click **"Find Events Near Me"** on the Events tab
2. Enter your city name
3. Claude API searches the web for real iftar events near your location
4. Discovered events are displayed with an option to submit them to the database
5. Requires `ANTHROPIC_API_KEY` to be configured

### Database Moderation

Events submitted by users default to `is_approved: false`. To approve events:

1. Log into your [Supabase Dashboard](https://app.supabase.com)
2. Go to your project → **Table Editor** → **events**
3. Find the event you want to approve
4. Set `is_approved` to `true`
5. The event will now appear on the website

## Project Structure

```
RamadanHub/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── events/
│   │   │   │   ├── route.ts          # GET approved events
│   │   │   │   ├── submit/route.ts   # POST submit new event
│   │   │   │   ├── seed/route.ts     # POST seed initial events
│   │   │   │   └── discover/route.ts # POST AI event discovery
│   │   │   └── prayer-times/route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── EventsTab.tsx             # Events display & management
│   │   ├── EventSubmissionForm.tsx   # Event submission form
│   │   ├── PrayerTimes.tsx
│   │   ├── MealsTab.tsx
│   │   ├── CharityTab.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client
│   │   ├── types.ts
│   │   └── ...
│   ├── types/
│   │   └── event.ts                  # Event TypeScript types
│   └── data/
│       ├── charities.json
│       └── meals.json
├── .env.local                        # Environment variables (create this)
├── package.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Routes

### GET `/api/events`
Fetch all approved events from Supabase.

**Response**: Array of events
```json
[
  {
    "id": 1,
    "title": "Community Iftar",
    "location": "123 Main St",
    "city": "Boston",
    "state": "MA",
    "date": "2026-03-15",
    "time": "6:30 PM",
    ...
  }
]
```

### POST `/api/events/submit`
Submit a new event (requires approval).

**Body**:
```json
{
  "title": "Community Iftar",
  "description": "Family-friendly event",
  "location": "123 Main St, Boston, MA",
  "city": "Boston",
  "state": "MA",
  "date": "2026-03-15",
  "time": "6:30 PM",
  "organization": "Islamic Center",
  "contact_email": "contact@example.com",
  "website": "https://example.com",
  "submitted_by": "John Doe"
}
```

### POST `/api/events/discover`
Discover events using AI (requires Claude API key).

**Body**:
```json
{
  "city": "Boston"
}
```

**Response**:
```json
{
  "success": true,
  "events": [...],
  "count": 5
}
```

### POST `/api/events/seed`
Seed the database with initial sample events.

## Security & Privacy

- Event submissions default to unapproved for moderation
- Supabase Row Level Security (RLS) policies should be configured
- No sensitive data is collected without consent
- Claude API is only used for event discovery (no personal data sent)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues or questions:
- Open an issue on [GitHub](https://github.com/AzeemSyed123/RamadanHub/issues)
- Ensure you have the latest version
- Check that environment variables are correctly configured

## Acknowledgments

- Prayer times provided by [Aladhan API](https://aladhan.com/prayer-times-api)
- AI powered by [Anthropic Claude](https://www.anthropic.com)
- Database by [Supabase](https://supabase.com)

---

**May Allah accept your fasting and worship during Ramadan.** 🤲
