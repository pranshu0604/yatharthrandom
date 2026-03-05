# ReMemberX — Project Context

## What This Is
A premium web marketplace for buying and selling unused/transferable memberships in India (clubs, gyms, resorts, co-working spaces, holiday packages). UI is the primary differentiator — must feel premium, not like a generic template.

## Tech Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + Framer Motion (animations)
- **Database**: PostgreSQL (Docker container on port 5433) + Prisma 7 ORM (with `@prisma/adapter-pg`)
- **Auth**: NextAuth v5 (credentials + Google OAuth)
- **Icons**: lucide-react
- **Forms**: React Hook Form + Zod
- **No payment integration** in this phase

## Running the Project
```bash
# Start PostgreSQL (Docker must be running)
docker start rememberx-db
# or fresh: docker run -d --name rememberx-db -e POSTGRES_USER=rememberx -e POSTGRES_PASSWORD=rememberx -e POSTGRES_DB=rememberx -p 5433:5432 postgres:16-alpine

# Dev server
npm run dev

# Database commands
npm run db:push      # Push schema changes
npm run db:seed      # Seed with sample data
npm run db:studio    # Browse DB visually
npm run db:generate  # Regenerate Prisma client
```

## Test Accounts (password: `password123`)
| Role   | Email                 | Tier   |
|--------|-----------------------|--------|
| Admin  | admin@rememberx.in    | Gold   |
| Seller | rajesh@example.com    | Gold   |
| Seller | priya@example.com     | Silver |
| Seller | amit@example.com      | Bronze |
| Buyer  | ananya@example.com    | —      |

## Design System
- **Primary**: Deep Indigo `#1B1F3B` — headers, nav, primary buttons
- **Secondary**: Warm Gold `#C9A96E` — badges, tier highlights, premium accents
- **Accent**: Soft Teal `#2EC4B6` — CTAs, links, interactive elements
- **Neutrals**: `neutral-50` (#FAFBFC) through `neutral-900` (#0D0F1A)
- **Glass effect**: `.glass` / `.glass-dark` classes in globals.css
- **Font**: Inter via next/font/google
- **Animations**: Framer Motion — scroll reveals, hover lifts, staggered grids. Restrained, not overwhelming.

## Project Structure
```
src/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── marketplace/page.tsx              # Listings with search/filter
│   ├── listing/[id]/page.tsx             # Listing detail
│   ├── (auth)/login & register           # Auth pages (split layout, no navbar/footer)
│   ├── dashboard/
│   │   ├── seller/ (overview, listings, create, edit)
│   │   └── buyer/ (overview, saved, purchases)
│   ├── admin/ (overview, users, listings, categories, reviews, settings)
│   └── api/ (listings, categories, reviews, users, admin, auth)
├── components/
│   ├── ui/        # Button, Input, Badge, Card, Modal, Select, Skeleton, Avatar, StarRating, ScrollReveal
│   ├── layout/    # Navbar (auth-aware), Footer, AuthProvider
│   ├── landing/   # Hero, FeaturedListings, Categories, HowItWorks, TrustIndicators, CTASection
│   ├── marketplace/ # ListingCard, SearchBar, FilterDrawer, SortSelect, ListingGrid
│   ├── listing/   # ImageGallery, PriceBreakdown, SellerCard, ReviewSection, RelatedListings
│   ├── dashboard/ # StatsCard, DashboardSidebar, SavedListingCard
│   └── admin/     # AdminSidebar, DataTable
├── lib/
│   ├── prisma.ts       # Prisma client singleton
│   ├── auth.ts         # NextAuth config
│   ├── utils.ts        # cn(), formatCurrency(), formatDate(), getDiscount(), getDaysUntilExpiry(), slugify(), getInitials()
│   └── validations.ts  # Zod schemas (login, register, listing, review)
├── hooks/              # useDebounce, useMediaQuery
└── types/              # next-auth.d.ts (extended session types)
```

## Database (Prisma Schema)
Models: `User`, `Listing`, `Category`, `Review`, `Transaction`, `SavedListing`, `TierConfig`, `PlatformConfig`
- Enums: `Role` (BUYER/SELLER/ADMIN), `SellerTier` (BRONZE/SILVER/GOLD), `ListingStatus` (PENDING/ACTIVE/SOLD/EXPIRED/REJECTED), `TransactionStatus`
- `prisma.config.ts` at project root configures datasource URL and seed command (Prisma 7 pattern)
- `.env` file has `DATABASE_URL` for Prisma CLI; `.env.local` has all env vars for Next.js

## Key Conventions
- Server components for data fetching, client components only where interactivity needed
- Prisma 7: `PrismaClient` uses `@prisma/adapter-pg` driver adapter (see `src/lib/prisma.ts`)
- All prices in INR (₹), Indian cities/states, Indian phone numbers
- Listings start as PENDING, admin must approve to ACTIVE
- Seller tier limits enforced on listing creation
- Framer Motion `type: "spring"` in variant objects needs `as const` to satisfy TypeScript
- Framer Motion `ease` arrays in variant objects need tuple assertion: `as [number, number, number, number]`
- URL search params used for marketplace filters (server-side filtering)
- Auth layout group `(auth)` overrides root layout — no navbar/footer on login/register

## Out of Scope (MVP)
- Payment integration (commission logic exists but no gateway)
- AI recommendations
- Escrow system
- Image upload (currently text URL inputs)
- Email notifications
- Social features
